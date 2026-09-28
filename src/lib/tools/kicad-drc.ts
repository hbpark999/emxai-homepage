/**
 * tools/kicad-drc.ts
 * 외부 DRC 결과를 받아 Fail 위치를 찾고, 외부(DRC·Surrogate MCP)가 정한 수정
 * 지시를 검증해 수정 전/후를 보여준 뒤, 사람이 승인하면 .kicad_pcb 수정본을
 * 만들어 주는 도구 6종.
 *
 * 이 파일의 도구는 판정도 판단도 하지 않는다.
 *  - 판정(Pass/Fail): 외부 DRC 결과를 그대로 전달
 *  - 판단(무엇을 어떻게 고칠지): 외부 MCP가 directive로 지정
 *  - 승인: 사람이 fix_apply에 approved=true와 save_mode를 준다
 *  - 이 서버: 좌표·형상 생성, 안전 검사, 수정본 텍스트 생성
 * 서버는 파일을 읽거나 쓰지 않는다. 텍스트를 받고 텍스트를 돌려준다.
 */

import { z } from "zod";
import { checkAndIncrementDailyUsage } from "@/lib/mcp-rate-limit";
import { parseKicadPcb } from "@/lib/kicad/parse";
import { plotBoardSvg } from "@/lib/kicad/plot";
import { adapt, type DrcFormat } from "@/lib/kicad/drc/adapters";
import { locateFails, type LocatedTarget } from "@/lib/kicad/drc/locate";
import {
  DISCLAIMER,
  isFail,
  sha256,
  summarize,
  verdictFingerprint,
  type DrcItem,
} from "@/lib/kicad/drc/schema";
import {
  crossCheckPads,
  readPadsFromGeometryJson,
  readPadsFromKicadPcb,
  readSegmentsFromKicadPcb,
} from "@/lib/kicad/fix/pads";
import { backupFileName, fixedFileName, timestampTag } from "@/lib/kicad/fix/edit";
import {
  applyPlan,
  buildPlan,
  checkApplyGate,
  type ChangePlan,
  type FixDirective,
} from "@/lib/kicad/fix/plan";
import { TEMPLATE_DEFAULTS, TEMPLATE_INFO } from "@/lib/kicad/fix/templates";

type TextResult = { content: Array<{ type: "text"; text: string }> };
type ToolConfig = { title: string; description: string; inputSchema?: z.ZodTypeAny };
type ToolServer = {
  registerTool: (name: string, config: ToolConfig, handler: (args: unknown) => Promise<TextResult>) => void;
};

const ROUTE_NAME = "kicad-drc";
const DAILY_LIMIT = 500;

const asText = (value: unknown): TextResult => ({
  content: [{ type: "text", text: JSON.stringify(value, null, 1) }],
});

function registerLimited(server: ToolServer, name: string, config: ToolConfig, handler: (args: unknown) => Promise<TextResult>) {
  server.registerTool(name, config, async (args) => {
    const { allowed, count } = await checkAndIncrementDailyUsage(ROUTE_NAME, DAILY_LIMIT);
    if (!allowed) return asText({ error: `Daily KiCad DRC MCP limit (${DAILY_LIMIT}) reached`, count });
    return handler(args);
  });
}

/** .kicad_pcb에서 패드를 읽고, geometry JSON이 있으면 교차 검증한다. */
function collectPads(kicad_pcb: string, geometry_json?: unknown) {
  const fromPcb = readPadsFromKicadPcb(kicad_pcb);
  const fromJson = geometry_json ? readPadsFromGeometryJson(geometry_json) : undefined;

  if (fromPcb.ok) {
    const cross = fromJson?.ok ? crossCheckPads(fromPcb.pads, fromJson.pads) : undefined;
    return {
      ok: true as const,
      pads: fromPcb.pads,
      used: "kicad_pcb" as const,
      cross_check: cross
        ? {
            compared: cross.compared,
            match: cross.match,
            mismatches: cross.mismatches,
            note: cross.match
              ? ".kicad_pcb에서 계산한 패드 좌표가 geometry JSON과 일치한다."
              : ".kicad_pcb 계산값과 geometry JSON이 다르다. 회전 해석을 확인할 것.",
          }
        : undefined,
    };
  }
  if (fromJson?.ok) {
    return {
      ok: true as const,
      pads: fromJson.pads,
      used: "geometry_json" as const,
      cross_check: { note: `.kicad_pcb에서 패드를 읽지 못해 geometry JSON을 썼다: ${fromPcb.error}` },
    };
  }
  return { ok: false as const, error: fromPcb.error };
}

