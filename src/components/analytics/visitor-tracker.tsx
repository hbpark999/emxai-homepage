"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer,
      }),
      keepalive: true,
    }).catch(() => {
      // Analytics must never interrupt the visitor experience.
    });
  }, [pathname, searchParams]);

  return null;
}
