export type VisitorKind = "human" | "ai_bot" | "search_bot" | "bot" | "unknown";

export type VisitEvent = {
  id: string;
  timestamp: string;
  path: string;
  referrer: string;
  userAgent: string;
  visitorKind: VisitorKind;
  visitorLabel: string;
  ipHash: string;
  country?: string;
};

export type AnalyticsSummary = {
  totalViews: number;
  todayViews: number;
  uniqueVisitors: number;
  humanViews: number;
  aiBotViews: number;
  searchBotViews: number;
  botViews: number;
  unknownViews: number;
  topPages: Array<{ path: string; views: number }>;
  recentEvents: VisitEvent[];
  dailyViews: Array<{ date: string; views: number }>;
};
