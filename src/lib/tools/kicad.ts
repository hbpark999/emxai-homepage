/**
 * kicad.ts
 * KiCad PCB 생성 MCP의 툴 정의 6종(pcb_ 접두어)을 한 곳에 모은다.
 * 계산/직렬화 로직은 전부 lib/kicad/*에 있고, 여기서는 zod 입력 스키마와
 * 사람이 읽는 응답 텍스트로 감싸기만 한다. 라우트는 registerKicadTools(server)
 * 하나만 호출해 등록한다 - 새 MCP가 추가돼도 이 분리는 유지한다.
 */

import { z } from "zod";
import type { BoardAnalysis, BoardSpec, CouponSpec, Pt } from "@/lib/kicad/types";
import { buildBoard } from "@/lib/kicad/board";
import { buildCoupon2xThru } from "@/lib/kicad/coupon";
import { measureBoard } from "@/lib/kicad/measure";
import { parseKicadPcb } from "@/lib/kicad/parse";
import { listPartsCatalogSummary } from "@/lib/kicad/parts";
import { plotBoardSvg } from "@/lib/kicad/plot";
import { listStackupPresets, totalBoardThicknessMm } from "@/lib/kicad/stackup";
import { validateSpec } from "@/lib/kicad/validate";
import { checkAndIncrementDailyUsage } from "@/lib/mcp-rate-limit";

/** 트레이스 세그먼트를 이 개수까지만 싣고 나머지는 개수로 요약한다(토큰 폭발 방지). */
const MAX_SEGMENTS_IN_OUTPUT = 20;

function boundingBox(points: Pt[]): { min: Pt; max: Pt } | null {
  if (points.length === 0) return null;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    min: { x: Math.min(...xs), y: Math.min(...ys) },
    max: { x: Math.max(...xs), y: Math.max(...ys) },
  };
}

/**
 * BoardAnalysis를 MCP 응답에 실을 형태로 줄인다.
 * 형상 중 부피가 큰 것(세그먼트 목록, 평면 외곽선 좌표)만 요약하고
 * measurements는 분석의 본체이므로 항상 통째로 싣는다.
 */
function shapeAnalysisForOutput(
  analysis: BoardAnalysis,
  detail: "shape" | "full",
  includeGeometry: boolean
) {
  const traces = analysis.traces.map((t) => ({
    net: t.net,
    layer: t.layer,
    total_len_mm: t.total_len_mm,
    width_profile: t.width_profile,
    segment_count: t.segments.length,
    segments: t.segments.slice(0, MAX_SEGMENTS_IN_OUTPUT),
    segments_omitted: Math.max(0, t.segments.length - MAX_SEGMENTS_IN_OUTPUT),
  }));

  const planes = analysis.planes.map((p) => ({
    net: p.net,
    layer: p.layer,
    area_mm2: p.area_mm2,
    outline_point_count: p.outline.length,
    outline_bbox: boundingBox(p.outline),
    hole_count: p.holes.length,
    splits: p.splits.map((s) => ({
      width_mm: s.width_mm,
      length_mm: s.length_mm,
      bbox: boundingBox(s.polygon),
      ...(includeGeometry ? { polygon: s.polygon } : {}),
    })),
    ...(includeGeometry ? { outline: p.outline, holes: p.holes } : {}),
  }));

  const base = {
    source: analysis.source,
    outline: includeGeometry
      ? analysis.outline
      : {
          w_mm: analysis.outline.w_mm,
          h_mm: analysis.outline.h_mm,
          polygon_point_count: analysis.outline.polygon.length,
        },
    stackup: analysis.stackup,
    nets: analysis.nets,
    traces,
    vias: analysis.vias,
    planes,
    pads: analysis.pads,
  };

  if (detail === "shape") return base;
  return { ...base, measurements: analysis.measurements };
}

/** 이 MCP 전체(툴 6개 합산) 하루 호출 한도. */
const DAILY_LIMIT = 500;
const ROUTE_NAME = "kicad";

// ---- zod: BoardSpec ---------------------------------------------------------

const zPoint = z.object({ x: z.number(), y: z.number() });

