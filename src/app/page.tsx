import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

const focusAreas = [
  "AI-assisted engineering workflows",
  "Simulation and design automation",
  "Education programs for applied AI",
  "Practical web tools for technical teams",
];

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              EMxAI Homepage
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] text-slate-950 sm:text-6xl">
              Engineering intelligence for better decisions.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A Next.js foundation for presenting EMxAI solutions, education,
              knowledge content, web tools, news, and contact pathways.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/solution"
                className="rounded-md bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Explore Solutions
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-950"
              >
                Contact EMxAI
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {focusAreas.map((item, index) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-teal-700">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{item}</p>
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
              <h2 className="text-lg font-semibold text-slate-950">{route.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{route.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
