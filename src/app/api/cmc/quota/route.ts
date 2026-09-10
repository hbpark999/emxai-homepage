import { NextRequest, NextResponse } from "next/server";
import { quotaStatus } from "@/lib/cmc-quota";
import { setVisitorCookie, visitorId } from "@/lib/cmc-visitor";

export async function GET(request: NextRequest) {
  const id = visitorId(request);
  try {
    const response = NextResponse.json(await quotaStatus(id));
    setVisitorCookie(response, id);
    return response;
  } catch {
    return NextResponse.json({ error: "사용량 관리 서버 설정을 확인하세요." }, { status: 503 });
  }
}
