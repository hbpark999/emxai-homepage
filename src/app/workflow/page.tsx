import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { WorkflowPlayer } from "@/components/workflow/workflow-player";

const title = "Agentic AI기반 EMI/SI 설계·검증 Workflow 예시";
const description =
  "STEP 1 Design부터 STEP 6 AI Report까지, AI Agent가 PCB EMI/SI 설계와 검증을 어떻게 수행하는지 6편의 시연 영상으로 보여 드립니다.";

/**
 * LinkedIn 등에 공유할 전용 페이지.
 * 미리보기 카드가 홈 기본값을 쓰지 않도록 openGraph를 이 페이지 것으로 덮어쓴다.
 * og 이미지는 1200x627(1.91:1) — LinkedIn 권장 규격이다. 홈이 쓰는 3627x800은 잘린다.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/workflow" },
  openGraph: {
    type: "article",
    url: "https://www.emxai.net/workflow",
    siteName: "EMxAI",
    locale: "ko_KR",
    title,
    description,
    images: [
      {
        url: "/images/og-workflow.png",
        width: 1200,
        height: 627,
        alt: "STEP 1 Design부터 STEP 6 AI Report까지 이어지는 AI 기반 EMI/SI 업무 흐름도",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-workflow.png"],
  },
};

export default function WorkflowPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="mx-auto w-full max-w-[94vw] px-6 py-12 sm:px-8 lg:max-w-[76vw] lg:py-16 xl:max-w-[70vw]">
        <h1 className="text-center text-2xl font-extrabold leading-snug tracking-tight text-[#002060] sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-slate-600 sm:text-base [word-break:keep-all]">
          {description}
        </p>

        <div className="mx-auto mt-8 w-full lg:mt-10">
          <Image
            src="/images/emxai-workflow-steps.png"
            alt="STEP 1 Design부터 STEP 6 AI Report까지 이어지는 AI 기반 EMI/SI 업무 흐름도"
            width={3627}
            height={442}
            className="h-auto w-full"
            priority
            sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 76vw, 94vw"
          />
        </div>

        <div className="mx-auto mt-8 max-w-4xl lg:mt-10">
          <WorkflowPlayer />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/solution"
            className="rounded-md border border-sky-500 bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            EMxAI 솔루션 보기
          </Link>
          <Link
            href="/"
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-600"
          >
            홈으로
          </Link>
        </div>
      </section>
    </main>
  );
}
