/**
 * fix/templates.ts
 * 규칙별 수정 템플릿. 외부(DRC·Surrogate MCP)가 "어느 템플릿을 어떤 파라미터로
 * 쓸지" 정해서 보내면, 여기서 실제 좌표와 zone 형상을 만든다.
 *
 * 형상은 반드시 템플릿이 만든다. 호출자가 자유 폴리곤을 보내도 받지 않는다.
 * 파라미터는 범위를 벗어나면 거부하고, 빠졌으면 추정하지 않고 빠졌다고 알린다.
 */

import type { PadGeom } from "./pads";

export type TemplateId = "cap_void_under_pad";

export type TemplateParams = {
  /** 패드 크기에 사방으로 더할 여유 [mm]. 기본 0 = 패드와 같은 크기 */
  margin_mm?: number;
  /** void를 넣을 층. 예: ["In1.Cu","In2.Cu"] */
  layers?: string[];
  /** zone 이름 접두어 */
  name_prefix?: string;
};

export type RectZone = {
  /** KiCad 좌표(Y-down) 기준 사각형 꼭짓점 4개 */
  points: Array<{ x: number; y: number }>;
  layer: string;
  name: string;
  /** 사람이 읽는 요약 */
  size_mm: { w: number; h: number };
  center: { x: number; y: number };
};

export type TemplateTarget = { ref: string; pin: string; layer: string };

export type TemplateResult =
  | { ok: true; zones: RectZone[]; applied_params: Required<Pick<TemplateParams, "margin_mm" | "name_prefix">> }
  | { ok: false; error: string; missing?: string[] };

const LIMITS = {
  margin_mm: { min: 0, max: 2 },
};

/** 템플릿 기본값. 외부에서 파라미터를 주지 않았을 때만 쓰고, 출력에 기본값 사용 사실을 남긴다. */
export const TEMPLATE_DEFAULTS: Record<TemplateId, Required<Pick<TemplateParams, "margin_mm" | "name_prefix">>> = {
  cap_void_under_pad: { margin_mm: 0, name_prefix: "DRC fix void" },
};

export const TEMPLATE_INFO: Record<TemplateId, { title: string; description: string; makes: string }> = {
  cap_void_under_pad: {
    title: "AC Cap 패드 아래 GND void",
    description:
      "지정한 패드 바로 아래 내부 층에 copperpour not_allowed keepout(Rule Area)을 만든다. " +
      "기본은 패드와 같은 가로·세로 크기이며 margin_mm으로 사방 여유를 줄 수 있다.",
    makes: "(zone (keepout (copperpour not_allowed)) (polygon ...)) 사각형 1개 / 층",
  },
};

/** 패드를 절대 회전까지 반영해 축 정렬 사각형으로 만든다. 90도 배수만 지원한다. */
function padRect(pad: PadGeom, margin: number): { ok: true; w: number; h: number } | { ok: false; error: string } {
  const rot = ((pad.rot_deg % 360) + 360) % 360;
  const quarter = Math.round(rot / 90) * 90;
  if (Math.abs(rot - quarter) > 0.01) {
    return {
      ok: false,
      error: `${pad.ref}.${pad.pin}의 회전각 ${pad.rot_deg}도는 90도 배수가 아니다. 이 템플릿은 축 정렬 사각형만 만든다.`,
    };
  }
  const swapped = quarter === 90 || quarter === 270;
  const w = (swapped ? pad.size.h : pad.size.w) + 2 * margin;
  const h = (swapped ? pad.size.w : pad.size.h) + 2 * margin;
  return { ok: true, w, h };
}

export function runTemplate(
  template_id: TemplateId,
  targets: Array<{ target: TemplateTarget; pad: PadGeom }>,
  params: TemplateParams | undefined
): TemplateResult {
  if (template_id !== "cap_void_under_pad") {
    return { ok: false, error: `알 수 없는 template_id: ${template_id}` };
  }

  const defaults = TEMPLATE_DEFAULTS.cap_void_under_pad;
  const margin = params?.margin_mm ?? defaults.margin_mm;
  const name_prefix = params?.name_prefix ?? defaults.name_prefix;

  if (!Number.isFinite(margin) || margin < LIMITS.margin_mm.min || margin > LIMITS.margin_mm.max) {
    return {
      ok: false,
      error: `margin_mm은 ${LIMITS.margin_mm.min}~${LIMITS.margin_mm.max} mm 범위여야 한다. 받은 값: ${margin}`,
    };
  }
  if (!targets.length) return { ok: false, error: "대상 패드가 없다.", missing: ["targets"] };

  const zones: RectZone[] = [];
  for (const { target, pad } of targets) {
    if (!target.layer) {
      return { ok: false, error: `${target.ref}.${target.pin}의 대상 층이 없다.`, missing: ["target.layer"] };
    }
    const rect = padRect(pad, margin);
    if (!rect.ok) return { ok: false, error: rect.error };

    const hw = rect.w / 2;
    const hh = rect.h / 2;
    zones.push({
      layer: target.layer,
      name: `${name_prefix} ${target.ref}.${target.pin} ${target.layer}`,
      size_mm: { w: Number(rect.w.toFixed(4)), h: Number(rect.h.toFixed(4)) },
      center: { x: Number(pad.pos.x.toFixed(4)), y: Number(pad.pos.y.toFixed(4)) },
      points: [
        { x: pad.pos.x - hw, y: pad.pos.y - hh },
        { x: pad.pos.x + hw, y: pad.pos.y - hh },
        { x: pad.pos.x + hw, y: pad.pos.y + hh },
        { x: pad.pos.x - hw, y: pad.pos.y + hh },
      ].map((p) => ({ x: Number(p.x.toFixed(4)), y: Number(p.y.toFixed(4)) })),
    });
  }

  return { ok: true, zones, applied_params: { margin_mm: margin, name_prefix } };
}
