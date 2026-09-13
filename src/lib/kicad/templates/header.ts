/**
 * header.ts
 * .kicad_pcb 헤더(version/general/layers/setup)를 스택업에 맞춰 생성한다.
 * 버전 토큰과 레이어 ID는 추측한 값이 아니라 실제 KiCad 10 파일에서 확인한
 * 것이다: 포맷 헤더는 ../templates/empty.kicad_pcb, 내층 ID(In1.Cu=4,
 * In2.Cu=6, B.Cu=2)와 (stackup) 블록 문법은 KiCad 10.0 동봉 데모
 * (share/kicad/demos/royalblue54L_feather)에서 가져왔다.
 * 4층인데 (layers)에 내층을 안 적으면 KiCad가 해당 zone/via를 조용히 버린다.
 */

import type { StackupId } from "../types";
import {
  COPPER_LAYER_IDS,
  COPPER_THICKNESS_MM,
  DIELECTRIC_LOSS_TANGENT,
  DIELECTRIC_MATERIAL,
  SOLDER_MASK_THICKNESS_MM,
  getStackupPreset,
  totalBoardThicknessMm,
} from "../stackup";
import { formatMm } from "../units";

/** 구리층을 제외한 나머지 레이어 정의. 모든 보드에 공통. */
const NON_COPPER_LAYERS = `\t\t(9 "F.Adhes" user "F.Adhesive")
\t\t(11 "B.Adhes" user "B.Adhesive")
\t\t(13 "F.Paste" user)
\t\t(15 "B.Paste" user)
\t\t(5 "F.SilkS" user "F.Silkscreen")
\t\t(7 "B.SilkS" user "B.Silkscreen")
\t\t(1 "F.Mask" user)
\t\t(3 "B.Mask" user)
\t\t(17 "Dwgs.User" user "User.Drawings")
\t\t(19 "Cmts.User" user "User.Comments")
\t\t(21 "Eco1.User" user "User.Eco1")
\t\t(23 "Eco2.User" user "User.Eco2")
\t\t(25 "Edge.Cuts" user)
\t\t(27 "Margin" user)
\t\t(31 "F.CrtYd" user "F.Courtyard")
\t\t(29 "B.CrtYd" user "B.Courtyard")
\t\t(35 "F.Fab" user)
\t\t(33 "B.Fab" user)
\t\t(39 "User.1" user)
\t\t(41 "User.2" user)
\t\t(43 "User.3" user)
\t\t(45 "User.4" user)`;

const PCB_PLOT_PARAMS = `\t\t(pcbplotparams
\t\t\t(layerselection 0x00000000_00000000_55555555_5755f5ff)
\t\t\t(plot_on_all_layers_selection 0x00000000_00000000_00000000_00000000)
\t\t\t(disableapertmacros no)
\t\t\t(usegerberextensions no)
\t\t\t(usegerberattributes yes)
\t\t\t(usegerberadvancedattributes yes)
\t\t\t(creategerberjobfile yes)
\t\t\t(dashed_line_dash_ratio 12)
\t\t\t(dashed_line_gap_ratio 3)
\t\t\t(svgprecision 4)
\t\t\t(plotframeref no)
\t\t\t(mode 1)
\t\t\t(useauxorigin no)
\t\t\t(pdf_front_fp_property_popups yes)
\t\t\t(pdf_back_fp_property_popups yes)
\t\t\t(pdf_metadata yes)
\t\t\t(pdf_single_document no)
\t\t\t(dxfpolygonmode yes)
\t\t\t(dxfimperialunits yes)
\t\t\t(dxfusepcbnewfont yes)
\t\t\t(psnegative no)
\t\t\t(psa4output no)
\t\t\t(plot_black_and_white yes)
\t\t\t(sketchpadsonfab no)
\t\t\t(plotpadnumbers no)
\t\t\t(hidednponfab no)
\t\t\t(sketchdnponfab yes)
\t\t\t(crossoutdnponfab yes)
\t\t\t(subtractmaskfromsilk no)
\t\t\t(outputformat 1)
\t\t\t(mirror no)
\t\t\t(drillshape 1)
\t\t\t(scaleselection 1)
\t\t\t(outputdirectory "")
\t\t)`;

