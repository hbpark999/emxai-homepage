import Image from "next/image";
import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#183553] bg-[#0d2238]/95 shadow-[0_8px_24px_rgba(2,8,23,0.16)] backdrop-blur">
      <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-300 to-lime-300" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center rounded-md bg-white px-3 py-1 ring-1 ring-white/20 transition hover:ring-cyan-200"
          aria-label="EMxAI home"
        >
          <Image
            src="/EMxAI Logo20251219.jpeg"
            alt="EMxAI"
            width={180}
            height={100}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-2 text-2xl font-semibold text-slate-100 lg:flex xl:gap-3">
          {secondaryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={
                route.href === "/contact"
                  ? "rounded-md bg-[#08a99d] px-5 py-3 text-white shadow-sm shadow-cyan-950/20 transition hover:bg-[#22c7ba]"
                  : "rounded-md px-3 py-3 text-slate-100 transition hover:bg-white/10 hover:text-cyan-100 xl:px-4"
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
