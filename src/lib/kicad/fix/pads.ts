/**
 * fix/pads.ts
 * .kicad_pcb 원본 텍스트에서 패드의 절대 위치·크기·회전을 KiCad 좌표(Y-down)
 * 그대로 뽑아낸다. 수정본을 쓸 때는 원본 좌표계를 그대로 써야 하므로,
 * Y-up으로 바꾸는 parse.ts의 BoardAnalysis를 쓰지 않고 여기서 따로 읽는다.
 *
 * geometry JSON(패드 절대 좌표가 이미 풀려 있는 형식)도 같은 형태로 읽어,
 * .kicad_pcb만으로 좌표가 맞는지 교차 검증할 수 있게 한다.
 */

import { parseSExpr, type SNode } from "../parse";

export type PadGeom = {
  ref: string;
  pin: string;
  net: string;
  /** 패드가 올라간 층. 관통 패드는 "*.Cu" */
  layers: string[];
  /** KiCad 좌표(Y-down), mm */
  pos: { x: number; y: number };
  /** 패드 자체 크기(회전 전), mm */
  size: { w: number; h: number };
  /** 보드 기준 절대 회전각(도) */
  rot_deg: number;
  shape: string;
  source: "kicad_pcb" | "geometry_json";
};

// ---- S-expression 도우미 (parse.ts와 동일한 규칙) ---------------------------

