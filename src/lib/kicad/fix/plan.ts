/**
 * fix/plan.ts
 * 수정 계획(change plan)을 만들고, 승인 조건을 확인한 뒤 적용한다.
 *
 * 서버는 계획을 저장하지 않는다. 계획 객체를 그대로 돌려주고 호출자가 들고
 * 있다가 적용할 때 되돌려준다. 무결성은 계획에 넣어 둔 원본 sha256으로 확인한다
 * (preview 이후 원본이 바뀌면 적용을 거부한다).
 *
 * 판단은 하지 않는다. 어느 Fail을 어떤 템플릿·파라미터로 고칠지는 외부
 * DRC·Surrogate MCP가 정하고, 여기서는 받은 지시를 검증하고 형상만 만든다.
 */

import { randomUUID } from "node:crypto";
import { NOTICE } from "../drc/schema";
import { findPad, traceAxisAtPad, type PadGeom, type TraceAxis, type TraceSeg } from "./pads";
import {
  TEMPLATE_DEFAULTS,
  runTemplate,
  type RectZone,
  type TemplateId,
  type TemplateParams,
} from "./templates";
import { findExistingZoneNames, insertZones, sha256 } from "./edit";

/** 외부 MCP가 보내는 수정 지시. 판단 결과와 근거를 그대로 싣는다. */
export type FixDirective = {
  rule_id: string;
  template_id: TemplateId;
  /** 대상 목록. drc_locate_fail 결과를 그대로 넣으면 된다. */
  targets: Array<{ ref: string; pin: string; layer: string; drc_item_id?: string }>;
  params?: TemplateParams;
  /** 누가 판단했는지. 예: "drc_mcp", "surrogate_mcp", "rule_table" */
  provider: string;
  /** 판단 근거. 승인 화면에 그대로 보여준다. */
  rationale?: string;
  /** Surrogate 등이 예측한 값과 신뢰 범위 */
  predicted?: unknown;
  confidence?: unknown;
  /** 적용 범위를 벗어났다고 외부가 표시한 경우 */
  out_of_range?: boolean;
};

export type PlanChange = {
  id: string;
  rule_id: string;
  drc_item_id?: string;
  target: { ref: string; pin: string; layer: string };
  before: string;
  after: string;
  zone: RectZone;
};

export type ChangePlan = {
  plan_version: "1";
  plan_id: string;
  created_at: string;
  source: { file_name?: string; sha256: string };
  directive: FixDirective;
  applied_params: {
    margin_mm: number;
    name_prefix: string;
    long_axis: "trace" | "x" | "y" | "pad";
    used_template_defaults: boolean;
  };
  changes: PlanChange[];
  notice: string;
};

export type BuildPlanInput = {
  kicad_pcb: string;
  file_name?: string;
  directive: FixDirective;
  pads: PadGeom[];
  /** void의 긴 변 방향을 정하는 데 쓰는 배선 */
  segments?: TraceSeg[];
};

