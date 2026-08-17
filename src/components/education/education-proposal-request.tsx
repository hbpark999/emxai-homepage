"use client";

import Link from "next/link";

const proposalFormUrl =
  "https://tally.so/embed/xX0e5G?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&inquiry_type=EducationProposal";

const proposalDirectUrl = "https://tally.so/r/xX0e5G?inquiry_type=EducationProposal";

export function EducationProposalRequest() {
  return (
    <section
      id="education-proposal"
      className="scroll-mt-40 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-500">
            Education Guide
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">교육 운영 안내</h2>
          <dl className="mt-6 grid gap-3 text-base leading-7">
            {[
              ["과정 기간", "1일 / 2일 / 3일 선택"],
              ["권장 인원", "회당 20명 이하"],
              ["진행 방식", "Claude, ChatGPT, Gemini 기반 실습"],
              ["LLM 선택", "회사 환경에 맞게 선택 가능"],
              ["비용", "규모에 따라 별도 협의"],
            ].map(([term, detail]) => (
              <div key={term} className="grid grid-cols-[6rem_1fr] gap-4">
                <dt className="font-black text-slate-950">{term}</dt>
                <dd className="text-slate-600">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg bg-slate-50 p-5">
          <h3 className="text-2xl font-black text-slate-950">교육 제안서 요청하기</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            회사명, 이메일, 필요한 교육 주제와 참석 대상을 간단히 남겨주시면 검토용
            제안서를 준비합니다.
          </p>
          <p className="mt-3 rounded-md bg-white px-4 py-3 text-sm leading-6 text-slate-600">
            예: AI 기반 S-parameter 분석, Report 자동화 / PCB 설계 엔지니어 Senior 12명
          </p>
          <iframe
            title="교육 제안서 요청 폼"
            src={proposalFormUrl}
            className="mt-5 h-[34rem] w-full rounded-md border border-slate-200 bg-white"
            loading="lazy"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={proposalDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
            >
              새 창에서 제안서 요청
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-sky-500 hover:text-sky-600"
            >
              교육 문의하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
