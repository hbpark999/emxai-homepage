import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

type PreviewAccessPayload = {
  email?: string;
  newsletter?: boolean;
};

function trimText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function richText(content: string) {
  return [{ type: "text", text: { content: content.slice(0, 2000) } }];
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_EDUCATION_PREVIEW_DB_ID;

  if (!token || !databaseId) {
    return NextResponse.json(
      { ok: false, error: "샘플 슬라이드 열람 저장소가 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as PreviewAccessPayload;
  const email = trimText(payload.email);
  const newsletter = Boolean(payload.newsletter);

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "올바른 이메일 주소를 입력해 주세요." },
      { status: 400 },
    );
  }

  const response = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: richText(`[교육 샘플 열람] ${email}`),
        },
        이메일: {
          email,
        },
        Newsletter: {
          checkbox: newsletter,
        },
        상태: {
          select: { name: "신규" },
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return NextResponse.json(
      {
        ok: false,
        error: `열람 등록에 실패했습니다. ${detail.slice(0, 200)}`,
      },
      { status: 500 },
    );
  }

  let emailSent = false;
  try {
    const result = await sendNotificationEmail({
      subject: `[EMxAI 교육 샘플 열람] ${email}`,
      text: `이메일: ${email}\nNewsletter 발송 희망: ${newsletter ? "예" : "아니오"}`,
    });
    emailSent = result.sent;
  } catch (error) {
    const message = error instanceof Error ? error.message : "메일 발송 실패";
    return NextResponse.json({ ok: true, emailSent: false, warning: message });
  }

  return NextResponse.json({ ok: true, emailSent });
}
