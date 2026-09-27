/**
 * page.tsx — /web-tools/diff-pair
 *
 * 용도 : Edge-coupled microstrip differential pair의 Zdiff를 근사식으로 계산하는 교육용 도구.
 *        계산기 본체는 public/tools/diff-pair/index.html이며 iframe으로 띄운다.
 * 대응 MCP : diffpair_zdiff / diffpair_solve / diffpair_sweep / diffpair_model_info
 *            (계산식은 src/lib/diffpair.ts에 같은 형태로 두어 화면과 답이 일치한다)
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Microstrip 차동 쌍 Zdiff 계산기",
  description:
    "Edge-coupled surface microstrip differential pair의 Zdiff, 단일 선로 Z0, Zodd를 IPC-2141 계열 근사식으로 계산하고 단면도를 실시간으로 확인합니다.",
  alternates: { canonical: "/web-tools/diff-pair" },
};

export default function DiffPairPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[96vw] px-5 py-9 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            Microstrip Differential Pair
          </p>
          <div className="mt-3">
            <h1 className="text-3xl font-medium text-slate-950">
              차동 쌍 Zdiff 근사식 계산기
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
              선폭 W, 간격 S, 기판 높이 H, 동박 두께 T를 바꾸며 차동 임피던스와 단면 형상을
              함께 확인합니다. 외층 edge-coupled microstrip과 연속된 단일 기준면을 가정한
              근사식이며, 제조 전에는 PCB 업체 stackup 계산과 field solver로 재검증합니다.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[98vw] px-2 py-4 sm:px-4">
        <iframe
          src="/tools/diff-pair/index.html"
          title="Microstrip differential pair impedance calculator"
          className="h-[1180px] w-full rounded-xl border border-slate-200 bg-white shadow-sm"
        />
      </section>
    </main>
  );
}
