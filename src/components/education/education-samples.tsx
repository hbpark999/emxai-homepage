import Image from "next/image";
import Link from "next/link";
import { educationOverview } from "@/data/education-content";
import { getEducationCatalog } from "@/lib/education-catalog";

export function EducationSamples() {
  const catalog = getEducationCatalog();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8">
        <div className="border-b border-slate-200 pb-10">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-500">
            Education Preview
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            기업 교육·자문
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {educationOverview.previewNote} 목차별 교육 흐름과 샘플 슬라이드를 확인할 수
            있게 구성했습니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-sky-500 hover:text-sky-600"
            >
              교육 문의하기
            </Link>
          </div>
        </div>

        <nav
          aria-label="교육 목차"
          className="sticky top-[76px] z-20 -mx-5 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-1">
            {catalog.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600"
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-16 py-12">
          {catalog.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-40 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-400">
                    {section.folder}
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {section.title}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-slate-400">
                  {section.slides.length > 0
                    ? `${section.slides.length}개 자료`
                    : "Markdown 자료"}
                </p>
              </div>

              {section.slides.length > 0 ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {section.slides.map((slide) => (
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
                        <h3 className="line-clamp-2 text-sm font-bold leading-6 text-slate-800">
                          {slide.title}
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-lg bg-slate-50 p-6 text-base leading-7 text-slate-600">
                  이 섹션은 Markdown 문서 중심으로 구성되어 있습니다. 필요하면 PNG 또는
                  PDF로 export해 같은 폴더에 넣으면 자동으로 상세 자료에 표시됩니다.
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
