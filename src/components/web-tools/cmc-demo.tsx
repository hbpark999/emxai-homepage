"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Validation = {
  confirmation_holdout: { db_rmse: number; mean_relative_error_percent: number; p90_relative_error_percent: number };
  confirmation_holdout_fsv: { mean_adm: number; mean_fdm: number; mean_gdm: number; grade_counts: Record<string, number> };
};
type Surface = { turns: number[][]; pitch: number[][]; zcm_ohm: number[][] };
type Prediction = { frequency_hz: number[]; zcm_ohm: number[]; zdm_ohm: number[]; version: string; validation?: Validation; surface_1mhz?: Surface };

const families = [[16,28,6],[16,28,12],[20,32,8],[24,40,6],[24,40,12]];
const validation: Validation = {
  confirmation_holdout: { db_rmse: .866468, mean_relative_error_percent: 5.478876, p90_relative_error_percent: 21.431658 },
  confirmation_holdout_fsv: { mean_adm: .012644, mean_fdm: .013368, mean_gdm: .020953, grade_counts: { Excellent: 8 } },
};

function Geometry({ design }: { design: { turns: number; family: number; wire: number; pitch: number } }) {
  const [inner, outer, height] = families[design.family];
  const loops = Array.from({ length: Math.min(12, Math.max(6, design.turns)) });
  return <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 p-4">
    <div className="mb-2 flex items-center justify-between"><h3 className="font-bold">① 입력 기반 CMC 3D 형상</h3><span className="text-xs text-slate-500">개략 형상</span></div>
    <svg viewBox="0 0 520 330" className="w-full" role="img" aria-label="토로이드 코어와 두 권선의 3D 개략 형상">
      <defs><radialGradient id="core" cx="35%" cy="28%"><stop offset="0" stopColor="#64748b"/><stop offset=".62" stopColor="#27384b"/><stop offset="1" stopColor="#101d2c"/></radialGradient></defs>
      <ellipse cx="260" cy="170" rx="177" ry="105" fill="url(#core)" stroke="#0f172a" strokeWidth="4"/>
      <ellipse cx="260" cy="170" rx="76" ry="45" fill="#f1f5f9" stroke="#0f172a" strokeWidth="4"/>
      {loops.map((_,i) => { const a=(-145+i*20)*Math.PI/180; const x=260+130*Math.cos(a), y=170+78*Math.sin(a); return <path key={`l${i}`} d={`M ${x-24} ${y-60} Q ${x-42} ${y} ${x-20} ${y+62}`} fill="none" stroke="#d96f32" strokeWidth={7+design.wire*2} strokeLinecap="round" opacity=".95"/>; })}
      {loops.map((_,i) => { const a=(35+i*20)*Math.PI/180; const x=260+130*Math.cos(a), y=170+78*Math.sin(a); return <path key={`n${i}`} d={`M ${x+20} ${y-60} Q ${x+42} ${y} ${x+24} ${y+62}`} fill="none" stroke="#e6ad42" strokeWidth={7+design.wire*2} strokeLinecap="round" opacity=".95"/>; })}
      <text x="20" y="300" fontSize="13" fill="#475569">ID {inner} · OD {outer} · H {height} mm / {design.turns} turns × 2 / wire {design.wire} mm / pitch {design.pitch}°</text>
    </svg>
    <p className="text-xs leading-5 text-slate-500">입력 치수 기반 교육용 미리보기이며 실제 CAD, 리드선, 절연 상세 및 HFSS 자동 보정 형상과 다를 수 있습니다.</p>
  </div>;
}

