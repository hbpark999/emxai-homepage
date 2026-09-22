/**
 * parallel-decap-client.tsx — De-cap 병렬 임피던스 계산기 UI
 *
 * 구성 : 좌측 입력(패키지·C·ESR·ESL·개수·VCC/GND 배선 길이 + 실축 단면도)
 *        우측 결과(요약 타일 · 합성 |Z| 차트 · SRF/반공진 표)
 * 차트 : 외부 라이브러리 없이 canvas로 직접 그린다(log-log, 크로스헤어 포함).
 * 계산 : src/lib/decap.ts 를 그대로 쓴다. MCP 도구(decap_*)와 결과가 항상 일치한다.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_STRUCTURE,
  findExtrema,
  formatFreq,
  formatZ,
  mountNh,
  sweep,
  traceNhPerMm,
  viaNh,
  type DecapSpec,
  type MountStructure,
} from "@/lib/decap";

const SERIES = ["#2563eb", "#ea580c", "#0d9488", "#9333ea", "#a16207", "#be185d"];
const INK = "#0f172a";
const MUTED = "#64748b";
const GRID = "#e2e8f0";
const CU = "#b45309";
const GND = "#0f766e";

const PKG: Record<string, { l: number; w: number; esl: number }> = {
  "0402": { l: 1.0, w: 0.5, esl: 0.5 },
  "0603": { l: 1.6, w: 0.8, esl: 0.8 },
  "1206": { l: 3.2, w: 1.6, esl: 2.0 },
};

type Row = DecapSpec & { pkg: string };

const INITIAL: Row[] = [
  { pkg: "1206", c_uf: 10, esr_mohm: 10, esl_nh: 2, qty: 1, len_vcc_mm: 1, len_gnd_mm: 1 },
  { pkg: "0402", c_uf: 0.1, esr_mohm: 30, esl_nh: 0.5, qty: 1, len_vcc_mm: 1, len_gnd_mm: 1 },
];

const F_LABEL: Record<number, string> = {
  2: "100 Hz", 3: "1 kHz", 4: "10 kHz", 5: "100 kHz",
  6: "1 MHz", 7: "10 MHz", 8: "100 MHz", 9: "1 GHz",
};

export default function ParallelDecapClient() {
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [includeMount, setIncludeMount] = useState(true);
  const [structure, setStructure] = useState<MountStructure>(DEFAULT_STRUCTURE);
  const [hover, setHover] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geoRef = useRef<{ left: number; width: number } | null>(null);

  const data = useMemo(
    () => sweep({ caps: rows, structure, includeMount }),
    [rows, structure, includeMount]
  );

  const series = useMemo(() => {
    const out = [
      { label: "합성 |Z| — 실장 포함", color: INK, width: 3, dash: [] as number[], data: data.total },
    ];
    if (includeMount) {
      out.push({ label: "합성 |Z| — 부품만", color: MUTED, width: 2, dash: [7, 5], data: data.componentOnly });
    }
    rows.forEach((r, i) =>
      out.push({
        label: `Cap ${i + 1} · ${r.c_uf}µF ×${r.qty}`,
        color: SERIES[i % SERIES.length],
        width: 1.8,
        dash: [4, 4],
        data: data.each[i],
      })
    );
    return out;
  }, [data, rows, includeMount]);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    const box = cv?.parentElement;
    if (!cv || !box) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    if (W < 40 || H < 40) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    const g = cv.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);

    const m = { l: 66, r: 14, t: 12, b: 42 };
    const pw = W - m.l - m.r;
    const ph = H - m.t - m.b;

    const ref = includeMount ? [data.total, data.componentOnly] : [data.total];
    let lo = Infinity;
    let hi = -Infinity;
    ref.forEach((arr) =>
      arr.forEach((v) => {
        if (v > 0 && Number.isFinite(v)) {
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
      })
    );
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) { lo = 1e-3; hi = 1e2; }
    const y0 = Math.floor(Math.log10(lo));
    const y1 = Math.ceil(Math.log10(hi));
    const X = (f: number) => m.l + ((Math.log10(f) - 2) / 7) * pw;
    const Y = (z: number) => m.t + ((y1 - Math.log10(z)) / (y1 - y0)) * ph;

    g.lineWidth = 1;
    g.setLineDash([]);
    g.strokeStyle = GRID;
    for (let e = 2; e <= 9; e++) {
      const x = Math.round(X(10 ** e)) + 0.5;
      g.beginPath(); g.moveTo(x, m.t); g.lineTo(x, m.t + ph); g.stroke();
    }
    for (let e = y0; e <= y1; e++) {
      const y = Math.round(Y(10 ** e)) + 0.5;
      g.beginPath(); g.moveTo(m.l, y); g.lineTo(m.l + pw, y); g.stroke();
    }
    g.strokeStyle = "#cbd5e1";
    g.strokeRect(m.l + 0.5, m.t + 0.5, pw, ph);

    g.fillStyle = MUTED;
    g.font = '10px ui-monospace, "IBM Plex Mono", monospace';
    g.textAlign = "center";
    g.textBaseline = "top";
    for (let e = 2; e <= 9; e++) g.fillText(F_LABEL[e], X(10 ** e), m.t + ph + 9);
    g.textAlign = "right";
    g.textBaseline = "middle";
    const step = y1 - y0 > 8 ? 2 : 1;
    for (let e = y0; e <= y1; e += step) {
      const label = e < 0 ? `${(10 ** (e + 3)).toPrecision(3).replace(/\.?0+$/, "")} mΩ`
                          : `${(10 ** e).toLocaleString("en")} Ω`;
      g.fillText(label, m.l - 9, Y(10 ** e));
    }
    g.textAlign = "center";
    g.textBaseline = "bottom";
    g.font = '11px ui-sans-serif, system-ui, sans-serif';
    g.fillText("Frequency (Hz)", m.l + pw / 2, H - 5);
    g.save();
    g.translate(14, m.t + ph / 2);
    g.rotate(-Math.PI / 2);
    g.textBaseline = "top";
    g.fillText("|Z| (Ω)", 0, 0);
    g.restore();

    g.save();
    g.beginPath();
    g.rect(m.l, m.t, pw, ph);
    g.clip();
    g.lineJoin = "round";
    g.lineCap = "round";
    [...series].reverse().forEach((s) => {
      g.strokeStyle = s.color;
      g.lineWidth = s.width;
      g.setLineDash(s.dash);
      g.beginPath();
      let started = false;
      for (let i = 0; i < data.freq.length; i++) {
        const v = s.data[i];
        if (!(v > 0) || !Number.isFinite(v)) continue;
        const x = X(data.freq[i]);
        const y = Y(v);
        if (started) g.lineTo(x, y);
        else { g.moveTo(x, y); started = true; }
      }
      g.stroke();
    });
    g.setLineDash([]);

    if (hover >= 0 && hover < data.freq.length) {
      const x = Math.round(X(data.freq[hover])) + 0.5;
      g.strokeStyle = MUTED;
      g.lineWidth = 1;
      g.setLineDash([3, 3]);
      g.beginPath(); g.moveTo(x, m.t); g.lineTo(x, m.t + ph); g.stroke();
      g.setLineDash([]);
      series.forEach((s) => {
        const v = s.data[hover];
        if (!(v > 0) || !Number.isFinite(v)) return;
        g.beginPath();
        g.arc(X(data.freq[hover]), Y(v), 4, 0, 2 * Math.PI);
        g.fillStyle = s.color;
        g.fill();
        g.strokeStyle = "#ffffff";
        g.lineWidth = 2;
        g.stroke();
      });
    }
    g.restore();
    geoRef.current = { left: m.l, width: pw };
  }, [data, series, hover, includeMount]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const box = canvasRef.current?.parentElement;
    if (!box) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(box);
    return () => ro.disconnect();
  }, [draw]);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const geo = geoRef.current;
    const cv = canvasRef.current;
    if (!geo || !cv) return;
    const px = e.clientX - cv.getBoundingClientRect().left;
    if (px < geo.left || px > geo.left + geo.width) { setHover(-1); return; }
    const frac = (px - geo.left) / geo.width;
    setHover(Math.max(0, Math.min(data.freq.length - 1, Math.round(frac * (data.freq.length - 1)))));
  };

  const patch = (i: number, field: keyof Row, value: number | string) =>
    setRows((prev) =>
      prev.map((r, k) => {
        if (k !== i) return r;
        if (field === "pkg") return { ...r, pkg: String(value), esl_nh: PKG[String(value)].esl };
        return { ...r, [field]: Number(value) || 0 };
      })
    );

  const extremaOn = useMemo(() => findExtrema(data.freq, data.total), [data]);
  const extremaOff = useMemo(() => findExtrema(data.freq, data.componentOnly), [data]);
  const peakRows = useMemo(() => {
    const list = extremaOn.map((p) => ({ cond: "실장 포함", ...p }));
    if (includeMount) extremaOff.forEach((p) => list.push({ cond: "부품만", ...p }));
    return list.sort((a, b) => a.f_hz - b.f_hz);
  }, [extremaOn, extremaOff, includeMount]);

  const minOn = Math.min(...data.total);
  const minOff = Math.min(...data.componentOnly);
  const antiOn = extremaOn.filter((p) => p.type === "anti");
  const antiOff = extremaOff.filter((p) => p.type === "anti");
  const topOn = antiOn.length ? Math.max(...antiOn.map((p) => p.z_ohm)) : null;
  const topOff = antiOff.length ? Math.max(...antiOff.map((p) => p.z_ohm)) : null;
  const mountPar = (() => {
    const inv = rows.reduce(
      (a, c) => a + Math.max(1, c.qty) / Math.max(1e-6, mountNh(c, structure)), 0);
    return inv > 0 ? 1 / inv : 0;
  })();

  const card = "rounded-lg border border-slate-200 bg-white p-4";
  const numInput =
    "w-full rounded-md border border-slate-300 px-2 py-1.5 text-right font-mono text-[12.5px] tabular-nums text-slate-900 focus:border-sky-500 focus:outline-none";

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      {/* ---------------- 입력 ---------------- */}
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-sky-300 bg-sky-50 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={includeMount}
              onChange={(e) => setIncludeMount(e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            <span className="text-sm font-bold text-slate-900">실장 인덕턴스 포함</span>
          </label>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            한쪽 pin은 VCC plane, 다른 pin은 GND plane으로 내려갑니다. 전류 루프가
            <b> 두 경로를 모두</b> 지나므로 양쪽 배선이 더해집니다.
          </p>
        </div>

        <div className={card}>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            Capacitor 파라미터
          </h2>
          <div className="mb-1 grid grid-cols-[1.1fr_1fr_1fr_0.7fr_26px] gap-1.5 px-0.5 text-center text-[10px] font-semibold text-slate-500">
            <span>C (µF)</span><span>ESR (mΩ)</span><span>ESL (nH)</span><span>개수</span><span />
          </div>

          {rows.map((r, i) => {
            const lm = mountNh(r, structure);
            return (
              <div key={i} className="mb-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SERIES[i % SERIES.length] }} />
                  <span className="flex-1 text-xs font-bold text-slate-800">Cap {i + 1}</span>
                  <select
                    value={r.pkg}
                    onChange={(e) => patch(i, "pkg", e.target.value)}
                    aria-label={`Cap ${i + 1} 패키지`}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11.5px] text-slate-800"
                  >
                    {Object.keys(PKG).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-[1.1fr_1fr_1fr_0.7fr_26px] items-center gap-1.5">
                  <input className={numInput} type="number" step="any" min={0} value={r.c_uf} aria-label="C"
                    onChange={(e) => patch(i, "c_uf", e.target.value)} />
                  <input className={numInput} type="number" step="any" min={0} value={r.esr_mohm} aria-label="ESR"
                    onChange={(e) => patch(i, "esr_mohm", e.target.value)} />
                  <input className={numInput} type="number" step="any" min={0} value={r.esl_nh} aria-label="ESL"
                    onChange={(e) => patch(i, "esl_nh", e.target.value)} />
                  <input className={numInput} type="number" step={1} min={1} value={r.qty} aria-label="개수"
                    onChange={(e) => patch(i, "qty", Math.max(1, Math.round(Number(e.target.value) || 1)))} />
                  <button
                    type="button"
                    aria-label={`Cap ${i + 1} 삭제`}
                    onClick={() => rows.length > 1 && setRows(rows.filter((_, k) => k !== i))}
                    className="h-7 rounded-md border border-slate-300 text-slate-400 hover:border-red-400 hover:text-red-500"
                  >×</button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-0.5">
                    <span className="whitespace-nowrap text-[10px] font-bold" style={{ color: CU }}>VCC 배선</span>
                    <input type="number" step={0.1} min={0} value={r.len_vcc_mm} aria-label="VCC 배선 길이 mm"
                      onChange={(e) => patch(i, "len_vcc_mm", e.target.value)}
                      className="w-full border-none bg-transparent py-1 text-right font-mono text-[12.5px] tabular-nums focus:outline-none" />
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-0.5">
                    <span className="whitespace-nowrap text-[10px] font-bold" style={{ color: GND }}>GND 배선</span>
                    <input type="number" step={0.1} min={0} value={r.len_gnd_mm} aria-label="GND 배선 길이 mm"
                      onChange={(e) => patch(i, "len_gnd_mm", e.target.value)}
                      className="w-full border-none bg-transparent py-1 text-right font-mono text-[12.5px] tabular-nums focus:outline-none" />
                  </label>
                </div>

                <CapCrossSection row={r} color={SERIES[i % SERIES.length]} />

                <div className="mt-1.5 flex justify-between text-[11px] text-slate-600">
                  <span>실장 L (1개) · VCC+GND 경로</span>
                  <b className="font-mono text-slate-900">{lm.toFixed(3)} nH</b>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>ESL + 실장 L, {r.qty}개 병렬</span>
                  <b className="font-mono text-slate-900">
                    {((r.esl_nh + lm) / Math.max(1, r.qty)).toFixed(3)} nH
                  </b>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setRows([...rows, { pkg: "0603", c_uf: 1, esr_mohm: 20, esl_nh: 0.8, qty: 1, len_vcc_mm: 1, len_gnd_mm: 1 }])}
            className="w-full rounded-md border border-dashed border-sky-400 bg-white py-2 text-[12.5px] font-bold text-sky-700 hover:bg-sky-50"
          >
            + Capacitor 추가
          </button>

          <details className="mt-3 border-t border-slate-200 pt-3">
            <summary className="cursor-pointer text-[11.5px] font-medium text-slate-600">
              실장 구조 고급 설정
            </summary>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {([
                ["w_mm", "배선 폭 w"], ["h_mm", "plane 간격 h"],
                ["t_mm", "via 길이 t"], ["d_mm", "via 지름 d"],
              ] as const).map(([k, label]) => (
                <div key={k}>
                  <label htmlFor={`st-${k}`} className="mb-1 block text-[10px] text-slate-500">{label}</label>
                  <input id={`st-${k}`} type="number" step={0.05} min={0.02} value={structure[k]}
                    className={numInput}
                    onChange={(e) => setStructure({ ...structure, [k]: Number(e.target.value) || structure[k] })} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] text-slate-600">
              배선 계수 <b className="font-mono" style={{ color: CU }}>{traceNhPerMm(structure).toFixed(3)}</b> nH/mm ·
              via 2개 <b className="font-mono" style={{ color: CU }}>{(2 * viaNh(structure)).toFixed(3)}</b> nH
              <br />
              <span className="text-slate-400">
                L_mnt = (µ₀·h/w)·(len_VCC + len_GND) + 2·L_via,&nbsp; L_via = (µ₀/2π)·t·[ln(4t/d)+1]
              </span>
            </p>
          </details>
        </div>
      </div>

      {/* ---------------- 결과 ---------------- */}
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <Tile label="최저 |Z|" value={formatZ(minOn)}
            note={!includeMount ? "실장 인덕턴스 미포함"
              : minOn / minOff < 1.05 ? "ESR이 결정 — 실장 L 영향 없음"
              : `부품만 ${formatZ(minOff)} · ${(minOn / minOff).toFixed(1)}배`} />
          <Tile label="반공진 peak" value={topOn != null ? formatZ(topOn) : "없음"}
            note={includeMount && topOn != null && topOff != null
              ? `부품만 ${formatZ(topOff)} · ${(topOn / topOff).toFixed(1)}배`
              : "반공진 최대 peak"} />
          <Tile label="실장 L 합계 (병렬)" value={includeMount ? `${mountPar.toFixed(3)} nH` : "— nH"}
            note={includeMount ? "전체 병렬 합성 · 부품 ESL과 별개" : "토글을 켜면 계산됩니다"} />
        </div>

        <div className={card}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              합성 임피던스 |Z|
            </h2>
            <span className="font-mono text-[11px] text-slate-500">
              {hover >= 0
                ? `${formatFreq(data.freq[hover])} · ${series.slice(0, includeMount ? 2 : 1).map((s) => formatZ(s.data[hover])).join(" / ")}`
                : "곡선에 커서를 올리면 값을 읽습니다"}
            </span>
          </div>
          <div className="relative h-[430px] w-full">
            <canvas ref={canvasRef} onMouseMove={onMove} onMouseLeave={() => setHover(-1)}
              className="block h-full w-full cursor-crosshair" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-slate-600">
            {series.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5">
                <i className="inline-block h-0 w-4"
                  style={{ borderTop: `2.5px ${s.dash.length ? "dashed" : "solid"} ${s.color}` }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            공진(SRF) · 반공진 주파수
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[12.5px]">
              <thead>
                <tr className="text-[10.5px] uppercase tracking-wide text-slate-500">
                  <th className="border-b border-slate-200 px-2 py-2 text-left">조건</th>
                  <th className="border-b border-slate-200 px-2 py-2 text-left">유형</th>
                  <th className="border-b border-slate-200 px-2 py-2 text-right">주파수</th>
                  <th className="border-b border-slate-200 px-2 py-2 text-right">|Z|</th>
                </tr>
              </thead>
              <tbody>
                {peakRows.length === 0 ? (
                  <tr><td colSpan={4} className="px-2 py-3 text-slate-400">극점이 없습니다.</td></tr>
                ) : peakRows.map((p, i) => (
                  <tr key={i}>
                    <td className={`border-b border-slate-100 px-2 py-2 ${p.cond === "부품만" ? "text-slate-400" : "text-slate-900"}`}>
                      {p.cond}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                        p.type === "srf" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {p.type === "srf" ? "SRF 공진" : "반공진"}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 text-right font-mono tabular-nums">{formatFreq(p.f_hz)}</td>
                    <td className="border-b border-slate-100 px-2 py-2 text-right font-mono tabular-nums">{formatZ(p.z_ohm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
            개수 n은 <code className="font-mono">C×n, ESR/n, ESL/n, L_mnt/n</code>로 병렬 반영됩니다.
            실장 경로는 <code className="font-mono">VCC 패드 → 배선 → via → VCC plane</code>과{" "}
            <code className="font-mono">GND 패드 → 배선 → via → GND plane</code>이 직렬로 루프를 이룹니다.
            IC까지의 공통 경로는 포함하지 않습니다 — 부품과 실장 구간만 다루는 교육용 모델입니다.
            같은 계산을 Claude에서 쓰려면 MCP 도구 <code className="font-mono">decap_composite_z</code>를 호출하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.07em] text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-[23px] font-semibold tabular-nums text-slate-900">{value}</div>
      <div className="mt-0.5 text-[11.5px] text-slate-600">{note}</div>
    </div>
  );
}

/** 단면도용 치수선 */
function Dim({ x1, x2, y, text, c }: { x1: number; x2: number; y: number; text: string; c: string }) {
  return (
    <g opacity={0.75}>
      <path
        d={`M${x1},${y} L${x2},${y} M${x1},${y - 4} L${x1},${y + 4} M${x2},${y - 4} L${x2},${y + 4}`}
        stroke={c} strokeWidth={1} fill="none"
      />
      <text x={(x1 + x2) / 2} y={y - 6} fill={c} fontSize={9} textAnchor="middle" fontFamily="ui-monospace, monospace">
        {text}
      </text>
    </g>
  );
}

/** 패키지 크기와 양쪽 배선 길이를 실축 비율(15px = 1mm)로 그린 단면도 */
function CapCrossSection({ row, color }: { row: Row; color: string }) {
  const PX = 15;
  const p = PKG[row.pkg];
  const bodyW = p.l * PX;
  const padW = 10;
  const tV = Math.max(10, row.len_vcc_mm * PX);
  const tG = Math.max(10, row.len_gnd_mm * PX);
  const viaV = 20;
  const bodyX = viaV + tV + padW;
  const viaG = bodyX + bodyW + padW + tG;
  const W = Math.max(300, viaG + 34);
  const traceY = 44;
  const gndY = 78;
  const vccY = 98;

  return (
    <svg viewBox={`0 0 ${W} 114`} className="mt-2 block h-auto w-full" role="img"
      aria-label={`${row.pkg} 패키지, VCC 배선 ${row.len_vcc_mm} mm, GND 배선 ${row.len_gnd_mm} mm 단면`}>
      <text x={2} y={11} fill={MUTED} fontSize={9} fontFamily="ui-monospace, monospace">
        {row.pkg} · {p.l}×{p.w} mm
      </text>

      <rect x={0} y={gndY} width={W} height={4} fill={GND} />
      <text x={W - 2} y={gndY - 3} fill={GND} fontSize={9} textAnchor="end" fontFamily="ui-monospace, monospace">GND plane</text>
      <rect x={0} y={vccY} width={W} height={4} fill={CU} />
      <text x={W - 2} y={vccY - 3} fill={CU} fontSize={9} textAnchor="end" fontFamily="ui-monospace, monospace">VCC plane</text>

      <rect x={bodyX} y={traceY - 17} width={bodyW} height={17} rx={1.5} fill={color} />
      <rect x={bodyX - 5} y={traceY - 17} width={5} height={17} fill={CU} />
      <rect x={bodyX + bodyW} y={traceY - 17} width={5} height={17} fill={GND} />
      <text x={bodyX - 7} y={traceY - 20} fill={CU} fontSize={9} textAnchor="end" fontWeight={600} fontFamily="ui-monospace, monospace">VCC</text>
      <text x={bodyX + bodyW + 7} y={traceY - 20} fill={GND} fontSize={9} fontWeight={600} fontFamily="ui-monospace, monospace">GND</text>

      <rect x={viaV} y={traceY} width={bodyX - viaV} height={4} fill={CU} />
      <rect x={bodyX + bodyW} y={traceY} width={viaG - bodyX - bodyW + 4} height={4} fill={GND} />

      <rect x={viaV} y={traceY} width={4} height={vccY - traceY + 4} fill={CU} />
      <rect x={viaV - 6} y={gndY - 1} width={16} height={6} fill="#f8fafc" />
      <rect x={viaV} y={gndY - 1} width={4} height={6} fill={CU} />
      <circle cx={viaV + 2} cy={vccY + 2} r={4} fill="#ffffff" stroke={CU} strokeWidth={1.5} />

      <rect x={viaG} y={traceY} width={4} height={gndY - traceY + 4} fill={GND} />
      <circle cx={viaG + 2} cy={gndY + 2} r={4} fill="#ffffff" stroke={GND} strokeWidth={1.5} />

      <Dim x1={viaV + 2} x2={bodyX - 5} y={traceY + 20} text={`${row.len_vcc_mm} mm`} c={CU} />
      <Dim x1={bodyX + bodyW + 5} x2={viaG + 2} y={traceY + 20} text={`${row.len_gnd_mm} mm`} c={GND} />
    </svg>
  );
}
