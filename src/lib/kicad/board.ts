/**
 * board.ts
 * BoardSpec을 실제 .kicad_pcb(S-expression) 문자열로 직렬화한다.
 * 넷 테이블 조립 → 외곽선 → 부품(풋프린트+패드) → 트레이스(segment) → 비아
 * → 카퍼존/GND slit 순으로 블록을 이어붙인다. buildBoard()는 직렬화 전에
 * validate.ts를 돌려, 치명적 오류가 있으면 파일을 만들지 않고 오류만 낸다.
 */

import type { BoardSpec, BuildBoardResult, Result, ViaType } from "./types";
import {
  boardYToKicadY,
  distanceMm,
  flipLocalY,
  formatMm,
  makeUuid,
  rotatePoint,
  xy,
} from "./units";
import { getFootprint } from "./parts";
import { validateSpec } from "./validate";
import { KICAD_PCB_FOOTER, buildKicadPcbHeader } from "./templates/header";

function escapeKicadString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function quoteLayers(layers: string[]): string {
  return layers.map((l) => `"${l}"`).join(" ");
}

/**
 * 뒷면(B) 실장 부품의 패드 레이어를 뒤집는다. parts.ts는 앞면 기준으로만
 * 패드를 만들기 때문에, 이걸 거치지 않으면 footprint는 B.Cu에 있는데 패드는
 * F.Cu에 남아 실제로는 연결되지 않는 보드가 나온다.
 */
function padLayersForSide(layers: string[], side: "F" | "B"): string[] {
  if (side === "F") return layers;
  return layers.map((layer) => {
    if (layer.startsWith("F.")) return `B.${layer.slice(2)}`;
    if (layer.startsWith("B.")) return `F.${layer.slice(2)}`;
    return layer;
  });
}

function viaTypeToken(type: ViaType): string {
  if (type === "micro") return "micro ";
  if (type === "blind") return "blind_buried ";
  return "";
}

// ---- 넷 테이블 ---------------------------------------------------------------

type NetTable = { numberByName: Map<string, number>; namesByNumber: string[] };

function buildNetTable(spec: BoardSpec): NetTable {
  const namesByNumber = ["", ...spec.nets.map((n) => n.name)];
  const numberByName = new Map<string, number>();
  namesByNumber.forEach((name, idx) => {
    if (!numberByName.has(name)) numberByName.set(name, idx);
  });
  return { numberByName, namesByNumber };
}

function netDeclSExpr(namesByNumber: string[]): string {
  return namesByNumber.map((name, i) => `\t(net ${i} "${escapeKicadString(name)}")`).join("\n");
}

/** "REF.PIN" → 넷 이름. spec.nets[].pins 를 뒤집어 만든다. */
function buildPinNetMap(spec: BoardSpec): Map<string, string> {
  const map = new Map<string, string>();
  for (const net of spec.nets) {
    for (const pin of net.pins) {
      map.set(pin, net.name);
    }
  }
  return map;
}

// ---- 직렬화 본체 --------------------------------------------------------------

