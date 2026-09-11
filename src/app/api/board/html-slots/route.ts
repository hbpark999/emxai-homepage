/**
 * HTML 실습 1/2 공유 슬롯 API
 *
 * GET  : 두 슬롯의 현재 코드와 사용 상태를 반환한다.
 * POST : 슬롯을 갱신하거나 관리자 인증 후 점유를 강제 해제한다.
 */

import { NextResponse } from "next/server";
import { isValidAnalyticsPassword } from "@/lib/analytics/auth";
import { getHtmlSlots, isEducationLiveStoreConfigured, setHtmlSlot } from "@/lib/education/live-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UpdatePayload = {
  slot?: number;
  code?: string;
  inUse?: boolean;
  forceRelease?: boolean;
  password?: string;
  ownerId?: string;
};

export async function GET() {
  if (!isEducationLiveStoreConfigured()) {
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
  if (!isEducationLiveStoreConfigured()) {
    return NextResponse.json(
      { ok: false, error: "실습 슬롯이 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as UpdatePayload;

  if (payload.slot !== 1 && payload.slot !== 2) {
    return NextResponse.json({ ok: false, error: "잘못된 슬롯 번호입니다." }, { status: 400 });
  }

  if (payload.forceRelease) {
    if (!isValidAnalyticsPassword(payload.password ?? "")) {
      return NextResponse.json(
        { ok: false, error: "관리자 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    try {
      await setHtmlSlot(payload.slot, { inUse: false }, payload.ownerId ?? "admin", true);
      return NextResponse.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "강제 해제 중 오류가 발생했습니다.";
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
  }

  if (!payload.ownerId || payload.ownerId.length > 100) {
    return NextResponse.json({ ok: false, error: "사용자 식별 정보가 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const state = await setHtmlSlot(
      payload.slot,
      { code: payload.code, inUse: payload.inUse },
      payload.ownerId,
    );
    return NextResponse.json({ ok: true, state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
