import { knowledgeItems } from "@/data/updates-content";

export default function KnowledgePage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-14 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
            Knowledge
          </p>
          <h1 className="mt-4 text-3xl font-medium text-slate-950">게시</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            교육 영상, 기술 메모, 계산 도구를 바로 확인할 수 있도록 정리했습니다.
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[92vw] px-6 py-10 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <div className="grid gap-4 md:grid-cols-2">
          {knowledgeItems.map((item) => {
            const isExternal = item.href.startsWith("http");

            return (
              <a
                key={item.title}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <h2 className="text-lg font-medium text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                <span className="mt-5 inline-flex text-sm font-medium text-sky-600">
                  {item.action}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
