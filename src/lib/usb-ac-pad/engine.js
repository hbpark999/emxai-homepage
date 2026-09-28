/**
 * usb-ac-pad/engine.js
 * 브라우저 데모(public/tools/usb-ac-pad/index.html)와 같은 계산을 서버에서 수행한다.
 *
 * 추론·수동성 투영·회로 로딩·mixed-mode 변환·TDR·impulse 모듈은 데모의 인라인
 * 스크립트를 그대로 복사한 것이라, 화면과 MCP의 숫자가 같다.
 * 모델(model.usbgp, 16.5 MB)은 public 밖에 두어 정적 파일로 노출되지 않는다.
 */

const fs = require("node:fs");
const path = require("node:path");

const UsbPadInference = require("./inference.js");
const UsbPadPassivity = require("./passivity.js");
const USBNetwork = require("./network.js");
const USBTdr = require("./tdr.js");
const USBImpulse = require("./impulse.js");
const USBTrace = require("./trace.js");

let cached = null;

/** 모델 파일을 읽어 한 번만 디코드하고 인스턴스 안에서 재사용한다. */
function getBundle() {
  if (cached) return cached;
  const file = path.join(process.cwd(), "src", "lib", "usb-ac-pad", "model.usbgp");
  const buf = fs.readFileSync(file);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  cached = UsbPadInference.decode(ab);
  return cached;
}

const LIMITS = {
  W: [0.1, 0.25],
  S: [0.1, 0.3],
  Vx: [0.6, 3.2],
  Vy: [0.3, 0.9],
};

/** 모델 헤더에 들어 있는 학습 범위를 읽는다. 없으면 보수적 기본값을 쓴다. */
function featureLimits(bundle) {
  const out = {};
  for (const branch of ["void", "control"]) {
    const keys = bundle.meta.model_metadata.feature_keys[branch] || [];
    const arr = bundle.arrays[branch + "__limits"];
    if (!arr || !arr.data || arr.data.length < keys.length * 2) {
      out[branch] = Object.fromEntries(keys.map((k) => [k, LIMITS[k] || null]));
      continue;
    }
    out[branch] = Object.fromEntries(keys.map((k, i) => [k, [arr.data[i * 2], arr.data[i * 2 + 1]]]));
  }
  return out;
}

function checkRange(branch, params, limits) {
  const bad = [];
  for (const [key, range] of Object.entries(limits[branch] || {})) {
    if (!range) continue;
    const v = params[key];
    if (typeof v !== "number" || Number.isNaN(v)) {
      bad.push(`${key}: 값이 없다`);
    } else if (v < range[0] - 1e-9 || v > range[1] + 1e-9) {
      bad.push(`${key}=${v}는 학습 범위 ${range[0]}~${range[1]} mm 밖이다`);
    }
  }
  return bad;
}

/** 복소 S 성분 하나를 꺼낸다. mixed-mode 행렬은 (k, i, j) 순서다. */
function sAt(x, k, i, j) {
  const n = x.shape[1];
  const idx = k * n * n + i * n + j;
  return [x.real[idx], x.imaginary[idx]];
}

const dB = (re, im) => 20 * Math.log10(Math.max(Math.hypot(re, im), 1e-12));

/**
 * 로그 간격으로 주파수 몇 점만 골라 응답을 가볍게 유지한다.
 * f[0]은 DC(0 Hz)라 로그를 취할 수 없으므로 양수 구간에서만 고른다.
 */
function sampleIndices(f, count) {
  const first = f.findIndex((v) => v > 0);
  const lo = Math.log10(f[first]);
  const hi = Math.log10(f[f.length - 1]);
  const out = [];
  for (let i = 0; i < count; i++) {
    const target = 10 ** (lo + ((hi - lo) * i) / (count - 1));
    let best = first;
    let bestD = Infinity;
    for (let k = first; k < f.length; k++) {
      const d = Math.abs(Math.log10(f[k]) - Math.log10(target));
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    }
    if (out[out.length - 1] !== best) out.push(best);
  }
  return out;
}

/**
 * 형상과 부품 조건으로 예측하고 요약을 돌려준다.
 * @param {object} p W,S,Vx,Vy,void_enabled,cap_nf,esr_ohm,esl_nh,rise_ps,mode,points
 */
