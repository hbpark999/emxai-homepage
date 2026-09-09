"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Prediction = { frequency_hz: number[]; zcm_ohm: number[]; zdm_ohm: number[]; version: string };
const families = ["16 / 28 / 6", "16 / 28 / 12", "20 / 32 / 8", "24 / 40 / 6", "24 / 40 / 12"];
export default function CmcDemo() {
  const [design, setDesign] = useState({ turns: 8, family: 2, wire: 0.8, pitch: 3 });
  const [data, setData] = useState<Prediction | null>(null);
  const [message, setMessage] = useState("입력을 선택하고 특성 예측을 실행하세요.");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("prediction");
  async function predict() {
    setBusy(true); setMessage("특성을 계산하고 있습니다."); setData(null);
    try {
      const response = await fetch("/api/cmc/predict", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(design) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setData(result); setMessage(`예측 완료 · ${result.version}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "예측 실패"); }
    finally { setBusy(false); }
  }
  function curve(values: number[]) {
    if (!data) return "";
    return values.map((v, i) => `${65 + Math.log10(data.frequency_hz[i] / 150000) / Math.log10(200) * 660},${285 - Math.log10(Math.max(v, 0.1) / 0.1) / 7 * 250}`).join(" ");
  }
  return <main className="min-h-screen bg-slate-100 px-5 py-12 text-slate-800">
    <div className="mx-auto max-w-6xl space-y-6">
      <Link href="/solution" className="text-sm text-blue-700">← Solutions</Link>
      <header className="rounded-2xl bg-[#14283f] p-8 text-white">
        <p className="text-sm tracking-widest text-blue-200">EMxAI · ENGINEERING DEMO</p>
        <h1 className="mt-3 text-3xl font-bold">CE-CMF-Filter-PCB Sim</h1>
        <p className="mt-3 text-slate-200">CMC 특성 예측 · 대표 SPICE · PCB와 LISN 교육 예제</p>
        <p className="mt-5 text-sm text-blue-200">80-case-2026-09-09 / GPR + PCA8 / 150 kHz–30 MHz</p>
      </header>
      <div className="flex gap-3" role="tablist" aria-label="기능 선택">
        {[['prediction','특성 예측'],['spice','SPICE 모델']].map(([key,label])=><button key={key} role="tab" aria-selected={tab===key} onClick={()=>setTab(key)} className={`rounded-lg px-7 py-3 font-semibold text-white ${tab===key?'bg-blue-700':'bg-blue-500'}`}>{label}</button>)}
      </div>
      {tab==='prediction' ? <section className="rounded-2xl bg-white p-7 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-4">
          <label>권선 수<input className="mt-2 w-full rounded border p-2" type="number" min={6} max={12} step={1} value={design.turns} onChange={e=>{setDesign({...design,turns:Number(e.target.value)});setData(null);}}/></label>
          <label>코어 ID / OD / H (mm)<select className="mt-2 w-full rounded border p-2" value={design.family} onChange={e=>{setDesign({...design,family:Number(e.target.value)});setData(null);}}>{families.map((f,i)=><option value={i} key={f}>{f}</option>)}</select></label>
          <label>선경 (mm)<input className="mt-2 w-full rounded border p-2" type="number" min={.5} max={1.1} step={.1} value={design.wire} onChange={e=>{setDesign({...design,wire:Number(e.target.value)});setData(null);}}/></label>
          <label>피치 (°)<input className="mt-2 w-full rounded border p-2" type="number" min={2.1} max={5} step={.1} value={design.pitch} onChange={e=>{setDesign({...design,pitch:Number(e.target.value)});setData(null);}}/></label>
        </div>
        <button disabled={busy} onClick={predict} className="mt-6 rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white disabled:opacity-50">{busy?'계산 중…':'특성 예측'}</button>
        <p role="status" className="mt-4 text-sm">{message}</p>
        {data && <svg viewBox="0 0 780 335" role="img" aria-label="주파수별 CM 및 DM 임피던스" className="mt-6 w-full">
          {[.1,1,10,100,1000,10000,100000,1000000].map(v=><g key={v}><line x1="65" x2="725" y1={285-Math.log10(v/.1)/7*250} y2={285-Math.log10(v/.1)/7*250} stroke="#e2e8f0"/><text x="58" y={289-Math.log10(v/.1)/7*250} textAnchor="end" fontSize="11">{v}</text></g>)}
          <polyline fill="none" stroke="#087f8c" strokeWidth="2.5" points={curve(data.zcm_ohm)}/><polyline fill="none" stroke="#d48328" strokeWidth="2.5" points={curve(data.zdm_ohm)}/>
          <text x="65" y="307" fontSize="12">150 kHz</text><text x="680" y="307" fontSize="12">30 MHz</text><text x="65" y="20" fontSize="12">|Z| (Ω), log scale</text><text x="525" y="20" fill="#087f8c">CM</text><text x="590" y="20" fill="#d48328">DM</text>
        </svg>}
        <p className="mt-6 text-sm leading-6 text-slate-500">HFSS 기반 크기 예측이며 위상·임의 형상의 SPICE 생성을 의미하지 않습니다. 정적 ferrite 가정, DC bias 0 / 25°C. 요청 피치가 HFSS에서 자동 보정된 학습 사례가 포함돼 있습니다.</p>
      </section> : <section className="rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold">검증된 대표 CMC-01</h2>
        <p className="mt-3">8 turns × 2 · ID/OD/H 20/32/8 mm · 선경 0.8 mm · 피치 3°</p>
        <p className="mt-3 text-sm text-slate-600">수동성 검사 및 LTspice 4포트 재현 확인. 검사 지점에서 CM 크기 차이 최대 1.814%, DM 0.058%. 150 kHz–29.63 MHz.</p>
        <a href="/ce-cmf/cmc-01.lib" download className="mt-5 inline-block rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white">대표 SPICE 다운로드</a>
        <p className="mt-3 text-sm text-slate-500">위 자유 입력과 별개인 대표 모델입니다. 브라우저에서 LTspice를 실행하지 않습니다.</p>
        <div className="mt-6 flex flex-wrap gap-4">{['PCB + CMC','PCB + CMC + X','PCB + CMC + X/Y'].map((label,i)=><a className="rounded border border-blue-200 px-4 py-2 text-blue-700" href={`/ce-cmf/pcb_filter_${i+1}.cir`} download key={label}>{label} 예제</a>)}</div>
        <p className="mt-3 text-sm text-slate-500">예제 파일은 데스크톱 편집기용 RLC 회로 조각입니다. CMC·LISN·소스는 데스크톱 앱이 연결합니다.</p>
        <Image src="/ce-cmf/schematic.png" alt="L/N 선로, CMC, X/Y 커패시터와 LISN 회로" width={1690} height={949} className="mt-8 h-auto w-full"/>
      </section>}
      <p className="text-sm leading-6 text-slate-500">교육·데모용 모델입니다. 실측 검증 및 CE 인증 결과가 아닙니다. 후속 8–12건 해석·재학습·평가가 필요합니다.</p>
    </div>
  </main>;
}
