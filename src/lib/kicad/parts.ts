/**
 * parts.ts
 * 부품 풋프린트를 KiCad 라이브러리 없이 수식으로 생성한다.
 * 1005/1608 수동소자(R/C/L/Bead), QFP(핀수 가변, 3종 프리셋), SMA 엣지 런치를
 * 지원한다. 반환값은 부품 원점(0,0) 기준 로컬 패드 좌표 목록이며, board.ts가
 * BoardSpecPart의 x,y,rot을 적용해 보드 좌표로 옮기고 .kicad_pcb로 직렬화한다.
 */

import type { PadSpec, PartFootprint, StackupId } from "./types";

// ---- 상수 테이블 (매직넘버 금지) -------------------------------------------

type PassiveSizeId = "1005" | "1608";
type PassiveKind = "R" | "C" | "L" | "FB";

const PASSIVE_SIZE_TABLE: Record<PassiveSizeId, { padW_mm: number; padH_mm: number; pitch_mm: number }> = {
  "1005": { padW_mm: 0.6, padH_mm: 0.55, pitch_mm: 0.9 },
  "1608": { padW_mm: 0.9, padH_mm: 0.8, pitch_mm: 1.5 },
};

const PASSIVE_KIND_LABEL: Record<PassiveKind, string> = {
  R: "저항",
  C: "커패시터",
  L: "인덕터",
  FB: "페라이트 비드",
};

type QfpPresetDef = {
  id: string;
  pin_count: number;
  pitch_mm: number;
  body_mm: number;
  pad_w_mm: number;
  pad_l_mm: number;
};

const QFP_PRESETS: QfpPresetDef[] = [
  { id: "QFP-32", pin_count: 32, pitch_mm: 0.8, body_mm: 7.0, pad_w_mm: 0.4, pad_l_mm: 1.5 },
  { id: "QFP-48", pin_count: 48, pitch_mm: 0.5, body_mm: 7.0, pad_w_mm: 0.3, pad_l_mm: 1.3 },
  { id: "QFP-64", pin_count: 64, pitch_mm: 0.5, body_mm: 10.0, pad_w_mm: 0.3, pad_l_mm: 1.3 },
];

/** SMA 엣지 런치 기본 치수(mm). 임피던스 튜닝은 signalPadWidth_mm로 노출. */
const SMA_DEFAULTS = {
  signalPadLen_mm: 2.0, // 보드 엣지 방향으로 뻗는 길이
  gndPadW_mm: 1.6,
  gndPadH_mm: 2.0,
  gndOffsetY_mm: 2.2, // 시그널 패드 중심에서 GND 패드 중심까지 Y거리
  viaDrill_mm: 0.3,
  viaDiameter_mm: 0.6,
  viaFenceCount: 2, // GND 패드 1개당 via 개수
  viaFenceSpacing_mm: 0.8,
} as const;

const SMA_LAUNCH_WIDTHS_MM: Record<string, number> = {
  "SMA-EDGE-W30": 0.3,
  "SMA-EDGE-W40": 0.4,
  "SMA-EDGE-W50": 0.5,
};

// ---- 수동소자 ---------------------------------------------------------------

function buildPassiveFootprint(sizeId: PassiveSizeId, kind: PassiveKind): PartFootprint {
  const size = PASSIVE_SIZE_TABLE[sizeId];
  const half = size.pitch_mm / 2;
  const pads: PadSpec[] = [
    {
      number: "1",
      kind: "smd",
      shape: "rect",
      x_mm: -half,
      y_mm: 0,
      w_mm: size.padW_mm,
      h_mm: size.padH_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: "1",
    },
    {
      number: "2",
      kind: "smd",
      shape: "rect",
      x_mm: half,
      y_mm: 0,
      w_mm: size.padW_mm,
      h_mm: size.padH_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: "2",
    },
  ];
  return {
    id: `${kind}-${sizeId}`,
    label: `${PASSIVE_KIND_LABEL[kind]} ${sizeId}`,
    category: "passive",
    refPrefix: kind,
    pads,
    bodySize_mm: { w: size.pitch_mm + size.padW_mm, h: size.padH_mm },
  };
}

// ---- QFP ---------------------------------------------------------------

/**
 * 핀수 가변 QFP를 하나의 함수로 생성한다. 핀 1번은 좌하단에서 시작해
 * 반시계 방향(CCW)으로 매겨진다: 하단(좌→우) → 우측(하→상) → 상단(우→좌)
 * → 좌측(상→하).
 */
export function buildQfpFootprint(def: QfpPresetDef): PartFootprint {
  const { pin_count, pitch_mm, body_mm, pad_w_mm, pad_l_mm } = def;
  if (pin_count % 4 !== 0) {
    throw new Error(`QFP pin_count는 4의 배수여야 한다: ${pin_count}`);
  }
  const perSide = pin_count / 4;
  const half_body = body_mm / 2;
  const standoff = half_body + pad_l_mm / 2;
  const span = (perSide - 1) * pitch_mm;
  const first = -span / 2;

  const pads: PadSpec[] = [];
  let pin = 1;

  // 하단: 좌→우
  for (let i = 0; i < perSide; i++) {
    pads.push({
      number: String(pin++),
      kind: "smd",
      shape: "rect",
      x_mm: first + i * pitch_mm,
      y_mm: -standoff,
      w_mm: pad_w_mm,
      h_mm: pad_l_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: String(pin - 1),
    });
  }
  // 우측: 하→상
  for (let i = 0; i < perSide; i++) {
    pads.push({
      number: String(pin++),
      kind: "smd",
      shape: "rect",
      x_mm: standoff,
      y_mm: first + i * pitch_mm,
      w_mm: pad_l_mm,
      h_mm: pad_w_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: String(pin - 1),
    });
  }
  // 상단: 우→좌
  for (let i = 0; i < perSide; i++) {
    pads.push({
      number: String(pin++),
      kind: "smd",
      shape: "rect",
      x_mm: -first - i * pitch_mm,
      y_mm: standoff,
      w_mm: pad_w_mm,
      h_mm: pad_l_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: String(pin - 1),
    });
  }
  // 좌측: 상→하
  for (let i = 0; i < perSide; i++) {
    pads.push({
      number: String(pin++),
      kind: "smd",
      shape: "rect",
      x_mm: -standoff,
      y_mm: -first - i * pitch_mm,
      w_mm: pad_l_mm,
      h_mm: pad_w_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: String(pin - 1),
    });
  }

  return {
    id: def.id,
    label: `${def.id} (${pin_count}핀, ${pitch_mm}mm pitch)`,
    category: "qfp",
    refPrefix: "U",
    pads,
    bodySize_mm: { w: body_mm + 2 * pad_l_mm, h: body_mm + 2 * pad_l_mm },
  };
}

