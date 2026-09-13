/**
 * parse.ts
 * .kicad_pcb 텍스트를 S-expression으로 토큰 단위 파싱해 BoardAnalysis(형상)로
 * 옮긴다. 정규식으로 긁지 않고 중첩 괄호·따옴표 이스케이프·주석을 제대로
 * 처리하므로, 우리가 생성한 파일뿐 아니라 KiCad가 저장한 파일도 읽는다.
 * KiCad의 Y-down 좌표를 보드 좌하단 기준(Y-up)으로 바꾸는 지점도 여기다.
 * 측정값(measurements)은 채우지 않는다 - measure.ts가 담당한다.
 */

import type {
  AnalysisPad,
  AnalysisPlane,
  AnalysisTrace,
  AnalysisVia,
  AnalysisStackupLayer,
  BoardAnalysis,
  PlaneSplit,
  Pt,
  Result,
  StackupId,
  TraceSegment,
} from "./types";
import { getStackupPreset } from "./stackup";
import { COPPER_THICKNESS_MM } from "./stackup";
import { distanceMm, polygonArea } from "./units";

// ---- S-expression 토크나이저 ---------------------------------------------

export type SNode = string | SNode[];

/**
 * S-expression 파서. 문자열 리터럴 안의 괄호/이스케이프와 ';' 줄 주석을
 * 올바르게 건너뛴다. 반환값은 중첩 배열이며, 원자는 문자열로 남긴다
 * (따옴표는 벗겨서 저장하되, 따옴표 여부는 값 자체로 구분하지 않는다).
 */
export function parseSExpr(text: string): Result<SNode> {
  let i = 0;
  const n = text.length;

  function skipWhitespaceAndComments() {
    while (i < n) {
      const c = text[i];
      if (c === ";") {
        while (i < n && text[i] !== "\n") i++;
      } else if (c === " " || c === "\t" || c === "\n" || c === "\r") {
        i++;
      } else {
        break;
      }
    }
  }

  function readString(): string {
    i++; // 여는 따옴표
    let out = "";
    while (i < n) {
      const c = text[i];
      if (c === "\\") {
        const next = text[i + 1];
        if (next === "n") out += "\n";
        else if (next === "t") out += "\t";
        else out += next ?? "";
        i += 2;
        continue;
      }
      if (c === '"') {
        i++;
        return out;
      }
      out += c;
      i++;
    }
    throw new Error("따옴표가 닫히지 않았다.");
  }

  function readAtom(): string {
    const start = i;
    while (i < n) {
      const c = text[i];
      if (c === "(" || c === ")" || c === " " || c === "\t" || c === "\n" || c === "\r" || c === ";") {
        break;
      }
      i++;
    }
    return text.slice(start, i);
  }

  function readNode(): SNode {
    skipWhitespaceAndComments();
    if (i >= n) throw new Error("입력이 예상보다 일찍 끝났다.");
    const c = text[i];
    if (c === "(") {
      i++;
      const list: SNode[] = [];
      for (;;) {
        skipWhitespaceAndComments();
        if (i >= n) throw new Error("괄호가 닫히지 않았다.");
        if (text[i] === ")") {
          i++;
          return list;
        }
        list.push(readNode());
      }
    }
    if (c === ")") throw new Error("짝이 맞지 않는 ')'가 있다.");
    if (c === '"') return readString();
    return readAtom();
  }

  try {
    const node = readNode();
    return { ok: true, value: node };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, errors: [`S-expression 파싱 실패: ${message}`] };
  }
}

// ---- 노드 탐색 헬퍼 --------------------------------------------------------

function isList(node: SNode | undefined): node is SNode[] {
  return Array.isArray(node);
}

function head(node: SNode | undefined): string | undefined {
  if (isList(node) && typeof node[0] === "string") return node[0];
  return undefined;
}

/** 리스트의 직계 자식 중 head가 name인 것들. */
function children(node: SNode[], name: string): SNode[][] {
  const out: SNode[][] = [];
  for (const child of node) {
    if (isList(child) && head(child) === name) out.push(child);
  }
  return out;
}

function child(node: SNode[], name: string): SNode[] | undefined {
  return children(node, name)[0];
}

/** (name value) 형태에서 value를 문자열로. */
function value(node: SNode[] | undefined, index = 1): string | undefined {
  if (!node) return undefined;
  const v = node[index];
  return typeof v === "string" ? v : undefined;
}

