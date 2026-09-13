/**
 * measure.ts
 * BoardAnalysis(형상)에서 SI/EMI 분석용 측정값만 산출한다.
 * 합격/불합격은 판정하지 않고 숫자만 낸다 - 판정 기준(최소 간격 등)은
 * 제조사·용도마다 다르므로 규칙 상수를 코드에 두지 않는다.
 * 핵심은 return_path의 slit_crossings(트레이스가 레퍼런스 평면의 슬릿을
 * 가로지르는 지점)이며, 선분-다각형 교차로 정확히 계산한다.
 */

import type {
  AnalysisPlane,
  AnalysisTrace,
  BoardAnalysis,
  BoardMeasurements,
  Pt,
  SlitCrossing,
} from "./types";

/** clearance 결과가 토큰을 잡아먹지 않도록 가까운 순으로 이만큼만 남긴다. */
const MAX_CLEARANCE_ENTRIES = 30;

// ---- 기하 헬퍼 --------------------------------------------------------------

function dist(a: Pt, b: Pt): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function round6(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

/** 점과 선분 사이 최단거리와 그 최근접점. */
function pointSegment(p: Pt, a: Pt, b: Pt): { d: number; at: Pt } {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len2 = vx * vx + vy * vy;
  if (len2 < 1e-18) return { d: dist(p, a), at: a };
  let t = ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2;
  t = Math.max(0, Math.min(1, t));
  const at = { x: a.x + t * vx, y: a.y + t * vy };
  return { d: dist(p, at), at };
}

/** 두 선분의 교차점 (없으면 null). 끝점 접촉도 교차로 본다. */
function segmentIntersection(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-12) return null; // 평행
  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
  const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: round6(a1.x + t * d1x), y: round6(a1.y + t * d1y) };
}

/** 두 선분 사이 최단거리와 그 위치. */
function segmentSegment(a1: Pt, a2: Pt, b1: Pt, b2: Pt): { d: number; at: Pt } {
  const hit = segmentIntersection(a1, a2, b1, b2);
  if (hit) return { d: 0, at: hit };
  const cands = [
    pointSegment(a1, b1, b2),
    pointSegment(a2, b1, b2),
    pointSegment(b1, a1, a2),
    pointSegment(b2, a1, a2),
  ];
  return cands.reduce((best, c) => (c.d < best.d ? c : best));
}

function pointInPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    const intersects = a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** 축 정렬 사각형(패드 근사)의 네 변. */
function rectEdges(center: Pt, w: number, h: number): Array<[Pt, Pt]> {
  const x0 = center.x - w / 2;
  const x1 = center.x + w / 2;
  const y0 = center.y - h / 2;
  const y1 = center.y + h / 2;
  return [
    [{ x: x0, y: y0 }, { x: x1, y: y0 }],
    [{ x: x1, y: y0 }, { x: x1, y: y1 }],
    [{ x: x1, y: y1 }, { x: x0, y: y1 }],
    [{ x: x0, y: y1 }, { x: x0, y: y0 }],
  ];
}

function polygonEdges(poly: Pt[]): Array<[Pt, Pt]> {
  const out: Array<[Pt, Pt]> = [];
  for (let i = 0; i < poly.length; i++) out.push([poly[i], poly[(i + 1) % poly.length]]);
  return out;
}

/** 다각형의 장축 방향 단위벡터 (슬릿이 어느 쪽으로 길게 뻗었는지). */
function longAxis(poly: Pt[]): { ux: number; uy: number } {
  let best = { ux: 1, uy: 0 };
  let bestLen = -1;
  for (const [a, b] of polygonEdges(poly)) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len > bestLen) {
      bestLen = len;
      best = { ux: dx / len, uy: dy / len };
    }
  }
  return best;
}

// ---- 스택업 유틸 ------------------------------------------------------------

type CopperIndex = { layer: string; index: number };

function copperLayersInOrder(analysis: BoardAnalysis): CopperIndex[] {
  return analysis.stackup
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.kind === "copper")
    .map(({ entry, index }) => ({ layer: entry.layer, index }));
}

/** 두 구리층 사이(양 끝 구리층 제외)의 두께 합 [mm]. */
function verticalGapMm(analysis: BoardAnalysis, aIndex: number, bIndex: number): number {
  const lo = Math.min(aIndex, bIndex);
  const hi = Math.max(aIndex, bIndex);
  let sum = 0;
  for (let i = lo + 1; i < hi; i++) sum += analysis.stackup[i].thickness_mm;
  return round6(sum);
}

