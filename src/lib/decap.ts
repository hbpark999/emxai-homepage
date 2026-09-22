/**
 * decap.ts — De-cap 병렬 합성 임피던스 계산 (교육용 lumped 모델)
 *
 * 용도 : 여러 de-cap을 병렬로 붙였을 때의 합성 Z(f), SRF, 반공진을 구한다.
 *        웹 도구(/web-tools/parallel-decap)와 MCP 도구(decap_*)가 이 파일을 공유한다.
 *
 * 모델 : 각 de-cap은 C + ESR + ESL 직렬. 실장 인덕턴스를 켜면
 *        VCC 패드 → 배선 → via → VCC plane 경로와
 *        GND 패드 → 배선 → via → GND plane 경로가 직렬로 루프에 더해진다.
 *        개수 n은 C×n, ESR/n, ESL/n, L_mnt/n 으로 병렬 반영한다.
 *
 * 범위 : IC까지의 공통 경로(plane 확산)는 포함하지 않는다. 부품과 실장 구간만 다룬다.
 *        HFSS 기반 구조 해석은 별도 도구(pdn_*)를 쓴다.
 */

const MU0 = 4e-7 * Math.PI;

export type MountStructure = {
  /** 실장 배선 폭 [mm] */ w_mm: number;
  /** VCC–GND plane 간격 [mm] */ h_mm: number;
  /** via 길이 [mm] */ t_mm: number;
  /** via 지름 [mm] */ d_mm: number;
};

export type DecapSpec = {
  c_uf: number;
  esr_mohm: number;
  esl_nh: number;
  /** 같은 사양을 몇 개 병렬로 붙였는가 */ qty: number;
  /** VCC 패드에서 VCC via까지 배선 길이 [mm] */ len_vcc_mm: number;
  /** GND 패드에서 GND via까지 배선 길이 [mm] */ len_gnd_mm: number;
};

export type Extremum = { type: "srf" | "anti"; f_hz: number; z_ohm: number };

export const DEFAULT_STRUCTURE: MountStructure = { w_mm: 0.5, h_mm: 0.2, t_mm: 0.3, d_mm: 0.3 };

/** 평행판 근사 배선 인덕턴스 계수 [nH/mm] */
export function traceNhPerMm(s: MountStructure): number {
  return (MU0 * (s.h_mm * 1e-3)) / (s.w_mm * 1e-3) * 1e6;
}

/** 단일 via 인덕턴스 [nH] */
export function viaNh(s: MountStructure): number {
  const t = s.t_mm * 1e-3;
  const d = s.d_mm * 1e-3;
  return (MU0 / (2 * Math.PI)) * t * (Math.log((4 * t) / d) + 1) * 1e9;
}

/** de-cap 1개의 실장 인덕턴스 [nH] — VCC 경로 + GND 경로 직렬 */
export function mountNh(cap: DecapSpec, s: MountStructure = DEFAULT_STRUCTURE): number {
  const len = Math.max(0, cap.len_vcc_mm) + Math.max(0, cap.len_gnd_mm);
  return traceNhPerMm(s) * len + 2 * viaNh(s);
}

export type SweepOptions = {
  caps: DecapSpec[];
  structure?: MountStructure;
  /** 실장 인덕턴스 포함 여부 */ includeMount?: boolean;
  fStart?: number;
  fEnd?: number;
  points?: number;
};

export type SweepResult = {
  freq: number[];
  /** includeMount 설정을 적용한 합성 |Z| */ total: number[];
  /** 부품 ESL만 적용한 합성 |Z| (비교용) */ componentOnly: number[];
  /** 각 de-cap 그룹의 |Z| */ each: number[][];
  mount_nh: number[];
};

