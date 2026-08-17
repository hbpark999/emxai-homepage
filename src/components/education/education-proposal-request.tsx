"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

export function EducationProposalRequest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setPending(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/education/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, summary }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "접수하지 못했습니다.");
        return;
      }

      setMessage("제안서 요청이 접수되었습니다. 확인 후 연락드리겠습니다.");
      setName("");
      setEmail("");
      setCompany("");
      setSummary("");
      setPrivacyAgreed(false);
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
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
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-black text-slate-950">제안서에 담기는 내용</h3>
            <ul className="mt-4 grid gap-2 text-sm font-bold leading-6 text-slate-600">
              <li>· 귀사 요구사항에 맞춘 커리큘럼(일자별)</li>
              <li>· 실습 환경 및 준비사항</li>
              <li>· 강사 이력</li>
              <li>· 견적</li>
            </ul>
          </div>
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
            <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(event) => setPrivacyAgreed(event.target.checked)}
                className="mt-1 size-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                required
              />
              <span>제안서 발송을 위한 개인정보 수집·이용에 동의합니다.</span>
            </label>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
              >
                {pending ? "접수 중..." : "제안서 요청하기"}
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-sky-500 hover:text-sky-600"
              >
                교육 문의하기
              </Link>
            </div>
            {message ? (
              <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
