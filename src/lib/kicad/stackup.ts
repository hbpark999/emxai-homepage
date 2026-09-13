/**
 * stackup.ts
 * 2층(S-G), 4층(S-G-G-S) 스택업 프리셋과 레이어 이름 매핑.
 * 두께·유전율 기본값을 여기 상수 테이블 하나로 모아, board.ts/parts.ts에
 * 매직넘버가 흩어지지 않도록 한다. spec에서 값을 덮어쓸 때도 이 프리셋을
 * 베이스로 병합한다.
 */

import type { StackupId, StackupPreset, ViaType } from "./types";

const STACKUP_2L: StackupPreset = {
  id: "2L",
  label: "2층 (S-G)",
  layers: [
    { name: "F.Cu", role: "signal", thickness_mm: 1.6, er: 4.3 },
    { name: "B.Cu", role: "ground", thickness_mm: 1.6, er: 4.3 },
  ],
  allowedVias: ["through"],
  copperLayerOrder: ["F.Cu", "B.Cu"],
};

const STACKUP_4L: StackupPreset = {
  id: "4L",
  label: "4층 (S-G-G-S)",
  layers: [
    { name: "F.Cu", role: "signal", thickness_mm: 0.1, er: 3.8 },
    { name: "In1.Cu", role: "ground", thickness_mm: 0.7, er: 3.8 },
    { name: "In2.Cu", role: "ground", thickness_mm: 0.1, er: 3.8 },
    { name: "B.Cu", role: "signal", thickness_mm: 0.1, er: 3.8 },
  ],
  allowedVias: ["through", "micro", "blind"],
  copperLayerOrder: ["F.Cu", "In1.Cu", "In2.Cu", "B.Cu"],
};

const STACKUP_PRESETS: Record<StackupId, StackupPreset> = {
  "2L": STACKUP_2L,
  "4L": STACKUP_4L,
};

export function getStackupPreset(id: StackupId): StackupPreset {
  return STACKUP_PRESETS[id];
}

export function listStackupPresets(): StackupPreset[] {
  return [STACKUP_2L, STACKUP_4L];
}

/** via.type이 해당 스택업에서 허용되는지 확인. */
export function isViaAllowed(stackup: StackupId, viaType: ViaType): boolean {
  return getStackupPreset(stackup).allowedVias.includes(viaType);
}

/** via.type에 대응하는 기본 from/to 레이어 (spec에서 생략 시 사용). */
export function defaultViaLayers(
  stackup: StackupId,
  viaType: ViaType
): { from_layer: string; to_layer: string } {
  if (stackup === "2L") {
    return { from_layer: "F.Cu", to_layer: "B.Cu" };
  }
  switch (viaType) {
    case "through":
      return { from_layer: "F.Cu", to_layer: "B.Cu" };
    case "micro":
      return { from_layer: "F.Cu", to_layer: "In1.Cu" };
    case "blind":
      return { from_layer: "F.Cu", to_layer: "In2.Cu" };
  }
}

/** 보드 전체 두께(mm). 카퍼 레이어 사이 유전체 두께의 합으로 근사. */
export function totalBoardThicknessMm(preset: StackupPreset): number {
  return preset.layers.reduce((sum, layer) => sum + layer.thickness_mm, 0);
}