/** 해당 층에 가장 가까운(스택업상 인접한) 레퍼런스 평면. */
function nearestReferencePlane(
  analysis: BoardAnalysis,
  layer: string,
  planes: AnalysisPlane[]
): { plane: AnalysisPlane; gap_mm: number } | undefined {
  const coppers = copperLayersInOrder(analysis);
  const self = coppers.find((c) => c.layer === layer);
  if (!self) return undefined;

  let best: { plane: AnalysisPlane; gap_mm: number; distance: number } | undefined;
  for (const plane of planes) {
    const target = coppers.find((c) => c.layer === plane.layer);
    if (!target || target.layer === layer) continue;
    const distance = Math.abs(target.index - self.index);
    if (!best || distance < best.distance) {
      best = { plane, gap_mm: verticalGapMm(analysis, self.index, target.index), distance };
    }
  }
  return best ? { plane: best.plane, gap_mm: best.gap_mm } : undefined;
}

// ---- 측정 항목 --------------------------------------------------------------

type ClearanceItem = {
  label: string;
  net: string;
  layer: string;
  edges: Array<[Pt, Pt]>;
};

function collectClearanceItems(analysis: BoardAnalysis): ClearanceItem[] {
  const items: ClearanceItem[] = [];

  for (const trace of analysis.traces) {
    items.push({
      label: `${trace.net}(trace)`,
      net: trace.net,
      layer: trace.layer,
      edges: trace.segments.map((s) => [s.start, s.end] as [Pt, Pt]),
    });
  }

  for (const pad of analysis.pads) {
    items.push({
      label: `${pad.ref}.${pad.pin}(pad)`,
      net: pad.net,
      layer: pad.layer,
      edges: rectEdges(pad.pos, pad.size_mm.w, pad.size_mm.h),
    });
  }

  for (const plane of analysis.planes) {
    // 평면은 외곽선과 슬릿 경계만 "가장자리"로 본다. 평면 내부는 구리로
    // 덮여 있으므로 같은 층 다른 넷과의 간격은 이 경계까지의 거리다.
    const edges = [
      ...polygonEdges(plane.outline),
      ...plane.splits.flatMap((s) => polygonEdges(s.polygon)),
    ];
    items.push({ label: `${plane.net}(plane)`, net: plane.net, layer: plane.layer, edges });
  }

  return items;
}

function measureClearances(analysis: BoardAnalysis): BoardMeasurements["clearances"] {
  const items = collectClearanceItems(analysis);
  const results: BoardMeasurements["clearances"] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.layer !== b.layer) continue;
      if (a.net === b.net) continue; // 같은 넷은 붙어 있는 게 정상

      let best: { d: number; at: Pt } | undefined;
      for (const [a1, a2] of a.edges) {
        for (const [b1, b2] of b.edges) {
          const hit = segmentSegment(a1, a2, b1, b2);
          if (!best || hit.d < best.d) best = hit;
        }
      }
      if (best) {
        results.push({
          a: a.label,
          b: b.label,
          layer: a.layer,
          min_mm: round6(best.d),
          at: { x: round6(best.at.x), y: round6(best.at.y) },
        });
      }
    }
  }

  results.sort((x, y) => x.min_mm - y.min_mm);
  return results.slice(0, MAX_CLEARANCE_ENTRIES);
}

function measureTraceToEdge(analysis: BoardAnalysis): BoardMeasurements["trace_to_edge"] {
  const outlineEdges = polygonEdges(analysis.outline.polygon);
  const out: BoardMeasurements["trace_to_edge"] = [];

  for (const trace of analysis.traces) {
    let best: { d: number; at: Pt } | undefined;
    for (const seg of trace.segments) {
      for (const [e1, e2] of outlineEdges) {
        const hit = segmentSegment(seg.start, seg.end, e1, e2);
        if (!best || hit.d < best.d) best = hit;
      }
    }
    if (best) {
      out.push({
        net: trace.net,
        layer: trace.layer,
        min_mm: round6(best.d),
        at: { x: round6(best.at.x), y: round6(best.at.y) },
      });
    }
  }
  return out;
}

/**
 * 트레이스가 슬릿 다각형을 가로지르는 지점을 찾는다. 선분과 슬릿 경계의
 * 교차점을 모아, 들어간 곳과 나온 곳의 중점을 교차 위치로 본다.
 */
function findSlitCrossings(trace: AnalysisTrace, plane: AnalysisPlane): SlitCrossing[] {
  const crossings: SlitCrossing[] = [];

  for (const split of plane.splits) {
    const axis = longAxis(split.polygon);
    for (const seg of trace.segments) {
      const hits: Pt[] = [];
      for (const [p1, p2] of polygonEdges(split.polygon)) {
        const hit = segmentIntersection(seg.start, seg.end, p1, p2);
        if (hit) hits.push(hit);
      }

      // 세그먼트 끝점이 슬릿 안에 있으면 그 끝점도 경계로 친다.
      const startInside = pointInPolygon(seg.start, split.polygon);
      const endInside = pointInPolygon(seg.end, split.polygon);
      if (startInside) hits.push(seg.start);
      if (endInside) hits.push(seg.end);
      if (hits.length === 0) continue;

      // 중복 제거 후 진행 방향 순으로 정렬
      const uniq: Pt[] = [];
      for (const h of hits) {
        if (!uniq.some((u) => dist(u, h) < 1e-6)) uniq.push(h);
      }
      uniq.sort((p, q) => dist(seg.start, p) - dist(seg.start, q));

      const entry = uniq[0];
      const exit = uniq[uniq.length - 1];
      const at = { x: round6((entry.x + exit.x) / 2), y: round6((entry.y + exit.y) / 2) };

      const dx = seg.end.x - seg.start.x;
      const dy = seg.end.y - seg.start.y;
      const segLen = Math.hypot(dx, dy) || 1;
      const cosang = Math.abs((dx / segLen) * axis.ux + (dy / segLen) * axis.uy);
      const angleToAxis = (Math.acos(Math.min(1, cosang)) * 180) / Math.PI;

      crossings.push({
        at,
        slit_width_mm: split.width_mm,
        crossing_angle_deg: round6(angleToAxis),
      });
    }
  }

  return crossings;
}

