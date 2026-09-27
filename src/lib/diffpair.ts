/**
 * diffpair.ts — Edge-coupled microstrip differential pair 근사 계산 (IPC-2141 계열)
 *
 * 용도 : 공개 계산기(public/tools/diff-pair/index.html)와 MCP 도구(diffpair_*)가
 *        같은 수식을 쓰도록 식을 한 곳에 둔다. 웹 화면의 숫자와 Claude의 답이 일치한다.
 *
 * 수식 : Z0    = 87 / sqrt(er + 1.41) * ln(5.98H / (0.8W + T))
 *        Zdiff = 2*Z0 * (1 - 0.48 * exp(-0.96 * S / H))
 *        eeff  = 0.475*er + 0.67
 *        길이 단위는 mm, 동박 두께만 µm로 받아 mm로 환산한다.
 *
 * 주의 : src/lib/z0.js의 diff 계산은 Hammerstad-Jensen 기반이라 값이 조금 다르다.
 *        이 파일은 공개 계산기 화면과 숫자를 맞추기 위한 IPC 근사식 전용이다.
 */

export type DiffPairInput = {
  /** 상대 유전율 */ er: number;
  /** 기판 높이 [mm] */ h_mm: number;
  /** 한 선로의 폭 [mm] */ w_mm: number;
  /** edge-to-edge 간격 [mm] */ s_mm: number;
  /** 동박 두께 [µm] */ t_um: number;
  /** 파장 계산용 주파수 [GHz] */ freq_ghz: number;
};

export type DiffPairResult = {
  zdiff_ohm: number;
  z0_ohm: number;
  zodd_ohm: number;
  eeff: number;
  coupling_percent: number;
  delay_ps_per_mm: number;
  lambda_mm: number;
  w_over_h: number;
  s_over_h: number;
  cautions: string[];
};

export const DEFAULT_INPUT: DiffPairInput = {
  er: 4.2,
  h_mm: 0.15,
  w_mm: 0.25,
  s_mm: 0.25,
  t_um: 35,
  freq_ghz: 5,
};

/** 계산이 불가능한 입력이면 사유 문자열을, 문제가 없으면 빈 문자열을 반환한다. */
export function validate(v: DiffPairInput): string {
  const all = [v.er, v.h_mm, v.w_mm, v.s_mm, v.t_um, v.freq_ghz];
  if (!all.every(Number.isFinite)) return "모든 입력값은 숫자여야 합니다.";
  if (v.er <= 1) return "er은 1보다 커야 합니다.";
  if (v.h_mm <= 0 || v.w_mm <= 0 || v.s_mm <= 0 || v.t_um <= 0 || v.freq_ghz <= 0) {
    return "모든 치수와 주파수는 0보다 커야 합니다.";
  }
  if (5.98 * v.h_mm <= 0.8 * v.w_mm + v.t_um / 1000) {
    return "이 W/H 조합에서는 IPC 근사식의 로그 항이 유효하지 않습니다. W를 줄이거나 H를 늘리세요.";
  }
  return "";
}

export function calcDiffPair(v: DiffPairInput): DiffPairResult {
  const t_mm = v.t_um / 1000;
  const z0 = (87 / Math.sqrt(v.er + 1.41)) * Math.log((5.98 * v.h_mm) / (0.8 * v.w_mm + t_mm));
  const coupling = 0.48 * Math.exp((-0.96 * v.s_mm) / v.h_mm);
  const zdiff = 2 * z0 * (1 - coupling);
  const eeff = 0.475 * v.er + 0.67;
  const w_over_h = v.w_mm / v.h_mm;
  const s_over_h = v.s_mm / v.h_mm;

  const cautions: string[] = [];
  if (w_over_h < 0.1 || w_over_h > 2) {
    cautions.push(`W/H=${w_over_h.toFixed(2)}는 권장 근사 범위 0.1–2 밖입니다.`);
  }
  if (s_over_h < 0.1 || s_over_h > 3) {
    cautions.push(`S/H=${s_over_h.toFixed(2)}에서는 결합 근사 오차가 커질 수 있습니다.`);
  }

  return {
    zdiff_ohm: zdiff,
    z0_ohm: z0,
    zodd_ohm: zdiff / 2,
    eeff,
    coupling_percent: coupling * 100,
    delay_ps_per_mm: 3.335640952 * Math.sqrt(eeff),
    lambda_mm: 299.792458 / (v.freq_ghz * Math.sqrt(eeff)),
    w_over_h,
    s_over_h,
    cautions,
  };
}