const zBoardSpecPart = z.object({
  ref: z.string().describe('부품 참조번호. 예: "U1", "C1", "J1"'),
  type: z.string().describe("pcb_list_parts가 돌려주는 카탈로그 id"),
  x: z.number().describe("mm, 보드 좌하단 기준"),
  y: z.number().describe("mm, 보드 좌하단 기준"),
  rot: z.number().optional().describe("deg, 기본 0. 반시계 방향(CCW)이 양수"),
  layer: z.enum(["F", "B"]).optional().describe("실장 면. 기본 F(앞면)"),
});

const zBoardSpecNet = z.object({
  name: z.string().describe('넷 이름. 예: "GND", "VDD", "SIG_P"'),
  pins: z.array(z.string()).describe('"REF.PIN" 형식 목록. 예: ["U1.12","C3.1"]'),
  diff_pair: z
    .string()
    .optional()
    .describe("차동 라우팅 짝 넷 이름. 2단계 기능이라 이번 단계에서는 무시된다"),
});

const zBoardSpecRoute = z.object({
  net: z.string().describe("nets에 선언된 넷 이름"),
  layer: z.string().describe('"F.Cu", "In1.Cu", "B.Cu" 등'),
  width_mm: z.number().describe("트레이스 폭 [mm]"),
  points: z
    .array(zPoint)
    .min(2)
    .describe("꺾인 점들의 나열. 연속한 두 점마다 세그먼트 하나가 된다. 폭을 바꾸려면 route를 나눠 넣는다"),
});

const zBoardSpecVia = z.object({
  net: z.string(),
  x: z.number(),
  y: z.number(),
  type: z.enum(["through", "micro", "blind"]),
  from_layer: z.string(),
  to_layer: z.string(),
  drill_mm: z.number(),
  diameter_mm: z.number(),
});

const zBoardSpecZoneSlit = z.object({
  x: z.number(),
  y: z.number(),
  w_mm: z.number().describe("슬릿 폭 [mm]"),
  h_mm: z.number().describe("슬릿 높이 [mm]"),
  rot: z.number().optional().describe("deg, 기본 0"),
});

const zBoardSpecZone = z.object({
  net: z.string(),
  layer: z.string(),
  outline: z.array(zPoint).optional().describe("생략하면 보드 전체를 외곽선으로 쓴다"),
  slits: z.array(zBoardSpecZoneSlit).optional().describe("GND slit(카퍼 없는 구멍) 목록"),
});

const zBoardSpec = z.object({
  name: z.string(),
  stackup: z.enum(["2L", "4L"]),
  size_mm: z.object({ w: z.number(), h: z.number() }),
  parts: z.array(zBoardSpecPart),
  nets: z.array(zBoardSpecNet),
  routes: z.array(zBoardSpecRoute),
  vias: z.array(zBoardSpecVia),
  zones: z.array(zBoardSpecZone),
});

function numberedList(items: string[]): string {
  return items.map((s, i) => `${i + 1}. ${s}`).join("\n");
}

// ---- 툴 등록 -----------------------------------------------------------------

/** McpServer 대신 registerTool만 요구하는 최소 인터페이스. mcp-handler의 서버가 이를 만족한다. */
type ToolServer = {
  registerTool: (
    name: string,
    config: { title: string; description: string; inputSchema?: z.ZodTypeAny },
    handler: (args: unknown) => Promise<{ content: Array<{ type: "text"; text: string }> }>
  ) => void;
};

type ToolConfig = { title: string; description: string; inputSchema?: z.ZodTypeAny };
type ToolHandler = (args: unknown) => Promise<{ content: Array<{ type: "text"; text: string }> }>;

/**
 * server.registerTool을 대신해서 부르는 래퍼. 실제 핸들러를 돌리기 전에
 * 하루 전체 호출 한도를 먼저 확인한다 - 6개 툴 전부 여기 하나만 거치므로
 * 각 핸들러 안에 제한 로직을 반복해 넣지 않아도 된다.
 */
