/**
 * types.ts
 * KiCad PCB 생성 MCP 전체가 공유하는 타입 정의.
 * BoardSpec은 Claude가 자연어 지시를 옮겨 담는 선언형 스펙이며, 보드 전체를
 * 한 번에 기술한다 (place_part → route 같은 상태 누적형 API는 쓰지 않는다).
 * diff_pair는 2단계(차동 라우팅) 자리표시자로, 이번 단계에서는 미사용.
 */

export type Layer = "F" | "B";
export type CopperLayerName = "F.Cu" | "In1.Cu" | "In2.Cu" | "B.Cu";
export type StackupId = "2L" | "4L";
export type ViaType = "through" | "micro" | "blind";

export type BoardSpecPart = {
  ref: string; // "U1", "C1", "J1"
  type: string; // pcb_list_parts 의 카탈로그 id
  x: number; // mm, 보드 좌하단 기준
  y: number; // mm, 보드 좌하단 기준
  rot?: number; // deg, 기본 0
  layer?: Layer;
};

export type BoardSpecNet = {
  name: string; // "GND", "VDD", "SIG_P"
  pins: string[]; // ["U1.12", "C3.1"]
  /** 2단계(차동 라우팅)에서 사용할 짝 넷 이름. 이번 단계에서는 타입만 존재. */
  diff_pair?: string;
};

export type BoardSpecRoute = {
  net: string;
  layer: string; // "F.Cu", "In1.Cu", "B.Cu"
  width_mm: number;
  points: Array<{ x: number; y: number }>;
};

export type BoardSpecVia = {
  net: string;
  x: number;
  y: number;
  type: ViaType;
  from_layer: string;
  to_layer: string;
  drill_mm: number;
  diameter_mm: number;
};

export type BoardSpecZoneSlit = {
  x: number;
  y: number;
  w_mm: number;
  h_mm: number;
  rot?: number;
};

export type BoardSpecZone = {
  net: string;
  layer: string;
  outline?: Array<{ x: number; y: number }>; // 생략 시 보드 전체
  slits?: BoardSpecZoneSlit[]; // GND slit
};

export type BoardSpec = {
  name: string;
  stackup: StackupId;
  size_mm: { w: number; h: number };
  parts: BoardSpecPart[];
  nets: BoardSpecNet[];
  routes: BoardSpecRoute[];
  vias: BoardSpecVia[];
  zones: BoardSpecZone[];
};

/** { ok:false, errors:[...] } 형태로 반환하기 위한 공통 결과 타입. 예외를 던지지 않는다. */
export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

// ---- 부품 카탈로그 (parts.ts) ----------------------------------------------

export type PadShape = "rect" | "circle" | "roundrect" | "oval";
export type PadKind = "smd" | "thru_hole";

export type PadSpec = {
  number: string; // "1", "2", ... KiCad 패드 번호(문자열)
  kind: PadKind;
  shape: PadShape;
  /** 부품 원점(0,0) 기준 로컬 좌표, mm. rot 적용 전. */
  x_mm: number;
  y_mm: number;
  w_mm: number;
  h_mm: number;
  drill_mm?: number; // thru_hole일 때만
  layers: string[]; // 예: ["F.Cu","F.Mask","F.Paste"] 또는 ["*.Cu","*.Mask"]
  /** BoardSpecPart.type 안에서 이 패드가 연결되어야 하는 넷 핀 이름 (예: "1", "2"). */
  pinRef: string;
};

export type PartAuxVia = {
  x_mm: number; // 부품 원점 기준 로컬 좌표
  y_mm: number;
  type: ViaType;
  drill_mm: number;
  diameter_mm: number;
};

export type PartFootprint = {
  id: string; // pcb_list_parts 의 id, BoardSpecPart.type 값
  label: string; // 사람이 읽는 이름
  category: "passive" | "qfp" | "sma";
  refPrefix: string; // "R", "C", "L", "FB", "U", "J"
  pads: PadSpec[];
  /** 부품 courtyard 근사 크기(겹침 검사용), mm. */
  bodySize_mm: { w: number; h: number };
  /** SMA 엣지 런치의 GND via fence처럼, 부품에 딸려 함께 찍히는 비아(4층 전용). */
  auxVias?: PartAuxVia[];
};

// ---- 스택업 (stackup.ts) ---------------------------------------------------

export type StackupLayerSpec = {
  name: CopperLayerName;
  role: "signal" | "ground";
  /** 이 구리층 "바로 아래"의 유전체 두께 [mm]. 맨 아래 구리층은 0. */
  dielectricBelow_mm: number;
  /** 그 유전체의 비유전율. 맨 아래 구리층에서는 의미 없음. */
  er: number;
};

export type StackupPreset = {
  id: StackupId;
  label: string;
  layers: StackupLayerSpec[];
  allowedVias: ViaType[];
  copperLayerOrder: CopperLayerName[]; // KiCad 레이어 스택 순서 (F → B)
};