function nodes(list: SNode, name: string): SNode[][] {
  if (!Array.isArray(list)) return [];
  return list.filter((n): n is SNode[] => Array.isArray(n) && n[0] === name);
}
function first(list: SNode, name: string): SNode[] | undefined {
  return nodes(list, name)[0];
}
function atom(list: SNode | undefined, index = 1): string | undefined {
  if (!Array.isArray(list)) return undefined;
  const v = list[index];
  return typeof v === "string" ? v : undefined;
}
function numAt(list: SNode | undefined, index = 1): number | undefined {
  const v = atom(list, index);
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function readAt(node: SNode[]): { x: number; y: number; rot: number } | undefined {
  const at = first(node, "at");
  if (!at) return undefined;
  const x = numAt(at, 1);
  const y = numAt(at, 2);
  if (x === undefined || y === undefined) return undefined;
  return { x, y, rot: numAt(at, 3) ?? 0 };
}

/**
 * .kicad_pcb에서 패드를 읽는다.
 *
 * footprint 회전 rot은 KiCad 좌표계에서 화면상 반시계가 양이며, 패드의 절대
 * 위치는 parse.ts와 같은 식을 쓴다:
 *   absX = fpX + padX*cos(rot) + padY*sin(rot)
 *   absY = fpY - padX*sin(rot) + padY*cos(rot)
 *
 * 패드의 (at x y angle)에 적힌 angle은 KiCad가 footprint 회전을 이미 반영해
 * 절대각으로 저장한다. 다만 파일에 따라 다를 수 있어, 절대각을 그대로 쓰되
 * geometry JSON과 교차 검증할 수 있도록 fp_rot_deg도 함께 남긴다.
 */
export function readPadsFromKicadPcb(text: string): { ok: true; pads: PadGeom[] } | { ok: false; error: string } {
  const parsed = parseSExpr(text);
  if (!parsed.ok) return { ok: false, error: parsed.errors.join(" / ") };
  const root = parsed.value;
  if (!Array.isArray(root)) return { ok: false, error: ".kicad_pcb 최상위 구조를 읽지 못했다." };

  const pads: PadGeom[] = [];
  for (const fp of nodes(root, "footprint")) {
    const fpAt = readAt(fp);
    if (!fpAt) continue;
    const fpLayer = atom(first(fp, "layer")) ?? "F.Cu";

    let ref = "";
    for (const prop of nodes(fp, "property")) {
      if (atom(prop, 1) === "Reference") ref = atom(prop, 2) ?? "";
    }

    for (const pad of nodes(fp, "pad")) {
      const padAt = readAt(pad);
      const sizeNode = first(pad, "size");
      const w = numAt(sizeNode, 1);
      const h = numAt(sizeNode, 2);
      if (!padAt || w === undefined || h === undefined) continue;

      const rad = (fpAt.rot * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const layersNode = first(pad, "layers");
      const layers = Array.isArray(layersNode)
        ? layersNode.slice(1).filter((v): v is string => typeof v === "string")
        : [fpLayer];

      const netNode = first(pad, "net");
      pads.push({
        ref,
        pin: atom(pad, 1) ?? "",
        net: atom(netNode, 2) ?? "",
        layers: layers.length ? layers : [fpLayer],
        pos: {
          x: fpAt.x + padAt.x * cos + padAt.y * sin,
          y: fpAt.y - padAt.x * sin + padAt.y * cos,
        },
        size: { w, h },
        rot_deg: padAt.rot,
        shape: typeof pad[3] === "string" ? pad[3] : "rect",
        source: "kicad_pcb",
      });
    }
  }

  if (!pads.length) return { ok: false, error: ".kicad_pcb에서 패드를 찾지 못했다." };
  return { ok: true, pads };
}

type GeometryJson = {
  components?: Array<{
    ref?: string;
    pads?: Array<{
      number?: string;
      net?: string | null;
      position?: [number, number];
      size?: [number, number];
      rotation_deg?: number;
      layers?: string;
      shape?: string;
    }>;
  }>;
};

/** geometry JSON에서 패드를 읽는다. 좌표가 이미 절대값이라 회전 계산이 없다. */
export function readPadsFromGeometryJson(
  input: unknown
): { ok: true; pads: PadGeom[] } | { ok: false; error: string } {
  const g = input as GeometryJson;
  if (!g || !Array.isArray(g.components)) {
    return { ok: false, error: "geometry JSON에 components 배열이 없다." };
  }
  const pads: PadGeom[] = [];
  for (const comp of g.components) {
    for (const pad of comp.pads ?? []) {
      if (!pad.position || !pad.size) continue;
      pads.push({
        ref: comp.ref ?? "",
        pin: String(pad.number ?? ""),
        net: pad.net ?? "",
        layers: [pad.layers ?? "F.Cu"],
        pos: { x: pad.position[0], y: pad.position[1] },
        size: { w: pad.size[0], h: pad.size[1] },
        rot_deg: pad.rotation_deg ?? 0,
        shape: pad.shape ?? "rect",
        source: "geometry_json",
      });
    }
  }
  if (!pads.length) return { ok: false, error: "geometry JSON에서 패드를 찾지 못했다." };
  return { ok: true, pads };
}

export function findPad(pads: PadGeom[], ref: string, pin: string): PadGeom | undefined {
  return pads.find((p) => p.ref === ref && p.pin === pin);
}

/**
 * 두 출처의 패드 좌표를 비교한다. .kicad_pcb만으로 좌표가 맞는지 확인할 때 쓴다.
 * 허용 오차를 넘는 항목만 돌려준다.
 */
export function crossCheckPads(a: PadGeom[], b: PadGeom[], tol_mm = 0.01) {
  const diffs: Array<{ ref: string; pin: string; d_mm: number; a: PadGeom["pos"]; b: PadGeom["pos"] }> = [];
  let compared = 0;
  for (const pa of a) {
    const pb = findPad(b, pa.ref, pa.pin);
    if (!pb) continue;
    compared += 1;
    const d = Math.hypot(pa.pos.x - pb.pos.x, pa.pos.y - pb.pos.y);
    if (d > tol_mm) diffs.push({ ref: pa.ref, pin: pa.pin, d_mm: Number(d.toFixed(4)), a: pa.pos, b: pb.pos });
  }
  return { compared, mismatches: diffs, match: diffs.length === 0 };
}

// ---- trace 방향 ------------------------------------------------------------

export type TraceSeg = { net: string; layer: string; width: number; a: { x: number; y: number }; b: { x: number; y: number } };

/** .kicad_pcb의 segment를 KiCad 좌표 그대로 읽는다. void 방향을 정하는 데 쓴다. */
export function readSegmentsFromKicadPcb(text: string): TraceSeg[] {
  const parsed = parseSExpr(text);
  if (!parsed.ok || !Array.isArray(parsed.value)) return [];
  const root = parsed.value;

  const netNameByCode = new Map<number, string>();
  for (const n of nodes(root, "net")) {
    const code = numAt(n, 1);
    const name = atom(n, 2);
    if (code !== undefined) netNameByCode.set(code, name ?? "");
  }

  const out: TraceSeg[] = [];
  for (const seg of nodes(root, "segment")) {
    const start = first(seg, "start");
    const end = first(seg, "end");
    const ax = numAt(start, 1);
    const ay = numAt(start, 2);
    const bx = numAt(end, 1);
    const by = numAt(end, 2);
    if (ax === undefined || ay === undefined || bx === undefined || by === undefined) continue;
    out.push({
      net: netNameByCode.get(numAt(first(seg, "net")) ?? -1) ?? "",
      layer: atom(first(seg, "layer")) ?? "",
      width: numAt(first(seg, "width")) ?? 0,
      a: { x: ax, y: ay },
      b: { x: bx, y: by },
    });
  }
  return out;
}

export type TraceAxis = { axis: "x" | "y"; source: "trace" | "pad_fallback"; note: string };

/**
 * 패드에 붙은 trace의 진행 방향을 축(x/y)으로 돌려준다.
 * 같은 net의 segment 중 끝점이 패드 중심에 가장 가까운 것을 쓰고, 그 방향을
 * 가까운 축으로 스냅한다. trace를 찾지 못하면 패드 자체 방향으로 물러선다.
 */
export function traceAxisAtPad(pad: PadGeom, segments: TraceSeg[], searchRadiusMm = 1.0): TraceAxis {
  const candidates = segments
    .filter((s) => !pad.net || s.net === pad.net)
    .map((s) => {
      const da = Math.hypot(s.a.x - pad.pos.x, s.a.y - pad.pos.y);
      const db = Math.hypot(s.b.x - pad.pos.x, s.b.y - pad.pos.y);
      const near = Math.min(da, db);
      return { seg: s, near };
    })
    .filter((c) => c.near <= searchRadiusMm)
    .sort((a, b) => a.near - b.near);

  if (!candidates.length) {
    const rot = ((pad.rot_deg % 360) + 360) % 360;
    const swapped = Math.abs(rot - 90) < 0.01 || Math.abs(rot - 270) < 0.01;
    const longAlongY = swapped ? pad.size.w > pad.size.h : pad.size.h > pad.size.w;
    return {
      axis: longAlongY ? "y" : "x",
      source: "pad_fallback",
      note: `${pad.ref}.${pad.pin}에 붙은 같은 net(${pad.net || "?"}) trace를 ${searchRadiusMm} mm 안에서 찾지 못해 패드 방향을 그대로 썼다.`,
    };
  }

  const s = candidates[0].seg;
  const dx = Math.abs(s.b.x - s.a.x);
  const dy = Math.abs(s.b.y - s.a.y);
  return {
    axis: dy >= dx ? "y" : "x",
    source: "trace",
    note: `${pad.ref}.${pad.pin}: net ${s.net}의 trace 방향(${dy >= dx ? "세로" : "가로"})을 void 긴 변으로 삼았다.`,
  };
}