export type SolveVariable = "w_mm" | "s_mm" | "h_mm";

export type SolveResult =
  | { ok: true; variable: SolveVariable; value: number; result: DiffPairResult; error_ohm: number }
  | { ok: false; reason: string };

const SOLVE_RANGE: Record<SolveVariable, [number, number]> = {
  w_mm: [0.02, 5],
  s_mm: [0.02, 10],
  h_mm: [0.02, 5],
};

/**
 * 목표 Zdiff를 만족하는 치수 하나를 이분법으로 역산한다.
 * Zdiff는 W에 대해 감소, S와 H에 대해 증가하므로 구간 양끝 값으로 방향을 판정한다.
 */
export function solveForTarget(
  target: number,
  variable: SolveVariable,
  base: DiffPairInput,
  tol = 0.01,
  maxIter = 100,
): SolveResult {
  if (!Number.isFinite(target) || target <= 0) return { ok: false, reason: "목표 Zdiff는 0보다 커야 합니다." };

  const [min, max] = SOLVE_RANGE[variable];
  const at = (value: number): number | null => {
    const trial = { ...base, [variable]: value };
    if (validate(trial)) return null;
    return calcDiffPair(trial).zdiff_ohm;
  };

  let lo = min;
  let hi = max;
  let zLo = at(lo);
  let zHi = at(hi);

  // 로그 항이 무효가 되는 끝값은 유효한 지점까지 좁혀 들어간다.
  for (let i = 0; i < 60 && zLo === null; i++) {
    lo += (hi - lo) / 20;
    zLo = at(lo);
  }
  for (let i = 0; i < 60 && zHi === null; i++) {
    hi -= (hi - lo) / 20;
    zHi = at(hi);
  }
  if (zLo === null || zHi === null) return { ok: false, reason: "이 조건에서는 유효한 계산 구간이 없습니다." };

  const low = Math.min(zLo, zHi);
  const high = Math.max(zLo, zHi);
  if (target < low || target > high) {
    return {
      ok: false,
      reason:
        `${variable} ${lo.toFixed(3)}~${hi.toFixed(3)} mm 범위에서 가능한 Zdiff는 ` +
        `${low.toFixed(2)}~${high.toFixed(2)} Ω입니다. 다른 치수를 함께 조정하세요.`,
    };
  }

  const increasing = zHi > zLo;
  let value = (lo + hi) / 2;
  for (let i = 0; i < maxIter; i++) {
    value = (lo + hi) / 2;
    const z = at(value);
    if (z === null) {
      lo = value;
      continue;
    }
    if (Math.abs(z - target) < tol) break;
    if (increasing === z < target) lo = value;
    else hi = value;
  }

  const result = calcDiffPair({ ...base, [variable]: value });
  return { ok: true, variable, value, result, error_ohm: result.zdiff_ohm - target };
}

export type SweepVariable = SolveVariable | "er" | "t_um";

export type SweepPoint = {
  value: number;
  zdiff_ohm: number | null;
  z0_ohm: number | null;
  note?: string;
};

/** 변수 하나를 훑으며 Zdiff 변화를 배열로 반환한다. */
export function sweep(
  variable: SweepVariable,
  from: number,
  to: number,
  steps: number,
  base: DiffPairInput,
): SweepPoint[] {
  const n = Math.max(2, Math.min(steps, 41));
  const out: SweepPoint[] = [];
  for (let i = 0; i < n; i++) {
    const value = from + ((to - from) * i) / (n - 1);
    const trial = { ...base, [variable]: value };
    const invalid = validate(trial);
    if (invalid) {
      out.push({ value: round(value, 4), zdiff_ohm: null, z0_ohm: null, note: invalid });
      continue;
    }
    const r = calcDiffPair(trial);
    out.push({ value: round(value, 4), zdiff_ohm: round(r.zdiff_ohm, 2), z0_ohm: round(r.z0_ohm, 2) });
  }
  return out;
}

export function round(value: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

/** 목표 대비 편차를 사람이 읽는 문장으로 만든다. 계산기 화면과 같은 기준(±5% / ±10%)을 쓴다. */
export function compareToTarget(zdiff: number, target: number) {
  const delta = zdiff - target;
  const percent = (Math.abs(delta) / target) * 100;
  const verdict = percent <= 5 ? "±5% 이내" : percent <= 10 ? "±10% 이내" : "조정 필요";
  return {
    target_ohm: target,
    delta_ohm: round(delta, 2),
    delta_percent: round(percent, 1),
    verdict,
  };
}
