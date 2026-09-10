import { NextRequest, NextResponse } from "next/server";
import { allowOtpRequest, createOtp, quotaStatus, saveOtp, validEmail } from "@/lib/cmc-quota";
import { setVisitorCookie, visitorId } from "@/lib/cmc-visitor";
import { sendNotificationEmail } from "@/lib/notification-email";

export async function POST(request: NextRequest) {
  const id = visitorId(request);
  try {
    const body = (await request.json()) as { email?: unknown };
    if (!validEmail(body.email)) return NextResponse.json({ error: "올바른 이메일 주소를 입력하세요." }, { status: 400 });
    const status = await quotaStatus(id);
    if (status.bonus) return NextResponse.json({ error: "오늘 추가 사용량을 이미 받았습니다." }, { status: 409 });
    if (status.remaining > 0) return NextResponse.json({ error: `기본 사용량이 ${status.remaining}회 남아 있습니다.` }, { status: 409 });
    if (!await allowOtpRequest(id)) return NextResponse.json({ error: "인증번호 요청이 많습니다. 15분 후 다시 시도하세요." }, { status: 429 });
    const code = createOtp();
    await saveOtp(id, body.email, code);
    await sendNotificationEmail({
      to: body.email,
      subject: "[EMxAI] CE-CMF 추가 사용 인증번호",
      text: `인증번호는 ${code} 입니다.\n\n10분 안에 입력해 주세요. 본인이 요청하지 않았다면 이 메일을 무시해 주세요.`,
    });
    const response = NextResponse.json({ message: "인증번호를 이메일로 발송했습니다." });
    setVisitorCookie(response, id);
    return response;
  } catch {
    return NextResponse.json({ error: "인증번호를 발송하지 못했습니다. 잠시 후 다시 시도하세요." }, { status: 503 });
  }
}
