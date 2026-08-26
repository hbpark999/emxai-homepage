/**
 * 과정 게시판 — 교시/휴식 타이머 API
 *
 * GET  : 현재 종료 예정 시각(endsAt, ISO 문자열 | null)을 반환한다.
 * POST : { action: "start", minutes: number } 지금부터 minutes분 뒤로 종료 시각 설정,
 *        { action: "clear" } 타이머 해제.
 */

import { NextResponse } from "next/server";
import {
  clearTimer,
  getTimerEndsAt,
  isCompleteCounterConfigured,
  startTimer,
} from "@/lib/board/notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ActionPayload = {
  action?: "start" | "clear";
  minutes?: number;
};

export async function GET() {
  if (!isCompleteCounterConfigured()) {
    return NextResponse.json(
      { ok: false, error: "타이머가 아직 설정되지 않았습니다.", endsAt: null },
      { status: 200 },
    );
  }

  try {
    const endsAt = await getTimerEndsAt();
    return NextResponse.json({ ok: true, endsAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message, endsAt: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isCompleteCounterConfigured()) {
    return NextResponse.json(
      { ok: false, error: "타이머가 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as ActionPayload;

  try {
    if (payload.action === "clear") {
      await clearTimer();
      return NextResponse.json({ ok: true, endsAt: null });
    }

    const minutes = Number(payload.minutes);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return NextResponse.json(
        { ok: false, error: "남은 시간(분)을 올바르게 입력해 주세요." },
        { status: 400 },
      );
    }

    const endsAt = await startTimer(minutes);
    return NextResponse.json({ ok: true, endsAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
