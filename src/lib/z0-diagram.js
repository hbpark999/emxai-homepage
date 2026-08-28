/**
 * z0-diagram.js - Z0 계산 결과용 단면도 + 수식 SVG 생성
 *
 * 용도 : MCP 도구(calc_z0, solve_width) 응답에 이미지로 첨부해서, Claude 대화창에
 *        구조 단면과 실제 사용된 계산식을 함께 보여준다.
 * 출력 : SVG 문자열. route.js에서 sharp로 PNG로 변환해 base64로 전송한다.
 * 주의 : 실제 축척이 아니라 "보기 좋은" 상대 비율로 그린다(도체 두께는 항상
 *        보이도록 최소 두께를 강제). 정확한 치수는 라벨 텍스트로 표기한다.
 */

const W = 560;
const H = 400;
const COPPER = "#c9822f";
const COPPER_STROKE = "#8a5a1f";
const GROUND = "#3f4757";
const DIELECTRIC = "#dcefe6";
const DIELECTRIC_STROKE = "#8fc9ab";
const TEXT = "#1f2937";
const DIM = "#6b7280";

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmt(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  return (Math.round(v * 1000) / 1000).toString();
}

function defs() {
  return `<defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="${DIM}" />
    </marker>
  </defs>`;
}

function header(title) {
  return `<text x="${W / 2}" y="30" font-size="18" font-weight="700" fill="${TEXT}" text-anchor="middle" font-family="sans-serif">${esc(title)}</text>`;
}

function hDim(x1, x2, y, label) {
  return `
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${DIM}" stroke-width="1.4" marker-start="url(#arrow)" marker-end="url(#arrow)" />
    <text x="${(x1 + x2) / 2}" y="${y - 8}" font-size="13" fill="${DIM}" text-anchor="middle" font-family="monospace">${esc(label)}</text>`;
}

function vDim(x, y1, y2, label) {
  return `
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${DIM}" stroke-width="1.4" marker-start="url(#arrow)" marker-end="url(#arrow)" />
    <text x="${x + 8}" y="${(y1 + y2) / 2 + 4}" font-size="13" fill="${DIM}" font-family="monospace">${esc(label)}</text>`;
}

function footer(lines) {
  const visible = lines.filter(Boolean);
  // 줄 수에 관계없이 항상 하단에 붙도록, 마지막 줄을 기준으로 위쪽으로 쌓는다
  // (구조별로 수식+결과 줄 수가 달라 캔버스 밖으로 잘리는 걸 방지).
  const lastY = H - 16;
  const startY = lastY - (visible.length - 1) * 18;

  return visible
    .map(
      (line, i) =>
        `<text x="24" y="${startY + i * 18}" font-size="12.5" fill="${TEXT}" font-family="monospace">${esc(line)}</text>`,
    )
    .join("");
}

function wrap(body, title, footerLines) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs()}
  <rect width="${W}" height="${H}" fill="#ffffff" />
  ${header(title)}
  ${body}
  ${footer(footerLines)}
