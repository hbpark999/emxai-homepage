import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] px-6 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <h1 className="mx-auto mb-3 max-w-7xl text-center text-3xl font-black leading-tight tracking-normal text-blue-600 sm:text-4xl lg:text-5xl">
            <span className="block">
              전자파(EMI/EMC, SI, RF) 설계·분석 업무의 AI 전환을 위한
            </span>
            <span className="block">솔루션 개발, 자문 및 교육</span>
          </h1>
          <div className="relative mx-auto w-full">
            <Image
              src="/이엠엑스아이_AI도입효과1_v5.png"
              alt="AI 기반 EMI/SI Engineering 업무 전환 전후 요약"
              width={1809}
              height={748}
              className="h-auto w-full"
              priority
              sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 76vw, 94vw"
            />
            <span className="absolute left-[50.5%] top-[38.2%] -translate-x-1/2 -translate-y-1/2 text-[clamp(0.75rem,1.65vw,1.875rem)] font-black leading-none text-violet-700">
              AI-Connected
            </span>
            <span className="absolute left-[0.3%] top-[65.1%] bg-white pr-2 text-[clamp(0.5rem,1.025vw,1.25rem)] font-black leading-none text-zinc-700">
              Before
            </span>
            <span className="absolute left-[0.3%] top-[84.4%] bg-white pr-2 text-[clamp(0.5rem,1.025vw,1.25rem)] font-black leading-none text-zinc-700">
              After
            </span>
          </div>
          <div className="mx-auto mt-14 max-w-6xl text-center">
            <p className="text-xl font-black tracking-normal text-[#4E95D9] sm:text-2xl lg:text-4xl">
              AI-Connected EM Solutions for AI-Integrated, Agentic Engineering
            </p>
          </div>
          <div className="mx-auto mt-4 max-w-6xl px-4 py-2 text-base font-semibold leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            <div className="hero-message-rotator relative grid min-h-[4.25rem] place-items-center overflow-hidden sm:min-h-[3rem]">
              <p className="hero-rotating-message text-center">
                <strong>AI-Connected&Integrated:</strong> Simulation Tool, 계측장비를 AI로 연결하여 측정, 분석, 보고서 작성 진행, AI연결 Tool개발
              </p>
              <p className="hero-rotating-message text-center">
                <strong>Agentic</strong> — AI가 필요한 Tool을 선택·제어하고 분석·판단하여 Workflow 수행
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
