import { NextRequest, NextResponse } from "next/server";
import { makeVisitorId } from "@/lib/cmc-quota";

export const VISITOR_COOKIE = "cmc_visitor";

export function visitorId(request: NextRequest) {
  const current = request.cookies.get(VISITOR_COOKIE)?.value;
  return current && /^[a-f0-9]{32}$/.test(current) ? current : makeVisitorId();
}

export function setVisitorCookie(response: NextResponse, id: string) {
  response.cookies.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
