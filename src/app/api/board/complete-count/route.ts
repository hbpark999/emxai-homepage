/**
 * 과정 게시판 — "작업완료" 카운터 API
 *
 * GET  : 현재 { count, round }을 반환한다.
 * POST : { action: "increment" } 카운트 +1 (round는 그대로),
 *        { action: "reset" } 카운트를 0으로, round를 +1 한다.
 *
 * round는 화면에서 "한 사람당 한 번만 반영"을 구현하는 데 쓰인다 — 초기화가 round를
 * 올리므로, 학생 브라우저는 자신이 클릭했던 round와 다르면 다시 누를 수 있다.
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
      { ok: false, error: "카운터가 아직 설정되지 않았습니다.", count: 0, round: 0 },
      { status: 200 },
    );
  }

  try {
    const state = await getCompleteCount();
    return NextResponse.json({ ok: true, ...state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message, count: 0, round: 0 }, { status: 500 });
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
    const state =
      payload.action === "reset" ? await resetCompleteCount() : await incrementCompleteCount();
    return NextResponse.json({ ok: true, ...state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
