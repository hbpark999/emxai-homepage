/**
 * coupon.ts
 * IEEE P370 2x-thru de-embedding용 SI 테스트 쿠폰 2종을 생성한다:
 * FIX-DUT-FIX(fixture+DUT+fixture)와 2x-thru(fixture 두 개를 맞붙인 것).
 * 두 보드의 fixture(런치·트레이스 폭·레이어·via 구조)가 완전히 같아야
 * de-embedding이 성립하므로, buildCouponBoardSpec() 하나만 두고 dut 길이만
 * 0으로 바꿔 양쪽에서 호출하는 방식으로 동일성을 강제한다.
 */

import type { BoardSpec, BoardSpecPart, CouponResult, CouponSpec, Result, SmaLaunchKind } from "./types";
import { buildBoard } from "./board";

const EDGE_MARGIN_MM = 3; // 커넥터 중심이 보드 엣지에서 안쪽으로 들어오는 거리
const BOARD_HEIGHT_MM = 12; // SMA GND 패드 폭(기본값 기준 약 6.4mm) 대비 여유

/** pcb_coupon_2xthru의 launch 파라미터 → parts.ts 카탈로그 id. */
const LAUNCH_TO_PART_ID: Record<SmaLaunchKind, string> = {
  "edge-sma-2.92mm": "SMA-EDGE-W40",
  "edge-sma-sub-mini": "SMA-EDGE-W30",
};

function buildCouponBoardSpec(spec: CouponSpec, dutLen_mm: number, boardName: string): BoardSpec {
  const launchTypeId = LAUNCH_TO_PART_ID[spec.launch];
  const centerY = BOARD_HEIGHT_MM / 2;
  const totalSignalLen_mm = 2 * spec.fixture_len_mm + dutLen_mm;
  const boardWidth_mm = 2 * EDGE_MARGIN_MM + totalSignalLen_mm;

  const leftX = EDGE_MARGIN_MM;
  const rightX = EDGE_MARGIN_MM + totalSignalLen_mm;

  // 시그널 패드(핀 "1")는 부품 로컬 원점(0,0)에 있으므로, rot과 무관하게
  // 절대 좌표는 항상 부품의 (x,y) 그 자체다. 트레이스 시작/끝점을 그대로
  // 커넥터 배치 좌표로 쓸 수 있는 이유가 이것이다.
  const j1: BoardSpecPart = { ref: "J1", type: launchTypeId, x: leftX, y: centerY, rot: 0, layer: "F" };
  const j2: BoardSpecPart = { ref: "J2", type: launchTypeId, x: rightX, y: centerY, rot: 180, layer: "F" };

  const points =
    dutLen_mm > 0
      ? [
          { x: leftX, y: centerY },
          { x: leftX + spec.fixture_len_mm, y: centerY },
          { x: leftX + spec.fixture_len_mm + dutLen_mm, y: centerY },
          { x: rightX, y: centerY },
        ]
      : [
          { x: leftX, y: centerY },
          { x: rightX, y: centerY },
        ];

  const gndLayer = spec.stackup === "4L" ? "In1.Cu" : "B.Cu";
  const slits = spec.gnd_slit
    ? [
        {
          // 트레이스와 수직으로 GND 평면을 가로질러 끊는 슬릿. w_mm은
          // 트레이스 방향(X)의 좁은 틈 폭, 높이는 보드 전체를 가로지르게
          // 잡아 회전 없이도 완전히 끊어지게 한다.
          x: leftX + spec.gnd_slit.offset_from_launch_mm,
          y: centerY,
          w_mm: spec.gnd_slit.w_mm,
          h_mm: BOARD_HEIGHT_MM,
        },
      ]
    : undefined;

  return {
    name: boardName,
    stackup: spec.stackup,
    size_mm: { w: boardWidth_mm, h: BOARD_HEIGHT_MM },
    parts: [j1, j2],
    nets: [
      { name: "SIG", pins: ["J1.1", "J2.1"] },
      { name: "GND", pins: ["J1.2", "J1.3", "J2.2", "J2.3"] },
    ],
    routes: [{ net: "SIG", layer: "F.Cu", width_mm: spec.trace_width_mm, points }],
    vias: [],
    zones: [{ net: "GND", layer: gndLayer, slits }],
  };
}

export function buildCoupon2xThru(spec: CouponSpec): Result<CouponResult> {
  const fixtureDutFixtureSpec = buildCouponBoardSpec(spec, spec.dut_len_mm, `${spec.name}-FIX-DUT-FIX`);
  const twoXThruSpec = buildCouponBoardSpec(spec, 0, `${spec.name}-2xTHRU`);

  const r1 = buildBoard(fixtureDutFixtureSpec);
  if (!r1.ok) {
    return { ok: false, errors: r1.errors.map((e) => `[FIX-DUT-FIX] ${e}`) };
  }
  const r2 = buildBoard(twoXThruSpec);
  if (!r2.ok) {
    return { ok: false, errors: r2.errors.map((e) => `[2x-thru] ${e}`) };
  }

  return {
    ok: true,
    value: {
      fixtureDutFixture: r1.value.kicad_pcb,
      twoXThru: r2.value.kicad_pcb,
      summary: {
        fixture_len_mm: spec.fixture_len_mm,
        dut_len_mm: spec.dut_len_mm,
        total_len_fixture_dut_fixture_mm: 2 * spec.fixture_len_mm + spec.dut_len_mm,
        total_len_2xthru_mm: 2 * spec.fixture_len_mm,
      },
    },
  };
}
