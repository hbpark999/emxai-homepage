import { NextRequest, NextResponse } from "next/server";
import { classifyVisitor } from "@/lib/analytics/classify";
import { hashIp, recordVisit } from "@/lib/analytics/store";

export const runtime = "nodejs";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor || realIp || "local";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { path?: string; referrer?: string };
    const userAgent = request.headers.get("user-agent") ?? "";
    const visitor = classifyVisitor(userAgent);

    await recordVisit({
      path: body.path?.slice(0, 240) || "/",
      referrer: body.referrer?.slice(0, 500) || "",
      userAgent: userAgent.slice(0, 500),
      visitorKind: visitor.kind,
      visitorLabel: visitor.label,
      ipHash: hashIp(getClientIp(request)),
      country: request.headers.get("x-vercel-ip-country") ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
