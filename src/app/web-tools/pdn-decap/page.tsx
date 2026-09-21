import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HFSS 기반 De-cap·IC Z(f) Surrogate",
  description:
    "형상, Lpath를 포함한 교육용 De-cap Z(f), HFSS 복소 2-port 종단으로 계산한 IC 핀 Z(f)를 한 화면에서 비교합니다.",
  alternates: { canonical: "/web-tools/pdn-decap" },
};

export default function PdnDecapPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[96vw] px-5 py-9 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            HFSS-trained PDN Surrogate
          </p>
          <div className="mt-3">
            <h1 className="text-3xl font-medium text-slate-950">
              De-cap 실장 경로와 IC 핀 Z(f)
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
              교육용 De-cap 곡선은 C + ESR + ESL + Lpath로 정의합니다. IC 핀 곡선은
              HFSS에서 얻은 복소 2-port surrogate에 De-cap을 정확히 종단해 계산하며,
              PCB를 lumped RLC로 바꾸지 않습니다.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[98vw] px-2 py-4 sm:px-4">
        <iframe
          src="/tools/pdn-decap/index.html"
          title="Mounting inductance and IC impedance surrogate"
          className="h-[1120px] w-full rounded-xl border border-slate-200 bg-white shadow-sm"
        />
      </section>
    </main>
  );
}
