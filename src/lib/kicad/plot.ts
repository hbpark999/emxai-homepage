/**
 * plot.ts
 * BoardAnalysis를 외부 라이브러리 없이 SVG 문자열로 그린다.
 * 수강생이 KiCad를 열지 않고도 보드를 확인하는 것이 목적이라, 층별 색과
 * 범례·mm 눈금을 함께 넣는다. 특히 GND 슬릿은 대비색 굵은 외곽선으로
 * 강조한다(수업에서 가장 중요한 시각 요소).
 * 좌표는 BoardAnalysis의 Y-up을 SVG의 Y-down으로 뒤집어 그린다.
 */

import type { BoardAnalysis, Pt } from "./types";

const MARGIN_MM = 2;
/** Y축 눈금 숫자가 들어갈 왼쪽 여백. */
const LEFT_MARGIN_MM = 4;
/** X축 눈금 숫자 + 범례가 들어갈 아래 여백. */
const BOTTOM_LABEL_MM = 3;
const LEGEND_ROW_MM = 3.2;
const PX_PER_MM = 12;
const GRID_STEP_MM = 5;

/** 층별 색. KiCad 기본 배색을 밝은 배경에 맞게 조정했다. */
const LAYER_COLORS: Record<string, string> = {
  "F.Cu": "#c8322f",
  "In1.Cu": "#b8a600",
  "In2.Cu": "#9a2fb8",
  "B.Cu": "#2f6dc8",
};

const SLIT_COLOR = "#e5007e"; // 대비색: 어떤 층 색과도 겹치지 않는다
const OUTLINE_COLOR = "#333333";
const GRID_COLOR = "#e2e6ea";
const TEXT_COLOR = "#404850";

function layerColor(layer: string): string {
  return LAYER_COLORS[layer] ?? "#7a7a7a";
}