const zTarget = z.object({
  ref: z.string().describe("부품 ref. 예: C1"),
  pin: z.string().describe("패드 번호. 예: 1"),
  layer: z.string().describe("수정할 층. 예: In1.Cu"),
  drc_item_id: z.string().optional().describe("대응하는 DRC 항목 id"),
});

const zDirective = z.object({
  rule_id: z.string().describe("규칙 id. 예: CAP-10"),
  template_id: z.enum(["cap_void_under_pad"]).describe("적용할 수정 템플릿"),
  targets: z.array(zTarget).min(1).describe("수정 대상 목록. drc_locate_fail 결과를 그대로 넣으면 된다"),
  params: z
    .object({
      margin_mm: z.number().min(0).max(2).optional().describe("패드 크기에 사방으로 더할 여유 [mm]. 기본 0 = 패드와 같은 크기"),
      long_axis: z
        .enum(["trace", "x", "y", "pad"])
        .optional()
        .describe(
          "void의 긴 변 방향. 기본 trace = 패드에 연결된 배선 진행 방향에 맞춘다. x/y로 강제하거나 pad로 패드 방향을 쓸 수 있다"
        ),
      layers: z.array(z.string()).optional().describe("참고용. 실제 층은 targets[].layer를 쓴다"),
      name_prefix: z.string().optional().describe("zone 이름 접두어"),
    })
    .optional()
    .describe("템플릿 파라미터. 외부 MCP가 정한 값을 그대로 넣는다"),
  provider: z.string().describe("누가 판단했는지. 예: drc_mcp / surrogate_mcp / rule_table"),
  rationale: z.string().optional().describe("판단 근거. 승인 화면에 그대로 표시된다"),
  predicted: z.unknown().optional().describe("Surrogate 등이 예측한 값"),
  confidence: z.unknown().optional().describe("신뢰 범위"),
  out_of_range: z.boolean().optional().describe("적용 범위를 벗어났다고 외부가 표시한 경우 true"),
});

