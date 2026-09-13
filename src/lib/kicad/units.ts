/**
 * units.ts
 * mm 단위 포맷팅과 좌표계 변환 헬퍼.
 * BoardSpec의 좌표는 "보드 좌하단이 (0,0), Y는 위로 증가"를 기준으로 받지만,
 * KiCad 내부 좌표는 "보드 좌상단이 (0,0), Y는 아래로 증가"이므로 board.ts가
 * 직렬화 직전에 반드시 이 헬퍼로 변환해야 한다. 여기서 변환을 놓치는 것이
 * 이 코드베이스에서 가장 흔한 버그 유형이다.
 */

/** KiCad 좌표 문자열로 쓸 mm 값. 소수점 6자리, 불필요한 trailing zero 제거. */
export function formatMm(value_mm: number): string {
  if (!Number.isFinite(value_mm)) return "0";
  const rounded = Math.round(value_mm * 1e6) / 1e6;
  // -0 방지
  const normalized = rounded === 0 ? 0 : rounded;
  return normalized.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

/** "x y" 형태의 KiCad 좌표 토큰. */
export function xy(x_mm: number, y_mm: number): string {
  return `${formatMm(x_mm)} ${formatMm(y_mm)}`;
}

/**
 * BoardSpec의 "좌하단 기준, Y 위로 증가" 좌표를 KiCad의
 * "좌상단 기준, Y 아래로 증가" 좌표로 변환한다.
 */
export function boardYToKicadY(y_mm: number, boardHeight_mm: number): number {
  return boardHeight_mm - y_mm;
}

export function boardPointToKicad(
  point: { x: number; y: number },
  boardHeight_mm: number
): { x_mm: number; y_mm: number } {
  return { x_mm: point.x, y_mm: boardYToKicadY(point.y, boardHeight_mm) };
}

/**
 * parts.ts는 부품 로컬 패드 좌표를 "Y 위로 증가"인 보통의 수학 좌표로 낸다
 * (QFP의 반시계 방향 핀 배치가 이 가정 위에서 성립한다). footprint의
 * (at x y rot)는 KiCad 좌표계(Y 아래로 증가) 안에서 그대로 해석되므로,
 * 패드 로컬 좌표를 쓰기 전에 반드시 Y부호를 뒤집어야 그림이 뒤집히지 않는다.
 * board.ts에서 이 함수를 거치지 않고 pad.y_mm을 그대로 쓰면, 부품이 상하
 * 반전되어 배치되는 버그가 생긴다.
 */
export function flipLocalY(y_mm: number): number {
  return -y_mm;
}

/** deg → rad. KiCad 각도는 반시계 방향(CCW)이 양(+)의 값이다. */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 부품 로컬 좌표를 rot(deg, CCW)만큼 회전시킨다. */
export function rotatePoint(
  point: { x_mm: number; y_mm: number },
  rot_deg: number
): { x_mm: number; y_mm: number } {
  if (!rot_deg) return point;
  const rad = degToRad(rot_deg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x_mm: point.x_mm * cos - point.y_mm * sin,
    y_mm: point.x_mm * sin + point.y_mm * cos,
  };
}

export function distanceMm(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

let uuidCounter = 0;

/**
 * KiCad가 각 요소 식별에 쓰는 UUID 형태의 문자열을 생성한다.
 * 암호학적 무작위성은 필요 없고, 한 파일 안에서 서로 다르기만 하면 된다.
 */
export function makeUuid(): string {
  uuidCounter += 1;
  const rand = () => Math.floor(Math.random() * 16).toString(16);
  const counterHex = uuidCounter.toString(16).padStart(8, "0").slice(-8);
  return `${counterHex}-${Array.from({ length: 4 }, rand).join("")}-4${Array.from(
    { length: 3 },
    rand
  ).join("")}-a${Array.from({ length: 3 }, rand).join("")}-${Array.from({ length: 12 }, rand).join("")}`;
}

/** 사각형 두 개가 겹치는지 (축 정렬 기준, mm). 패드 겹침 검사에 사용. */
export function rectsOverlap(
  a: { cx: number; cy: number; w: number; h: number },
  b: { cx: number; cy: number; w: number; h: number }
): boolean {
  const ax0 = a.cx - a.w / 2;
  const ax1 = a.cx + a.w / 2;
  const ay0 = a.cy - a.h / 2;
  const ay1 = a.cy + a.h / 2;
  const bx0 = b.cx - b.w / 2;
  const bx1 = b.cx + b.w / 2;
  const by0 = b.cy - b.h / 2;
  const by1 = b.cy + b.h / 2;
  return ax0 < bx1 && ax1 > bx0 && ay0 < by1 && ay1 > by0;
}
