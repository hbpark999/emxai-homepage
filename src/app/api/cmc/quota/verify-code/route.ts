import { NextRequest, NextResponse } from "next/server";
import { quotaStatus, validEmail, verifyOtp } from "@/lib/cmc-quota";
import { setVisitorCookie, visitorId } from "@/lib/cmc-visitor";

export async function POST(request: NextRequest) {
  const id = visitorId(request);
  try {
    const body = (await request.json()) as { email?: unknown; code?: unknown };
    if (!validEmail(body.email) || typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) {
      return NextResponse.json({ error: "이메일과 6자리 인증번호를 확인하세요." }, { status: 400 });
    }
    const result = await verifyOtp(id, body.email, body.code);
    if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 400 });
    const status = await quotaStatus(id);
    const response = NextResponse.json({ message: result.reason, ...status });
    setVisitorCookie(response, id);
    return response;
  } catch {
    return NextResponse.json({ error: "이메일 인증을 처리하지 못했습니다." }, { status: 503 });
  }
}
