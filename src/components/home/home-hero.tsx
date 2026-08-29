import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto px-6 py-6 sm:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] lg:max-w-[76vw] xl:max-w-[70vw]">
          <h1 className="mx-auto mb-3 max-w-7xl text-center text-3xl font-black leading-tight tracking-normal text-blue-600 sm:text-4xl lg:text-5xl">
            <span className="block">
              전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한
            </span>
            <span className="block">솔루션 개발, 자문 및 교육</span>
          </h1>
          <div className="mx-auto mb-6 max-w-6xl text-center">
            <p className="text-xl font-black tracking-normal text-slate-900 sm:text-2xl lg:text-4xl">
              AI-Connected · Integrated · Agentic EMI/SI Engineering
            </p>
            <div className="mt-4 overflow-hidden border-y border-slate-200 py-2 text-base leading-relaxed text-slate-700 sm:text-lg lg:text-xl">
              <div className="hero-marquee flex w-max gap-10 whitespace-nowrap">
                <span>
                  <strong className="text-slate-900">AI-Connected</strong> — 계측기·Simulation Tool과 AI 연동, AI연동 EMI/SI Engineering Tool 개발
                </span>
                <span>
                  <strong className="text-slate-900">Integrated</strong> — 측정·Simulation·분석·보고를 하나의 AI Workflow로 통합
                </span>
                <span>
                  <strong className="text-slate-900">Agentic</strong> — AI가 필요한 Tool을 선택·제어하고 분석·판단하여 Workflow 수행
                </span>
                <span aria-hidden="true">
                  <strong className="text-slate-900">AI-Connected</strong> — 계측기·Simulation Tool과 AI 연동, AI연동 EMI/SI Engineering Tool 개발
                </span>
                <span aria-hidden="true">
                  <strong className="text-slate-900">Integrated</strong> — 측정·Simulation·분석·보고를 하나의 AI Workflow로 통합
                </span>
                <span aria-hidden="true">
                  <strong className="text-slate-900">Agentic</strong> — AI가 필요한 Tool을 선택·제어하고 분석·판단하여 Workflow 수행
                </span>
              </div>
            </div>
          </div>
          <Image
            src="/images/emxai-business-summary-revised.png"
            alt="전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한 솔루션 개발, 자문 및 교육"
            width={3260}
            height={1023}
            className="mx-auto h-auto w-full"
            priority
            sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 76vw, 94vw"
          />
        </div>
      </div>
    </section>
  );
}