/** 레이어 이름을 SVG id로 쓸 수 있게 다듬는다 ("In1.Cu" → "In1-Cu"). */
function hatchId(layer: string): string {
  return layer.replace(/[^A-Za-z0-9]/g, "-");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(v: number): string {
  return (Math.round(v * 1000) / 1000).toString();
}

export type PlotOptions = {
  /** 그릴 구리층. 생략하면 보드에 있는 층 전부. */
  layers?: string[];
  /** 트레이스 옆에 넷 이름 표기. */
  show_nets?: boolean;
  /** 슬릿을 굵은 외곽선과 대비색으로 강조. */
  highlight_slits?: boolean;
};

export function plotBoardSvg(analysis: BoardAnalysis, options: PlotOptions = {}): string {
  const { show_nets = false, highlight_slits = true } = options;

  const boardW = analysis.outline.w_mm;
  const boardH = analysis.outline.h_mm;

  // BoardAnalysis(Y 위로) → SVG(Y 아래로). 텍스트가 뒤집히지 않도록
  // transform이 아니라 좌표 계산으로 뒤집는다.
  const sx = (x: number) => x + LEFT_MARGIN_MM;
  const sy = (y: number) => boardH - y + MARGIN_MM;
  const pt = (p: Pt) => `${fmt(sx(p.x))},${fmt(sy(p.y))}`;

  const activeLayers =
    options.layers && options.layers.length > 0
      ? options.layers
      : Array.from(
          new Set([
            ...analysis.traces.map((t) => t.layer),
            ...analysis.planes.map((p) => p.layer),
            ...analysis.pads.map((p) => p.layer),
          ])
        );
  const visible = (layer: string) => activeLayers.includes(layer);

  const parts: string[] = [];

  // --- 배경 격자 + 눈금 ---
  const grid: string[] = [];
  for (let x = 0; x <= boardW + 1e-9; x += GRID_STEP_MM) {
    grid.push(
      `<line x1="${fmt(sx(x))}" y1="${fmt(sy(0))}" x2="${fmt(sx(x))}" y2="${fmt(sy(boardH))}" stroke="${GRID_COLOR}" stroke-width="0.05"/>`
    );
    grid.push(
      `<text x="${fmt(sx(x))}" y="${fmt(sy(0) + 1.4)}" font-size="0.9" fill="${TEXT_COLOR}" text-anchor="middle">${fmt(x)}</text>`
    );
  }
  for (let y = 0; y <= boardH + 1e-9; y += GRID_STEP_MM) {
    grid.push(
      `<line x1="${fmt(sx(0))}" y1="${fmt(sy(y))}" x2="${fmt(sx(boardW))}" y2="${fmt(sy(y))}" stroke="${GRID_COLOR}" stroke-width="0.05"/>`
    );
    grid.push(
      `<text x="${fmt(sx(0) - 0.5)}" y="${fmt(sy(y) + 0.3)}" font-size="0.9" fill="${TEXT_COLOR}" text-anchor="end">${fmt(y)}</text>`
    );
  }
  parts.push(`<g id="grid">${grid.join("")}</g>`);

  // --- 보드 외곽 ---
  if (analysis.outline.polygon.length >= 3) {
    parts.push(
      `<polygon points="${analysis.outline.polygon.map(pt).join(" ")}" fill="#fbfbfa" stroke="${OUTLINE_COLOR}" stroke-width="0.15"/>`
    );
  }

  // --- 평면(zone) ---
  const planeParts: string[] = [];
  for (const plane of analysis.planes) {
    if (!visible(plane.layer)) continue;
    const color = layerColor(plane.layer);
    if (plane.outline.length >= 3) {
      // 평면은 "구리가 깔려 있다"가 한눈에 보여야 해서, 옅은 채움만으로는
      // 배경과 구분이 안 된다. 채움 + 사선 해치를 함께 쓴다.
      planeParts.push(
        `<polygon points="${plane.outline.map(pt).join(" ")}" fill="${color}" fill-opacity="0.13" stroke="${color}" stroke-width="0.12" stroke-dasharray="0.6 0.4"/>`
      );
      planeParts.push(
        `<polygon points="${plane.outline.map(pt).join(" ")}" fill="url(#hatch-${hatchId(plane.layer)})" stroke="none"/>`
      );
    }
    for (const hole of plane.holes) {
      if (hole.length >= 3) {
        planeParts.push(
          `<polygon points="${hole.map(pt).join(" ")}" fill="#ffffff" stroke="${color}" stroke-width="0.08"/>`
        );
      }
    }
  }
  parts.push(`<g id="planes">${planeParts.join("")}</g>`);

  // --- 트레이스 ---
  const traceParts: string[] = [];
  const labelParts: string[] = [];
  for (const trace of analysis.traces) {
    if (!visible(trace.layer)) continue;
    const color = layerColor(trace.layer);
    for (const seg of trace.segments) {
      traceParts.push(
        `<line x1="${fmt(sx(seg.start.x))}" y1="${fmt(sy(seg.start.y))}" x2="${fmt(sx(seg.end.x))}" y2="${fmt(sy(seg.end.y))}" stroke="${color}" stroke-width="${fmt(
          Math.max(seg.width_mm, 0.05)
        )}" stroke-linecap="round" stroke-opacity="0.95"/>`
      );
    }
    if (show_nets && trace.segments.length > 0) {
      const mid = trace.segments[Math.floor(trace.segments.length / 2)];
      const mx = (mid.start.x + mid.end.x) / 2;
      const my = (mid.start.y + mid.end.y) / 2;
      labelParts.push(
        `<text x="${fmt(sx(mx))}" y="${fmt(sy(my) - 0.6)}" font-size="1.1" fill="${color}" text-anchor="middle" font-weight="bold">${escapeXml(
          trace.net
        )}</text>`
      );
    }
  }
  parts.push(`<g id="traces">${traceParts.join("")}</g>`);

  // --- 패드 ---
  const padParts: string[] = [];
  for (const pad of analysis.pads) {
    if (!visible(pad.layer)) continue;
    const color = layerColor(pad.layer);
    const w = pad.size_mm.w;
    const h = pad.size_mm.h;
    padParts.push(
      `<rect x="${fmt(sx(pad.pos.x) - w / 2)}" y="${fmt(sy(pad.pos.y) - h / 2)}" width="${fmt(w)}" height="${fmt(
        h
      )}" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="0.04"/>`
    );
  }
  parts.push(`<g id="pads">${padParts.join("")}</g>`);

  // --- 비아 ---
  const viaParts: string[] = [];
  for (const via of analysis.vias) {
    viaParts.push(
      `<circle cx="${fmt(sx(via.pos.x))}" cy="${fmt(sy(via.pos.y))}" r="${fmt(
        via.diameter_mm / 2
      )}" fill="#5a5f66" stroke="#2c3036" stroke-width="0.03"/>`
    );
    viaParts.push(
      `<circle cx="${fmt(sx(via.pos.x))}" cy="${fmt(sy(via.pos.y))}" r="${fmt(
        via.drill_mm / 2
      )}" fill="#ffffff"/>`
    );
  }
  parts.push(`<g id="vias">${viaParts.join("")}</g>`);

  // --- 슬릿 (강조) ---
  const slitParts: string[] = [];
  let slitCount = 0;
  for (const plane of analysis.planes) {
    if (!visible(plane.layer)) continue;
    for (const split of plane.splits) {
      slitCount++;
      if (split.polygon.length < 3) continue;
      if (highlight_slits) {
        slitParts.push(
          `<polygon points="${split.polygon.map(pt).join(" ")}" fill="${SLIT_COLOR}" fill-opacity="0.35" stroke="${SLIT_COLOR}" stroke-width="0.3" stroke-linejoin="round"/>`
        );
        // 라벨은 슬릿 중심이 아니라 위쪽 끝 바깥에 둔다. 중심에 두면
        // 슬릿을 가로지르는 트레이스와 글자가 겹쳐 둘 다 안 읽힌다.
        const cx = split.polygon.reduce((s, p) => s + p.x, 0) / split.polygon.length;
        const topY = Math.max(...split.polygon.map((p) => p.y));
        slitParts.push(
          `<text x="${fmt(sx(cx))}" y="${fmt(sy(topY) - 0.6)}" font-size="1.1" fill="${SLIT_COLOR}" text-anchor="middle" font-weight="bold">slit ${fmt(
            split.width_mm
          )}mm</text>`
        );
      } else {
        slitParts.push(
          `<polygon points="${split.polygon.map(pt).join(" ")}" fill="#ffffff" stroke="#999999" stroke-width="0.08"/>`
        );
      }
    }
  }
  parts.push(`<g id="slits">${slitParts.join("")}</g>`);
  parts.push(`<g id="net-labels">${labelParts.join("")}</g>`);

  // --- 범례 ---
  const legendEntries = activeLayers
    .filter((l) => l in LAYER_COLORS)
    .map((l) => ({ label: l, color: layerColor(l) }));
  if (highlight_slits && slitCount > 0) {
    legendEntries.push({ label: `GND slit x${slitCount}`, color: SLIT_COLOR });
  }
  // 범례는 보드 아래에 가로로 깐다. 보드 안에 겹쳐 놓으면 정작 봐야 할
  // 배선을 가린다.
  const legendY = sy(0) + BOTTOM_LABEL_MM + LEGEND_ROW_MM / 2;
  const legend: string[] = [];
  let legendX = sx(0);
  for (const entry of legendEntries) {
    legend.push(
      `<rect x="${fmt(legendX)}" y="${fmt(legendY - 0.85)}" width="1.6" height="1.1" fill="${entry.color}"/>`
    );
    legend.push(
      `<text x="${fmt(legendX + 2.1)}" y="${fmt(legendY)}" font-size="1.1" fill="${TEXT_COLOR}">${escapeXml(
        entry.label
      )}</text>`
    );
    legendX += 2.1 + entry.label.length * 0.65 + 2.2;
  }
  parts.push(`<g id="legend">${legend.join("")}</g>`);

  const viewW = Math.max(boardW + LEFT_MARGIN_MM + MARGIN_MM, legendX + MARGIN_MM);
  const viewH = boardH + MARGIN_MM + BOTTOM_LABEL_MM + LEGEND_ROW_MM;

  // 평면 해치 패턴 정의 (레이어별 색)
  const hatchLayers = Array.from(new Set(analysis.planes.map((p) => p.layer))).filter(visible);
  const defs = hatchLayers
    .map(
      (layer) =>
        // 간격을 넓게, 농도를 낮게 잡는다. 촘촘하면 평면이 배선과 눈금을
        // 덮어버려서, "구리가 깔려 있다"는 신호가 오히려 방해가 된다.
        `<pattern id="hatch-${hatchId(layer)}" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
        `<line x1="0" y1="0" x2="0" y2="2.4" stroke="${layerColor(layer)}" stroke-width="0.14" stroke-opacity="0.34"/></pattern>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(viewW * PX_PER_MM)}" height="${fmt(
    viewH * PX_PER_MM
  )}" viewBox="0 0 ${fmt(viewW)} ${fmt(viewH)}" font-family="sans-serif">
<defs>${defs}</defs>
<rect width="${fmt(viewW)}" height="${fmt(viewH)}" fill="#ffffff"/>
${parts.join("\n")}
</svg>`;
}