export function buildPlan(
  input: BuildPlanInput
): { ok: true; plan: ChangePlan; warnings: string[] } | { ok: false; error: string; missing?: string[] } {
  const { kicad_pcb, directive, pads } = input;
  const warnings: string[] = [];

  if (!directive?.template_id) return { ok: false, error: "directive.template_id가 없다.", missing: ["template_id"] };
  if (!directive.provider) return { ok: false, error: "directive.provider가 없다. 누가 판단했는지 남겨야 한다.", missing: ["provider"] };
  if (!Array.isArray(directive.targets) || !directive.targets.length) {
    return { ok: false, error: "directive.targets가 비어 있다.", missing: ["targets"] };
  }

  const resolved: Array<{ target: { ref: string; pin: string; layer: string }; pad: PadGeom; axis: TraceAxis }> = [];
  const notFound: string[] = [];
  for (const t of directive.targets) {
    const pad = findPad(pads, t.ref, t.pin);
    if (!pad) {
      notFound.push(`${t.ref}.${t.pin}`);
      continue;
    }
    resolved.push({
      target: { ref: t.ref, pin: t.pin, layer: t.layer },
      pad,
      axis: traceAxisAtPad(pad, input.segments ?? []),
    });
  }
  if (notFound.length) {
    return { ok: false, error: `보드에서 찾지 못한 패드: ${notFound.join(", ")}`, missing: notFound };
  }

  const result = runTemplate(directive.template_id, resolved, directive.params);
  if (!result.ok) return { ok: false, error: result.error, missing: result.missing };

  const defaults = TEMPLATE_DEFAULTS[directive.template_id];
  const usedDefaults =
    directive.params?.margin_mm === undefined ||
    directive.params?.name_prefix === undefined ||
    directive.params?.long_axis === undefined;
  if (usedDefaults) {
    warnings.push(
      `파라미터 일부가 없어 템플릿 기본값을 썼다(margin_mm=${defaults.margin_mm}, ` +
        `long_axis=${defaults.long_axis}, name_prefix="${defaults.name_prefix}").`
    );
  }
  if (directive.out_of_range) {
    warnings.push("외부 판단이 적용 범위를 벗어났다고 표시했다. 승인 전에 근거를 확인할 것.");
  }

  const duplicated = findExistingZoneNames(kicad_pcb, result.zones.map((z) => z.name));
  if (duplicated.length) {
    warnings.push(`같은 이름의 zone이 원본에 이미 있다: ${duplicated.join(", ")}. 중복 적용일 수 있다.`);
  }

  for (const zone of result.zones) {
    if (zone.orientation.source === "pad_fallback") warnings.push(zone.orientation.note);
  }

  const changes: PlanChange[] = result.zones.map((zone, i) => {
    const t = resolved[i].target;
    return {
      id: `${directive.rule_id}-${t.ref}.${t.pin}-${t.layer}`,
      rule_id: directive.rule_id,
      drc_item_id: directive.targets[i]?.drc_item_id,
      target: t,
      before: `${t.layer}에 이 패드용 keepout 없음`,
      after:
        `keepout(copperpour not_allowed) ${zone.size_mm.w} x ${zone.size_mm.h} mm @ ` +
        `(${zone.center.x}, ${zone.center.y}), 긴 변 ${zone.orientation.axis === "y" ? "세로" : "가로"}`,
      zone,
    };
  });

  return {
    ok: true,
    warnings,
    plan: {
      plan_version: "1",
      plan_id: `plan_${randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
      source: { file_name: input.file_name, sha256: sha256(kicad_pcb) },
      directive,
      applied_params: { ...result.applied_params, used_template_defaults: usedDefaults },
      changes,
      notice: NOTICE,
    },
  };
}

export type ApplyGate = { approved?: boolean; save_mode?: "new_file" | "overwrite" };

/** 승인·저장방식·원본 일치 세 가지를 모두 확인한다. 하나라도 어긋나면 적용하지 않는다. */
export function checkApplyGate(
  plan: ChangePlan | undefined,
  kicad_pcb: string,
  gate: ApplyGate
): { ok: true } | { ok: false; error: string; reasons: string[] } {
  const reasons: string[] = [];
  if (!plan || plan.plan_version !== "1" || !Array.isArray(plan.changes) || !plan.changes.length) {
    reasons.push("유효한 change plan이 없다. fix_preview가 돌려준 plan을 그대로 넣어야 한다.");
  }
  if (gate.approved !== true) reasons.push("approved=true가 없다. 사람이 승인해야 적용한다.");
  if (gate.save_mode !== "new_file" && gate.save_mode !== "overwrite") {
    reasons.push('save_mode가 없다. "new_file" 또는 "overwrite" 중 하나를 골라야 한다.');
  }
  if (plan && sha256(kicad_pcb) !== plan.source.sha256) {
    reasons.push("preview 이후 원본 .kicad_pcb가 바뀌었다. 다시 preview부터 진행해야 한다.");
  }
  if (reasons.length) return { ok: false, error: "적용 조건을 만족하지 않는다.", reasons };
  return { ok: true };
}

export function applyPlan(
  plan: ChangePlan,
  kicad_pcb: string
): { ok: true; text: string; inserted: number } | { ok: false; error: string } {
  const inserted = insertZones(kicad_pcb, plan.changes.map((c) => c.zone));
  if (!inserted.ok) return { ok: false, error: inserted.error };
  return { ok: true, text: inserted.text, inserted: inserted.inserted };
}
