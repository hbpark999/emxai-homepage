import Image from "next/image";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#f6f9fc]">
      <div className="mx-auto py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[94vw] px-6 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          {/* 제목은 hero 이미지(v3_43)에서 빠져 있어 텍스트로 얹는다.
              색 #002060과 크기는 이전 이미지(v3_4)에서 실측한 값(폭 대비 3.83%)의 1.3배다. */}
          <h1 className="text-center text-xl font-extrabold leading-snug tracking-tight text-[#002060] sm:text-2xl lg:text-4xl xl:text-5xl">
            Agentic AI 기반 전자파 설계 · 분석과 EMxAI 업무 영역
          </h1>
          {/* Biz Area 줄. 색 #0063cf와 제목 대비 0.58배 크기는 첨부 시안에서 실측했다. */}
          <p className="mt-4 text-center text-sm font-bold italic leading-snug text-[#0063cf] sm:mt-5 sm:text-base lg:mt-7 lg:text-xl xl:mt-10 xl:text-[1.75rem]">
            Biz Area: PCB EMI/SI, Filter Design, Antenna/RF Design
          </p>
          {/* 이전 h1에 있던 영문 키워드는 검색엔진용으로만 남긴다. */}
          <p className="sr-only">
            EMI/SI Problem Solving Services — AI-Connected EMI/SI Engineering Enablement
          </p>
          <div className="relative mx-auto mt-5 w-full lg:mt-7">
            <Image
              src="/images/20260927EMxAI_DRC_Day3_v3_43.png"
              alt="STEP 1 Design부터 STEP 6 AI Report까지 이어지는 AI 기반 EMI/SI 업무 흐름도"
              width={3627}
              height={800}
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
