import Link from "next/link";
import { capabilityHighlights } from "@/data/home-content";
import { secondaryRoutes } from "@/lib/site-map";

export function HomeCapabilities() {
  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Deep Tech Focus
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              전자파 도메인 지식과 AI 실행력을 함께 보여주는 구조
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              기존 HTML의 방대한 구현 코드는 덜어내고, 방문자가 즉시 이해해야 할 기술
              가치와 서비스 흐름을 전면에 배치했습니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilityHighlights.map((item, index) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-teal-700">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {secondaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-950">{route.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{route.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
