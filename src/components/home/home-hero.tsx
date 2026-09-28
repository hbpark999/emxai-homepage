import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] px-6 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          {/* 같은 문구가 hero 이미지 안에 들어 있어 화면 표시는 생략한다.
              검색엔진과 스크린리더를 위해 h1만 시각적으로 숨겨 남긴다. */}
          <h1 className="sr-only">
            EMI/SI Problem Solving Services — AI-Connected EMI/SI Engineering Enablement
          </h1>
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
