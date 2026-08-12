"use client";

import Image from "next/image";
import { useState } from "react";
import { solutionCards } from "@/data/home-content";

export function HomeSolutions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openCard = openIndex === null ? null : solutionCards[openIndex];

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[92rem] px-5 py-18 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-normal text-sky-500 sm:text-5xl">
            <span>EMxAI</span>{" "}
            <span className="text-slate-950">Solutions</span>
          </h2>
          <p className="mt-4 text-base font-semibold text-slate-500">
            생성형 AI를 이용한 전자파 설계·분석 혁신
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-3">
          {solutionCards.map((card, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={card.title}
                className="flex min-h-[44rem] overflow-hidden rounded-lg border border-sky-100 bg-white shadow-[0_0_0_1px_rgba(14,165,233,0.04)]"
              >
                <div className="flex w-full flex-col">
                  <div className="h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-lime-300" />
                  <div className="px-7 pt-8 text-center">
                    <p className="text-3xl font-black tracking-normal text-sky-400">{card.title}</p>
                    <p className="mt-4 text-sm font-bold text-sky-200">{card.subtitle}</p>
                  </div>

                  <div className="relative mx-7 mt-8 h-56 bg-white">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 30vw, 100vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-8 pb-8 pt-8">
                    <h3 className="text-center text-xl font-black text-slate-950">
                      {card.description}
                    </h3>
                    <ul className="mt-10 space-y-4 text-sm leading-6 text-slate-700">
                      {card.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-sky-400 text-[10px] font-black text-white">
                            ✓
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex justify-center gap-2 pt-10">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        className="rounded-md border border-sky-400 px-8 py-2.5 text-sm font-bold text-sky-500 transition hover:bg-sky-50"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                      >
                        예시 보기
                      </button>
                      <a
                        href={card.inquiryHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-sky-400 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500"
                      >
                        문의 하기
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {openCard ? (
          <div className="mt-8 rounded-lg border border-sky-100 bg-sky-50/60 p-5">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-400">
                  Example
                </p>
                <h3 className="mt-3 text-3xl font-black text-slate-950">
                  {openCard.exampleTitle}
                </h3>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  {openCard.exampleLead}
                </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-400 hover:text-sky-500"
                  onClick={() => setOpenIndex(null)}
                >
                  예시 접기
                </button>
              </div>

              {openCard.exampleVideo ? (
                <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
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
              ) : openCard.exampleImages ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  target="_blank"
                  rel="noopener noreferrer"
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
