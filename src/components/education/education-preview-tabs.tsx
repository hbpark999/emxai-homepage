"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { EducationSection } from "@/lib/education-catalog";

type EducationPreviewTabsProps = {
  catalog: EducationSection[];
};

const UNLOCK_STORAGE_KEY = "emxai_edu_preview_unlocked";

function SlideAccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/education/preview-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newsletter }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "열람 등록에 실패했습니다.");
        return;
      }

      window.localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
      onUnlock();
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-dashed border-sky-300 bg-sky-50/60 p-8 text-center">
      <p className="text-base font-bold leading-7 text-slate-800">
        이메일을 입력하면 각 교육 내용의 샘플 슬라이드를 볼 수 있습니다.
      </p>
      <form
        onSubmit={submitAccess}
        className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row sm:items-start"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="w-full flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
        >
          {pending ? "확인 중..." : "이메일 입력하기"}
        </button>
      </form>
      <label className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(event) => setNewsletter(event.target.checked)}
          className="size-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
        />
        <span>EMxAI Newsletter 발송 희망</span>
      </label>
      {error ? (
        <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

export function EducationPreviewTabs({ catalog }: EducationPreviewTabsProps) {
  const [activeId, setActiveId] = useState(catalog[0]?.id ?? "");
  const [unlocked, setUnlocked] = useState(false);
  const activeSection = useMemo(
    () => catalog.find((section) => section.id === activeId) ?? catalog[0],
    [activeId, catalog],
  );

  useEffect(() => {
    if (window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  if (!activeSection) {
    return null;
  }

  return (
    <>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {catalog.map((section) => {
          const isActive = section.id === activeSection.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveId(section.id)}
              className={
                isActive
                  ? "shrink-0 rounded-md border border-sky-500 bg-sky-50 px-4 py-2.5 text-sm font-black text-sky-700"
                  : "shrink-0 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600"
              }
            >
              {section.title}
            </button>
          );
        })}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-400">
              {activeSection.folder}
            </p>
            <h3 className="mt-2 text-3xl font-black text-slate-950">
              {activeSection.title}
            </h3>
          </div>
          <p className="text-sm font-semibold text-slate-400">
            {activeSection.slides.length > 0
              ? `${activeSection.slides.length}개 자료`
              : "Markdown 자료"}
          </p>
        </div>

        {activeSection.slides.length > 0 ? (
          unlocked ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {activeSection.slides.map((slide) => (
                <article
                  key={slide.src}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <div className="relative aspect-[16/9] bg-slate-50">
                    <Image
                      src={slide.src}
                      alt={`${slide.title} 교육자료`}
                      fill
                      className="object-contain p-2"
                      sizes="(min-width: 1024px) 42vw, 100vw"
                    />
                  </div>
                  <div className="border-t border-slate-100 p-4">
                    <h4 className="line-clamp-2 text-sm font-bold leading-6 text-slate-800">
                      {slide.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <SlideAccessGate onUnlock={() => setUnlocked(true)} />
          )
        ) : (
          <div className="mt-6 rounded-lg bg-slate-50 p-6 text-base leading-7 text-slate-600">
            이 섹션은 Markdown 문서 중심으로 구성되어 있습니다. 필요하면 PNG 또는 PDF로
            export해 같은 폴더에 넣으면 자동으로 상세 자료에 표시됩니다.
          </div>
        )}
      </section>
    </>
  );
}
