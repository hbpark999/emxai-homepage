import { knowledgeItems } from "@/data/updates-content";

export default function NewsEventPage() {
  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-16 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
              Knowledge
            </p>
            <h1 className="mt-4 text-3xl font-medium tracking-normal text-slate-950 sm:text-4xl">
              사이트 이전, 보완 중
            </h1>
          </div>

          <div className="mt-14 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-medium text-slate-950">게시</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {knowledgeItems.map((item) => {
                const isExternal = item.href.startsWith("http");

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="rounded-md border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-950">{item.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{item.body}</p>
                    <span className="mt-3 inline-flex text-xs text-slate-500">{item.action}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
