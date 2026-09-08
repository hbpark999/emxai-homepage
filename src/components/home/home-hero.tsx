import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] px-6 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <div className="mx-auto mb-3 max-w-7xl border-l-4 border-slate-200 pl-4 text-left sm:pl-6">
            <h1 className="text-2xl font-black leading-tight tracking-normal text-slate-900 sm:text-3xl lg:text-4xl">
              EMI/SI Problem Solving Services
            </h1>
            <p className="mt-2 text-lg italic leading-snug text-slate-500 sm:text-xl lg:text-2xl">
              Expert-Guided, AI-Accelerated EMI/SI Problem Solving
            </p>
            <p className="mt-4 text-2xl font-black leading-tight tracking-normal text-slate-900 sm:text-3xl lg:text-4xl">
              AI-Connected EMI/SI Engineering Enablement
            </p>
            <p className="mt-2 text-lg italic leading-snug text-slate-500 sm:text-xl lg:text-2xl">
              Enabling smarter EMI/SI engineering through education,
              AI-connected workflow consulting, and solution development.
            </p>
          </div>
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
            <span className="absolute left-[50.5%] top-[40.4%] -translate-x-1/2 -translate-y-1/2 text-[clamp(0.75rem,1.65vw,1.875rem)] font-black leading-none text-violet-700">
              AI-Connected
            </span>
            <span className="absolute left-0 top-[62.8%] flex h-[7.8%] w-[9.8%] items-center bg-white pl-[1.1%] text-[clamp(0.65rem,1.33vw,1.625rem)] font-black leading-none text-zinc-500">
              Before
            </span>
            <span className="absolute left-0 top-[82.1%] flex h-[7.8%] w-[9.8%] items-center bg-white pl-[1.1%] text-[clamp(0.65rem,1.33vw,1.625rem)] font-black leading-none text-zinc-500">
              After
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
