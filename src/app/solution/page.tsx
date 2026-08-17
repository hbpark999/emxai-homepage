import Image from "next/image";
import Link from "next/link";
import { solutionCards } from "@/data/home-content";
import { knowledgeItems } from "@/data/updates-content";

const primarySolutions = solutionCards.filter((card) =>
  ["AIfEM-A", "AIfEM-D"].includes(card.title),
);

export default function SolutionPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-16 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <div className="grid gap-8">
            {primarySolutions.map((card) => (
              <article
                key={card.title}
                id={card.title === "AIfEM-A" ? "aifem-a" : "aifem-d"}
                className="scroll-mt-28 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-4xl font-black text-sky-500">{card.title}</h2>
                </div>
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

            <section
              id="public-tools"
              className="scroll-mt-28 rounded-lg border border-slate-200 bg-slate-50 p-5"
            >
              <h2 className="text-4xl font-black text-sky-500">간단한 공개 Tools</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {knowledgeItems.map((tool) => {
                  const isExternal = tool.href.startsWith("http");

                  return isExternal ? (
                    <a
                      key={tool.title}
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-sm"
                    >
                      <p className="text-sm font-bold text-slate-950">{tool.title}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{tool.body}</p>
                      <span className="mt-3 inline-flex text-xs text-slate-500">
                        {tool.action}
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={tool.title}
                      href={tool.href}
                      className="rounded-md border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-sm"
                    >
                      <p className="text-sm font-bold text-slate-950">{tool.title}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{tool.body}</p>
                      <span className="mt-3 inline-flex text-xs text-slate-500">
                        {tool.action}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
