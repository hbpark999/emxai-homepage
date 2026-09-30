import Image from "next/image";

import { HomeStepVideos } from "@/components/home/home-step-videos";
import { dxAxDiagram } from "@/data/home-content";

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
          {/* 이전 h1에 있던 영문 키워드는 검색엔진용으로만 남긴다. */}
          <p className="sr-only">
            EMI/SI Problem Solving Services — AI-Connected EMI/SI Engineering Enablement
          </p>

          {/* 사업 개요를 먼저 보여 "무엇을 하는 회사인가"에 답하고, 아래 흐름도가 "어떻게 하는가"를 잇는다.
              -panel은 -revised에서 오른쪽 사업 3종 박스를 잘라낸 것이다(2168x1025).
              같은 내용을 바로 아래에 글자로 적으므로 그림에 두 번 둘 이유가 없다. */}
          <div className="relative mx-auto mt-5 w-full max-w-[64rem]">
            <Image
              src="/images/emxai-business-summary-panel.png"
              alt="EMxAI 사업 개요 — 수동·반복 전자파 설계·분석(DX)을 Agentic Workflow(AX)로 전환한다"
              width={2168}
              height={1025}
              className="h-auto w-full"
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </div>

          {/* 이미지 오른쪽 파란 박스 3개를 글자로 한 번 더 적는다.
              PNG 안에만 있으면 검색엔진이 못 읽고, 폰 폭에서는 글자가 뭉개져 안 읽힌다. */}
          <ul className="mx-auto mt-4 grid w-full max-w-[64rem] gap-2 sm:grid-cols-3 sm:gap-3">
            {dxAxDiagram.services.map((service, index) => (
              <li
                key={service.title}
                className="rounded-md border border-slate-200 border-l-2 border-l-[#1f6e8c] bg-white px-3 py-2.5"
              >
                <p className="text-sm font-bold text-[#002060]">
                  {index + 1}. {service.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-slate-600 [word-break:keep-all]">
                  {service.detail}
                </p>
              </li>
            ))}
          </ul>

          {/* -steps는 v3_43에서 맨 위 "Biz Area" 줄과 보라색 주석 줄을 잘라낸 것이다(3627x442).
              가로 폭은 그대로라 아래 영상 카드의 left/width(%) 실측값을 그대로 쓸 수 있다.
              LCP는 위 사업 개요 이미지가 가져가므로 여기서는 priority를 뺀다.
              화면 안에 있으면 어차피 바로 받아 오고, 둘 다 priority면 서로 대역폭을 뺏는다. */}
          <div className="relative mx-auto mt-6 w-full lg:mt-8">
            <Image
              src="/images/emxai-workflow-steps.png"
              alt="STEP 1 Design부터 STEP 6 AI Report까지 이어지는 AI 기반 EMI/SI 업무 흐름도"
              width={3627}
              height={442}
              className="h-auto w-full"
              sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 76vw, 94vw"
            />
          </div>
          {/* 흐름도의 STEP 박스 열에 맞춰 시연 영상 카드를 깐다. */}
          <HomeStepVideos />
        </div>
      </div>
    </section>
  );
}
