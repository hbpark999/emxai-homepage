import { NextRequest, NextResponse } from "next/server";
import { consumeQuota } from "@/lib/cmc-quota";
import { setVisitorCookie, visitorId } from "@/lib/cmc-visitor";

export async function POST(request: NextRequest) {
  const base = process.env.CMC_API_URL;
  if (!base) return NextResponse.json({ error: "예측 서버 연결 전입니다. CMC_API_URL을 설정하세요." }, { status: 503 });
  const id = visitorId(request);
  try {
    const body = await request.text();
    if (body.length > 2048) return NextResponse.json({ error: "입력값이 너무 큽니다." }, { status: 413 });
    JSON.parse(body);
    const quota = await consumeQuota(id);
    if (!quota.allowed) {
      const response = NextResponse.json({ error: quota.bonus ? "오늘의 최대 사용 횟수 200회를 모두 사용했습니다." : "기본 100회를 모두 사용했습니다. 이메일 인증으로 100회를 추가할 수 있습니다.", quota }, { status: 429 });
      setVisitorCookie(response, id);
      return response;
    }
    const upstream = await fetch(`${base.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.CMC_INTERNAL_API_KEY ? { "X-EMXAI-API-Key": process.env.CMC_INTERNAL_API_KEY } : {}) },
      body,
      signal: AbortSignal.timeout(30000),
      cache: "no-store",
    });
    if (!upstream.ok) return NextResponse.json({ error: "입력 범위 또는 예측 서버 상태를 확인하세요.", quota }, { status: upstream.status });
    const result = await upstream.json();
    const response = NextResponse.json({ ...result, quota });
    setVisitorCookie(response, id);
    return response;
  } catch (error) {
    const configurationError = error instanceof Error && /not configured|quota store/i.test(error.message);
    return NextResponse.json({ error: configurationError ? "사용량 관리 서버 설정을 확인하세요." : "예측 요청을 처리하지 못했습니다." }, { status: configurationError ? 503 : 502 });
  }
}
