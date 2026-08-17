import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  type?: string;
  message?: string;
};

function trimText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function richText(content: string) {
  return [{ type: "text", text: { content: content.slice(0, 2000) } }];
}

export async function POST(request: Request) {
  const token = process.env.NOTION_TOKEN;
  const boardDatabaseId = process.env.NOTION_BOARD_DB_ID;
  const educationInquiryDatabaseId = process.env.NOTION_EDUCATION_INQUIRY_DB_ID;

  if (!token || !boardDatabaseId) {
    return NextResponse.json(
      { ok: false, error: "문의 저장소가 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as ContactPayload;
  const name = trimText(payload.name);
  const email = trimText(payload.email);
  const company = trimText(payload.company);
  const type = trimText(payload.type) || "일반 문의";
  const message = trimText(payload.message);

  if (!name || !email || !company || !message) {
    return NextResponse.json(
      { ok: false, error: "필수 항목을 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  const content = [
    `성함: ${name}`,
    `연락처(e-mail): ${email}`,
    `회사: ${company}`,
    `문의 유형: ${type}`,
    "",
    "문의 내용:",
    message,
  ].join("\n");
  const isEducationInquiry = type.includes("교육") || type.includes("자문");
  const databaseId =
    isEducationInquiry && educationInquiryDatabaseId
      ? educationInquiryDatabaseId
      : boardDatabaseId;
  const properties = isEducationInquiry && educationInquiryDatabaseId
    ? {
        Name: {
          title: richText(`[교육 문의] ${company} - ${name}`),
        },
        회사: {
          rich_text: richText(company),
        },
        이메일: {
          email,
        },
        요청내용: {
          rich_text: richText(content),
        },
        상태: {
          select: { name: "신규" },
        },
      }
    : {
        Name: {
          title: richText(`[문의] ${company} - ${name}`),
        },
        내용: {
          rich_text: richText(content),
        },
        공개: {
          checkbox: false,
        },
        과정: {
          select: { name: "홈페이지 문의" },
        },
      };

  const response = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: `문의 접수에 실패했습니다. ${detail.slice(0, 200)}` },
      { status: 500 },
    );
  }

  let emailSent = false;
  try {
    const result = await sendNotificationEmail({
      subject: `[EMxAI 홈페이지 문의] ${company} - ${name}`,
      text: content,
    });
    emailSent = result.sent;
  } catch (error) {
    const message = error instanceof Error ? error.message : "메일 발송 실패";
    return NextResponse.json({ ok: true, emailSent: false, warning: message });
  }

  return NextResponse.json({ ok: true, emailSent });
}
