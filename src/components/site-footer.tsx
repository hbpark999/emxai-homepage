import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="text-lg font-semibold tracking-[0.08em]">EMxAI</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Engineering intelligence for simulation, education, and practical AI tools.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
          {secondaryRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="transition hover:text-white">
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
