const tallyFormUrl =
  "https://tally.so/embed/xX0e5G?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&inquiry_type=General";

const tallyDirectUrl = "https://tally.so/r/xX0e5G?inquiry_type=General";

export default function ContactPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-14 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-600">
            Contact EMxAI
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
                문의하기
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환 솔루션 개발, 기업 교육
                및 자문이 필요하시면 아래 문의 폼으로 내용을 남겨주세요.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-950">문의 수신</p>
              <a
                href="mailto:contact@emxai.net"
                className="mt-2 inline-flex text-slate-700 underline-offset-4 transition hover:text-[#2563eb] hover:underline"
              >
                contact@emxai.net
              </a>
              <p className="mt-3">031-216-2806</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[92vw] px-6 py-12 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-950">프로젝트·교육 문의</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                제출된 내용은 Tally 알림 설정을 통해 contact@emxai.net으로 전달됩니다.
              </p>
            </div>
            <iframe
              title="EMxAI inquiry form"
              src={tallyFormUrl}
              className="h-[48rem] w-full border-0 bg-white"
              loading="lazy"
            />
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-600">
              Inquiry Type
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <li className="border-l-2 border-sky-400 pl-4">
                전자파 설계·분석 업무의 AI 전환 솔루션 개발
              </li>
              <li className="border-l-2 border-sky-400 pl-4">
                Simulation workflow 자동화
              </li>
              <li className="border-l-2 border-sky-400 pl-4">
                기업 맞춤형 교육 및 자문
              </li>
            </ul>
            <a
              href={tallyDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full justify-center rounded-md bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              새 창에서 문의하기
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
