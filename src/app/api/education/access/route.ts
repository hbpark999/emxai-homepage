import { NextResponse } from "next/server";
import { getStudentCourse } from "@/data/student-courses";
import {
  createAccessToken,
  getAccessCookieName,
  getCoursePassword,
  isCoursePasswordConfigured,
} from "@/lib/education/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AccessPayload = {
  course?: string;
  password?: string;
};

function getNextKoreanMidnight() {
  const now = new Date();
  const koreaOffsetMs = 9 * 60 * 60 * 1000;
  const koreanNow = new Date(now.getTime() + koreaOffsetMs);

  return new Date(
    Date.UTC(
      koreanNow.getUTCFullYear(),
      koreanNow.getUTCMonth(),
      koreanNow.getUTCDate() + 1,
    ) - koreaOffsetMs,
  );
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as AccessPayload;
  const course = payload.course ? getStudentCourse(payload.course) : null;

  if (!course) {
    return NextResponse.json({ ok: false, error: "과정을 찾을 수 없습니다." }, { status: 404 });
  }

  if (!isCoursePasswordConfigured(course)) {
    return NextResponse.json(
      { ok: false, error: "아직 과정 비밀번호가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  if (payload.password !== getCoursePassword(course)) {
    return NextResponse.json(
      { ok: false, error: "비밀번호가 맞지 않습니다." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAccessCookieName(course), createAccessToken(course), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // 한국시간 기준 당일에는 다시 비밀번호를 묻지 않는다. 과정 비밀번호가 바뀌면
    // 토큰 값도 달라지므로 만료 전이라도 기존 쿠키는 자동으로 무효화된다.
    expires: getNextKoreanMidnight(),
    path: "/",
  });

  return response;
}
