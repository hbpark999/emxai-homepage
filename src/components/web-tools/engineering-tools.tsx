"use client";

import { useMemo, useState } from "react";

type SParamPoint = {
  frequency: number;
  s11: number;
  s21: number;
};

function microstripZ0(widthMm: number, heightMm: number, copperMm: number, dk: number) {
  const wEff = widthMm + copperMm / Math.PI;
  const ratio = wEff / heightMm;
  const eEff =
    (dk + 1) / 2 +
    ((dk - 1) / 2) * (1 / Math.sqrt(1 + 12 / Math.max(ratio, 0.001)));

  if (ratio <= 1) {
    return (60 / Math.sqrt(eEff)) * Math.log(8 / ratio + ratio / 4);
  }

  return (
    (120 * Math.PI) /
    (Math.sqrt(eEff) * (ratio + 1.393 + 0.667 * Math.log(ratio + 1.444)))
  );
}

function parseS2P(content: string): SParamPoint[] {
  let scale = 1;
  let format = "MA";

  return content
    .split(/\r?\n/)
    .flatMap((rawLine) => {
      const line = rawLine.split("!")[0].trim();
      if (!line) return [];

      if (line.startsWith("#")) {
        const tokens = line.slice(1).trim().split(/\s+/);
        const unit = tokens[0]?.toUpperCase();
        scale = unit === "GHZ" ? 1e9 : unit === "MHZ" ? 1e6 : unit === "KHZ" ? 1e3 : 1;
        format = tokens.find((token) => ["MA", "DB", "RI"].includes(token.toUpperCase())) ?? "MA";
        return [];
      }

      const values = line.split(/\s+/).map(Number).filter(Number.isFinite);
      if (values.length < 9) return [];

      const toDb = (a: number, b: number) => {
        if (format.toUpperCase() === "DB") return a;
        if (format.toUpperCase() === "RI") return 20 * Math.log10(Math.max(Math.hypot(a, b), 1e-12));
        return 20 * Math.log10(Math.max(Math.abs(a), 1e-12));
      };

      return [
        {
          frequency: values[0] * scale,
          s11: toDb(values[1], values[2]),
          s21: toDb(values[3], values[4]),
        },
      ];
    });
}

function plotLine(points: SParamPoint[], key: "s11" | "s21") {
  if (!points.length) return "";

  const width = 330;
  const height = 100;
  const left = 24;
  const top = 18;
  const frequencies = points.map((point) => point.frequency);
  const values = points.flatMap((point) => [point.s11, point.s21]);
  const minX = Math.min(...frequencies);
  const maxX = Math.max(...frequencies);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const pad = Math.max((maxY - minY) * 0.12, 1);

  return points
    .map((point) => {
      const x = maxX === minX ? left + width / 2 : left + ((point.frequency - minX) / (maxX - minX)) * width;
      const y = top + ((maxY + pad - point[key]) / (maxY - minY + pad * 2)) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function EngineeringTools() {
  const [widthMm, setWidthMm] = useState(0.3);
  const [heightMm, setHeightMm] = useState(0.18);
  const [copperMm, setCopperMm] = useState(0.035);
  const [dk, setDk] = useState(4.2);
  const [points, setPoints] = useState<SParamPoint[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const z0 = microstripZ0(widthMm, heightMm, copperMm, dk);
  const eEff = useMemo(() => {
    const ratio = widthMm / heightMm;
    return (dk + 1) / 2 + ((dk - 1) / 2) * (1 / Math.sqrt(1 + 12 / Math.max(ratio, 0.001)));
  }, [dk, heightMm, widthMm]);

  async function handleFile(file?: File) {
    if (!file) return;
    const parsed = parseS2P(await file.text());

    if (!parsed.length) {
      setError("Touchstone 2-port 데이터 행을 찾지 못했습니다.");
      return;
    }

    setFileName(file.name);
    setPoints(parsed);
    setError("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
          Calculator
        </p>
        <h2 className="mt-3 text-2xl font-medium text-slate-950">Microstrip Z0 Calculator</h2>
        <div className="mt-6 grid gap-4 text-sm text-slate-600">
          {[
            ["Trace Width W (mm)", widthMm, setWidthMm, 0.05, 2],
            ["Substrate Height H (mm)", heightMm, setHeightMm, 0.05, 1.6],
            ["Copper Thickness T (mm)", copperMm, setCopperMm, 0.005, 0.105],
            ["Dielectric Constant Dk", dk, setDk, 2.5, 5.5],
          ].map(([label, value, setter, min, max]) => (
            <label key={label as string} className="grid gap-2">
              <span>{label as string}</span>
              <input
                type="number"
                step="0.005"
                min={min as number}
                max={max as number}
                value={value as number}
                onChange={(event) => (setter as (next: number) => void)(Number(event.target.value))}
                className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-5 text-sm sm:grid-cols-2">
          <p>
            <span className="block text-slate-500">Z0</span>
            <span className="text-2xl font-semibold text-slate-950">{z0.toFixed(2)} Ω</span>
          </p>
          <p>
            <span className="block text-slate-500">Effective Dk</span>
            <span className="text-2xl font-semibold text-slate-950">{eEff.toFixed(3)}</span>
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
          Viewer
        </p>
        <h2 className="mt-3 text-2xl font-medium text-slate-950">S-Parameter Plot Viewer</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          `.s2p` 또는 Touchstone 텍스트 파일을 불러와 S11/S21 magnitude를 dB로 확인합니다.
        </p>
        <label className="mt-5 inline-flex cursor-pointer rounded-md bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">
          파일 선택
          <input
            type="file"
            accept=".s2p,.txt,.dat"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>
        {fileName ? <p className="mt-3 text-sm text-slate-500">{fileName}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        <div className="mt-6 rounded-lg bg-slate-950 p-4">
          <svg viewBox="0 0 380 140" className="h-56 w-full">
            <line x1="24" y1="118" x2="360" y2="118" stroke="#475569" />
            <line x1="24" y1="18" x2="24" y2="118" stroke="#475569" />
            <polyline points={plotLine(points, "s11")} fill="none" stroke="#38bdf8" strokeWidth="3" />
            <polyline points={plotLine(points, "s21")} fill="none" stroke="#a3e635" strokeWidth="3" />
            <text x="28" y="135" fill="#94a3b8" fontSize="10">Frequency</text>
            <text x="280" y="24" fill="#38bdf8" fontSize="10">S11</text>
            <text x="322" y="24" fill="#a3e635" fontSize="10">S21</text>
          </svg>
        </div>
      </section>
    </div>
  );
}