/** 로그 주파수 격자에서 합성 임피던스를 계산한다. */
export function sweep(opts: SweepOptions): SweepResult {
  const structure = opts.structure ?? DEFAULT_STRUCTURE;
  const includeMount = opts.includeMount ?? true;
  const fStart = opts.fStart ?? 100;
  const fEnd = opts.fEnd ?? 1e9;
  const N = Math.max(50, Math.min(4000, opts.points ?? 1400));

  const a = Math.log10(fStart);
  const b = Math.log10(fEnd);
  const freq = Array.from({ length: N }, (_, i) => 10 ** (a + (i * (b - a)) / (N - 1)));

  const mount_nh = opts.caps.map((c) => mountNh(c, structure));
  const each: number[][] = opts.caps.map(() => []);
  const total: number[] = [];
  const componentOnly: number[] = [];

  freq.forEach((f, k) => {
    const w = 2 * Math.PI * f;
    let gr = 0, gi = 0, hr = 0, hi = 0;

    opts.caps.forEach((cap, i) => {
      const n = Math.max(1, Math.round(cap.qty));
      const C = cap.c_uf * 1e-6 * n;
      const R = (cap.esr_mohm * 1e-3) / n;
      const Lc = (cap.esl_nh * 1e-9) / n;
      const Lm = Lc + (mount_nh[i] * 1e-9) / n;

      const accumulate = (L: number, acc: [number, number]) => {
        const X = w * L - (C > 0 ? 1 / (w * C) : 0);
        const Z2 = R * R + X * X;
        if (Z2 > 0) {
          acc[0] += R / Z2;
          acc[1] += -X / Z2;
        }
        return Math.sqrt(Z2);
      };

      const withMount: [number, number] = [0, 0];
      const without: [number, number] = [0, 0];
      const mag = accumulate(includeMount ? Lm : Lc, withMount);
      accumulate(Lc, without);
      gr += withMount[0]; gi += withMount[1];
      hr += without[0];   hi += without[1];
      each[i].push(mag);
      void k;
    });

    total.push(1 / Math.hypot(gr, gi));
    componentOnly.push(1 / Math.hypot(hr, hi));
  });

  return { freq, total, componentOnly, each, mount_nh };
}

/** 로그-로그 포물선 보간으로 극점(SRF/반공진)의 위치를 정밀화한다. */
export function findExtrema(freq: number[], z: number[]): Extremum[] {
  const out: Extremum[] = [];
  for (let i = 1; i < z.length - 1; i++) {
    const isMin = z[i] < z[i - 1] && z[i] < z[i + 1];
    const isMax = z[i] > z[i - 1] && z[i] > z[i + 1];
    if (!isMin && !isMax) continue;
    const y0 = Math.log10(z[i - 1]);
    const y1 = Math.log10(z[i]);
    const y2 = Math.log10(z[i + 1]);
    const den = y0 - 2 * y1 + y2;
    const dx = den !== 0 ? (0.5 * (y0 - y2)) / den : 0;
    const lf = Math.log10(freq[i]) + dx * (Math.log10(freq[i + 1]) - Math.log10(freq[i]));
    out.push({
      type: isMin ? "srf" : "anti",
      f_hz: 10 ** lf,
      z_ohm: 10 ** (y1 - 0.25 * (y0 - y2) * dx),
    });
  }
  return out;
}

/** 로그 보간으로 임의 주파수의 |Z|를 읽는다. */
export function zAt(freq: number[], z: number[], f: number): number {
  let i = 0;
  while (i < freq.length - 2 && freq[i + 1] < f) i++;
  const r =
    (Math.log10(f) - Math.log10(freq[i])) / (Math.log10(freq[i + 1]) - Math.log10(freq[i]));
  return 10 ** (Math.log10(z[i]) + r * (Math.log10(z[i + 1]) - Math.log10(z[i])));
}

export const formatFreq = (f: number) =>
  f >= 1e9 ? `${(f / 1e9).toFixed(2)} GHz`
  : f >= 1e6 ? `${(f / 1e6).toFixed(2)} MHz`
  : f >= 1e3 ? `${(f / 1e3).toFixed(2)} kHz`
  : `${f.toFixed(1)} Hz`;

export const formatZ = (z: number) =>
  z < 1 ? `${(z * 1000).toFixed(2)} mΩ` : `${z.toFixed(3)} Ω`;
