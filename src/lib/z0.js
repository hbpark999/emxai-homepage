/**
 * z0.js - 전송선 특성임피던스(Z0) 계산 엔진
 *
 * 용도   : z0.html(사용자용 계산기)와 api/mcp(Claude용 창구)가 공유하는 단일 소스 모듈
 * 단위   : 모든 길이는 mm
 * 지원   : microstrip / stripline / diff (edge-coupled 차동 마이크로스트립)
 * 근거식 : Hammerstad-Jensen (마이크로스트립), IPC-2141 (스트립라인, 차동 보정)
 * 주의   : 폐형 근사식이므로 최종 검증은 HFSS 등 3D 솔버로 수행할 것
 */

/** 마이크로스트립: 도체 두께 보정 후 Z0와 실효 유전율 반환 */
export function microstripZ0({ w, h, t = 0.035, er = 4.3 }) {
  const we = t > 0 ? w + (t / Math.PI) * (1 + Math.log((2 * h) / t)) : w;
  const u = we / h;

  let eeff = (er + 1) / 2 + ((er - 1) / 2) * Math.pow(1 + 12 / u, -0.5);
  if (u < 1) eeff += ((er - 1) / 2) * 0.04 * Math.pow(1 - u, 2);

  const z0 =
    u <= 1
      ? (60 / Math.sqrt(eeff)) * Math.log(8 / u + u / 4)
      : (120 * Math.PI) /
        (Math.sqrt(eeff) * (u + 1.393 + 0.667 * Math.log(u + 1.444)));

  return { z0, eeff };
}

/** 대칭 스트립라인: b는 두 기준면 사이 전체 유전체 두께 */
export function striplineZ0({ w, b, t = 0.035, er = 4.3 }) {
  const z0 =
    (60 / Math.sqrt(er)) *
    Math.log((4 * b) / (0.67 * Math.PI * w * (0.8 + t / w)));
  return { z0, eeff: er };
}

/** 차동 마이크로스트립: s는 두 선로 사이 간격(edge-to-edge) */
export function diffMicrostripZ0({ w, h, t = 0.035, s = 0.2, er = 4.3 }) {
  const { z0, eeff } = microstripZ0({ w, h, t, er });
  const zdiff = 2 * z0 * (1 - 0.48 * Math.exp((-0.96 * s) / h));
  return { z0, zdiff, eeff };
}

/** 구조 종류에 따라 알맞은 계산 함수로 분배 */
export function calcZ0(p) {
  const structure = p.structure || "microstrip";
  if (structure === "stripline") {
    const r = striplineZ0(p);
    return { structure, ...r, primary: r.z0 };
  }
  if (structure === "diff") {
    const r = diffMicrostripZ0(p);
    return { structure, ...r, primary: r.zdiff };
  }
  const r = microstripZ0(p);
  return { structure, ...r, primary: r.z0 };
}

/**
 * 목표 임피던스를 만족하는 폭 w를 이분법으로 역산
 * Z0는 w에 대해 단조 감소하므로 구간을 절반씩 좁혀가며 수렴한다
 */
export function solveWidth(target, p, tol = 0.01, maxIter = 80) {
  let lo = 0.005;
  let hi = 50;

  const at = (w) => calcZ0({ ...p, w }).primary;

  if (at(lo) < target) return { ok: false, reason: "목표값이 너무 높음 (폭 최소에서도 미달)" };
  if (at(hi) > target) return { ok: false, reason: "목표값이 너무 낮음 (폭 최대에서도 초과)" };

  let w = 0;
  for (let i = 0; i < maxIter; i++) {
    w = (lo + hi) / 2;
    const z = at(w);
    if (Math.abs(z - target) < tol) break;
    if (z > target) lo = w;
    else hi = w;
  }

  const result = calcZ0({ ...p, w });
  return { ok: true, w, ...result, error: result.primary - target };
}

/** 변수 하나를 범위 내에서 훑으며 Z0 변화를 배열로 반환 (민감도 확인용) */
export function sweepZ0(variable, from, to, steps, p) {
  const n = Math.max(2, Math.min(steps || 9, 25));
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = from + ((to - from) * i) / (n - 1);
    const r = calcZ0({ ...p, [variable]: v });
    out.push({ [variable]: Number(v.toFixed(4)), z0: Number(r.primary.toFixed(2)) });
  }
  return out;
}
