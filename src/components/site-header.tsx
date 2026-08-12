import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="EMxAI home">
          <span className="grid size-9 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
            E
          </span>
          <span className="text-lg font-semibold tracking-[0.08em] text-slate-950">
            EMxAI
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
          {secondaryRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="transition hover:text-slate-950">
              {route.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
