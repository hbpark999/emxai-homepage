/**
 * board-geometry.ts — PCB 형상 JSON에서 차동 쌍의 단면과 재질을 뽑아낸다
 *
 * 용도 : KiCad에서 내보낸 형상 JSON(stackup / traces / components / design_rules)을 읽어
 *        특정 위치에서의 선폭 W, 간격 S, 기준면까지 높이 H, 동박 두께 T, 유전율 er을 구한다.
 *        결과는 src/lib/diffpair.ts의 Zdiff 계산기로 그대로 넘긴다.
 *
 * 기본 위치 : AC Capacitor에서 부품(IC)쪽으로 1 mm 떨어진 지점.
 *             호출자가 위치를 지정하면 그 지점에서 단면을 뽑는다.
 *
 * 주의 : 좌표는 JSON 그대로 mm 단위이며 y는 아래쪽이 +(KiCad 좌표)다.
 *        단면은 해당 지점의 실제 배선에서 측정하므로, 팬아웃 구간에서는
 *        design_rules의 diff_gap보다 넓은 간격이 나오는 것이 정상이다.
 */

import type { DiffPairInput } from "@/lib/diffpair";

export type Pt = [number, number];

export type BoardTrace = {
  net: string;
  layer: string;
  width: number;
  points: Pt[];
  length?: number;
};

export type StackupLayer = {
  name: string;
  type: string;
  thickness: number;
  material?: string;
  z_bottom: number;
  z_top: number;
  role?: string;
};

export type BoardPad = { number?: string; net?: string | null; position?: Pt; layers?: string };
export type BoardComponent = { ref?: string; value?: string; footprint?: string; position?: Pt; pads?: BoardPad[] };

export type BoardJson = {
  meta?: { name?: string };
  stackup?: StackupLayer[];
  materials?: Record<string, { epsilon_r?: number; loss_tangent?: number }>;
  design_rules?: {
    diff_width?: number;
    diff_gap?: number;
    target_Zdiff_ohm?: number;
    net_class?: string;
  };
  diff_pairs?: Array<{
    name?: string;
    direction?: string;
    sections?: Array<{ section?: string; p?: string; n?: string; layer?: string }>;
  }>;
  ac_caps?: Array<{ ref?: string; value?: string; center?: Pt; nets?: string[] }>;
  components?: BoardComponent[];
  traces?: BoardTrace[];
  hfss?: { setup?: { solution_freq_GHz?: number } };
};

export type LocationRequest = {
  /** 기준으로 삼을 부품 ref (기본: 첫 번째 AC Cap) */
  ref?: string;
  /** 기준 부품에서 떨어진 거리 [mm] (기본 1) */
  offset_mm?: number;
  /** ic = 부품(IC)쪽, connector = 커넥터쪽 (기본 ic) */
  side?: "ic" | "connector";
  /** 좌표를 직접 줄 때 사용. 주면 ref/offset보다 우선한다. */
  x_mm?: number;
  y_mm?: number;
  /** 차동 쌍 이름(diff_pairs[].name) 또는 네트 이름. 생략하면 AC Cap이 붙은 쌍을 쓴다. */
  pair?: string;
};

export type CrossSection = {
  input: DiffPairInput;
  layer: string;
  reference_layer: string;
  dielectric: { name: string; material: string; thickness_mm: number; epsilon_r: number };
  net_p: string;
  net_n: string;
  point: Pt;
  center_to_center_mm: number;
  width_p_mm: number;
  width_n_mm: number;
  notes: string[];
};

const EPS = 1e-9;

/* ── 기하 유틸 ───────────────────────────────────────────── */

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function polylineLength(points: Pt[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i]);
  return total;
}

