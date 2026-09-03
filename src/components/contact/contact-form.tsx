"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const inquiryTypes = [
  "전자파 설계·분석 업무의 AI 전환 솔루션 개발",
  "Simulation workflow 자동화",
  "기업 맞춤형 교육 및 자문",
  "교육 견적 요청",
  "기타",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState(inquiryTypes[0]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setPending(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, type, message }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "문의 접수에 실패했습니다.");
        return;
      }

      setSuccess("문의가 접수되었습니다. 확인 후 연락드리겠습니다.");
      setName("");
      setEmail("");
      setCompany("");
      setType(inquiryTypes[0]);
      setMessage("");
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-5 px-6 py-6" onSubmit={submitContact}>
      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>
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
        <span className="text-sm font-bold text-slate-700">문의 유형</span>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
        >
          {inquiryTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">문의 내용</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={7}
          placeholder="예: 사내 PCB 설계 검증 workflow 자동화 검토 / SI 엔지니어 대상 교육 문의"
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 outline-none transition focus:border-sky-500"
          required
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex justify-center rounded-md bg-sky-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {pending ? "접수 중..." : "문의 접수하기"}
      </button>
      {success ? (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
