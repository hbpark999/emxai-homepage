import { createHash, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AnalyticsSummary, VisitEvent } from "./types";

const dataDir = path.join(process.cwd(), ".analytics");
const eventsFile = path.join(dataDir, "visits.json");
const retentionLimit = 5000;

async function readEvents(): Promise<VisitEvent[]> {
  try {
    const raw = await readFile(eventsFile, "utf8");
    return JSON.parse(raw) as VisitEvent[];
  } catch {
    return [];
  }
}

async function writeEvents(events: VisitEvent[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(eventsFile, JSON.stringify(events.slice(-retentionLimit), null, 2), "utf8");
}

export function hashIp(ip: string) {
  const salt = process.env.ANALYTICS_SALT ?? "emxai-local-analytics";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16);
}

export async function recordVisit(event: Omit<VisitEvent, "id" | "timestamp">) {
  const events = await readEvents();
  events.push({
    ...event,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
  });
  await writeEvents(events);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const events = await readEvents();
  const today = new Date().toISOString().slice(0, 10);
  const recentEvents = [...events].reverse().slice(0, 50);
  const uniqueVisitors = new Set(events.map((event) => event.ipHash)).size;
  const byPage = new Map<string, number>();
  const byDate = new Map<string, number>();

  for (const event of events) {
    byPage.set(event.path, (byPage.get(event.path) ?? 0) + 1);
    const date = event.timestamp.slice(0, 10);
    byDate.set(date, (byDate.get(date) ?? 0) + 1);
  }

  return {
    totalViews: events.length,
    todayViews: events.filter((event) => event.timestamp.startsWith(today)).length,
    uniqueVisitors,
    humanViews: events.filter((event) => event.visitorKind === "human").length,
    aiBotViews: events.filter((event) => event.visitorKind === "ai_bot").length,
    searchBotViews: events.filter((event) => event.visitorKind === "search_bot").length,
    botViews: events.filter((event) => event.visitorKind === "bot").length,
    unknownViews: events.filter((event) => event.visitorKind === "unknown").length,
    topPages: [...byPage.entries()]
      .map(([pagePath, views]) => ({ path: pagePath, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
    recentEvents,
    dailyViews: [...byDate.entries()]
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14),
  };
}
