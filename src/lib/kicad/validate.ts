/**
 * validate.ts
 * .kicad_pcb를 만들기 전에 BoardSpec을 검사한다. 확인 항목: 미연결 넷,
 * 존재하지 않는 부품/핀 참조, 보드 외곽을 벗어난 좌표, 패드끼리 겹침.
 * Claude가 스스로 오류를 고칠 수 있도록 사람이 읽는 짧은 문장으로 반환하며,
 * 예외는 던지지 않는다.
 */

import type { BoardSpec, Result } from "./types";
import { getFootprint } from "./parts";
import { isCopperLayerInStackup, isViaAllowed } from "./stackup";
import { distanceMm, rectsOverlap, rotatePoint } from "./units";

/** 두 점이 "닿았다"고 볼 여유 [mm]. 좌표 반올림 오차만 흡수할 정도로 작게 둔다. */
const TOUCH_TOLERANCE_MM = 0.01;

export function validateSpec(spec: BoardSpec): Result<true> {
  const errors: string[] = [];

  if (!spec.name?.trim()) errors.push("보드 이름(name)이 비어 있다.");
  if (spec.size_mm.w <= 0 || spec.size_mm.h <= 0) {
    errors.push(`보드 크기(size_mm)가 잘못됐다: ${spec.size_mm.w} x ${spec.size_mm.h}`);
  }

  const netNames = new Set(spec.nets.map((n) => n.name));
  const dupNetNames = spec.nets
    .map((n) => n.name)
    .filter((name, i, arr) => arr.indexOf(name) !== i);
  for (const name of new Set(dupNetNames)) {
    errors.push(`넷 이름 "${name}"이 여러 번 선언됐다.`);
  }

  const partByRef = new Map(spec.parts.map((p) => [p.ref, p]));
  const dupRefs = spec.parts
    .map((p) => p.ref)
    .filter((ref, i, arr) => arr.indexOf(ref) !== i);
  for (const ref of new Set(dupRefs)) {
    errors.push(`부품 참조번호 "${ref}"가 여러 번 선언됐다.`);
  }

  // 부품 타입 존재 여부 + 핀 캐시(부품별 유효 핀 번호 집합)
  const validPinsByRef = new Map<string, Set<string>>();
  for (const part of spec.parts) {
    const footprint = getFootprint(part.type);
    if (!footprint) {
      errors.push(`부품 "${part.ref}"의 타입 "${part.type}"은 카탈로그에 없다.`);
      continue;
    }
    validPinsByRef.set(part.ref, new Set(footprint.pads.map((p) => p.pinRef)));
  }

  // 넷이 참조하는 핀이 실존하는 부품/핀인지
  for (const net of spec.nets) {
    for (const pinStr of net.pins) {
      const dot = pinStr.lastIndexOf(".");
      if (dot < 0) {
        errors.push(`넷 "${net.name}"의 핀 표기 "${pinStr}"가 "REF.PIN" 형식이 아니다.`);
        continue;
      }
      const ref = pinStr.slice(0, dot);
      const pin = pinStr.slice(dot + 1);
      const part = partByRef.get(ref);
      if (!part) {
        errors.push(`넷 "${net.name}"이 존재하지 않는 부품 "${ref}"를 참조한다.`);
        continue;
      }
      const validPins = validPinsByRef.get(ref);
      if (validPins && !validPins.has(pin)) {
        errors.push(`넷 "${net.name}"이 부품 "${ref}"에 없는 핀 "${pin}"을 참조한다.`);
      }
    }
  }

  // routes/vias가 선언되지 않은 넷을 참조하는지
  for (const route of spec.routes) {
    if (!netNames.has(route.net)) {
      errors.push(`트레이스가 선언되지 않은 넷 "${route.net}"을 참조한다.`);
    }
    if (route.points.length < 2) {
      errors.push(`넷 "${route.net}"의 트레이스는 점이 2개 이상이어야 한다.`);
    }
  }
  for (const via of spec.vias) {
    if (!netNames.has(via.net)) {
      errors.push(`비아가 선언되지 않은 넷 "${via.net}"을 참조한다.`);
    }
    if (!isViaAllowed(spec.stackup, via.type)) {
      errors.push(`${spec.stackup} 스택업에서는 via type "${via.type}"을 쓸 수 없다.`);
    }
  }
  for (const zone of spec.zones) {
    if (!netNames.has(zone.net)) {
      errors.push(`카퍼존이 선언되지 않은 넷 "${zone.net}"을 참조한다.`);
    }
  }

  // 정의됐지만 어디에도 연결되지 않은 넷. GND처럼 트레이스 없이 카퍼존
  // 하나로만 연결되는 경우가 매우 흔하므로, routes뿐 아니라 zones/vias도
  // "연결"로 인정한다 - 트레이스만 기준으로 하면 정상 설계를 오탐한다.
  const connectedNets = new Set<string>([
    ...spec.routes.map((r) => r.net),
    ...spec.zones.map((z) => z.net),
    ...spec.vias.map((v) => v.net),
  ]);
  for (const net of spec.nets) {
    if (!connectedNets.has(net.name)) {
      errors.push(`넷 "${net.name}"은 정의됐지만 트레이스/카퍼존/비아 어디에도 연결되지 않았다.`);
    }
  }

  // 보드 외곽을 벗어난 좌표 (부품 패드 절대 위치, 트레이스 점, 비아)
  const w = spec.size_mm.w;
  const h = spec.size_mm.h;
  const outOfBounds = (x: number, y: number) => x < 0 || y < 0 || x > w || y > h;

  for (const part of spec.parts) {
    if (outOfBounds(part.x, part.y)) {
      errors.push(`부품 "${part.ref}" 위치 (${part.x}, ${part.y})가 보드(${w} x ${h}) 밖이다.`);
    }
  }
  for (const route of spec.routes) {
    for (const p of route.points) {
      if (outOfBounds(p.x, p.y)) {
        errors.push(`넷 "${route.net}"의 트레이스 점 (${p.x}, ${p.y})가 보드 밖이다.`);
      }
    }
  }
  for (const via of spec.vias) {
    if (outOfBounds(via.x, via.y)) {
      errors.push(`비아(넷 "${via.net}") 위치 (${via.x}, ${via.y})가 보드 밖이다.`);
    }
  }
  for (const zone of spec.zones) {
    for (const p of zone.outline ?? []) {
      if (outOfBounds(p.x, p.y)) {
        errors.push(`카퍼존(넷 "${zone.net}")의 외곽선 점 (${p.x}, ${p.y})가 보드(${w} x ${h}) 밖이다.`);
      }
    }
    for (const slit of zone.slits ?? []) {
      // 회전을 반영한 네 꼭짓점으로 판정한다. 축 정렬 사각형만 보면
      // 45도 돌아간 슬릿이 보드를 삐져나가는 걸 놓친다.
      const halfW = slit.w_mm / 2;
      const halfH = slit.h_mm / 2;
      const corners = [
        { x: -halfW, y: -halfH },
        { x: halfW, y: -halfH },
        { x: halfW, y: halfH },
        { x: -halfW, y: halfH },
      ];
      const outside = corners.some((c) => {
        const r = rotatePoint({ x_mm: c.x, y_mm: c.y }, slit.rot ?? 0);
        return outOfBounds(slit.x + r.x_mm, slit.y + r.y_mm);
      });
      if (outside) {
        errors.push(
          `카퍼존(넷 "${zone.net}")의 GND slit (중심 ${slit.x}, ${slit.y} / ${slit.w_mm}x${slit.h_mm}mm)이 보드(${w} x ${h}) 밖으로 나간다.`
        );
      }
    }
  }

  // 스택업에 없는 구리층 참조. 4층에만 있는 In1.Cu를 2층 보드에 쓰면
  // KiCad가 해당 요소를 조용히 버리므로 파일은 열리는데 내용이 사라진다.
  for (const route of spec.routes) {
    if (!isCopperLayerInStackup(spec.stackup, route.layer)) {
      errors.push(`트레이스(넷 "${route.net}")가 ${spec.stackup} 스택업에 없는 레이어 "${route.layer}"를 쓴다.`);
    }
  }
  for (const zone of spec.zones) {
    if (!isCopperLayerInStackup(spec.stackup, zone.layer)) {
      errors.push(`카퍼존(넷 "${zone.net}")이 ${spec.stackup} 스택업에 없는 레이어 "${zone.layer}"를 쓴다.`);
    }
  }
  for (const via of spec.vias) {
    for (const layer of [via.from_layer, via.to_layer]) {
      if (!isCopperLayerInStackup(spec.stackup, layer)) {
        errors.push(`비아(넷 "${via.net}")가 ${spec.stackup} 스택업에 없는 레이어 "${layer}"를 쓴다.`);
      }
    }
  }

  // 끊긴 트레이스 끝점. 트레이스 끝이 같은 넷의 패드/비아/다른 세그먼트
  // 어디에도 닿지 않으면, 파일은 열리지만 실제로는 연결되지 않은 보드가
  // 된다 (KiCad DRC의 track_dangling / unconnected_items와 같은 상황).
  // 카퍼존으로 연결되는 넷은 채우기 전에는 판정할 수 없어 검사에서 뺀다.
  const zoneNets = new Set(spec.zones.map((z) => z.net));
  const pinNetMap = new Map<string, string>();
  for (const net of spec.nets) {
    for (const pin of net.pins) pinNetMap.set(pin, net.name);
  }
  const padsByNet = new Map<string, Array<{ x: number; y: number; reach: number }>>();
  for (const part of spec.parts) {
    const footprint = getFootprint(part.type);
    if (!footprint) continue;
    for (const pad of footprint.pads) {
      const netName = pinNetMap.get(`${part.ref}.${pad.pinRef}`);
      if (!netName) continue;
      // KiCad는 footprint의 (at x y rot)으로 패드를 직접 회전시킨다. 실제
      // KiCad 10에 파일을 넣어 확인한 결과, spec의 Y-up 좌표계에서는 이
      // 회전이 표준 반시계(CCW)와 일치한다.
      const r = rotatePoint({ x_mm: pad.x_mm, y_mm: pad.y_mm }, part.rot ?? 0);
      const list = padsByNet.get(netName) ?? [];
      list.push({
        x: part.x + r.x_mm,
        y: part.y + r.y_mm,
        reach: Math.max(pad.w_mm, pad.h_mm) / 2 + TOUCH_TOLERANCE_MM,
      });
      padsByNet.set(netName, list);
    }
  }

  for (const route of spec.routes) {
    if (zoneNets.has(route.net)) continue;
    const endpoints = [route.points[0], route.points[route.points.length - 1]];
    for (const end of endpoints) {
      if (!end) continue;

      const onPad = (padsByNet.get(route.net) ?? []).some(
        (pad) => distanceMm(end, pad) <= pad.reach
      );
      const onVia = spec.vias.some(
        (v) => v.net === route.net && distanceMm(end, v) <= v.diameter_mm / 2 + TOUCH_TOLERANCE_MM
      );
      const onOtherSegment = spec.routes.some(
        (other) =>
          other !== route &&
          other.net === route.net &&
          other.points.some((p) => distanceMm(end, p) <= TOUCH_TOLERANCE_MM)
      );

      if (!onPad && !onVia && !onOtherSegment) {
        errors.push(
          `넷 "${route.net}"의 트레이스 끝점 (${end.x}, ${end.y})이 같은 넷의 패드·비아·다른 세그먼트 어디에도 닿지 않는다 (끊긴 배선).`
        );
      }
    }
  }

  // 패드끼리 겹침. 회전된 개별 패드의 정확한 교차 판정(OBB)까지는 하지
  // 않고, 부품 courtyard(bodySize_mm) 축 정렬 바운딩 박스로 보수적으로
  // 근사한다 - 회전이 섞이면 오탐(과다 검출)은 있어도 놓치는 경우는 적다.
  type AbsBox = { ref: string; layer: string; cx: number; cy: number; w: number; h: number };
  const absBoxes: AbsBox[] = [];
  for (const part of spec.parts) {
    const footprint = getFootprint(part.type);
    if (!footprint) continue;
    const side = part.layer === "B" ? "B" : "F";
    absBoxes.push({
      ref: part.ref,
      layer: `${side}.Cu`,
      cx: part.x,
      cy: part.y,
      w: footprint.bodySize_mm.w,
      h: footprint.bodySize_mm.h,
    });
  }
  for (let i = 0; i < absBoxes.length; i++) {
    for (let j = i + 1; j < absBoxes.length; j++) {
      const a = absBoxes[i];
      const b = absBoxes[j];
      if (a.ref === b.ref || a.layer !== b.layer) continue;
      if (rectsOverlap(a, b)) {
        errors.push(`부품 "${a.ref}"와 "${b.ref}"가 겹친다 (레이어 ${a.layer}).`);
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: true };
}