/** 폴리라인의 한쪽 끝에서 거리 d만큼 따라 들어간 지점. 길이를 넘으면 반대쪽 끝으로 잘린다. */
export function walkAlong(points: Pt[], fromStart: boolean, d: number): { point: Pt; clamped: boolean } {
  const path = fromStart ? points : [...points].reverse();
  let remaining = Math.max(0, d);
  for (let i = 1; i < path.length; i++) {
    const seg = dist(path[i - 1], path[i]);
    if (seg < EPS) continue;
    if (remaining <= seg) {
      const r = remaining / seg;
      return {
        point: [
          path[i - 1][0] + (path[i][0] - path[i - 1][0]) * r,
          path[i - 1][1] + (path[i][1] - path[i - 1][1]) * r,
        ],
        clamped: false,
      };
    }
    remaining -= seg;
  }
  return { point: path[path.length - 1], clamped: true };
}

/** 점에서 폴리라인까지의 최단 거리와 그 발. */
export function nearestOnPolyline(points: Pt[], p: Pt): { distance: number; point: Pt } {
  let best = { distance: Infinity, point: points[0] };
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const vx = b[0] - a[0];
    const vy = b[1] - a[1];
    const len2 = vx * vx + vy * vy;
    let t = len2 < EPS ? 0 : ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / len2;
    t = Math.max(0, Math.min(1, t));
    const foot: Pt = [a[0] + vx * t, a[1] + vy * t];
    const d = dist(p, foot);
    if (d < best.distance) best = { distance: d, point: foot };
  }
  return best;
}

/* ── 네트·쌍 해석 ────────────────────────────────────────── */

/** 네트 이름의 _P/_N 짝을 만든다. */
function siblingNet(net: string): string | null {
  if (/_P$/.test(net)) return net.replace(/_P$/, "_N");
  if (/_N$/.test(net)) return net.replace(/_N$/, "_P");
  return null;
}

/** diff_pairs 정의에서 짝 네트를 찾는다. 없으면 _P/_N 규칙으로 보조한다. */
export function partnerNet(board: BoardJson, net: string): string | null {
  for (const pair of board.diff_pairs ?? []) {
    for (const sec of pair.sections ?? []) {
      if (sec.p === net) return sec.n ?? null;
      if (sec.n === net) return sec.p ?? null;
    }
  }
  return siblingNet(net);
}

function componentsOnNet(board: BoardJson, net: string, excludeRef?: string): BoardComponent[] {
  return (board.components ?? []).filter(
    (c) => c.ref !== excludeRef && (c.pads ?? []).some((p) => p.net === net),
  );
}

function isConnector(c: BoardComponent): boolean {
  const f = `${c.footprint ?? ""} ${c.value ?? ""}`.toLowerCase();
  return f.includes("connector") || f.includes("usb3_a") || /^j\d/i.test(c.ref ?? "");
}

/**
 * AC Cap의 두 네트 중 부품(IC)쪽 네트를 고른다.
 * 반대쪽 네트에 커넥터가 붙어 있으면 그것을 커넥터쪽으로 판정하고,
 * 판정할 수 없으면 ac_caps[].nets의 첫 번째를 IC쪽으로 본다(JSON 관례).
 */
export function icSideNet(board: BoardJson, capRef: string, nets: string[]): { net: string; note: string } {
  for (const net of nets) {
    const others = componentsOnNet(board, net, capRef);
    if (others.length && others.every((c) => !isConnector(c))) {
      return { net, note: `${net}은 ${others.map((c) => c.ref).join(",")}에 연결되어 부품(IC)쪽으로 판정` };
    }
  }
  return { net: nets[0], note: `연결 부품으로 판정하지 못해 nets 첫 번째(${nets[0]})를 부품쪽으로 가정` };
}

/* ── 스택업 ─────────────────────────────────────────────── */

function copperLayers(board: BoardJson): StackupLayer[] {
  return (board.stackup ?? []).filter((l) => l.type === "copper");
}

function isPlane(l: StackupLayer): boolean {
  return /plane/i.test(l.role ?? "") || /gnd|power/i.test(l.role ?? "");
}

