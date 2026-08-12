import { PageShell } from "@/components/page-shell";
import { siteRoutes } from "@/lib/site-map";

export default function NewsEventPage() {
  return <PageShell route={siteRoutes.find((route) => route.href === "/news-event")!} />;
}