function num(node: SNode[] | undefined, index = 1): number | undefined {
  const v = value(node, index);
  if (v === undefined) return undefined;
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** (at x y [rot]) */
function readAt(node: SNode[]): { x: number; y: number; rot: number } | undefined {
  const at = child(node, "at");
  if (!at) return undefined;
  const x = num(at, 1);
  const y = num(at, 2);
  if (x === undefined || y === undefined) return undefined;
  return { x, y, rot: num(at, 3) ?? 0 };
}

/** (pts (xy x y) ...) → 점 목록 (KiCad 좌표 그대로) */
function readPts(node: SNode[]): Array<{ x: number; y: number }> {
  const pts = child(node, "pts");
  if (!pts) return [];
  const out: Array<{ x: number; y: number }> = [];
  for (const xy of children(pts, "xy")) {
    const x = num(xy, 1);
    const y = num(xy, 2);
    if (x !== undefined && y !== undefined) out.push({ x, y });
  }
  return out;
}

// ---- 좌표 변환 --------------------------------------------------------------

/** KiCad(Y 아래로 증가, 좌상단 원점) → 분석용(Y 위로 증가, 보드 좌하단 원점) */
type Frame = { minX: number; maxY: number };

function toAnalysis(p: { x: number; y: number }, frame: Frame): Pt {
  return { x: round6(p.x - frame.minX), y: round6(frame.maxY - p.y) };
}

function round6(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

// ---- 본체 -------------------------------------------------------------------

export function parseKicadPcb(text: string): Result<BoardAnalysis> {
  const parsed = parseSExpr(text);
  if (!parsed.ok) return parsed;
  const root = parsed.value;
  if (!isList(root) || head(root) !== "kicad_pcb") {
    return { ok: false, errors: ["최상위 노드가 (kicad_pcb ...)가 아니다."] };
  }

  const kicad_version = value(child(root, "version")) ?? "unknown";

  // --- 외곽선: Edge.Cuts의 gr_line / gr_rect / gr_poly 로부터 ---
  const edgePoints: Array<{ x: number; y: number }> = [];
  const edgeSegments: Array<[{ x: number; y: number }, { x: number; y: number }]> = [];
  for (const node of root) {
    if (!isList(node)) continue;
    const kind = head(node);
    const layer = value(child(node, "layer"));
    if (layer !== "Edge.Cuts") continue;

    if (kind === "gr_line") {
      const s = child(node, "start");
      const e = child(node, "end");
      const sx = num(s, 1);
      const sy = num(s, 2);
      const ex = num(e, 1);
      const ey = num(e, 2);
      if (sx !== undefined && sy !== undefined && ex !== undefined && ey !== undefined) {
        edgeSegments.push([
          { x: sx, y: sy },
          { x: ex, y: ey },
        ]);
        edgePoints.push({ x: sx, y: sy }, { x: ex, y: ey });
      }
    } else if (kind === "gr_rect") {
      const s = child(node, "start");
      const e = child(node, "end");
      const sx = num(s, 1);
      const sy = num(s, 2);
      const ex = num(e, 1);
      const ey = num(e, 2);
      if (sx !== undefined && sy !== undefined && ex !== undefined && ey !== undefined) {
        edgePoints.push({ x: sx, y: sy }, { x: ex, y: ey });
        edgeSegments.push(
          [{ x: sx, y: sy }, { x: ex, y: sy }],
          [{ x: ex, y: sy }, { x: ex, y: ey }],
          [{ x: ex, y: ey }, { x: sx, y: ey }],
          [{ x: sx, y: ey }, { x: sx, y: sy }]
        );
      }
    } else if (kind === "gr_poly") {
      const pts = readPts(node);
      edgePoints.push(...pts);
      for (let k = 0; k < pts.length; k++) {
        edgeSegments.push([pts[k], pts[(k + 1) % pts.length]]);
      }
    }
  }

  if (edgePoints.length === 0) {
    return { ok: false, errors: ["Edge.Cuts 레이어에서 보드 외곽선을 찾지 못했다."] };
  }

  const minX = Math.min(...edgePoints.map((p) => p.x));
  const maxX = Math.max(...edgePoints.map((p) => p.x));
  const minY = Math.min(...edgePoints.map((p) => p.y));
  const maxY = Math.max(...edgePoints.map((p) => p.y));
  const frame: Frame = { minX, maxY };

  const outlinePolygon = orderOutline(edgeSegments).map((p) => toAnalysis(p, frame));

  // --- 넷 테이블 ---
  const nets: Array<{ name: string; code: number }> = [];
  const netNameByCode = new Map<number, string>();
  for (const node of children(root, "net")) {
    const code = num(node, 1);
    const name = value(node, 2) ?? "";
    if (code === undefined) continue;
    netNameByCode.set(code, name);
    nets.push({ name, code });
  }

  // --- (layers) 에 선언된 구리층 ---
  const copperLayers: string[] = [];
  const layersNode = child(root, "layers");
  if (layersNode) {
    for (const entry of layersNode) {
      if (!isList(entry)) continue;
      const name = typeof entry[1] === "string" ? entry[1] : undefined;
      const type = typeof entry[2] === "string" ? entry[2] : undefined;
      if (name && type === "signal") copperLayers.push(name);
    }
  }

  // --- 스택업 ---
  const setupNode = child(root, "setup");
  const stackupNode = setupNode ? child(setupNode, "stackup") : undefined;
  const stackup: AnalysisStackupLayer[] = [];
  let stackup_estimated = false;

  if (stackupNode) {
    for (const layerNode of children(stackupNode, "layer")) {
      const name = value(layerNode, 1);
      if (!name) continue;
      const type = value(child(layerNode, "type"));
      const thickness = num(child(layerNode, "thickness")) ?? 0;
      const isCopper = type === "copper";
      const isDielectric = type === "core" || type === "prepreg";
      if (!isCopper && !isDielectric) continue; // 마스크/실크는 제외
      stackup.push({
        layer: name,
        kind: isCopper ? "copper" : "dielectric",
        thickness_mm: thickness,
        er: num(child(layerNode, "epsilon_r")),
        loss_tangent: num(child(layerNode, "loss_tangent")),
      });
    }
  }

  if (stackup.length === 0) {
    // (stackup) 블록이 없는 외부 보드: 구리층 수로 프리셋을 골라 채운다.
    stackup_estimated = true;
    const presetId: StackupId = copperLayers.length >= 4 ? "4L" : "2L";
    const preset = getStackupPreset(presetId);
    for (const layer of preset.layers) {
      stackup.push({
        layer: layer.name,
        kind: "copper",
        thickness_mm: COPPER_THICKNESS_MM,
      });
      if (layer.dielectricBelow_mm > 0) {
        stackup.push({
          layer: `dielectric${stackup.filter((s) => s.kind === "dielectric").length + 1}`,
          kind: "dielectric",
          thickness_mm: layer.dielectricBelow_mm,
          er: layer.er,
        });
      }
    }
  }

  // --- 트레이스 (segment / arc) ---
  type RawSeg = { net: string; layer: string; seg: TraceSegment };
  const rawSegs: RawSeg[] = [];

  for (const node of children(root, "segment")) {
    const s = child(node, "start");
    const e = child(node, "end");
    const sx = num(s, 1);
    const sy = num(s, 2);
    const ex = num(e, 1);
    const ey = num(e, 2);
    const width = num(child(node, "width"));
    const layer = value(child(node, "layer"));
    const netCode = num(child(node, "net"));
    if (sx === undefined || sy === undefined || ex === undefined || ey === undefined) continue;
    if (width === undefined || !layer) continue;
    const start = toAnalysis({ x: sx, y: sy }, frame);
    const end = toAnalysis({ x: ex, y: ey }, frame);
    rawSegs.push({
      net: netNameByCode.get(netCode ?? 0) ?? "",
      layer,
      seg: { start, end, width_mm: width, len_mm: round6(distanceMm(start, end)) },
    });
  }

  for (const node of children(root, "arc")) {
    const s = child(node, "start");
    const m = child(node, "mid");
    const e = child(node, "end");
    const sx = num(s, 1);
    const sy = num(s, 2);
    const mx = num(m, 1);
    const my = num(m, 2);
    const ex = num(e, 1);
    const ey = num(e, 2);
    const width = num(child(node, "width"));
    const layer = value(child(node, "layer"));
    const netCode = num(child(node, "net"));
    if ([sx, sy, mx, my, ex, ey].some((v) => v === undefined) || width === undefined || !layer) {
      continue;
    }
    const start = toAnalysis({ x: sx as number, y: sy as number }, frame);
    const mid = toAnalysis({ x: mx as number, y: my as number }, frame);
    const end = toAnalysis({ x: ex as number, y: ey as number }, frame);
    const arc = arcFromThreePoints(start, mid, end);
    rawSegs.push({
      net: netNameByCode.get(netCode ?? 0) ?? "",
      layer,
      seg: {
        start,
        end,
        width_mm: width,
        len_mm: arc ? round6(Math.abs((arc.angle_deg * Math.PI) / 180) * arc.radius_mm) : round6(distanceMm(start, end)),
        arc: arc ?? undefined,
      },
    });
  }

  const traces = groupTraces(rawSegs);

  // --- 비아 ---
  const vias: AnalysisVia[] = [];
  for (const node of children(root, "via")) {
    const at = readAt(node);
    if (!at) continue;
    const size = num(child(node, "size")) ?? 0;
    const drill = num(child(node, "drill")) ?? 0;
    const netCode = num(child(node, "net"));
    const layersNodeVia = child(node, "layers");
    const from_layer = value(layersNodeVia, 1) ?? "F.Cu";
    const to_layer = value(layersNodeVia, 2) ?? "B.Cu";

    // (via micro ...) / (via blind_buried ...) - 타입 토큰은 head 다음 원자.
    const typeToken = typeof node[1] === "string" ? node[1] : "";
    let type: AnalysisVia["type"] = "through";
    if (typeToken === "micro") type = "micro";
    else if (typeToken === "blind_buried") {
      // 바깥층에 닿으면 blind, 내층끼리면 buried.
      const touchesOuter = [from_layer, to_layer].some((l) => l === "F.Cu" || l === "B.Cu");
      type = touchesOuter ? "blind" : "buried";
    }

    vias.push({
      net: netNameByCode.get(netCode ?? 0) ?? "",
      pos: toAnalysis({ x: at.x, y: at.y }, frame),
      type,
      drill_mm: drill,
      diameter_mm: size,
      annular_ring_mm: round6((size - drill) / 2),
      from_layer,
      to_layer,
      is_stitching: false, // 아래에서 트레이스 접촉 여부로 채운다
    });
  }

  // --- zone: 평면(pour)과 슬릿(keepout) ---
  const planes: AnalysisPlane[] = [];
  const keepoutSplits: Array<{ layer: string; split: PlaneSplit }> = [];
  let zones_unfilled = false;

  for (const node of children(root, "zone")) {
    const layer = value(child(node, "layer")) ?? value(child(node, "layers"), 1) ?? "";
    const netCode = num(child(node, "net"));
    const netName = value(child(node, "net_name")) ?? netNameByCode.get(netCode ?? 0) ?? "";
    const keepout = child(node, "keepout");

    const polygonNode = child(node, "polygon");
    const outlinePts = polygonNode ? readPts(polygonNode).map((p) => toAnalysis(p, frame)) : [];

    if (keepout) {
      // copperpour가 금지된 keepout만 "구리를 끊는" 슬릿으로 본다.
      const copperpour = value(child(keepout, "copperpour"));
      if (copperpour === "not_allowed" && outlinePts.length >= 3) {
        keepoutSplits.push({ layer, split: describeSplit(outlinePts) });
      }
      continue;
    }

    if (outlinePts.length < 3) continue;

    // filled_polygons가 있으면 그쪽이 실제 구리다. 없으면 외곽선 기준.
    const filledNodes = children(node, "filled_polygon");
    let area_mm2: number;
    const holes: Pt[][] = [];
    if (filledNodes.length > 0) {
      area_mm2 = 0;
      for (const fp of filledNodes) {
        const pts = readPts(fp).map((p) => toAnalysis(p, frame));
        area_mm2 += Math.abs(polygonArea(pts));
      }
    } else {
      zones_unfilled = true;
      area_mm2 = Math.abs(polygonArea(outlinePts));
    }

    planes.push({
      net: netName,
      layer,
      outline: outlinePts,
      holes,
      area_mm2: round6(area_mm2),
      splits: [],
    });
  }

  // keepout 슬릿을 같은 층 평면에 귀속시킨다.
  for (const { layer, split } of keepoutSplits) {
    for (const plane of planes) {
      if (plane.layer === layer) plane.splits.push(split);
    }
  }

  // --- 패드 (footprint 변환 적용) ---
  const pads: AnalysisPad[] = [];
  for (const fp of children(root, "footprint")) {
    const fpAt = readAt(fp);
    if (!fpAt) continue;
    const fpLayer = value(child(fp, "layer")) ?? "F.Cu";
    let ref = "";
    for (const prop of children(fp, "property")) {
      if (value(prop, 1) === "Reference") ref = value(prop, 2) ?? "";
    }

    for (const padNode of children(fp, "pad")) {
      const pin = value(padNode, 1) ?? "";
      const shape = typeof padNode[3] === "string" ? padNode[3] : "rect";
      const padAt = readAt(padNode);
      const sizeNode = child(padNode, "size");
      const w = num(sizeNode, 1) ?? 0;
      const h = num(sizeNode, 2) ?? 0;
      const netNode = child(padNode, "net");
      const netName = value(netNode, 2) ?? netNameByCode.get(num(netNode) ?? 0) ?? "";
      const padLayers = child(padNode, "layers");
      const firstLayer = value(padLayers, 1) ?? fpLayer;
      if (!padAt) continue;

      // KiCad 실측 확인: footprint (at x y rot)에서 양의 rot은 화면상 반시계.
      // KiCad 좌표(Y-down) 기준 변환식은 아래와 같다.
      const rad = (fpAt.rot * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const absX = fpAt.x + padAt.x * cos + padAt.y * sin;
      const absY = fpAt.y - padAt.x * sin + padAt.y * cos;

      pads.push({
        ref,
        pin,
        net: netName,
        layer: firstLayer === "*.Cu" ? "F.Cu" : firstLayer,
        pos: toAnalysis({ x: absX, y: absY }, frame),
        size_mm: { w, h },
        shape,
      });
    }
  }

  // --- 비아 부가 정보: 스티칭 여부 ---
  for (const via of vias) {
    const touchesTrace = traces.some(
      (t) =>
        t.net === via.net &&
        t.segments.some(
          (s) =>
            distanceMm(s.start, via.pos) <= via.diameter_mm / 2 ||
            distanceMm(s.end, via.pos) <= via.diameter_mm / 2
        )
    );
    via.is_stitching = !touchesTrace;
  }

  const analysis: BoardAnalysis = {
    source: { kicad_version, stackup_estimated, zones_unfilled },
    outline: {
      polygon: outlinePolygon,
      w_mm: round6(maxX - minX),
      h_mm: round6(maxY - minY),
    },
    stackup,
    nets,
    traces,
    vias,
    planes,
    pads,
    measurements: {
      clearances: [],
      trace_to_edge: [],
      return_path: [],
      layer_transitions: [],
      diff_pairs: [],
    },
  };

  return { ok: true, value: analysis };
}

// ---- 보조 ------------------------------------------------------------------

/** 외곽선 선분들을 끝점끼리 이어 하나의 폐다각형 순서로 정렬한다. */
function orderOutline(
  segments: Array<[{ x: number; y: number }, { x: number; y: number }]>
): Array<{ x: number; y: number }> {
  if (segments.length === 0) return [];
  const remaining = segments.slice();
  const first = remaining.shift() as [{ x: number; y: number }, { x: number; y: number }];
  const ordered = [first[0], first[1]];
  const near = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6;

  while (remaining.length > 0) {
    const tail = ordered[ordered.length - 1];
    const idx = remaining.findIndex((s) => near(s[0], tail) || near(s[1], tail));
    if (idx < 0) break; // 끊긴 외곽선: 있는 데까지만
    const [a, b] = remaining.splice(idx, 1)[0];
    ordered.push(near(a, tail) ? b : a);
  }
  // 시작점으로 되돌아온 마지막 점은 뺀다.
  if (ordered.length > 2 && near(ordered[0], ordered[ordered.length - 1])) ordered.pop();
  return ordered;
}

/** 같은 넷·같은 층의 세그먼트를 하나의 트레이스로 묶고 폭 프로파일을 만든다. */
function groupTraces(raw: Array<{ net: string; layer: string; seg: TraceSegment }>): AnalysisTrace[] {
  const byKey = new Map<string, AnalysisTrace>();
  for (const { net, layer, seg } of raw) {
    const key = `${net} ${layer}`;
    let trace = byKey.get(key);
    if (!trace) {
      trace = { net, layer, segments: [], total_len_mm: 0, width_profile: [] };
      byKey.set(key, trace);
    }
    trace.segments.push(seg);
  }

  for (const trace of byKey.values()) {
    trace.segments = chainSegments(trace.segments);
    let at = 0;
    let lastWidth: number | undefined;
    for (const seg of trace.segments) {
      if (seg.width_mm !== lastWidth) {
        trace.width_profile.push({ at_mm: round6(at), width_mm: seg.width_mm });
        lastWidth = seg.width_mm;
      }
      at += seg.len_mm;
    }
    trace.total_len_mm = round6(at);
  }

  return [...byKey.values()];
}

/** 세그먼트를 끝점이 이어지는 순서로 재배열한다 (폭 프로파일의 거리 기준을 위해). */
function chainSegments(segments: TraceSegment[]): TraceSegment[] {
  if (segments.length <= 1) return segments;
  const near = (a: Pt, b: Pt) => distanceMm(a, b) < 1e-6;
  const remaining = segments.slice();

  // 다른 세그먼트의 끝점에 닿지 않는 점을 시작점으로 삼는다.
  let startIdx = 0;
  for (let i = 0; i < remaining.length; i++) {
    const s = remaining[i];
    const startTouched = remaining.some((o, j) => j !== i && (near(o.start, s.start) || near(o.end, s.start)));
    if (!startTouched) {
      startIdx = i;
      break;
    }
  }

  const ordered: TraceSegment[] = [remaining.splice(startIdx, 1)[0]];
  while (remaining.length > 0) {
    const tail = ordered[ordered.length - 1].end;
    const idx = remaining.findIndex((s) => near(s.start, tail) || near(s.end, tail));
    if (idx < 0) break;
    const seg = remaining.splice(idx, 1)[0];
    ordered.push(near(seg.start, tail) ? seg : { ...seg, start: seg.end, end: seg.start });
  }
  return [...ordered, ...remaining];
}

/** 슬릿 다각형에서 짧은 쪽/긴 쪽 치수를 뽑는다 (회전된 사각형도 처리). */
function describeSplit(polygon: Pt[]): PlaneSplit {
  let width_mm = Infinity;
  let length_mm = 0;

  // 각 변을 축으로 삼아 투영 폭을 재고, 그 중 최소를 슬릿 폭으로 본다
  // (회전 캘리퍼스의 단순화 버전).
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) continue;
    const ux = dx / len;
    const uy = dy / len;
    let minProj = Infinity;
    let maxProj = -Infinity;
    let minPerp = Infinity;
    let maxPerp = -Infinity;
    for (const p of polygon) {
      const proj = (p.x - a.x) * ux + (p.y - a.y) * uy;
      const perp = -(p.x - a.x) * uy + (p.y - a.y) * ux;
      minProj = Math.min(minProj, proj);
      maxProj = Math.max(maxProj, proj);
      minPerp = Math.min(minPerp, perp);
      maxPerp = Math.max(maxPerp, perp);
    }
    const thisWidth = maxPerp - minPerp;
    if (thisWidth < width_mm) {
      width_mm = thisWidth;
      length_mm = maxProj - minProj;
    }
  }

  return {
    polygon,
    width_mm: round6(Number.isFinite(width_mm) ? width_mm : 0),
    length_mm: round6(length_mm),
  };
}

/** start-mid-end 세 점을 지나는 원호의 중심/반지름/사잇각. */
function arcFromThreePoints(
  s: Pt,
  m: Pt,
  e: Pt
): { center: Pt; radius_mm: number; angle_deg: number } | null {
  const d = 2 * (s.x * (m.y - e.y) + m.x * (e.y - s.y) + e.x * (s.y - m.y));
  if (Math.abs(d) < 1e-12) return null;
  const s2 = s.x * s.x + s.y * s.y;
  const m2 = m.x * m.x + m.y * m.y;
  const e2 = e.x * e.x + e.y * e.y;
  const cx = (s2 * (m.y - e.y) + m2 * (e.y - s.y) + e2 * (s.y - m.y)) / d;
  const cy = (s2 * (e.x - m.x) + m2 * (s.x - e.x) + e2 * (m.x - s.x)) / d;
  const center = { x: round6(cx), y: round6(cy) };
  const radius = Math.hypot(s.x - cx, s.y - cy);
  const a0 = Math.atan2(s.y - cy, s.x - cx);
  const a1 = Math.atan2(e.y - cy, e.x - cx);
  let sweep = ((a1 - a0) * 180) / Math.PI;
  while (sweep <= -180) sweep += 360;
  while (sweep > 180) sweep -= 360;
  return { center, radius_mm: round6(radius), angle_deg: round6(sweep) };
}