/** (layers) 블록. 구리층은 스택업에 있는 것만, KiCad 순서(F → 내층 → B)로 적는다. */
function layersBlock(stackup: StackupId): string {
  const preset = getStackupPreset(stackup);
  const inner = preset.copperLayerOrder.filter((n) => n !== "F.Cu" && n !== "B.Cu");
  const copperLines = [
    `\t\t(${COPPER_LAYER_IDS["F.Cu"]} "F.Cu" signal)`,
    ...inner.map((name) => `\t\t(${COPPER_LAYER_IDS[name]} "${name}" signal)`),
    `\t\t(${COPPER_LAYER_IDS["B.Cu"]} "B.Cu" signal)`,
  ];
  return `\t(layers\n${copperLines.join("\n")}\n${NON_COPPER_LAYERS}\n\t)`;
}

/** (setup (stackup ...)) 블록. 각 구리층과 그 아래 유전체의 두께·유전율을 적는다. */
function stackupBlock(stackup: StackupId): string {
  const preset = getStackupPreset(stackup);
  const lines: string[] = [
    `\t\t\t(layer "F.SilkS"\n\t\t\t\t(type "Top Silk Screen")\n\t\t\t)`,
    `\t\t\t(layer "F.Paste"\n\t\t\t\t(type "Top Solder Paste")\n\t\t\t)`,
    `\t\t\t(layer "F.Mask"\n\t\t\t\t(type "Top Solder Mask")\n\t\t\t\t(thickness ${formatMm(
      SOLDER_MASK_THICKNESS_MM
    )})\n\t\t\t)`,
  ];

  let dielectricIndex = 0;
  for (const layer of preset.layers) {
    lines.push(
      `\t\t\t(layer "${layer.name}"\n\t\t\t\t(type "copper")\n\t\t\t\t(thickness ${formatMm(
        COPPER_THICKNESS_MM
      )})\n\t\t\t)`
    );
    if (layer.dielectricBelow_mm > 0) {
      dielectricIndex += 1;
      lines.push(
        `\t\t\t(layer "dielectric ${dielectricIndex}"\n\t\t\t\t(type "core")\n\t\t\t\t(thickness ${formatMm(
          layer.dielectricBelow_mm
        )})\n\t\t\t\t(material "${DIELECTRIC_MATERIAL}")\n\t\t\t\t(epsilon_r ${layer.er})\n\t\t\t\t(loss_tangent ${DIELECTRIC_LOSS_TANGENT})\n\t\t\t)`
      );
    }
  }

  lines.push(
    `\t\t\t(layer "B.Mask"\n\t\t\t\t(type "Bottom Solder Mask")\n\t\t\t\t(thickness ${formatMm(
      SOLDER_MASK_THICKNESS_MM
    )})\n\t\t\t)`,
    `\t\t\t(layer "B.Paste"\n\t\t\t\t(type "Bottom Solder Paste")\n\t\t\t)`,
    `\t\t\t(layer "B.SilkS"\n\t\t\t\t(type "Bottom Silk Screen")\n\t\t\t)`,
    `\t\t\t(copper_finish "None")`,
    `\t\t\t(dielectric_constraints no)`
  );

  return `\t\t(stackup\n${lines.join("\n")}\n\t\t)`;
}

/** 스택업에 맞는 .kicad_pcb 헤더 전체 ((kicad_pcb ... (setup ...)) 까지). */
export function buildKicadPcbHeader(stackup: StackupId): string {
  const thickness = totalBoardThicknessMm(getStackupPreset(stackup));
  return `(kicad_pcb
\t(version 20260206)
\t(generator "pcbnew")
\t(generator_version "10.0")
\t(general
\t\t(thickness ${formatMm(thickness)})
\t\t(legacy_teardrops no)
\t)
\t(paper "A4")
${layersBlock(stackup)}
\t(setup
${stackupBlock(stackup)}
\t\t(pad_to_mask_clearance 0)
\t\t(allow_soldermask_bridges_in_footprints no)
\t\t(tenting
\t\t\t(front yes)
\t\t\t(back yes)
\t\t)
\t\t(covering
\t\t\t(front no)
\t\t\t(back no)
\t\t)
\t\t(plugging
\t\t\t(front no)
\t\t\t(back no)
\t\t)
\t\t(capping no)
\t\t(filling no)
${PCB_PLOT_PARAMS}
\t)`;
}

/** kicad_pcb 최상위 리스트를 닫기 직전에 붙는 공통 꼬리표. */
export const KICAD_PCB_FOOTER = `\t(embedded_fonts no)\n)\n`;