// ---- SMA 엣지 런치 -----------------------------------------------------------

/**
 * 시그널 패드 1개 + 양옆 GND 패드 2개. 4층 보드에서는 GND 패드 아래
 * via fence(스루비아)를 함께 생성해 F.Cu GND를 내층/배면 GND로 연결한다.
 * signalPadWidth_mm이 임피던스 튜닝 파라미터다.
 */
export function buildSmaLaunchFootprint(
  id: string,
  signalPadWidth_mm: number,
  stackup: StackupId
): PartFootprint {
  const d = SMA_DEFAULTS;
  const pads: PadSpec[] = [
    {
      number: "1",
      kind: "smd",
      shape: "rect",
      x_mm: 0,
      y_mm: 0,
      w_mm: d.signalPadLen_mm,
      h_mm: signalPadWidth_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: "1",
    },
    {
      number: "2",
      kind: "smd",
      shape: "rect",
      x_mm: 0,
      y_mm: d.gndOffsetY_mm,
      w_mm: d.gndPadW_mm,
      h_mm: d.gndPadH_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: "2",
    },
    {
      number: "3",
      kind: "smd",
      shape: "rect",
      x_mm: 0,
      y_mm: -d.gndOffsetY_mm,
      w_mm: d.gndPadW_mm,
      h_mm: d.gndPadH_mm,
      layers: ["F.Cu", "F.Mask", "F.Paste"],
      pinRef: "3",
    },
  ];

  const footprint: PartFootprint = {
    id,
    label: `SMA 엣지 런치 (신호폭 ${signalPadWidth_mm}mm)`,
    category: "sma",
    refPrefix: "J",
    pads,
    bodySize_mm: { w: d.signalPadLen_mm, h: 2 * d.gndOffsetY_mm + d.gndPadH_mm },
  };

  if (stackup === "4L") {
    const viaXs: number[] = [];
    for (let i = 0; i < d.viaFenceCount; i++) {
      const offset = (i - (d.viaFenceCount - 1) / 2) * d.viaFenceSpacing_mm;
      viaXs.push(offset);
    }
    footprint.auxVias = viaXs.flatMap((vx) => [
      { x_mm: vx, y_mm: d.gndOffsetY_mm, type: "through" as const, drill_mm: d.viaDrill_mm, diameter_mm: d.viaDiameter_mm },
      { x_mm: vx, y_mm: -d.gndOffsetY_mm, type: "through" as const, drill_mm: d.viaDrill_mm, diameter_mm: d.viaDiameter_mm },
    ]);
  }

  return footprint;
}

// ---- 카탈로그 ---------------------------------------------------------------

const PASSIVE_KINDS: PassiveKind[] = ["R", "C", "L", "FB"];
const PASSIVE_SIZES: PassiveSizeId[] = ["1005", "1608"];

function buildCatalog(): PartFootprint[] {
  const passives = PASSIVE_SIZES.flatMap((size) =>
    PASSIVE_KINDS.map((kind) => buildPassiveFootprint(size, kind))
  );
  const qfps = QFP_PRESETS.map((def) => buildQfpFootprint(def));
  const smas = Object.entries(SMA_LAUNCH_WIDTHS_MM).map(([id, w]) =>
    buildSmaLaunchFootprint(id, w, "2L")
  );
  return [...passives, ...qfps, ...smas];
}

const PART_CATALOG: PartFootprint[] = buildCatalog();
const PART_CATALOG_BY_ID = new Map(PART_CATALOG.map((p) => [p.id, p]));

/**
 * BoardSpecPart.type → PartFootprint. SMA는 stackup에 따라 via fence 유무가
 * 달라지므로 카탈로그의 2L 버전을 베이스로 하되, 4층 요청 시 다시 생성한다.
 */
export function getFootprint(typeId: string, stackup: StackupId): PartFootprint | undefined {
  if (typeId.startsWith("SMA-EDGE-") && stackup === "4L") {
    const width = SMA_LAUNCH_WIDTHS_MM[typeId];
    if (width === undefined) return undefined;
    return buildSmaLaunchFootprint(typeId, width, "4L");
  }
  return PART_CATALOG_BY_ID.get(typeId);
}

/** pcb_list_parts 출력용 간결한 카탈로그 요약. */
export function listPartsCatalogSummary(): Array<{
  id: string;
  label: string;
  category: string;
  refPrefix: string;
  padCount: number;
}> {
  return PART_CATALOG.map((p) => ({
    id: p.id,
    label: p.label,
    category: p.category,
    refPrefix: p.refPrefix,
    padCount: p.pads.length,
  }));
}