function measureReturnPath(analysis: BoardAnalysis): BoardMeasurements["return_path"] {
  const out: BoardMeasurements["return_path"] = [];

  for (const trace of analysis.traces) {
    const ref = nearestReferencePlane(analysis, trace.layer, analysis.planes);
    if (!ref) continue;
    if (ref.plane.net === trace.net) continue; // 평면 자신의 넷이면 리턴패스 개념이 없다

    const slit_crossings = findSlitCrossings(trace, ref.plane);

    // 레퍼런스 넷(보통 GND) 비아까지의 최단거리
    let nearest = Infinity;
    for (const via of analysis.vias) {
      if (via.net !== ref.plane.net) continue;
      for (const seg of trace.segments) {
        nearest = Math.min(nearest, pointSegment(via.pos, seg.start, seg.end).d);
      }
    }

    out.push({
      net: trace.net,
      layer: trace.layer,
      ref_layer: ref.plane.layer,
      ref_gap_mm: ref.gap_mm,
      ref_continuous: slit_crossings.length === 0,
      slit_crossings,
      nearest_gnd_via_mm: Number.isFinite(nearest) ? round6(nearest) : -1,
    });
  }

  return out;
}

function measureLayerTransitions(analysis: BoardAnalysis): BoardMeasurements["layer_transitions"] {
  const out: BoardMeasurements["layer_transitions"] = [];

  for (const via of analysis.vias) {
    if (via.is_stitching) continue; // 평면 꿰매기용 비아는 층 전환이 아니다
    const fromRef = nearestReferencePlane(analysis, via.from_layer, analysis.planes);
    const toRef = nearestReferencePlane(analysis, via.to_layer, analysis.planes);
    out.push({
      net: via.net,
      via_pos: via.pos,
      from_layer: via.from_layer,
      to_layer: via.to_layer,
      ref_change: (fromRef?.plane.layer ?? "") !== (toRef?.plane.layer ?? ""),
    });
  }

  return out;
}

/**
 * through 비아에서 신호가 실제로 쓰지 않는 구간(스터브) 길이를 채운다.
 * 신호가 쓰는 층 = 그 비아 위치에 닿는 같은 넷 트레이스의 층.
 */
function fillViaStubs(analysis: BoardAnalysis): void {
  const coppers = copperLayersInOrder(analysis);
  const indexOf = (layer: string) => coppers.find((c) => c.layer === layer)?.index;

  for (const via of analysis.vias) {
    if (via.is_stitching) continue;

    const usedIndices: number[] = [];
    for (const trace of analysis.traces) {
      if (trace.net !== via.net) continue;
      const touches = trace.segments.some(
        (s) =>
          pointSegment(via.pos, s.start, s.end).d <= via.diameter_mm / 2 + 1e-6
      );
      if (!touches) continue;
      const idx = indexOf(trace.layer);
      if (idx !== undefined) usedIndices.push(idx);
    }
    if (usedIndices.length === 0) continue;

    const fromIdx = indexOf(via.from_layer);
    const toIdx = indexOf(via.to_layer);
    if (fromIdx === undefined || toIdx === undefined) continue;

    const viaTop = Math.min(fromIdx, toIdx);
    const viaBottom = Math.max(fromIdx, toIdx);
    const usedTop = Math.min(...usedIndices);
    const usedBottom = Math.max(...usedIndices);

    // 쓰이는 구간 바깥의 위/아래 잔여 길이를 더한다.
    const stub = verticalGapMm(analysis, viaTop, usedTop) + verticalGapMm(analysis, usedBottom, viaBottom);
    via.stub_len_mm = round6(stub);
  }
}

/** BoardAnalysis에 measurements를 채워 넣는다 (vias의 stub_len_mm도 함께 갱신). */
export function measureBoard(analysis: BoardAnalysis): BoardAnalysis {
  fillViaStubs(analysis);
  analysis.measurements = {
    clearances: measureClearances(analysis),
    trace_to_edge: measureTraceToEdge(analysis),
    return_path: measureReturnPath(analysis),
    layer_transitions: measureLayerTransitions(analysis),
    diff_pairs: [], // 2단계
  };
  return analysis;
}
