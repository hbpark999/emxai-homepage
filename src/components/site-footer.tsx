import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

export function SiteFooter() {
  return (
    <footer className="bg-[#2563eb] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-base font-black">
            이엠엑스아이(주) <span className="text-sm font-semibold">EMxAI Inc.</span>
          </p>
          <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/90">
            경기도 수원시 영통구 신원로 250번길 13, 현대테라타워 영통 B동 1022호
          </p>
          <p className="mt-6 text-xs font-bold text-white/90">
            Copyright © EMxAI Inc. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-6 lg:items-end">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white">
            <a href="mailto:contact@emxai.net" className="transition hover:text-lime-200">
              ✉ contact@emxai.net
            </a>
            <a href="tel:031-216-2806" className="transition hover:text-lime-200">
              ☎ 031-216-2806
            </a>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/80">
            {secondaryRoutes.map((route) => (
              <Link key={route.href} href={route.href} className="transition hover:text-white">
                {route.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs font-black text-white">
            AI-powered EMI/SI Design · Analysis · Education
          </p>
        </div>
      </div>
    </footer>
  );
}
