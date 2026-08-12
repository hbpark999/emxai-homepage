import Image from "next/image";
import Link from "next/link";
import { secondaryRoutes } from "@/lib/site-map";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="EMxAI home">
          <Image
            src="/EMxAI Logo20251219.jpeg"
            alt="EMxAI"
            width={180}
            height={100}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {secondaryRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="transition hover:text-slate-950">
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