/** 신호 층에서 가장 가까운 기준면과 그 사이 유전체를 찾는다. */
export function referenceFor(board: BoardJson, layerName: string) {
  const stack = board.stackup ?? [];
  const signal = copperLayers(board).find((l) => l.name === layerName);
  if (!signal) return null;

  const planes = copperLayers(board).filter(isPlane);
  if (!planes.length) return null;

  let best: { plane: StackupLayer; gap: number; below: boolean } | null = null;
  for (const plane of planes) {
    const below = plane.z_top <= signal.z_bottom + EPS;
    const gap = below ? signal.z_bottom - plane.z_top : plane.z_bottom - signal.z_top;
    if (gap < -EPS) continue;
    if (!best || gap < best.gap) best = { plane, gap, below };
  }
  if (!best) return null;

  const loZ = best.below ? best.plane.z_top : signal.z_top;
  const hiZ = best.below ? signal.z_bottom : best.plane.z_bottom;
  const between = stack.filter(
    (l) => l.type !== "copper" && l.z_bottom >= loZ - EPS && l.z_top <= hiZ + EPS && l.thickness > EPS,
  );
  const die = between[0];
  const material = die?.material ?? "FR4";
  const er = board.materials?.[material]?.epsilon_r ?? 4.3;

  // 두 면 사이에 낀 층(스트립라인)인지 확인한다.
  const hasOtherSide = planes.some((p) =>
    best!.below ? p.z_bottom >= signal.z_top - EPS : p.z_top <= signal.z_bottom + EPS,
  );

  return {
    signal,
    plane: best.plane,
    h_mm: Number(best.gap.toFixed(6)),
    dielectric: {
      name: die?.name ?? "unknown",
      material,
      thickness_mm: die?.thickness ?? best.gap,
      epsilon_r: er,
    },
    buried: hasOtherSide && signal.name !== "F.Cu" && signal.name !== "B.Cu",
  };
}

/* ── 위치 해석과 단면 추출 ───────────────────────────────── */

function tracesOf(board: BoardJson, net: string, layer?: string): BoardTrace[] {
  return (board.traces ?? []).filter(
    (t) => t.net === net && Array.isArray(t.points) && t.points.length >= 2 && (!layer || t.layer === layer),
  );
}

function padPosition(board: BoardJson, ref: string, net: string): Pt | null {
  const comp = (board.components ?? []).find((c) => c.ref === ref);
  const pad = (comp?.pads ?? []).find((p) => p.net === net && Array.isArray(p.position));
  return (pad?.position as Pt) ?? null;
}

export type ResolvedPoint = {
  point: Pt;
  net_p: string;
  layer: string;
  width_p: number;
  description: string;
  notes: string[];
};

