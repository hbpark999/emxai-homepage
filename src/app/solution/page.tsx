import Image from "next/image";
import Link from "next/link";
import { solutionCards } from "@/data/home-content";

const solutionIds = ["aifem-a", "aifem-d", "consulting-education"];

const processItems = [
  "현행 설계·측정·시뮬레이션 Workflow 진단",
  "반복 분석 구간과 병목 업무를 AI 적용 후보로 정의",
  "데이터 구조화, 자동화 스크립트, 모델 연동 방식 설계",
  "실무 적용 교육과 운영 환경 구축까지 연결",
];

export default function SolutionPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
            EMxAI Solutions
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            전자파 설계·분석 업무를 AI 기반 Workflow로 전환합니다.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            측정/분석 자동화, 시뮬레이션 설계 자동화, 기업 교육·자문을 하나의
            실행 가능한 AX 전환 로드맵으로 제공합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {processItems.map((item, index) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-teal-700">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-8">
            {solutionCards.map((card, index) => (
              <article
                key={card.title}
                id={solutionIds[index]}
                className="scroll-mt-28 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="relative min-h-[18rem] border-b border-slate-100 bg-white p-5 lg:border-b-0 lg:border-r">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-contain p-4"
                      sizes="(min-width: 1024px) 42vw, 100vw"
                    />
                  </div>
                  <div className="p-7 sm:p-9">
                    <p className="text-sm font-semibold text-teal-700">{card.subtitle}</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-950">{card.title}</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">{card.description}</p>
                    <ul className="mt-7 grid gap-4 text-base leading-7 text-slate-700">
                      {card.points.map((point) => (
                        <li key={point} className="border-l-2 border-teal-500 pl-4">
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/contact"
                        className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        문의하기
                      </Link>
                      <Link
                        href="/education"
                        className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-950"
                      >
                        교육 보기
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