// ---- pcb_coupon_2xthru ------------------------------------------------------

export type SmaLaunchKind = "edge-sma-2.92mm" | "edge-sma-sub-mini";

export type CouponSpec = {
  name: string;
  stackup: StackupId;
  fixture_len_mm: number;
  dut_len_mm: number;
  trace_width_mm: number;
  gnd_slit?: { w_mm: number; offset_from_launch_mm: number };
  launch: SmaLaunchKind;
};

export type CouponResult = {
  fixtureDutFixture: string; // FIX-DUT-FIX .kicad_pcb 텍스트
  twoXThru: string; // 2x-thru .kicad_pcb 텍스트
  summary: {
    fixture_len_mm: number;
    dut_len_mm: number;
    total_len_fixture_dut_fixture_mm: number;
    total_len_2xthru_mm: number;
  };
};

export type BuildBoardResult = {
  kicad_pcb: string;
  summary: {
    partCount: number;
    netCount: number;
    totalTraceLength_mm: number;
    viaCount: number;
  };
};

// ---- BoardAnalysis (parse.ts / measure.ts) ----------------------------------
// 좌표는 전부 mm, 보드 좌하단 기준(Y 위로 증가)이다. KiCad 파일의 Y-down
// 좌표는 parse.ts가 읽어들이면서 이 좌표계로 변환한다.

export type Pt = { x: number; y: number };

export type AnalysisStackupLayer = {
  layer: string; // "F.Cu", "dielectric1", "In1.Cu" ...
  kind: "copper" | "dielectric";
  thickness_mm: number;
  er?: number;
  loss_tangent?: number;
};

export type TraceSegment = {
  start: Pt;
  end: Pt;
  width_mm: number;
  len_mm: number;
  arc?: { center: Pt; radius_mm: number; angle_deg: number };
};

export type AnalysisTrace = {
  net: string;
  layer: string;
  segments: TraceSegment[];
  total_len_mm: number;
  /** 시작점부터의 누적 거리별 폭. 폭이 바뀌는 지점마다 한 항목. */
  width_profile: Array<{ at_mm: number; width_mm: number }>;
};

export type AnalysisVia = {
  net: string;
  pos: Pt;
  type: "through" | "micro" | "blind" | "buried";
  drill_mm: number;
  diameter_mm: number;
  annular_ring_mm: number;
  from_layer: string;
  to_layer: string;
  /** 신호가 실제로 쓰지 않는 구간 길이 [mm]. 계산 불가하면 undefined. */
  stub_len_mm?: number;
  /** 트레이스에 닿지 않고 평면만 꿰매는 비아인지. */
  is_stitching: boolean;
};

export type PlaneSplit = {
  polygon: Pt[];
  width_mm: number; // 짧은 쪽
  length_mm: number; // 긴 쪽
};

export type AnalysisPlane = {
  net: string;
  layer: string;
  outline: Pt[];
  holes: Pt[][];
  area_mm2: number;
  splits: PlaneSplit[];
};

export type AnalysisPad = {
  ref: string;
  pin: string;
  net: string;
  layer: string;
  pos: Pt;
  size_mm: { w: number; h: number };
  shape: string;
};

export type SlitCrossing = {
  at: Pt;
  slit_width_mm: number;
  /** 트레이스 진행 방향과 슬릿 장축이 이루는 각. 90°면 슬릿을 직각으로 가로지른다. */
  crossing_angle_deg: number;
};

export type BoardMeasurements = {
  clearances: Array<{ a: string; b: string; layer: string; min_mm: number; at: Pt }>;
  trace_to_edge: Array<{ net: string; layer: string; min_mm: number; at: Pt }>;
  return_path: Array<{
    net: string;
    layer: string;
    ref_layer: string;
    ref_gap_mm: number;
    ref_continuous: boolean;
    slit_crossings: SlitCrossing[];
    nearest_gnd_via_mm: number;
  }>;
  layer_transitions: Array<{
    net: string;
    via_pos: Pt;
    from_layer: string;
    to_layer: string;
    ref_change: boolean;
  }>;
  /** 2단계 예정. 지금은 항상 빈 배열. */
  diff_pairs: Array<{
    p_net: string;
    n_net: string;
    length_skew_mm: number;
    gap_mm: { min: number; max: number; nominal: number };
  }>;
};

export type BoardAnalysis = {
  source: {
    kicad_version: string;
    /** (stackup) 블록이 없어 stackup.ts 프리셋으로 채웠는가. */
    stackup_estimated: boolean;
    /** filled_polygons가 없어 zone 외곽선 기준으로 계산했는가. */
    zones_unfilled: boolean;
  };
  outline: { polygon: Pt[]; w_mm: number; h_mm: number };
  stackup: AnalysisStackupLayer[];
  nets: Array<{ name: string; code: number }>;
  traces: AnalysisTrace[];
  vias: AnalysisVia[];
  planes: AnalysisPlane[];
  pads: AnalysisPad[];
  measurements: BoardMeasurements;
};