export function serializeBoard(spec: BoardSpec): string {
  const boardHeight = spec.size_mm.h;
  const boardWidth = spec.size_mm.w;
  const netTable = buildNetTable(spec);
  const pinNetMap = buildPinNetMap(spec);
  const blocks: string[] = [];

  blocks.push(netDeclSExpr(netTable.namesByNumber));

  // 외곽선 (Edge.Cuts) - 보드 좌하단(0,0) 기준 사각형
  const corners = [
    { x: 0, y: 0 },
    { x: boardWidth, y: 0 },
    { x: boardWidth, y: boardHeight },
    { x: 0, y: boardHeight },
  ];
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    blocks.push(
      `\t(gr_line
\t\t(start ${xy(a.x, boardYToKicadY(a.y, boardHeight))})
\t\t(end ${xy(b.x, boardYToKicadY(b.y, boardHeight))})
\t\t(stroke
\t\t\t(width 0.1)
\t\t\t(type default)
\t\t)
\t\t(layer "Edge.Cuts")
\t\t(uuid "${makeUuid()}")
\t)`
    );
  }
  // gr_text는 앵커를 기준으로 가운데 정렬되므로, 보드 왼쪽 끝에 두면 긴
  // 이름이 외곽선을 넘어가 DRC의 silk_edge_clearance에 걸린다. 보드 가로
  // 중앙에 놓는다.
  blocks.push(
    `\t(gr_text "${escapeKicadString(spec.name)}"
\t\t(at ${xy(boardWidth / 2, 2)} 0)
\t\t(layer "F.SilkS")
\t\t(uuid "${makeUuid()}")
\t\t(effects
\t\t\t(font
\t\t\t\t(size 1 1)
\t\t\t)
\t\t)
\t)`
  );

  // 부품 (풋프린트 + 패드), SMA 4층 via fence
  const auxViaBlocks: string[] = [];
  for (const part of spec.parts) {
    const footprint = getFootprint(part.type);
    if (!footprint) {
      blocks.push(`\t; 알 수 없는 부품 타입 "${part.type}" (ref ${part.ref}) - 생성 생략`);
      continue;
    }
    const rot = part.rot ?? 0;
    const side = part.layer === "B" ? "B" : "F";
    const copperLayer = `${side}.Cu`;
    const silkLayer = `${side}.SilkS`;
    const fabLayer = `${side}.Fab`;
    const kicadX = part.x;
    const kicadY = boardYToKicadY(part.y, boardHeight);

    const padLines = footprint.pads.map((pad) => {
      const key = `${part.ref}.${pad.pinRef}`;
      const netName = pinNetMap.get(key);
      const netNum = netName !== undefined ? netTable.numberByName.get(netName) ?? 0 : 0;
      const netClause =
        netName !== undefined ? `\n\t\t\t(net ${netNum} "${escapeKicadString(netName)}")` : "";
      // pad.y_mm은 parts.ts가 "Y 위로 증가"로 authoring한 로컬 좌표이므로,
      // footprint의 (at ..rot)가 KiCad 좌표계에서 그대로 회전을 적용하기
      // 전에 반드시 Y부호를 뒤집어야 부품이 상하로 뒤집혀 보이지 않는다.
      const localY = flipLocalY(pad.y_mm);
      const padUuid = makeUuid();

      if (pad.kind === "thru_hole") {
        return `\t\t(pad "${pad.number}" thru_hole ${pad.shape}
\t\t\t(at ${xy(pad.x_mm, localY)})
\t\t\t(size ${formatMm(pad.w_mm)} ${formatMm(pad.h_mm)})
\t\t\t(drill ${formatMm(pad.drill_mm ?? Math.min(pad.w_mm, pad.h_mm) * 0.6)})
\t\t\t(layers ${quoteLayers(padLayersForSide(pad.layers, side))})
\t\t\t(remove_unused_layers no)${netClause}
\t\t\t(uuid "${padUuid}")
\t\t)`;
      }

      return `\t\t(pad "${pad.number}" smd ${pad.shape}
\t\t\t(at ${xy(pad.x_mm, localY)})
\t\t\t(size ${formatMm(pad.w_mm)} ${formatMm(pad.h_mm)})
\t\t\t(layers ${quoteLayers(padLayersForSide(pad.layers, side))})${netClause}
\t\t\t(thermal_bridge_angle 45)
\t\t\t(uuid "${padUuid}")
\t\t)`;
    });

    blocks.push(
      `\t(footprint ""
\t\t(layer "${copperLayer}")
\t\t(uuid "${makeUuid()}")
\t\t(at ${xy(kicadX, kicadY)}${rot ? ` ${formatMm(rot)}` : ""})
\t\t(property "Reference" "${escapeKicadString(part.ref)}"
\t\t\t(at 0 -1.2 0)
\t\t\t(layer "${silkLayer}")
\t\t\t(uuid "${makeUuid()}")
\t\t\t(effects
\t\t\t\t(font
\t\t\t\t\t(size 1 1)
\t\t\t\t)
\t\t\t)
\t\t)
\t\t(property "Value" "${escapeKicadString(footprint.label)}"
\t\t\t(at 0 1.2 0)
\t\t\t(layer "${fabLayer}")
\t\t\t(uuid "${makeUuid()}")
\t\t\t(effects
\t\t\t\t(font
\t\t\t\t\t(size 0.8 0.8)
\t\t\t\t)
\t\t\t)
\t\t)
\t\t(duplicate_pad_numbers_are_jumpers no)
${padLines.join("\n")}
\t\t(embedded_fonts no)
\t)`
    );

    if (footprint.auxVias) {
      // GND via fence는 인접한 GND 패드(핀 "2"/"3")와 같은 넷을 물려야
      // 물리적으로 의미가 있다.
      const gndNetName = pinNetMap.get(`${part.ref}.2`) ?? pinNetMap.get(`${part.ref}.3`);
      const netNum = gndNetName !== undefined ? netTable.numberByName.get(gndNetName) ?? 0 : 0;
      for (const via of footprint.auxVias) {
        // via는 footprint에 속하지 않는 독립된 최상위 요소라 KiCad가
        // footprint의 (at ..rot)을 대신 적용해주지 않는다. 그래서 부품
        // rot을 로컬(Y-up) 좌표에 먼저 수동으로 적용한 뒤 보드 좌표로
        // 옮기고, 마지막에 한 번만 KiCad Y로 뒤집는다.
        const rotated = rotatePoint({ x_mm: via.x_mm, y_mm: via.y_mm }, rot);
        const boardX = part.x + rotated.x_mm;
        const boardY = part.y + rotated.y_mm;
        const layerNames = via.type === "through" ? ["F.Cu", "B.Cu"] : ["F.Cu", "In1.Cu"];
        auxViaBlocks.push(
          `\t(via ${viaTypeToken(via.type)}(at ${xy(boardX, boardYToKicadY(boardY, boardHeight))})
\t\t(size ${formatMm(via.diameter_mm)})
\t\t(drill ${formatMm(via.drill_mm)})
\t\t(layers ${quoteLayers(layerNames)})
\t\t(net ${netNum})
\t\t(uuid "${makeUuid()}")
\t)`
        );
      }
    }
  }
  blocks.push(...auxViaBlocks);

  // 트레이스 (segment). points의 연속한 두 점마다 세그먼트 하나.
  for (const route of spec.routes) {
    const netNum = netTable.numberByName.get(route.net) ?? 0;
    for (let i = 0; i + 1 < route.points.length; i++) {
      const a = route.points[i];
      const b = route.points[i + 1];
      blocks.push(
        `\t(segment
\t\t(start ${xy(a.x, boardYToKicadY(a.y, boardHeight))})
\t\t(end ${xy(b.x, boardYToKicadY(b.y, boardHeight))})
\t\t(width ${formatMm(route.width_mm)})
\t\t(layer "${route.layer}")
\t\t(net ${netNum})
\t\t(uuid "${makeUuid()}")
\t)`
      );
    }
  }

  // 비아
  for (const via of spec.vias) {
    const netNum = netTable.numberByName.get(via.net) ?? 0;
    blocks.push(
      `\t(via ${viaTypeToken(via.type)}(at ${xy(via.x, boardYToKicadY(via.y, boardHeight))})
\t\t(size ${formatMm(via.diameter_mm)})
\t\t(drill ${formatMm(via.drill_mm)})
\t\t(layers "${via.from_layer}" "${via.to_layer}")
\t\t(net ${netNum})
\t\t(uuid "${makeUuid()}")
\t)`
    );
  }

  // 카퍼존 + GND slit
  for (const zone of spec.zones) {
    const netNum = netTable.numberByName.get(zone.net) ?? 0;
    const outline =
      zone.outline && zone.outline.length >= 3
        ? zone.outline
        : [
            { x: 0, y: 0 },
            { x: boardWidth, y: 0 },
            { x: boardWidth, y: boardHeight },
            { x: 0, y: boardHeight },
          ];
    const pts = outline.map((p) => `(xy ${xy(p.x, boardYToKicadY(p.y, boardHeight))})`).join(" ");
    blocks.push(
      `\t(zone
\t\t(net ${netNum})
\t\t(net_name "${escapeKicadString(zone.net)}")
\t\t(layer "${zone.layer}")
\t\t(uuid "${makeUuid()}")
\t\t(hatch edge 0.5)
\t\t(connect_pads
\t\t\t(clearance 0.3)
\t\t)
\t\t(min_thickness 0.2)
\t\t(fill yes
\t\t\t(thermal_gap 0.5)
\t\t\t(thermal_bridge_width 0.5)
\t\t\t(island_removal_mode 0)
\t\t)
\t\t(polygon
\t\t\t(pts ${pts})
\t\t)
\t)`
    );

    // GND slit: 카퍼존 외곽선에 구멍(도넛 폴리곤)을 내는 대신 별도의
    // keepout 사각형으로 처리한다. 외곽선에 구멍을 내려면 외곽+내곽을
    // 자기교차 없는 하나의 폴리곤으로 이어붙여야 하는데, 좌표 실수로
    // 폴리곤이 깨지면 zone 전체가 열리지 않거나 채우기가 실패할 수 있다.
    // keepout 사각형은 항상 4점짜리 단순 폴리곤이라 구조적으로 깨질 일이
    // 없고, 메인 zone과 독립적이라 KiCad에서 더 안정적으로 열린다.
    for (const slit of zone.slits ?? []) {
      const halfW = slit.w_mm / 2;
      const halfH = slit.h_mm / 2;
      const localCorners = [
        { x: -halfW, y: -halfH },
        { x: halfW, y: -halfH },
        { x: halfW, y: halfH },
        { x: -halfW, y: halfH },
      ];
      const rot = slit.rot ?? 0;
      const slitPts = localCorners
        .map((c) => {
          const r = rotatePoint({ x_mm: c.x, y_mm: c.y }, rot);
          const boardX = slit.x + r.x_mm;
          const boardY = slit.y + r.y_mm;
          return `(xy ${xy(boardX, boardYToKicadY(boardY, boardHeight))})`;
        })
        .join(" ");
      blocks.push(
        `\t(zone
\t\t(net 0)
\t\t(net_name "")
\t\t(layer "${zone.layer}")
\t\t(uuid "${makeUuid()}")
\t\t(name "GND slit")
\t\t(hatch edge 0.5)
\t\t(keepout
\t\t\t(copperpour not_allowed)
\t\t\t(footprints allowed)
\t\t\t(pads allowed)
\t\t\t(tracks allowed)
\t\t\t(vias allowed)
\t\t)
\t\t(polygon
\t\t\t(pts ${slitPts})
\t\t)
\t)`
      );
    }
  }

  return `${buildKicadPcbHeader(spec.stackup)}\n${blocks.join("\n")}\n${KICAD_PCB_FOOTER}`;
}

// ---- 요약 계산 ---------------------------------------------------------------

function computeSummary(spec: BoardSpec): BuildBoardResult["summary"] {
  let totalTraceLength_mm = 0;
  for (const route of spec.routes) {
    for (let i = 0; i + 1 < route.points.length; i++) {
      totalTraceLength_mm += distanceMm(route.points[i], route.points[i + 1]);
    }
  }
  let viaCount = spec.vias.length;
  for (const part of spec.parts) {
    const footprint = getFootprint(part.type);
    viaCount += footprint?.auxVias?.length ?? 0;
  }
  return {
    partCount: spec.parts.length,
    netCount: spec.nets.length,
    totalTraceLength_mm: Math.round(totalTraceLength_mm * 1000) / 1000,
    viaCount,
  };
}

/**
 * spec을 먼저 validate.ts로 검증하고, 치명적 오류가 없을 때만
 * .kicad_pcb 문자열과 요약을 만든다. 오류는 던지지 않고 Result로 반환한다.
 */
export function buildBoard(spec: BoardSpec): Result<BuildBoardResult> {
  const validation = validateSpec(spec);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }
  const kicad_pcb = serializeBoard(spec);
  return { ok: true, value: { kicad_pcb, summary: computeSummary(spec) } };
}