function registerLimitedTool(server: ToolServer, name: string, config: ToolConfig, handler: ToolHandler) {
  server.registerTool(name, config, async (args) => {
    const { allowed, count } = await checkAndIncrementDailyUsage(ROUTE_NAME, DAILY_LIMIT);
    if (!allowed) {
      return {
        content: [
          {
            type: "text",
            text: `이 MCP의 오늘 전체 호출 한도(${DAILY_LIMIT}회)를 넘었다 (누적 ${count}회). 내일 다시 시도해달라.`,
          },
        ],
      };
    }
    return handler(args);
  });
}

export function registerKicadTools(server: ToolServer) {
  registerLimitedTool(
    server,
    "pcb_list_parts",
    {
      title: "부품 카탈로그",
      description: "생성 가능한 부품 카탈로그를 나열한다. BoardSpec.parts[].type에 쓸 수 있는 id 목록",
    },
    async () => {
      const items = listPartsCatalogSummary().map(
        (p) => `${p.id} - ${p.label} (${p.category}, ref=${p.refPrefix}, 패드 ${p.padCount}개)`
      );
      return { content: [{ type: "text", text: items.join("\n") }] };
    }
  );

  registerLimitedTool(
    server,
    "pcb_stackup_presets",
    {
      title: "스택업 프리셋",
      description: "지원하는 2층/4층 스택업과 각 층 두께·유전율, 허용 via 종류를 반환한다",
    },
    async () => {
      const text = listStackupPresets()
        .map((preset) => {
          const layers = preset.layers
            .map((l) =>
              l.dielectricBelow_mm > 0
                ? `  ${l.name} (${l.role}) → 아래 유전체 ${l.dielectricBelow_mm}mm, εr ${l.er}`
                : `  ${l.name} (${l.role})`
            )
            .join("\n");
          return `${preset.id} - ${preset.label} (총 두께 ${totalBoardThicknessMm(preset)}mm)\n${layers}\n  허용 via: ${preset.allowedVias.join(", ")}`;
        })
        .join("\n\n");
      return { content: [{ type: "text", text }] };
    }
  );

  registerLimitedTool(
    server,
    "pcb_validate_spec",
    {
      title: "spec 검증",
      description:
        ".kicad_pcb를 만들지 않고 BoardSpec만 검증한다. 미연결 넷, 존재하지 않는 부품/핀, 외곽 이탈, 패드 겹침을 확인",
      inputSchema: z.object({ spec: zBoardSpec }),
    },
    async (args) => {
      const { spec } = args as { spec: BoardSpec };
      const result = validateSpec(spec);
      const text = result.ok
        ? "이상 없음: 이 spec으로 .kicad_pcb를 만들 수 있다."
        : `문제 ${result.errors.length}건:\n${numberedList(result.errors)}`;
      return { content: [{ type: "text", text }] };
    }
  );

  registerLimitedTool(
    server,
    "pcb_build_board",
    {
      title: "보드 생성",
      description:
        "BoardSpec으로 .kicad_pcb 전체 텍스트를 생성한다. 내부적으로 먼저 검증하고, 치명적 오류가 있으면 파일 없이 오류만 반환한다",
      inputSchema: z.object({ spec: zBoardSpec }),
    },
    async (args) => {
      const { spec } = args as { spec: BoardSpec };
      const result = buildBoard(spec);
      if (!result.ok) {
        return {
          content: [{ type: "text", text: `빌드 실패, 먼저 이 문제를 고쳐야 한다:\n${numberedList(result.errors)}` }],
        };
      }
      const s = result.value.summary;
      const summaryText = `부품 ${s.partCount}개 / 넷 ${s.netCount}개 / 트레이스 총 길이 ${s.totalTraceLength_mm}mm / 비아 ${s.viaCount}개`;
      return {
        content: [
          { type: "text", text: summaryText },
          { type: "text", text: result.value.kicad_pcb },
        ],
      };
    }
  );

  registerLimitedTool(
    server,
    "pcb_coupon_2xthru",
    {
      title: "2x-thru 쿠폰 생성",
      description:
        "IEEE P370 2x-thru de-embedding용 구조 2개(FIX-DUT-FIX, 2x-thru)를 생성한다. 두 보드는 같은 fixture 생성 함수를 공유해 런치·트레이스 폭·레이어·via 구조가 항상 같다",
      inputSchema: z.object({
        name: z.string().describe("쿠폰 이름. 파일 이름/보드 이름에 쓰인다"),
        stackup: z.enum(["2L", "4L"]),
        fixture_len_mm: z.number().describe("커넥터에서 DUT 경계까지 fixture 트레이스 길이 [mm]"),
        dut_len_mm: z.number().describe("DUT 구간 트레이스 길이 [mm]. 2x-thru 보드에서는 자동으로 0으로 처리된다"),
        trace_width_mm: z.number().describe("시그널 트레이스 폭 [mm]"),
        gnd_slit: z
          .object({
            w_mm: z.number().describe("슬릿 폭(트레이스 방향) [mm]"),
            offset_from_launch_mm: z.number().describe("런치 중심에서 슬릿 중심까지 거리 [mm]"),
          })
          .optional()
          .describe("생략하면 GND에 slit을 넣지 않는다"),
        launch: z
          .enum(["edge-sma-2.92mm", "edge-sma-sub-mini"])
          .describe("SMA 커넥터 종류. 신호 패드 폭 프리셋을 결정한다"),
      }),
    },
    async (args) => {
      const spec = args as CouponSpec;
      const result = buildCoupon2xThru(spec);
      if (!result.ok) {
        return {
          content: [{ type: "text", text: `생성 실패, 먼저 이 문제를 고쳐야 한다:\n${numberedList(result.errors)}` }],
        };
      }
      const { summary, fixtureDutFixture, twoXThru } = result.value;
      return {
        content: [
          {
            type: "text",
            text: `FIX-DUT-FIX 총 길이 ${summary.total_len_fixture_dut_fixture_mm}mm (fixture ${summary.fixture_len_mm}mm x2 + DUT ${summary.dut_len_mm}mm)\n2x-thru 총 길이 ${summary.total_len_2xthru_mm}mm (fixture ${summary.fixture_len_mm}mm x2)`,
          },
          { type: "text", text: `--- ${spec.name}-FIX-DUT-FIX.kicad_pcb ---\n${fixtureDutFixture}` },
          { type: "text", text: `--- ${spec.name}-2xTHRU.kicad_pcb ---\n${twoXThru}` },
        ],
      };
    }
  );

  registerLimitedTool(
    server,
    "pcb_board_summary",
    {
      title: "보드 요약",
      description:
        ".kicad_pcb 텍스트를 넣으면 넷 목록, 트레이스별 길이·폭·층, 비아 종류별 개수를 짧게 요약한다. 자세한 형상·측정값은 pcb_parse_file을 쓴다",
      inputSchema: z.object({ kicad_pcb: z.string().describe(".kicad_pcb 파일 전체 텍스트") }),
    },
    async (args) => {
      const { kicad_pcb } = args as { kicad_pcb: string };
      const parsed = parseKicadPcb(kicad_pcb);
      if (!parsed.ok) {
        return { content: [{ type: "text", text: numberedList(parsed.errors) }] };
      }
      const a = parsed.value;
      const netNames = a.nets.filter((n) => n.name).map((n) => n.name);
      const traceLines = a.traces
        .map((t) => {
          const widths = t.width_profile.map((w) => `${w.width_mm}mm`).join("→");
          return `  ${t.net} (${t.layer}): ${t.total_len_mm}mm, 폭 ${widths}, 세그먼트 ${t.segments.length}개`;
        })
        .join("\n");
      const viaCounts = a.vias.reduce<Record<string, number>>((acc, v) => {
        acc[v.type] = (acc[v.type] ?? 0) + 1;
        return acc;
      }, {});
      const viaText =
        Object.entries(viaCounts)
          .map(([k, v]) => `${k} ${v}`)
          .join(" / ") || "없음";
      const slitCount = a.planes.reduce((sum, p) => sum + p.splits.length, 0);

      const text = `보드 ${a.outline.w_mm} x ${a.outline.h_mm}mm / KiCad ${a.source.kicad_version}
넷 (${netNames.length}개): ${netNames.join(", ") || "없음"}
트레이스 (${a.traces.length}개):
${traceLines || "  없음"}
비아: ${viaText} (스티칭 ${a.vias.filter((v) => v.is_stitching).length}개)
평면: ${a.planes.map((p) => `${p.net}@${p.layer} ${p.area_mm2}mm²`).join(", ") || "없음"}
GND slit: ${slitCount}개${a.source.zones_unfilled ? " / zone 미채움(외곽선 기준 면적)" : ""}${
        a.source.stackup_estimated ? "\n주의: (stackup) 블록이 없어 프리셋으로 추정한 스택업이다." : ""
      }`;
      return { content: [{ type: "text", text }] };
    }
  );

  registerLimitedTool(
    server,
    "pcb_parse_file",
    {
      title: "보드 파싱/측정",
      description:
        ".kicad_pcb를 파싱해 형상(BoardAnalysis)과 SI/EMI 측정값을 낸다. 합격 여부는 판정하지 않고 숫자만 주므로, 판정은 설계 규칙 문서를 근거로 직접 하면 된다. detail=full이면 return_path(슬릿 교차 포함) 등 측정값 전부를 포함한다",
      inputSchema: z.object({
        kicad_pcb: z.string().describe(".kicad_pcb 파일 전체 텍스트"),
        detail: z
          .enum(["shape", "full"])
          .default("full")
          .describe("shape=형상만, full=형상+측정값(clearance/return_path 등)"),
        include_geometry: z
          .boolean()
          .default(false)
          .describe("true면 평면 외곽선/슬릿의 전체 좌표까지 포함한다. 기본은 점 개수와 바운딩 박스만"),
      }),
    },
    async (args) => {
      const { kicad_pcb, detail, include_geometry } = args as {
        kicad_pcb: string;
        detail?: "shape" | "full";
        include_geometry?: boolean;
      };
      const parsed = parseKicadPcb(kicad_pcb);
      if (!parsed.ok) {
        return { content: [{ type: "text", text: numberedList(parsed.errors) }] };
      }
      const analysis = (detail ?? "full") === "full" ? measureBoard(parsed.value) : parsed.value;
      const payload = shapeAnalysisForOutput(analysis, detail ?? "full", include_geometry ?? false);
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 1) }] };
    }
  );

  registerLimitedTool(
    server,
    "pcb_plot",
    {
      title: "보드 SVG 플롯",
      description:
        "보드를 SVG로 그려서 돌려준다. KiCad를 열지 않고도 배치를 확인할 수 있다. kicad_pcb 텍스트 또는 spec 중 하나를 준다",
      inputSchema: z.object({
        kicad_pcb: z.string().optional().describe(".kicad_pcb 전체 텍스트. spec을 주면 생략 가능"),
        spec: zBoardSpec.optional().describe("BoardSpec. 주면 내부에서 보드를 만든 뒤 그린다"),
        layers: z
          .array(z.string())
          .optional()
          .describe('그릴 구리층. 예: ["F.Cu","In1.Cu"]. 생략하면 전부'),
        show_nets: z.boolean().default(false).describe("트레이스 옆에 넷 이름 표기"),
        highlight_slits: z.boolean().default(true).describe("GND 슬릿을 대비색 굵은 외곽선으로 강조"),
      }),
    },
    async (args) => {
      const a = args as {
        kicad_pcb?: string;
        spec?: BoardSpec;
        layers?: string[];
        show_nets?: boolean;
        highlight_slits?: boolean;
      };

      let text = a.kicad_pcb;
      if (!text && a.spec) {
        const built = buildBoard(a.spec);
        if (!built.ok) {
          return {
            content: [{ type: "text", text: `spec으로 보드를 만들지 못했다:\n${numberedList(built.errors)}` }],
          };
        }
        text = built.value.kicad_pcb;
      }
      if (!text) {
        return { content: [{ type: "text", text: "kicad_pcb 텍스트나 spec 중 하나는 있어야 한다." }] };
      }

      const parsed = parseKicadPcb(text);
      if (!parsed.ok) {
        return { content: [{ type: "text", text: numberedList(parsed.errors) }] };
      }
      const svg = plotBoardSvg(parsed.value, {
        layers: a.layers,
        show_nets: a.show_nets ?? false,
        highlight_slits: a.highlight_slits ?? true,
      });
      return { content: [{ type: "text", text: svg }] };
    }
  );
}