function PredictionChart({ data }: { data: Prediction }) {
  const p90=(data.validation ?? validation).confirmation_holdout.p90_relative_error_percent/100;
  const point=(v:number,i:number) => `${65+Math.log10(data.frequency_hz[i]/150000)/Math.log10(200)*660},${285-Math.log10(Math.max(v,.1)/.1)/7*250}`;
  const curve=(values:number[]) => values.map(point).join(" ");
  const band=(values:number[]) => [...values.map((v,i)=>point(v/(1+p90),i)),...values.map((v,i)=>point(v/(1-p90),i)).reverse()].join(" ");
  return <div className="rounded-xl border border-slate-200 bg-white p-4">
    <h3 className="font-bold">② CM/DM 예측과 검증 오차 참고 범위</h3>
    <svg viewBox="0 0 780 335" role="img" aria-label="주파수별 CM 및 DM 임피던스와 P90 참고 범위" className="mt-3 w-full">
      {[.1,1,10,100,1000,10000,100000,1000000].map(v=><g key={v}><line x1="65" x2="725" y1={285-Math.log10(v/.1)/7*250} y2={285-Math.log10(v/.1)/7*250} stroke="#e2e8f0"/><text x="58" y={289-Math.log10(v/.1)/7*250} textAnchor="end" fontSize="11">{v}</text></g>)}
      <polygon points={band(data.zcm_ohm)} fill="#087f8c" opacity=".13"/><polygon points={band(data.zdm_ohm)} fill="#d48328" opacity=".13"/>
      <polyline fill="none" stroke="#087f8c" strokeWidth="2.5" points={curve(data.zcm_ohm)}/><polyline fill="none" stroke="#d48328" strokeWidth="2.5" points={curve(data.zdm_ohm)}/>
      <text x="65" y="307" fontSize="12">150 kHz</text><text x="680" y="307" fontSize="12">30 MHz</text><text x="65" y="20" fontSize="12">|Z| (Ω), log scale</text><text x="520" y="20" fill="#087f8c">CM</text><text x="575" y="20" fill="#d48328">DM</text><text x="625" y="20" fill="#64748b">P90 ({(p90*100).toFixed(2)}%)</text>
    </svg>
    <p className="text-xs text-slate-500">음영은 신규 확인군 4건의 P90 상대오차를 적용한 참고 범위이며 현재 설계의 신뢰구간이나 정확도 보장이 아닙니다.</p>
  </div>;
}

function KeyValues({ data }: { data: Prediction }) {
  const indices=[0,Math.round(data.frequency_hz.length*.36),Math.round(data.frequency_hz.length*.72),data.frequency_hz.length-1];
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-bold">③ 주요 주파수 결과</h3><div className="mt-3 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">주파수</th><th>|ZCM|</th><th>|ZDM|</th></tr></thead><tbody>{indices.map(i=><tr className="border-b border-slate-100" key={i}><td className="py-2">{data.frequency_hz[i]>=1e6?`${(data.frequency_hz[i]/1e6).toFixed(2)} MHz`:`${(data.frequency_hz[i]/1e3).toFixed(0)} kHz`}</td><td>{data.zcm_ohm[i].toPrecision(4)} Ω</td><td>{data.zdm_ohm[i].toPrecision(4)} Ω</td></tr>)}</tbody></table></div></div>;
}

function ValidationPanel({ data }: { data: Prediction }) {
  const v=data.validation ?? validation, f=v.confirmation_holdout_fsv;
  const cells=data.surface_1mhz?.zcm_ohm.flat() ?? [], low=Math.min(...cells), high=Math.max(...cells);
  return <div className="rounded-xl border border-slate-200 bg-sky-50 p-4"><h3 className="font-bold">④ 모델 검증 · FSV · 1 MHz 응답표면</h3><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["RMSE",`${v.confirmation_holdout.db_rmse.toFixed(3)} dB`],["평균 상대오차",`${v.confirmation_holdout.mean_relative_error_percent.toFixed(2)}%`],["P90",`(${v.confirmation_holdout.p90_relative_error_percent.toFixed(2)}%)`],["FSV GDM",f.mean_gdm.toFixed(4)]].map(([a,b])=><div key={a} className="rounded-lg bg-white p-3"><p className="text-xs text-slate-500">{a}</p><p className="mt-1 font-bold">{b}</p></div>)}</div><p className="mt-3 text-xs leading-5 text-slate-600">FSV: ADM {f.mean_adm.toFixed(4)} · FDM {f.mean_fdm.toFixed(4)} · GDM {f.mean_gdm.toFixed(4)} · Excellent {f.grade_counts.Excellent ?? 0}/8. 신규 확인군 4건, CM/DM 8개 응답 기준입니다.</p>{data.surface_1mhz&&<div className="mt-4"><p className="mb-2 text-xs font-bold text-slate-600">권선 수 × 피치 변화에 따른 |ZCM| 응답표면</p><div className="grid grid-cols-7 gap-px overflow-hidden rounded bg-white p-1">{cells.map((z,i)=>{const t=(Math.log(z)-Math.log(low))/(Math.log(high)-Math.log(low)||1);return <div key={i} title={`${z.toFixed(1)} Ω`} className="aspect-square" style={{backgroundColor:`hsl(${220-170*t} 72% ${72-25*t}%)`}}/>})}</div><div className="mt-1 flex justify-between text-[10px] text-slate-500"><span>낮은 |ZCM|</span><span>높은 |ZCM|</span></div></div>}</div>;
}

