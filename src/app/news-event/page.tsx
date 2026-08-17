import {
  educationSchedule,
  knowledgeArticles,
  relatedEventItems,
  updateActivities,
} from "@/data/updates-content";

const visibleEducationMonths = new Set(["'26년 8월", "'26년 9월", "'26년 10월"]);
const visibleEducationSchedule = educationSchedule.filter((group) =>
  visibleEducationMonths.has(group.month),
);

export default function NewsEventPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-16 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-4xl font-black text-sky-500">News</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {updateActivities.map((item) => {
                const isExternal = item.href.startsWith("http");
                const content = (
                  <>
                    <p className="text-sm font-medium text-slate-950">{item.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{item.body}</p>
                    {item.note ? (
                      <span className="mt-3 inline-flex text-xs text-slate-500">{item.note}</span>
                    ) : null}
                  </>
                );

                return item.href ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="rounded-md border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-sm"
                  >
                    {content}
                  </a>
                ) : (
                  <article
                    key={item.title}
                    className="rounded-md border border-slate-200 bg-white p-4"
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-4xl font-black text-sky-500">Events</h2>
            <h3 className="mt-6 text-xl font-black text-slate-950">전자파·EMI/SI 관련 행사</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relatedEventItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-sm"
                >
                  <span className="text-xs font-black text-sky-500">{item.month}</span>
                  <p className="mt-2 text-sm font-bold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{item.date}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.body}</p>
                  <span className="mt-3 inline-flex text-xs text-slate-500">행사 보기 →</span>
                </a>
              ))}
            </div>

            <h3 className="mt-8 text-xl font-black text-slate-950">교육 일정</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {visibleEducationSchedule.map((group) => (
                <div key={group.month} className="rounded-md border border-slate-200 bg-white p-4">
                  <h3 className="text-base font-bold text-slate-950">{group.month}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => {
                      const content = (
                        <>
                          <span className="text-sm font-medium text-slate-800">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            시작일: {item.startDate}
                          </span>
                        </>
                      );

                      return (
                        <li key={`${group.month}-${item.title}`}>
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-md border border-slate-100 px-3 py-2 transition hover:border-sky-300 hover:bg-sky-50"
                            >
                              {content}
                            </a>
                          ) : (
                            <div className="rounded-md border border-slate-100 px-3 py-2">
                              {content}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-4xl font-black text-sky-500">Knowledge</h2>
            <div className="mt-5 grid gap-4">
              {knowledgeArticles.map((article) => (
                <details
                  key={article.title}
                  className="group rounded-md border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-sm"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">{article.title}</h3>
                        <div className="mt-3 grid gap-1 text-sm leading-6 text-slate-600">
                          {article.abstract.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 group-open:bg-sky-50 group-open:text-sky-600">
                        자세히
                      </span>
                    </div>
                  </summary>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
                      {article.details.map((detail) => (
                        <li key={detail}>· {detail}</li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {article.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
