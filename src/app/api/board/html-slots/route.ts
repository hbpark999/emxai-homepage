/**
 * HTML 실습 1/2 공유 슬롯 API
 *
 * GET  : 두 슬롯의 현재 코드와 "사용 중" 상태를 반환한다.
 * POST : { slot: 1 | 2, code?: string, inUse?: boolean } 해당 슬롯만 갱신한다.
 */

import { NextResponse } from "next/server";
import { getHtmlSlots, isCompleteCounterConfigured, setHtmlSlot } from "@/lib/board/notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UpdatePayload = {
  slot?: number;
  code?: string;
  inUse?: boolean;
};

export async function GET() {
  if (!isCompleteCounterConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "실습 슬롯이 아직 설정되지 않았습니다.",
        slot1: { code: "", inUse: false },
        slot2: { code: "", inUse: false },
      },
      { status: 200 },
    );
  }

  try {
    const state = await getHtmlSlots();
    return NextResponse.json({ ok: true, ...state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isCompleteCounterConfigured()) {
    return NextResponse.json(
      { ok: false, error: "실습 슬롯이 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as UpdatePayload;

  if (payload.slot !== 1 && payload.slot !== 2) {
    return NextResponse.json({ ok: false, error: "잘못된 슬롯 번호입니다." }, { status: 400 });
  }

  try {
    await setHtmlSlot(payload.slot, { code: payload.code, inUse: payload.inUse });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
