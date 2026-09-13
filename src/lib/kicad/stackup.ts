/**
 * stackup.ts
 * 2층(S-G), 4층(S-G-G-S) 스택업 프리셋과 레이어 이름/번호 매핑.
 * 각 구리층의 dielectricBelow_mm은 "그 층 바로 아래 유전체" 두께이므로,
 * 맨 아래 층(B.Cu)은 0이다. 보드 총 두께와 .kicad_pcb의 (stackup) 블록이
 * 모두 이 표 하나에서 계산되므로, 두께/유전율은 여기서만 고친다.
 */

import type { CopperLayerName, StackupId, StackupPreset, ViaType } from "./types";

/** KiCad 9/10의 구리층 ID 체계: F.Cu=0, B.Cu=2, In1.Cu=4, In2.Cu=6, ... */
export const COPPER_LAYER_IDS: Record<CopperLayerName, number> = {
  "F.Cu": 0,
  "B.Cu": 2,
  "In1.Cu": 4,
  "In2.Cu": 6,
};

/** (stackup) 블록에 쓰는 물리 상수. */
export const COPPER_THICKNESS_MM = 0.035; // 1oz
export const SOLDER_MASK_THICKNESS_MM = 0.01;
export const DIELECTRIC_MATERIAL = "FR4";
export const DIELECTRIC_LOSS_TANGENT = 0.02;

const STACKUP_2L: StackupPreset = {
  id: "2L",
  label: "2층 (S-G)",
  layers: [
    { name: "F.Cu", role: "signal", dielectricBelow_mm: 1.6, er: 4.3 },
    { name: "B.Cu", role: "ground", dielectricBelow_mm: 0, er: 4.3 },
  ],
  allowedVias: ["through"],
  copperLayerOrder: ["F.Cu", "B.Cu"],
};

const STACKUP_4L: StackupPreset = {
  id: "4L",
  label: "4층 (S-G-G-S)",
  layers: [
    { name: "F.Cu", role: "signal", dielectricBelow_mm: 0.1, er: 3.8 },
    { name: "In1.Cu", role: "ground", dielectricBelow_mm: 0.7, er: 3.8 },
    { name: "In2.Cu", role: "ground", dielectricBelow_mm: 0.1, er: 3.8 },
    { name: "B.Cu", role: "signal", dielectricBelow_mm: 0, er: 3.8 },
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

/** 해당 스택업에 존재하는 구리층인지. routes/zones의 layer 검증에 쓴다. */
export function isCopperLayerInStackup(stackup: StackupId, layer: string): boolean {
  return getStackupPreset(stackup).copperLayerOrder.includes(layer as CopperLayerName);
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

/** 보드 총 두께 [mm]. 유전체 합 + 구리층 두께 합. (general (thickness ...))에 쓴다. */
export function totalBoardThicknessMm(preset: StackupPreset): number {
  const dielectric = preset.layers.reduce((sum, l) => sum + l.dielectricBelow_mm, 0);
  const copper = preset.layers.length * COPPER_THICKNESS_MM;
  return Math.round((dielectric + copper) * 1e6) / 1e6;
}