/** 평가 지점을 정한다. 좌표를 직접 주면 그 좌표를, 아니면 AC Cap에서 offset만큼 떨어진 지점을 쓴다. */
export function resolveLocation(board: BoardJson, req: LocationRequest = {}): ResolvedPoint | { error: string } {
  const notes: string[] = [];
  const caps = board.ac_caps ?? [];

  // 1) 기준 쌍의 네트 결정
  let netP: string | null = null;
  let capRef: string | undefined = req.ref;

  if (req.pair) {
    const byName = (board.diff_pairs ?? []).find((p) => p.name === req.pair);
    if (byName) {
      const sec = (byName.sections ?? [])[0];
      netP = sec?.p ?? null;
    } else if ((board.traces ?? []).some((t) => t.net === req.pair)) {
      netP = req.pair;
    }
    if (!netP) return { error: `pair "${req.pair}"를 diff_pairs나 traces에서 찾지 못했습니다.` };
  }

  const cap = capRef ? caps.find((c) => c.ref === capRef) : caps[0];
  if (!req.x_mm && !req.y_mm) {
    if (!cap) {
      return {
        error:
          "ac_caps가 없어 기본 위치를 잡을 수 없습니다. at.x_mm/at.y_mm으로 좌표를 주거나 at.ref로 부품을 지정하세요.",
      };
    }
    capRef = cap.ref;
    const side = req.side ?? "ic";
    const nets = cap.nets ?? [];
    if (nets.length < 2) return { error: `${cap.ref}의 nets 정보가 부족합니다.` };
    const ic = icSideNet(board, cap.ref ?? "", nets);
    const chosen = side === "ic" ? ic.net : nets.find((n) => n !== ic.net) ?? nets[1];
    notes.push(
      side === "ic"
        ? ic.note
        : `${ic.note}. 요청이 커넥터쪽이므로 반대 네트 ${chosen}에서 측정했습니다.`,
    );
    if (netP && netP !== chosen) {
      notes.push(`pair 지정(${netP})보다 ${cap.ref}의 ${side}쪽 네트(${chosen})를 우선했습니다.`);
    }
    netP = chosen;
  }

  if (!netP) {
    // 좌표만 준 경우: 좌표에 가장 가까운 차동 네트를 찾는다.
    const target: Pt = [req.x_mm ?? 0, req.y_mm ?? 0];
    let best: { net: string; d: number } | null = null;
    for (const t of board.traces ?? []) {
      if (!partnerNet(board, t.net)) continue;
      if (!Array.isArray(t.points) || t.points.length < 2) continue;
      const d = nearestOnPolyline(t.points, target).distance;
      if (!best || d < best.d) best = { net: t.net, d };
    }
    if (!best) return { error: "좌표 근처에서 차동 배선을 찾지 못했습니다." };
    netP = best.net;
    notes.push(`좌표에 가장 가까운 차동 네트 ${best.net}을 선택(거리 ${best.d.toFixed(3)} mm)`);
  }

  // 2) 좌표 지정이면 그 지점을 폴리라인에 투영
  if (req.x_mm !== undefined && req.y_mm !== undefined) {
    const target: Pt = [req.x_mm, req.y_mm];
    let best: { t: BoardTrace; d: number; p: Pt } | null = null;
    for (const t of tracesOf(board, netP)) {
      const near = nearestOnPolyline(t.points, target);
      if (!best || near.distance < best.d) best = { t, d: near.distance, p: near.point };
    }
    if (!best) return { error: `${netP}의 배선을 찾지 못했습니다.` };
    if (best.d > 0.5) notes.push(`지정 좌표가 배선에서 ${best.d.toFixed(3)} mm 떨어져 있어 가장 가까운 배선 위로 투영했습니다.`);
    return {
      point: best.p,
      net_p: netP,
      layer: best.t.layer,
      width_p: best.t.width,
      description: `지정 좌표 (${req.x_mm}, ${req.y_mm}) 위치`,
      notes,
    };
  }

  // 3) AC Cap 패드에서 offset만큼 걸어 들어간 지점
  const offset = req.offset_mm ?? 1;
  const pad = padPosition(board, capRef ?? "", netP) ?? (cap?.center as Pt | undefined);
  if (!pad) return { error: `${capRef}의 ${netP} 패드 위치를 찾지 못했습니다.` };

  const candidates = tracesOf(board, netP);
  if (!candidates.length) return { error: `${netP}의 배선을 찾지 못했습니다.` };

  let chosen: { t: BoardTrace; fromStart: boolean; d: number } | null = null;
  for (const t of candidates) {
    const dStart = dist(t.points[0], pad);
    const dEnd = dist(t.points[t.points.length - 1], pad);
    const fromStart = dStart <= dEnd;
    const d = Math.min(dStart, dEnd);
    if (!chosen || d < chosen.d) chosen = { t, fromStart, d };
  }
  if (!chosen) return { error: `${netP}의 배선 끝점을 찾지 못했습니다.` };
  if (chosen.d > 0.2) notes.push(`패드와 배선 끝점이 ${chosen.d.toFixed(3)} mm 떨어져 있습니다.`);

  const walk = walkAlong(chosen.t.points, chosen.fromStart, offset);
  if (walk.clamped) {
    notes.push(`이 배선 구간이 ${polylineLength(chosen.t.points).toFixed(3)} mm로 짧아 끝점에서 측정했습니다.`);
  }

  return {
    point: walk.point,
    net_p: netP,
    layer: chosen.t.layer,
    width_p: chosen.t.width,
    description: `${capRef}(${cap?.value ?? ""}) 패드에서 ${req.side === "connector" ? "커넥터" : "부품(IC)"}쪽으로 ${offset} mm 지점`,
    notes,
  };
}

