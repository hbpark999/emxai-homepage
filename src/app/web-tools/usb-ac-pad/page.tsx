import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "USB AC Coupling Pad 분석",
  description: "HFSS 기반 교육용 서로게이트로 USB 차동 배선·Void와 부품의 S-parameter, TDR, impulse 응답을 비교합니다.",
  alternates: { canonical: "/web-tools/usb-ac-pad" },
};

export default function UsbAcPadPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold text-amber-700">교육용 · 최종 독립 검증 전</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">USB AC Coupling Pad 분석</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            선폭·간격·개별 Void 크기를 바꾸며 형상과 S-parameter, Step TDR, Band-pass impulse를 비교합니다.
            실제 HFSS 학습 24개·개발 평가 6개 기반이며, 제조 또는 USB 규격 적합성 판정용은 아닙니다.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            고정 4층·1.6 mm PCB, h=0.1 mm, 0402 inch 패드입니다. PCB 해석 대역은 10 MHz–12.5 GHz이고 DC는 외삽입니다.
            부품 파일을 연결하면 공통 주파수 대역만 사용합니다. 파일과 계산은 브라우저 안에서 처리합니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/tools/usb-ac-pad/index.html" target="_blank" rel="noopener noreferrer" className="rounded-md bg-sky-500 px-5 py-3 text-sm font-bold text-white">큰 화면으로 실행 ↗</a>
            <a href="/tools/usb-ac-pad/index.html" download="USB_AC_PAD.html" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700">오프라인 HTML 다운로드 (약 29 MB)</a>
          </div>
          <p className="mt-3 text-xs text-slate-500">최초 로딩에 시간이 걸릴 수 있습니다. PC의 Chrome/Edge 사용을 권장합니다. Python 설치가 필요 없습니다.</p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[98vw] px-2 py-4 sm:px-4">
        <iframe src="/tools/usb-ac-pad/index.html" title="USB AC pad surrogate engineering demo" className="h-[1000px] w-full rounded-xl border border-slate-200 bg-white shadow-sm" />
      </section>
    </main>
  );
}
