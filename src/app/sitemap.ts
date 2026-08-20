import type { MetadataRoute } from "next";
import { siteRoutes } from "@/lib/site-map";

const siteUrl = "https://www.emxai.net";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.map((route) => ({
    url: `${siteUrl}${route.href}`,
    lastModified: new Date(),
    changeFrequency: route.href === "/news-event" ? "weekly" : "monthly",
    priority: route.href === "/" ? 1 : 0.7,
  }));
}