function predict(p) {
  const bundle = getBundle();
  const limits = featureLimits(bundle);
  const branch = p.void_enabled === false ? "control" : "void";
  const keys = bundle.meta.model_metadata.feature_keys[branch];

  const params = { W: p.W, S: p.S, Vx: p.Vx, Vy: p.Vy };
  if (branch === "control") {
    params.Vx = 0;
    params.Vy = 0;
  }

  const outOfRange = checkRange(branch, params, limits);
  if (outOfRange.length) return { ok: false, error: "학습 범위 밖 입력", details: outOfRange, limits };
  if (branch === "void" && 1.1 - params.Vy < 0.2 - 1e-10) {
    return { ok: false, error: "중앙 GND가 0.20 mm보다 좁다. Vy를 줄여야 한다." };
  }

  const raw = UsbPadInference.predictRaw(bundle, branch, keys.map((k) => params[k]));
  const network = UsbPadPassivity.projectPassive(raw);
  const f = Array.from(bundle.arrays.freq_hz.data);

  const mode = p.mode === "short" ? "short" : "capacitor";
  const gamma =
    mode === "short"
      ? { real: new Float64Array(f.length * 2).fill(-1), imaginary: new Float64Array(f.length * 2) }
      : USBNetwork.seriesRLC(f, (p.cap_nf ?? 220) * 1e-9, p.esr_ohm ?? 0, (p.esl_nh ?? 0) * 1e-9);

  const loaded = USBNetwork.loadGaps(network, gamma);
  const mm = USBNetwork.mixedMode(loaded);
  const tdr = USBTdr.earlyTime(f, mm, p.rise_ps ?? 200, 90, p.cap_nf ?? 220, [-0.5, 2], mode);
  const impulse = USBImpulse.compute(f, mm, 1e7, 12.5e9, "hann");

  const idx = sampleIndices(f, Math.max(5, Math.min(p.points ?? 15, 40)));
  const curve = idx.map((k) => {
    const dd11 = sAt(mm, k, 0, 0);
    const dd21 = sAt(mm, k, 1, 0);
    return {
      f_hz: Math.round(f[k]),
      f_display: f[k] >= 1e9 ? `${(f[k] / 1e9).toFixed(2)} GHz` : `${(f[k] / 1e6).toFixed(1)} MHz`,
      sdd11_db: +dB(dd11[0], dd11[1]).toFixed(3),
      sdd21_db: +dB(dd21[0], dd21[1]).toFixed(3),
    };
  });

  const dcIndex = f.findIndex((v) => v === 0);
  const dc =
    dcIndex >= 0
      ? (() => {
          const d21 = sAt(mm, dcIndex, 1, 0);
          return { sdd21_db: +dB(d21[0], d21[1]).toFixed(3), note: "DC는 해석값이 아니라 외삽이다" };
        })()
      : null;

  const zRoi = Array.from(tdr.z_ohm || []);
  const zStats = zRoi.length
    ? { min_ohm: +Math.min(...zRoi).toFixed(2), max_ohm: +Math.max(...zRoi).toFixed(2) }
    : null;

  return {
    ok: true,
    branch,
    parameters: { ...params, void: branch === "void" },
    component: { mode, cap_nf: p.cap_nf ?? 220, esr_ohm: p.esr_ohm ?? 0, esl_nh: p.esl_nh ?? 0 },
    frequency: { start_hz: f[0], stop_hz: f[f.length - 1], points: f.length },
    dc,
    curve,
    tdr: {
      rise_ps: tdr.rise_ps,
      sample_interval_ps: tdr.sample_interval_ps ? +tdr.sample_interval_ps.toFixed(3) : null,
      zdiff: zStats,
      roi_ns: [-0.5, 2],
    },
    impulse: {
      fwhm_ps: impulse.fwhm_ps ? +impulse.fwhm_ps.toFixed(2) : null,
      band_hz: [impulse.start_hz, impulse.stop_hz],
      window: impulse.window,
      points: impulse.points,
    },
    trace_delay: (() => {
      try {
        const shortGamma = {
          real: new Float64Array(f.length * 2).fill(-1),
          imaginary: new Float64Array(f.length * 2),
        };
        const shortMM = USBNetwork.mixedMode(USBNetwork.loadGaps(network, shortGamma));
        const d = USBTrace.delay(f, shortMM);
        return d
          ? {
              oneway_ps: +(d.oneway_ns * 1000).toFixed(2),
              roundtrip_ps: +(d.roundtrip_ns * 1000).toFixed(2),
              phase_rms_rad: +d.phase_rms_rad.toFixed(4),
            }
          : null;
      } catch {
        return null;
      }
    })(),
    correction: network.correction || 0,
  };
}

function modelInfo() {
  const bundle = getBundle();
  const meta = bundle.meta.model_metadata;
  const f = bundle.arrays.freq_hz.data;
  return {
    schema: bundle.meta.schema,
    source_sha256: bundle.meta.source_sha256,
    kind: meta.kind,
    profile: meta.profile,
    tier: meta.accuracy_scope && meta.accuracy_scope.tier,
    physical_use_allowed: meta.physical_use_allowed,
    dc_origin: meta.dc_origin,
    dc_validated: meta.dc_validated,
    feature_keys: meta.feature_keys,
    limits: featureLimits(bundle),
    frequency: { start_hz: f[0], stop_hz: f[f.length - 1], points: f.length },
    warnings: (meta.accuracy_scope && meta.accuracy_scope.warnings) || [],
    scope: meta.accuracy_scope && meta.accuracy_scope.scope,
  };
}

module.exports = { predict, modelInfo, getBundle };