</svg>`;
}

function microstripBody({ w, h, t = 0.035, er = 4.3 }) {
  const plotW = 360;
  const plotLeft = (W - plotW) / 2;
  const groundY = 220;
  const groundH = 14;
  const dielH = 120;
  const dielTop = groundY - dielH;
  const scaleX = (plotW * 0.45) / Math.max(w, 0.05);
  const traceW = Math.min(plotW * 0.85, Math.max(28, w * scaleX));
  const traceH = 10;
  const traceX = W / 2 - traceW / 2;
  const traceY = dielTop - traceH;

  return `
  <rect x="${plotLeft}" y="${dielTop}" width="${plotW}" height="${dielH}" fill="${DIELECTRIC}" stroke="${DIELECTRIC_STROKE}" stroke-width="1.5" />
  <text x="${W / 2}" y="${dielTop + dielH / 2 + 5}" font-size="13" fill="${TEXT}" text-anchor="middle" font-family="monospace">er = ${fmt(er)}</text>
  <rect x="${plotLeft}" y="${groundY}" width="${plotW}" height="${groundH}" fill="${GROUND}" />
  <text x="${W / 2}" y="${groundY + groundH + 16}" font-size="12" fill="${DIM}" text-anchor="middle" font-family="monospace">GND</text>
  <rect x="${traceX}" y="${traceY}" width="${traceW}" height="${traceH}" fill="${COPPER}" stroke="${COPPER_STROKE}" />
  ${hDim(traceX, traceX + traceW, traceY - 14, `w = ${fmt(w)} mm`)}
  ${vDim(plotLeft - 22, dielTop, groundY, `h = ${fmt(h)} mm`)}
  <text x="${traceX + traceW + 10}" y="${traceY + traceH / 2 + 4}" font-size="12" fill="${DIM}" font-family="monospace">t = ${fmt(t)} mm</text>`;
}

function striplineBody({ w, b, t = 0.035, er = 4.3 }) {
  const plotW = 360;
  const plotLeft = (W - plotW) / 2;
  const groundH = 14;
  const topY = 90;
  const dielH = 150;
  const bottomY = topY + groundH + dielH;
  const traceH = 10;
  const traceY = topY + groundH + dielH / 2 - traceH / 2;
  const scaleX = (plotW * 0.45) / Math.max(w, 0.05);
  const traceW = Math.min(plotW * 0.85, Math.max(28, w * scaleX));
  const traceX = W / 2 - traceW / 2;

  return `
  <rect x="${plotLeft}" y="${topY}" width="${plotW}" height="${groundH}" fill="${GROUND}" />
  <rect x="${plotLeft}" y="${topY + groundH}" width="${plotW}" height="${dielH}" fill="${DIELECTRIC}" stroke="${DIELECTRIC_STROKE}" stroke-width="1.5" />
  <rect x="${plotLeft}" y="${bottomY}" width="${plotW}" height="${groundH}" fill="${GROUND}" />
  <text x="${W / 2}" y="${topY + groundH + dielH / 2 + 30}" font-size="13" fill="${TEXT}" text-anchor="middle" font-family="monospace">er = ${fmt(er)}</text>
  <rect x="${traceX}" y="${traceY}" width="${traceW}" height="${traceH}" fill="${COPPER}" stroke="${COPPER_STROKE}" />
  ${hDim(traceX, traceX + traceW, traceY - 14, `w = ${fmt(w)} mm`)}
  ${vDim(plotLeft - 22, topY, bottomY + groundH, `b = ${fmt(b)} mm`)}
  <text x="${traceX + traceW + 10}" y="${traceY + traceH / 2 + 4}" font-size="12" fill="${DIM}" font-family="monospace">t = ${fmt(t)} mm</text>`;
}

function diffBody({ w, h, t = 0.035, s = 0.2, er = 4.3 }) {
  const plotW = 400;
  const plotLeft = (W - plotW) / 2;
  const groundY = 220;
  const groundH = 14;
  const dielH = 120;
  const dielTop = groundY - dielH;
  const scaleX = (plotW * 0.28) / Math.max(w, 0.05);
  const traceW = Math.min(plotW * 0.32, Math.max(22, w * scaleX));
  const scaleGap = (plotW * 0.18) / Math.max(s, 0.02);
  const gap = Math.min(plotW * 0.3, Math.max(10, s * scaleGap));
  const traceH = 10;
  const trace1X = W / 2 - gap / 2 - traceW;
  const trace2X = W / 2 + gap / 2;
  const traceY = dielTop - traceH;

  return `
  <rect x="${plotLeft}" y="${dielTop}" width="${plotW}" height="${dielH}" fill="${DIELECTRIC}" stroke="${DIELECTRIC_STROKE}" stroke-width="1.5" />
  <text x="${W / 2}" y="${dielTop + dielH / 2 + 5}" font-size="13" fill="${TEXT}" text-anchor="middle" font-family="monospace">er = ${fmt(er)}</text>
  <rect x="${plotLeft}" y="${groundY}" width="${plotW}" height="${groundH}" fill="${GROUND}" />
  <rect x="${trace1X}" y="${traceY}" width="${traceW}" height="${traceH}" fill="${COPPER}" stroke="${COPPER_STROKE}" />
  <rect x="${trace2X}" y="${traceY}" width="${traceW}" height="${traceH}" fill="${COPPER}" stroke="${COPPER_STROKE}" />
  ${hDim(trace1X, trace1X + traceW, traceY - 14, `w = ${fmt(w)} mm`)}
  ${hDim(trace1X + traceW, trace2X, traceY - 34, `s = ${fmt(s)} mm`)}
  ${vDim(plotLeft - 22, dielTop, groundY, `h = ${fmt(h)} mm`)}
  <text x="${trace2X + traceW + 10}" y="${traceY + traceH / 2 + 4}" font-size="12" fill="${DIM}" font-family="monospace">t = ${fmt(t)} mm</text>`;
}

const MICROSTRIP_FORMULA = [
  "Z0 = 60/sqrt(eeff) * ln(8/u + u/4)          [u <= 1]",
  "Z0 = 120*pi / (sqrt(eeff)*(u+1.393+0.667*ln(u+1.444)))  [u > 1]",
  "eeff = (er+1)/2 + (er-1)/2 * (1+12/u)^-0.5,  u = we/h",
];

const STRIPLINE_FORMULA = [
  "Z0 = (60/sqrt(er)) * ln( 4b / (0.67*pi*w*(0.8+t/w)) )",
];

const DIFF_FORMULA = [
  ...MICROSTRIP_FORMULA,
  "Zdiff = 2*Z0 * (1 - 0.48*exp(-0.96*s/h))",
];

/** structure/params/계산 결과를 받아 단면도+수식 SVG 문자열을 만든다. */
export function buildDiagramSvg(structure, params, result) {
  const resultLine = result
    ? structure === "diff"
      ? `-> Z0 = ${fmt(result.z0)} ohm, Zdiff = ${fmt(result.zdiff)} ohm, eeff = ${fmt(result.eeff)}`
      : `-> Z0 = ${fmt(result.z0 ?? result.primary)} ohm, eeff = ${fmt(result.eeff)}`
    : "";

  if (structure === "stripline") {
    return wrap(striplineBody(params), "Stripline 단면", [...STRIPLINE_FORMULA, resultLine]);
  }
  if (structure === "diff") {
    return wrap(diffBody(params), "차동 Microstrip 단면", [...DIFF_FORMULA, resultLine]);
  }
  return wrap(microstripBody(params), "Microstrip 단면", [...MICROSTRIP_FORMULA, resultLine]);
}
