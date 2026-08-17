"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export function EducationProposalRequest() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = "교육 제안서 요청";
    const body = [
      `회사/기관명: ${company}`,
      `이메일: ${email}`,
      "",
      "희망 교육 내용:",
      request,
    ].join("\n");

    return `mailto:contact@emxai.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [company, email, request]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-500">
            Education Guide
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">교육 운영 안내</h2>
          <dl className="mt-6 grid gap-3 text-base leading-7">
            {[
              ["과정 기간", "2일 / 3일"],
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
            필요한 교육 주제와 참석 대상만 간단히 남겨주시면 검토용 제안서를 준비합니다.
          </p>
          <form className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">회사명 / 기관명</span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">이메일</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">희망 교육 내용</span>
              <textarea
                value={request}
                onChange={(event) => setRequest(event.target.value)}
                rows={4}
                placeholder="예: AI 기반 S-parameter 분석, Report 자동화 / PCB 설계 엔지니어 Senior 12명"
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
              >
                교육 제안서 요청하기
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-sky-500 hover:text-sky-600"
              >
                교육 문의하기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
