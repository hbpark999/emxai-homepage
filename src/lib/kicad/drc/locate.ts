/**
 * drc/locate.ts
 * Fail 항목의 evidence 문자열을 보드의 실제 객체(ref·pad·net·layer)에 연결하고
 * 좌표와 bbox를 돌려준다.
 *
 * 예: "C1.1 · In1.Cu: 0%" → C1 pad1, In1.Cu
 * 매핑에 실패한 항목은 버리지 않고 사유와 함께 그대로 돌려준다. 추측해서
 * 억지로 붙이지 않는다.
 */

import type { DrcItem } from "./schema";
import { findPad, type PadGeom } from "../fix/pads";

const LAYER_RE = /\b((?:F|B|In\d+)\.Cu)\b/;
/** "C1.1", "C1 pad 1", "C1-1" 형태의 ref+pin */
const REF_PIN_RE = /\b([A-Z]+\d+)\s*(?:\.|-|\s+pad\s*)\s*(\d+|[A-Z]\d*)\b/i;
/** ref만 있는 경우 */
const REF_RE = /\b([A-Z]+\d+)\b/;

export type LocatedTarget = {
  drc_item_id: string;
  rule_id: string;
  status: string;
  measured: unknown;
  evidence: string;
  ref: string;
  pin: string;
  net: string;
  layer: string;
  pos: { x: number; y: number };
  size_mm: { w: number; h: number };
  rot_deg: number;
  bbox: { min: { x: number; y: number }; max: { x: number; y: number } };
  pad_source: PadGeom["source"];
};

export type UnmappedItem = { drc_item_id: string; evidence: string; reason: string };

function bboxOf(pad: PadGeom) {
  const rot = ((pad.rot_deg % 360) + 360) % 360;
  const swapped = Math.abs(rot - 90) < 0.01 || Math.abs(rot - 270) < 0.01;
  const w = swapped ? pad.size.h : pad.size.w;
  const h = swapped ? pad.size.w : pad.size.h;
  return {
    min: { x: Number((pad.pos.x - w / 2).toFixed(4)), y: Number((pad.pos.y - h / 2).toFixed(4)) },
    max: { x: Number((pad.pos.x + w / 2).toFixed(4)), y: Number((pad.pos.y + h / 2).toFixed(4)) },
  };
}

/**
 * Fail 항목을 패드에 연결한다.
 * @param defaultLayers evidence에 층이 없을 때 쓸 층 목록. 주지 않으면 층 없음으로 남긴다.
 */
export function locateFails(
  fails: DrcItem[],
  pads: PadGeom[],
  defaultLayers?: string[]
): { located: LocatedTarget[]; unmapped: UnmappedItem[] } {
  const located: LocatedTarget[] = [];
  const unmapped: UnmappedItem[] = [];

  for (const item of fails) {
    const text = `${item.evidence ?? ""} ${typeof item.raw === "string" ? item.raw : ""}`.trim();
    const refPin = REF_PIN_RE.exec(text);
    const layerMatch = LAYER_RE.exec(text);
    const layers = layerMatch ? [layerMatch[1]] : defaultLayers ?? [];

    if (!refPin) {
      const refOnly = REF_RE.exec(text);
      unmapped.push({
        drc_item_id: item.id,
        evidence: item.evidence,
        reason: refOnly
          ? `부품 ${refOnly[1]}은 찾았지만 pad 번호가 없다. evidence에 "${refOnly[1]}.1" 형태로 pad를 지정해야 한다.`
          : "evidence에서 부품 ref와 pad 번호를 찾지 못했다.",
      });
      continue;
    }

    const ref = refPin[1].toUpperCase();
    const pin = refPin[2];
    const pad = findPad(pads, ref, pin);
    if (!pad) {
      unmapped.push({
        drc_item_id: item.id,
        evidence: item.evidence,
        reason: `보드에 ${ref}.${pin} 패드가 없다.`,
      });
      continue;
    }

    if (!layers.length) {
      unmapped.push({
        drc_item_id: item.id,
        evidence: item.evidence,
        reason: `대상 층을 알 수 없다. evidence에 층 이름(예: In1.Cu)이 없고 default_layers도 주지 않았다.`,
      });
      continue;
    }

    for (const layer of layers) {
      located.push({
        drc_item_id: item.id,
        rule_id: item.rule_id,
        status: item.status,
        measured: item.measured,
        evidence: item.evidence,
        ref,
        pin,
        net: pad.net,
        layer,
        pos: { x: Number(pad.pos.x.toFixed(4)), y: Number(pad.pos.y.toFixed(4)) },
        size_mm: pad.size,
        rot_deg: pad.rot_deg,
        bbox: bboxOf(pad),
        pad_source: pad.source,
      });
    }
  }

  return { located, unmapped };
}
