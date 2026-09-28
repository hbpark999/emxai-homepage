/**
 * fix/templates.ts
 * 규칙별 수정 템플릿. 외부(DRC·Surrogate MCP)가 "어느 템플릿을 어떤 파라미터로
 * 쓸지" 정해서 보내면, 여기서 실제 좌표와 zone 형상을 만든다.
 *
 * 형상은 반드시 템플릿이 만든다. 호출자가 자유 폴리곤을 보내도 받지 않는다.
 * 파라미터는 범위를 벗어나면 거부하고, 빠졌으면 추정하지 않고 빠졌다고 알린다.
 */

import type { PadGeom, TraceAxis } from "./pads";

export type TemplateId = "cap_void_under_pad";

export type TemplateParams = {
  /** 패드 크기에 사방으로 더할 여유 [mm]. 기본 0 = 패드와 같은 크기 */
  margin_mm?: number;
  /**
   * void의 긴 변을 어느 방향에 맞출지.
   * trace(기본) = 패드에 연결된 배선 방향, x/y = 강제 지정, pad = 패드 자체 방향
   */
  long_axis?: "trace" | "x" | "y" | "pad";
  /** void를 넣을 층. 예: ["In1.Cu","In2.Cu"] */
  layers?: string[];
  /** zone 이름 접두어 */
  name_prefix?: string;
};

export type ZoneOrientation = { axis: "x" | "y"; source: TraceAxis["source"] | "forced"; note: string };

export type RectZone = {
  /** KiCad 좌표(Y-down) 기준 사각형 꼭짓점 4개 */
  points: Array<{ x: number; y: number }>;
  layer: string;
  name: string;
  /** 사람이 읽는 요약 */
  size_mm: { w: number; h: number };
  center: { x: number; y: number };
  /** 긴 변을 어느 축에 맞췄는지와 그 근거 */
  orientation: ZoneOrientation;
};

export type TemplateTarget = { ref: string; pin: string; layer: string };

export type TemplateResult =
  | {
      ok: true;
      zones: RectZone[];
      applied_params: Required<Pick<TemplateParams, "margin_mm" | "name_prefix" | "long_axis">>;
    }
  | { ok: false; error: string; missing?: string[] };

const LIMITS = {
  margin_mm: { min: 0, max: 2 },
};

/** 템플릿 기본값. 외부에서 파라미터를 주지 않았을 때만 쓰고, 출력에 기본값 사용 사실을 남긴다. */
export const TEMPLATE_DEFAULTS: Record<
  TemplateId,
  Required<Pick<TemplateParams, "margin_mm" | "name_prefix" | "long_axis">>
> = {
  cap_void_under_pad: { margin_mm: 0, name_prefix: "DRC fix void", long_axis: "trace" },
};

export const TEMPLATE_INFO: Record<TemplateId, { title: string; description: string; makes: string }> = {
  cap_void_under_pad: {
    title: "AC Cap 패드 아래 GND void",
    description:
      "지정한 패드 바로 아래 내부 층에 copperpour not_allowed keepout(Rule Area)을 만든다. " +
      "크기는 패드와 같고(margin_mm으로 사방 여유 가능), void의 긴 변은 그 패드에 연결된 " +
      "trace 진행 방향에 맞춘다(long_axis로 바꿀 수 있다).",
    makes: "(zone (keepout (copperpour not_allowed)) (polygon ...)) 사각형 1개 / 층",
  },
};

/**
 * void 사각형의 가로·세로를 정한다.
 * 크기는 패드 크기(회전 무관하게 긴 변/짧은 변)로 잡고, 긴 변을 지정된 축에 맞춘다.
 */
function voidRect(pad: PadGeom, margin: number, axis: "x" | "y"): { w: number; h: number } {
  const long = Math.max(pad.size.w, pad.size.h) + 2 * margin;
  const short = Math.min(pad.size.w, pad.size.h) + 2 * margin;
  return axis === "y" ? { w: short, h: long } : { w: long, h: short };
}

export function runTemplate(
  template_id: TemplateId,
  targets: Array<{ target: TemplateTarget; pad: PadGeom; axis: TraceAxis }>,
  params: TemplateParams | undefined
): TemplateResult {
  if (template_id !== "cap_void_under_pad") {
    return { ok: false, error: `알 수 없는 template_id: ${template_id}` };
  }

  const defaults = TEMPLATE_DEFAULTS.cap_void_under_pad;
  const margin = params?.margin_mm ?? defaults.margin_mm;
  const name_prefix = params?.name_prefix ?? defaults.name_prefix;
  const long_axis = params?.long_axis ?? defaults.long_axis;

  if (!Number.isFinite(margin) || margin < LIMITS.margin_mm.min || margin > LIMITS.margin_mm.max) {
    return {
      ok: false,
      error: `margin_mm은 ${LIMITS.margin_mm.min}~${LIMITS.margin_mm.max} mm 범위여야 한다. 받은 값: ${margin}`,
    };
  }
  if (!targets.length) return { ok: false, error: "대상 패드가 없다.", missing: ["targets"] };

  const zones: RectZone[] = [];
  for (const { target, pad, axis } of targets) {
    if (!target.layer) {
      return { ok: false, error: `${target.ref}.${target.pin}의 대상 층이 없다.`, missing: ["target.layer"] };
    }

    let orientation: ZoneOrientation;
    if (long_axis === "x" || long_axis === "y") {
      orientation = { axis: long_axis, source: "forced", note: `long_axis=${long_axis}로 지정받았다.` };
    } else if (long_axis === "pad") {
      const rot = ((pad.rot_deg % 360) + 360) % 360;
      const swapped = Math.abs(rot - 90) < 0.01 || Math.abs(rot - 270) < 0.01;
      const longAlongY = swapped ? pad.size.w > pad.size.h : pad.size.h > pad.size.w;
      orientation = { axis: longAlongY ? "y" : "x", source: "forced", note: "long_axis=pad: 패드 자체 방향을 썼다." };
    } else {
      orientation = { axis: axis.axis, source: axis.source, note: axis.note };
    }

    const rect = voidRect(pad, margin, orientation.axis);
    const hw = rect.w / 2;
    const hh = rect.h / 2;
    zones.push({
      layer: target.layer,
      name: `${name_prefix} ${target.ref}.${target.pin} ${target.layer}`,
      size_mm: { w: Number(rect.w.toFixed(4)), h: Number(rect.h.toFixed(4)) },
      center: { x: Number(pad.pos.x.toFixed(4)), y: Number(pad.pos.y.toFixed(4)) },
      orientation,
      points: [
        { x: pad.pos.x - hw, y: pad.pos.y - hh },
        { x: pad.pos.x + hw, y: pad.pos.y - hh },
        { x: pad.pos.x + hw, y: pad.pos.y + hh },
        { x: pad.pos.x - hw, y: pad.pos.y + hh },
      ].map((p) => ({ x: Number(p.x.toFixed(4)), y: Number(p.y.toFixed(4)) })),
    });
  }

  return { ok: true, zones, applied_params: { margin_mm: margin, name_prefix, long_axis } };
}
