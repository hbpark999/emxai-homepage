import Image from "next/image";
import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#f7fbff]/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur">
      <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-300 to-lime-300" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center rounded-md bg-white/75 px-3 py-1.5 ring-1 ring-slate-200/70 transition hover:ring-sky-200"
          aria-label="EMxAI home"
        >
          <Image
            src="/EMxAI Logo20251219.jpeg"
            alt="EMxAI"
            width={180}
            height={100}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-semibold text-slate-600 lg:flex">
          {secondaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={
                route.href === "/contact"
                  ? "rounded-md bg-[#059f94] px-4 py-2 text-white shadow-sm transition hover:bg-[#047f78]"
                  : "rounded-md px-3 py-2 transition hover:bg-white hover:text-[#0f766e] hover:shadow-sm"
              }
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
