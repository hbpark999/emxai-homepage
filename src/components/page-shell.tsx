import Link from "next/link";
import { secondaryRoutes, type SiteRoute } from "@/lib/site-map";

type PageShellProps = {
  route: SiteRoute;
};

export function PageShell({ route }: PageShellProps) {
  return (
    <main className="flex-1 bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
            EMxAI Homepage
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">
            {route.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {route.description}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="rounded-lg border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Ready for content</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              This route is prepared as a clean page surface. Replace this area with
              sections, data, forms, media, or interactive tools when the page content
              is finalized.
            </p>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-950">Page Map</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {secondaryRoutes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-slate-600 transition hover:bg-white hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
