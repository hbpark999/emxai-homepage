"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { EducationSection } from "@/lib/education-catalog";

type EducationPreviewTabsProps = {
  catalog: EducationSection[];
};

export function EducationPreviewTabs({ catalog }: EducationPreviewTabsProps) {
  const [activeId, setActiveId] = useState(catalog[0]?.id ?? "");
  const activeSection = useMemo(
    () => catalog.find((section) => section.id === activeId) ?? catalog[0],
    [activeId, catalog],
  );

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
          <div className="mt-6 rounded-lg bg-slate-50 p-6 text-base leading-7 text-slate-600">
            이 섹션은 Markdown 문서 중심으로 구성되어 있습니다. 필요하면 PNG 또는 PDF로
            export해 같은 폴더에 넣으면 자동으로 상세 자료에 표시됩니다.
          </div>
        )}
      </section>
    </>
  );
}