/** 평가 지점에서 차동 단면(W/S/H/T/er)을 만들어 Zdiff 계산 입력으로 돌려준다. */
export function crossSectionAt(
  board: BoardJson,
  loc: ResolvedPoint,
  freq_ghz?: number,
): CrossSection | { error: string } {
  const notes = [...loc.notes];
  const netN = partnerNet(board, loc.net_p);
  if (!netN) return { error: `${loc.net_p}의 짝 네트를 찾지 못했습니다.` };

  const sameLayer = tracesOf(board, netN, loc.layer);
  const pool = sameLayer.length ? sameLayer : tracesOf(board, netN);
  if (!pool.length) return { error: `${netN}의 배선을 찾지 못했습니다.` };
  if (!sameLayer.length) notes.push(`${netN}이 같은 층(${loc.layer})에 없어 다른 층 배선까지 포함해 간격을 측정했습니다.`);

  let best: { d: number; width: number } | null = null;
  for (const t of pool) {
    const near = nearestOnPolyline(t.points, loc.point);
    if (!best || near.distance < best.d) best = { d: near.distance, width: t.width };
  }
  if (!best) return { error: `${netN}까지의 거리를 계산하지 못했습니다.` };

  const ref = referenceFor(board, loc.layer);
  if (!ref) return { error: `스택업에서 ${loc.layer}의 기준면을 찾지 못했습니다.` };
  if (ref.buried) {
    notes.push(
      `${loc.layer}는 두 기준면 사이에 있어 스트립라인에 가깝습니다. 이 도구의 마이크로스트립 근사식은 경향 확인용으로만 쓰세요.`,
    );
  }

  const gap = best.d - (loc.width_p / 2 + best.width / 2);
  if (gap <= 0) {
    return {
      error:
        `측정 지점에서 두 배선의 중심 간 거리(${best.d.toFixed(3)} mm)가 선폭 합의 절반보다 작습니다. ` +
        "다른 위치를 지정하거나 좌표를 확인하세요.",
    };
  }

  const drGap = board.design_rules?.diff_gap;
  if (drGap && gap > drGap * 1.5) {
    notes.push(
      `측정 간격 ${gap.toFixed(3)} mm는 design_rules의 diff_gap ${drGap} mm보다 넓습니다. ` +
        "패드 팬아웃 구간이면 정상이며, 등간격 구간을 보려면 위치를 더 안쪽으로 지정하세요.",
    );
  }

  return {
    input: {
      er: ref.dielectric.epsilon_r,
      h_mm: ref.h_mm,
      w_mm: loc.width_p,
      s_mm: Number(gap.toFixed(6)),
      t_um: Number((ref.signal.thickness * 1000).toFixed(3)),
      freq_ghz: freq_ghz ?? board.hfss?.setup?.solution_freq_GHz ?? 5,
    },
    layer: loc.layer,
    reference_layer: ref.plane.name,
    dielectric: ref.dielectric,
    net_p: loc.net_p,
    net_n: netN,
    point: [Number(loc.point[0].toFixed(4)), Number(loc.point[1].toFixed(4))],
    center_to_center_mm: Number(best.d.toFixed(4)),
    width_p_mm: loc.width_p,
    width_n_mm: best.width,
    notes,
  };
}

/** 형상 JSON에 어떤 차동 쌍과 AC Cap이 들어 있는지 목록으로 돌려준다. */
export function summarizeBoard(board: BoardJson) {
  return {
    name: board.meta?.name ?? null,
    diff_pairs: (board.diff_pairs ?? []).map((p) => ({
      name: p.name,
      direction: p.direction,
      sections: (p.sections ?? []).map((s) => ({ section: s.section, p: s.p, n: s.n, layer: s.layer })),
    })),
    ac_caps: (board.ac_caps ?? []).map((c) => ({ ref: c.ref, value: c.value, nets: c.nets, center: c.center })),
    design_rules: board.design_rules ?? null,
    signal_layers: copperLayers(board)
      .filter((l) => !isPlane(l))
      .map((l) => l.name),
    reference_layers: copperLayers(board).filter(isPlane).map((l) => l.name),
  };
}
