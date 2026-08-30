"use client";

import Image from "next/image";
import { useState } from "react";
import { solutionCards } from "@/data/home-content";

export function HomeSolutions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openCard = openIndex === null ? null : solutionCards[openIndex];

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-[94vw] px-6 py-16 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-normal text-sky-500 sm:text-5xl">
            <span>EMxAI</span> <span className="text-slate-950">Solutions</span>
          </h2>
          <p className="mt-4 text-lg font-semibold text-slate-500">
            생성형 AI를 이용한 전자파 설계·분석 혁신
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {solutionCards.map((card, index) => {
            const isOpen = openIndex === index;
            const isEducationCard = card.title === "기업 교육·자문";
            const isExternalInquiry = card.inquiryHref.startsWith("http");
            const imageClassName = isEducationCard
              ? "object-contain scale-125"
              : "object-contain";

            return (
              <article
                key={card.title}
                className="flex min-h-[48rem] min-w-0 overflow-hidden rounded-lg border border-sky-100 bg-white shadow-[0_0_0_1px_rgba(14,165,233,0.04)]"
              >
                <div className="flex w-full flex-col">
                  <div className="h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-lime-300" />
                  <div className="px-6 pt-7 text-center">
                    <p className="text-3xl font-black tracking-normal text-sky-400">
                      {card.displayTitle ?? card.title}
                    </p>
                    <p className="mt-3 text-base font-bold text-sky-200">
                      {card.displaySubtitle ?? card.subtitle}
                    </p>
                  </div>

                  <div className="relative mx-5 mt-5 h-96 bg-white sm:h-[28rem] lg:h-[30rem]">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className={imageClassName}
                      sizes="(min-width: 1024px) 30vw, 100vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-7 pb-7 pt-4">
                    <h3 className="flex min-h-[5rem] items-end justify-center text-center text-2xl font-semibold leading-snug text-slate-950 [word-break:keep-all]">
                      {card.description}
                    </h3>
                    <ul className="mt-6 space-y-4 text-lg leading-8 text-slate-700 [word-break:keep-all] xl:text-xl">
                      {card.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-sky-400 text-base font-black text-white">
                            ✓
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-col items-center gap-3 pt-8">
                      <div className="flex justify-center gap-2">
                        {isEducationCard ? (
                          <a
                            href="/education"
                            className="rounded-md border border-sky-400 px-8 py-3 text-base font-bold text-sky-500 transition hover:bg-sky-50"
                          >
                            교육 둘러보기
                          </a>
                        ) : (
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            className="rounded-md border border-sky-400 px-8 py-3 text-base font-bold text-sky-500 transition hover:bg-sky-50"
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                          >
                            예시 보기
                          </button>
                        )}
                        <a
                          href={card.inquiryHref}
                          target={isExternalInquiry ? "_blank" : undefined}
                          rel={isExternalInquiry ? "noopener noreferrer" : undefined}
                          className="rounded-md bg-sky-400 px-8 py-3 text-base font-bold text-white transition hover:bg-sky-500"
                        >
                          문의 하기
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {openCard ? (
          <div className="mt-8 rounded-lg border border-sky-100 bg-sky-50/60 p-4">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-400">
                    Example
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-slate-950">
                    {openCard.exampleTitle}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {openCard.exampleLead}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-400 hover:text-sky-500"
                  onClick={() => setOpenIndex(null)}
                >
                  예시 닫기
                </button>
              </div>

              {openCard.exampleImages ? (
                <div className="mt-6">
                  {openCard.exampleImagesTitle ? (
                    <h4 className="text-xl font-black leading-snug text-slate-950 [word-break:keep-all]">
                      {openCard.exampleImagesTitle}
                    </h4>
                  ) : null}
                  <div className="mt-3 grid gap-4 lg:grid-cols-2">
                    {openCard.exampleImages.map((src, index) => (
                      <div
                        key={src}
                        className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                      >
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={src}
                            alt={`${openCard.title} 예시 자료 ${index + 1}`}
                            fill
                            className="object-contain p-2"
                            sizes="(min-width: 1024px) 28vw, 100vw"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {openCard.exampleVideo ? (
                <div className="mt-8">
                  {openCard.exampleVideoTitle ? (
                    <h4 className="text-xl font-black leading-snug text-slate-950 [word-break:keep-all]">
                      {openCard.exampleVideoTitle}
                    </h4>
                  ) : null}
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
                    <div className="aspect-video">
                      <iframe
                        src={openCard.exampleVideo}
                        title={`${openCard.title} 예시 영상`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <ul className="space-y-3 text-sm leading-6 text-slate-700">
                  {openCard.exampleSteps.map((step) => (
                    <li key={step} className="border-l-3 border-sky-400 pl-4">
                      {step}
                    </li>
                  ))}
                </ul>
                <a
                  href={openCard.inquiryHref}
                  target={openCard.inquiryHref.startsWith("http") ? "_blank" : undefined}
                  rel={openCard.inquiryHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex justify-center rounded-md bg-sky-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-500"
                >
                  문의 하기
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
