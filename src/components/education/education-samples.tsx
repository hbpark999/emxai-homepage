import Image from "next/image";
import Link from "next/link";
import { educationOverview } from "@/data/education-content";
import { studentCourses } from "@/data/student-courses";
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
              href="/education/board"
              className="rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
            >
              교육 게시판 열기
            </Link>
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
            <a
              href="#student-corner"
              className="shrink-0 rounded-md border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-black text-teal-700 transition hover:border-teal-400 hover:bg-teal-100"
            >
              교육생 전용
            </a>
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
          <section
            id="student-corner"
            className="scroll-mt-40 rounded-lg border border-teal-100 bg-teal-50/60 p-5"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-teal-100 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-600">
                  Student Corner
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  교육생 전용 코너
                </h2>
              </div>
              <p className="text-sm font-semibold text-teal-700">
                과정별 비밀번호 입장
              </p>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              아래 6개 과정은 각 과정별 비밀번호를 입력한 수강생만 PDF 자료를 읽고
              다운로드할 수 있습니다. 과정 게시판도 전용 화면에서 함께 확인합니다.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {studentCourses.map((course) => (
                <article
                  key={course.slug}
                  className="flex min-h-52 flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {course.organizer}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{course.dayLabel}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-black leading-7 text-slate-950">
                      {course.title}
                    </h3>
                  </div>
                  <Link
                    href={`/education/class/${course.slug}`}
                    className="mt-5 inline-flex items-center justify-center rounded-md bg-[#08a99d] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
                  >
                    전용 자료실 입장
                  </Link>
                </article>
              ))}
            </div>
          </section>

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