export default function CmcDemo() {
  const [design,setDesign]=useState({turns:8,family:2,wire:.8,pitch:3});
  const [data,setData]=useState<Prediction|null>(null),[message,setMessage]=useState("입력을 선택하고 특성 예측을 실행하세요."),[busy,setBusy]=useState(false),[tab,setTab]=useState("prediction");
  const familyLabels=useMemo(()=>families.map(f=>f.join(" / ")),[]);
  async function predict(){setBusy(true);setMessage("특성을 계산하고 있습니다.");setData(null);try{const r=await fetch("/api/cmc/predict",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(design)}),x=await r.json();if(!r.ok)throw new Error(x.error);setData(x);setMessage(`예측 완료 · ${x.version}`)}catch(e){setMessage(e instanceof Error?e.message:"예측 실패")}finally{setBusy(false)}}
  return <main className="min-h-screen bg-slate-100 px-5 py-12 text-slate-800"><div className="mx-auto max-w-6xl space-y-6"><Link href="/solution" className="text-sm text-blue-700">← Solutions</Link><header className="rounded-2xl bg-[#14283f] p-8 text-white"><p className="text-sm tracking-widest text-blue-200">EMxAI · ENGINEERING DEMO</p><h1 className="mt-3 text-3xl font-bold">CE-CMF-Filter-PCB Sim</h1><p className="mt-3 text-slate-200">CMC 형상 · 특성 예측 · 검증 결과 · 대표 SPICE</p><p className="mt-5 text-sm text-blue-200">80-case-2026-09-09 / GPR + PCA8 / 150 kHz–30 MHz</p></header>
    <div className="flex gap-3" role="tablist">{[["prediction","특성 예측"],["spice","SPICE 모델"]].map(([k,l])=><button key={k} role="tab" aria-selected={tab===k} onClick={()=>setTab(k)} className={`rounded-lg px-7 py-3 font-semibold text-white ${tab===k?"bg-blue-700":"bg-blue-500"}`}>{l}</button>)}</div>
    {tab==="prediction"?<section className="rounded-2xl bg-white p-7 shadow-sm"><div className="grid gap-4 sm:grid-cols-4"><label>권선 수<input className="mt-2 w-full rounded border p-2" type="number" min="6" max="12" value={design.turns} onChange={e=>setDesign({...design,turns:+e.target.value})}/></label><label>코어 ID / OD / H (mm)<select className="mt-2 w-full rounded border p-2" value={design.family} onChange={e=>setDesign({...design,family:+e.target.value})}>{familyLabels.map((f,i)=><option value={i} key={f}>{f}</option>)}</select></label><label>선경 (mm)<input className="mt-2 w-full rounded border p-2" type="number" min=".5" max="1.1" step=".1" value={design.wire} onChange={e=>setDesign({...design,wire:+e.target.value})}/></label><label>피치 (°)<input className="mt-2 w-full rounded border p-2" type="number" min="2.1" max="5" step=".1" value={design.pitch} onChange={e=>setDesign({...design,pitch:+e.target.value})}/></label></div>
      <div className="mt-6"><button disabled={busy} onClick={predict} className="rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white disabled:opacity-50">{busy?"계산 중…":"특성 예측"}</button></div><p role="status" className="mt-4 text-sm">{message}</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2"><Geometry design={design}/>{data?<PredictionChart data={data}/>:<div className="grid place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">예측을 실행하면 CM/DM 곡선과 P90 참고 범위가 표시됩니다.</div>}{data&&<><KeyValues data={data}/><ValidationPanel data={data}/></>}</div>
      <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900">공개된 내용은 교육 참가자를 위한 내용으로 실무 사용 시에는 재료 입력, 주파수 확장, 편차 고려 등 추가 사항들이 있어 문의 후 사용이 필요합니다.</p></section>:<section className="rounded-2xl bg-white p-7 shadow-sm"><h2 className="text-xl font-bold">검증된 대표 CMC-01</h2><p className="mt-3">8 turns × 2 · ID/OD/H 20/32/8 mm · 선경 0.8 mm · 피치 3°</p><p className="mt-3 text-sm text-slate-600">수동성 검사 및 LTspice 4포트 재현 확인. 검사 지점에서 CM 크기 차이 최대 1.814%, DM 0.058%.</p><a href="/ce-cmf/cmc-01.lib" download className="mt-5 inline-block rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white">대표 SPICE 다운로드</a><div className="mt-6 flex flex-wrap gap-4">{["PCB + CMC","PCB + CMC + X","PCB + CMC + X/Y"].map((l,i)=><a className="rounded border border-blue-200 px-4 py-2 text-blue-700" href={`/ce-cmf/pcb_filter_${i+1}.cir`} download key={l}>{l} 예제</a>)}</div><Image src="/ce-cmf/schematic.png" alt="CMC와 LISN 회로" width={1690} height={949} className="mt-8 h-auto w-full"/></section>}
    <p className="text-sm leading-6 text-slate-500">교육·데모용 모델이며 실측 검증 및 CE 인증 결과가 아닙니다.</p></div>
  </main>;
}