export function registerKicadDrcTools(server: ToolServer) {
  registerLimited(
    server,
    "drc_import",
    {
      title: "외부 DRC 결과 가져오기",
      description:
        "외부에서 판정한 DRC 결과(cap_drc 형식, KiCad DRC JSON 리포트, 표준 items 배열)를 표준 형태로 읽는다. " +
        "status·measured·evidence는 손대지 않고 그대로 옮기며, 바뀌지 않았음을 해시로 증명한다. " +
        "이 도구는 Pass/Fail을 다시 판정하지 않는다.",
      inputSchema: z.object({
        drc_result: z.object({}).passthrough().describe("외부 DRC 결과 JSON 전체"),
        format: z.enum(["auto", "cap_drc", "kicad_json", "generic"]).default("auto").describe("입력 형식"),
        file_name: z.string().optional().describe("결과 파일 이름(기록용)"),
      }),
    },
    async (args) => {
      const a = args as { drc_result: unknown; format?: DrcFormat | "auto"; file_name?: string };
      const adapted = adapt(a.drc_result, a.format ?? "auto", a.file_name);
      if (!adapted.ok) return asText({ error: adapted.error });

      const fails = adapted.items.filter((i) => isFail(i.status));
      const inputHash = sha256(JSON.stringify(a.drc_result));
      const verdict = verdictFingerprint(adapted.items);

      return asText({
        format: adapted.format,
        items: adapted.items,
        fails,
        summary: summarize(adapted.items),
        integrity: {
          input_sha256: inputHash,
          verdict_sha256: verdict,
          verdict_unchanged: true,
          note: "status·measured·evidence는 입력값을 그대로 옮겼다. verdict_sha256은 그 필드들만 모아 해시한 값이다.",
        },
        disclaimer: DISCLAIMER,
      });
    }
  );

  registerLimited(
    server,
    "drc_locate_fail",
    {
      title: "Fail 위치 찾기",
      description:
        "Fail 항목의 evidence를 보드의 패드에 연결해 좌표와 bbox를 돌려준다. 예: \"C1.1 · In1.Cu: 0%\" → C1 pad1, In1.Cu. " +
        "매핑하지 못한 항목은 사유와 함께 그대로 돌려준다. geometry_json을 함께 주면 .kicad_pcb에서 계산한 좌표와 교차 검증한다.",
      inputSchema: z.object({
        fails: z.array(z.object({}).passthrough()).describe("drc_import가 돌려준 fails 배열"),
        kicad_pcb: z.string().describe(".kicad_pcb 전체 텍스트"),
        geometry_json: z.object({}).passthrough().optional().describe("패드 절대 좌표가 들어 있는 geometry JSON(선택)"),
        default_layers: z
          .array(z.string())
          .optional()
          .describe("evidence에 층이 없을 때 쓸 층 목록. 예: [\"In1.Cu\",\"In2.Cu\"]"),
      }),
    },
    async (args) => {
      const a = args as {
        fails: DrcItem[];
        kicad_pcb: string;
        geometry_json?: unknown;
        default_layers?: string[];
      };
      const pads = collectPads(a.kicad_pcb, a.geometry_json);
      if (!pads.ok) return asText({ error: pads.error });

      const { located, unmapped } = locateFails(a.fails ?? [], pads.pads, a.default_layers);
      return asText({
        pad_source: pads.used,
        cross_check: pads.cross_check,
        located,
        unmapped,
        summary: { located: located.length, unmapped: unmapped.length },
        disclaimer: DISCLAIMER,
      });
    }
  );

  registerLimited(
    server,
    "fix_templates",
    {
      title: "수정 템플릿 목록",
      description:
        "이 서버가 만들 수 있는 수정 템플릿과 기본 파라미터를 돌려준다. 외부 MCP가 어떤 지시를 보낼 수 있는지 확인할 때 쓴다.",
    },
    async () =>
      asText({
        templates: Object.entries(TEMPLATE_INFO).map(([id, info]) => ({
          template_id: id,
          ...info,
          defaults: TEMPLATE_DEFAULTS[id as keyof typeof TEMPLATE_DEFAULTS],
        })),
        note: "형상은 템플릿만 만든다. 자유 폴리곤 좌표는 받지 않는다.",
        disclaimer: DISCLAIMER,
      })
  );

  registerLimited(
    server,
    "fix_preview",
    {
      title: "수정 전/후 미리보기 (파일 수정 없음)",
      description:
        "외부 MCP가 정한 수정 지시(directive)를 검증해 실제 좌표를 만들고, 수정 전/후를 함께 보여준다. " +
        "파일은 수정하지 않는다. 결과에 change plan이 들어 있으며, 승인 후 fix_apply에 그대로 넘기면 된다. " +
        "서버는 plan을 저장하지 않는다.",
      inputSchema: z.object({
        kicad_pcb: z.string().describe(".kicad_pcb 전체 텍스트"),
        directive: zDirective.describe("외부 DRC·Surrogate MCP가 정한 수정 지시"),
        file_name: z.string().optional().describe("원본 파일 이름. 저장 파일명 제안에 쓴다"),
        geometry_json: z.object({}).passthrough().optional().describe("좌표 교차 검증용 geometry JSON(선택)"),
        include_svg: z.boolean().default(true).describe("수정 전/후 SVG 2장을 포함할지"),
        layers: z.array(z.string()).optional().describe("SVG에 그릴 층. 생략하면 전부"),
      }),
    },
    async (args) => {
      const a = args as {
        kicad_pcb: string;
        directive: FixDirective;
        file_name?: string;
        geometry_json?: unknown;
        include_svg?: boolean;
        layers?: string[];
      };

      const pads = collectPads(a.kicad_pcb, a.geometry_json);
      if (!pads.ok) return asText({ error: pads.error });

      const built = buildPlan({
        kicad_pcb: a.kicad_pcb,
        file_name: a.file_name,
        directive: a.directive,
        pads: pads.pads,
        segments: readSegmentsFromKicadPcb(a.kicad_pcb),
      });
      if (!built.ok) return asText({ error: built.error, missing: built.missing });

      const applied = applyPlan(built.plan, a.kicad_pcb);
      if (!applied.ok) return asText({ error: applied.error });

      let svg_before: string | undefined;
      let svg_after: string | undefined;
      const svgNotes: string[] = [];
      if (a.include_svg ?? true) {
        const before = parseKicadPcb(a.kicad_pcb);
        const after = parseKicadPcb(applied.text);
        if (before.ok) svg_before = plotBoardSvg(before.value, { layers: a.layers, show_nets: false, highlight_slits: true });
        else svgNotes.push(`수정 전 SVG 실패: ${before.errors.join(" / ")}`);
        if (after.ok) svg_after = plotBoardSvg(after.value, { layers: a.layers, show_nets: false, highlight_slits: true });
        else svgNotes.push(`수정 후 SVG 실패: ${after.errors.join(" / ")}`);
      }

      const tag = timestampTag();
      const originalName = a.file_name ?? "board.kicad_pcb";

      return asText({
        change_table: built.plan.changes.map((c) => ({
          item: c.id,
          drc_item_id: c.drc_item_id,
          layer: c.target.layer,
          object: `${c.target.ref}.${c.target.pin}`,
          before: c.before,
          after: c.after,
          orientation: c.zone.orientation,
          provider: built.plan.directive.provider,
        })),
        rationale: built.plan.directive.rationale ?? null,
        predicted: built.plan.directive.predicted ?? null,
        confidence: built.plan.directive.confidence ?? null,
        applied_params: built.plan.applied_params,
        pad_source: pads.used,
        cross_check: pads.cross_check,
        warnings: built.warnings,
        svg_before,
        svg_after,
        svg_notes: svgNotes,
        plan: built.plan,
        questions: [
          "① 이 수정안을 적용할까요? (승인 / 수정 요청 / 취소)",
          `② 저장 방식을 선택해 주세요: A) 기존 파일은 그대로 두고 새 파일로 저장 (권장, ${fixedFileName(originalName, tag)}) / B) 기존 파일을 수정 (적용 직전 ${backupFileName(originalName, tag)} 백업 생성)`,
        ],
        next: "승인되면 fix_apply에 plan, kicad_pcb, approved=true, save_mode를 넘긴다.",
        disclaimer: DISCLAIMER,
      });
    }
  );

  registerLimited(
    server,
    "fix_apply",
    {
      title: "승인된 수정 적용 (수정본 텍스트 반환)",
      description:
        "승인된 change plan을 .kicad_pcb에 적용해 수정본 텍스트를 돌려준다. " +
        "approved=true, save_mode, preview 때와 같은 원본 세 가지가 모두 맞아야 적용한다. " +
        "이 서버는 파일을 쓰지 않는다. new_file이면 수정본과 새 파일명을, overwrite면 백업본과 수정본을 함께 돌려주므로 " +
        "실제 저장은 호출한 쪽에서 한다.",
      inputSchema: z.object({
        plan: z.object({}).passthrough().describe("fix_preview가 돌려준 change plan 전체"),
        kicad_pcb: z.string().describe("preview 때와 같은 .kicad_pcb 전체 텍스트"),
        approved: z
          .boolean()
          .optional()
          .describe("사람이 승인했으면 true. 없으면 적용하지 않고 사유를 돌려준다"),
        save_mode: z
          .enum(["new_file", "overwrite"])
          .optional()
          .describe(
            "new_file=새 파일로 저장(권장), overwrite=기존 파일 수정(백업 생성). 없으면 적용하지 않고 사유를 돌려준다"
          ),
        file_name: z.string().optional().describe("원본 파일 이름. plan에 없으면 여기서 받는다"),
      }),
    },
    async (args) => {
      const a = args as {
        plan: ChangePlan;
        kicad_pcb: string;
        approved?: boolean;
        save_mode?: "new_file" | "overwrite";
        file_name?: string;
      };

      const gate = checkApplyGate(a.plan, a.kicad_pcb, { approved: a.approved, save_mode: a.save_mode });
      if (!gate.ok) return asText({ error: gate.error, reasons: gate.reasons, applied: false });

      const applied = applyPlan(a.plan, a.kicad_pcb);
      if (!applied.ok) return asText({ error: applied.error, applied: false });

      const tag = timestampTag();
      const originalName = a.file_name ?? a.plan.source.file_name ?? "board.kicad_pcb";
      const newName = fixedFileName(originalName, tag);
      const bakName = backupFileName(originalName, tag);

      const changeLog = {
        applied_at: new Date().toISOString(),
        plan_id: a.plan.plan_id,
        rule_id: a.plan.directive.rule_id,
        template_id: a.plan.directive.template_id,
        provider: a.plan.directive.provider,
        save_mode: a.save_mode,
        changes: a.plan.changes.map((c) => ({ item: c.id, layer: c.target.layer, after: c.after })),
        source_sha256: a.plan.source.sha256,
        result_sha256: sha256(applied.text),
      };

      const common = {
        applied: true,
        inserted_zones: applied.inserted,
        change_log: changeLog,
        next_step:
          "KiCad에서 파일 열기 → Zone Refill(B) → 저장 → 외부 DRC 다시 실행 → 결과를 drc_import로 전달 (fix_verify_request 참고)",
        disclaimer: DISCLAIMER,
      };

      if (a.save_mode === "new_file") {
        return asText({
          ...common,
          save_mode: "new_file",
          write: [{ file_name: newName, content: applied.text }],
          note: `원본 ${originalName}은 바꾸지 않았다. 위 content를 ${newName}으로 저장하면 된다.`,
        });
      }

      return asText({
        ...common,
        save_mode: "overwrite",
        write: [
          { file_name: bakName, content: a.kicad_pcb, purpose: "적용 직전 백업" },
          { file_name: originalName, content: applied.text, purpose: "수정본" },
        ],
        note: `먼저 ${bakName}으로 백업을 저장한 뒤 ${originalName}을 수정본으로 덮어쓴다.`,
      });
    }
  );

  registerLimited(
    server,
    "fix_verify_request",
    {
      title: "수정 후 재검증 안내와 전/후 비교",
      description:
        "이 서버는 재판정하지 않는다. KiCad에서 Zone Refill 후 외부 DRC를 다시 돌리는 절차를 안내하고, " +
        "새 DRC 결과를 주면 수정 전/후 비교표를 만든다. 판정값은 양쪽 모두 외부 결과 그대로다.",
      inputSchema: z.object({
        before: z.array(z.object({}).passthrough()).optional().describe("수정 전 drc_import 결과의 items"),
        after: z.array(z.object({}).passthrough()).optional().describe("수정 후 drc_import 결과의 items"),
      }),
    },
    async (args) => {
      const a = args as { before?: DrcItem[]; after?: DrcItem[] };
      const steps = [
        "1. KiCad에서 수정본 .kicad_pcb를 연다.",
        "2. 보드 편집기에서 Zone Refill을 실행한다(단축키 B). keepout이 실제 pour에 반영된다.",
        "3. 파일을 저장한다.",
        "4. 외부 DRC를 다시 실행한다(예: run_cap_drc.mjs 또는 KiCad DRC 리포트 내보내기).",
        "5. 새 결과를 drc_import로 읽고, 이 도구에 before/after로 넘기면 비교표를 만든다.",
      ];

      if (!a.before?.length || !a.after?.length) {
        return asText({ steps, comparison: null, note: "before와 after를 모두 주면 비교표를 만든다.", disclaimer: DISCLAIMER });
      }

      const afterById = new Map(a.after.map((i) => [i.id, i]));
      const rows = a.before.map((b) => {
        const af = afterById.get(b.id);
        return {
          id: b.id,
          rule_id: b.rule_id,
          before: { status: b.status, measured: b.measured },
          after: af ? { status: af.status, measured: af.measured } : null,
          changed: af ? String(af.status) !== String(b.status) : null,
          note: af ? undefined : "수정 후 결과에 같은 id가 없다.",
        };
      });
      const onlyAfter = a.after.filter((i) => !a.before?.some((b) => b.id === i.id));

      return asText({
        steps,
        comparison: rows,
        new_items_after: onlyAfter,
        summary: {
          before: summarize(a.before),
          after: summarize(a.after),
        },
        note: "판정값은 외부 DRC 결과를 그대로 옮긴 것이다. 이 도구는 다시 판정하지 않는다.",
        disclaimer: DISCLAIMER,
      });
    }
  );
}

export type { LocatedTarget };
