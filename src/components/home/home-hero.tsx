import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] px-6 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <div className="mx-auto mb-3 max-w-7xl border-l-4 border-slate-200 pl-4 text-left sm:pl-6">
            <h1 className="text-xl font-black leading-tight tracking-normal text-slate-900 sm:text-2xl lg:text-3xl">
              EMI/SI Problem Solving Services
            </h1>
            <p className="mt-2 text-base italic leading-snug text-slate-500 sm:text-lg lg:text-xl">
              Expert-Guided, AI-Accelerated EMI/SI Problem Solving
            </p>
            <p className="mt-4 text-xl font-black leading-tight tracking-normal text-slate-900 sm:text-2xl lg:text-3xl">
              AI-Connected EMI/SI Engineering Enablement
            </p>
            <p className="mt-2 text-base italic leading-snug text-slate-500 sm:text-lg lg:text-xl">
              Enabling smarter EMI/SI engineering through education,
              AI-connected workflow consulting, and solution development.
            </p>
          </div>
          <div className="relative mx-auto w-full">
            {/* 이미지에 문구가 포함되어 있어 별도 텍스트 오버레이를 두지 않는다.
                이전 이미지(1809x748)용 좌표 오버레이는 비율이 달라 제거했다. */}
            <Image
              src="/images/20260927EMxAI_DRC_Day3_v3_4.png"
              alt="AI 기반 EMI/SI Engineering 업무 전환 요약"
              width={2933}
              height={1650}
              className="h-auto w-full"
              priority
              sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 76vw, 94vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
