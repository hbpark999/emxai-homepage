import { NextRequest, NextResponse } from "next/server";
import { isValidAnalyticsPassword } from "@/lib/analytics/auth";
import { getAnalyticsSummary } from "@/lib/analytics/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };

  if (!isValidAnalyticsPassword(body.password ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getAnalyticsSummary();

  return NextResponse.json(summary);
}
