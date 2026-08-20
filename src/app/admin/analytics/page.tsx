import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
