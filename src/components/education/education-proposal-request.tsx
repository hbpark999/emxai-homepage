"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

export function EducationProposalRequest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = "교육 제안서 요청";
    const body = [
      `성함: ${name}`,
      `연락처(e-mail): ${email}`,
      `회사: ${company}`,
      "",
      "요청 교육 요약(교육 내용, 참석자):",
      summary,
    ].join("\n");

    return `mailto:contact@emxai.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [company, email, name, summary]);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    window.location.href = mailtoHref;
  }

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
            회사명, 이메일, 필요한 교육 내용과 참석 대상을 간단히 남겨주시면 검토용
            제안서를 준비합니다.
          </p>
          <form className="mt-5 space-y-4" onSubmit={submitRequest}>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">성함</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">연락처(e-mail)</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">회사</span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                요청 교육 요약(교육 내용, 참석자)
              </span>
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                rows={4}
                placeholder="예: AI 기반 S-parameter 분석, Report 자동화 / PCB 설계 엔지니어 Senior 12명"
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 outline-none transition focus:border-sky-500"
                required
              />
            </label>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
              >
                메일로 제안서 요청
              </button>
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
