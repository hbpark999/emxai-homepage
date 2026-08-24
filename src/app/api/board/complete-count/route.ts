/**
 * 과정 게시판 — "작업완료" 카운터 API
 *
 * GET  : 현재 카운트를 반환한다.
 * POST : { action: "increment" } 카운트 +1, { action: "reset" } 카운트를 0으로 되돌린다.
 */

import { NextResponse } from "next/server";
import {
  getCompleteCount,
  incrementCompleteCount,
  isCompleteCounterConfigured,
  resetCompleteCount,
} from "@/lib/board/notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActionPayload = {
  action?: "increment" | "reset";
};

export async function GET() {
  if (!isCompleteCounterConfigured()) {
    return NextResponse.json(
      { ok: false, error: "카운터가 아직 설정되지 않았습니다.", count: 0 },
      { status: 200 },
    );
  }

  try {
    const count = await getCompleteCount();
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message, count: 0 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isCompleteCounterConfigured()) {
    return NextResponse.json(
      { ok: false, error: "카운터가 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as ActionPayload;

  try {
    const count =
      payload.action === "reset" ? await resetCompleteCount() : await incrementCompleteCount();
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
