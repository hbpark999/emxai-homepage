import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

type ProposalPayload = {
  name?: string;
  email?: string;
  company?: string;
  summary?: string;
};

function trimText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function richText(content: string) {
  return [{ type: "text", text: { content: content.slice(0, 2000) } }];
}

export async function POST(request: Request) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_EDUCATION_INQUIRY_DB_ID;

  if (!token || !databaseId) {
    return NextResponse.json(
      { ok: false, error: "교육 문의 저장소가 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as ProposalPayload;
  const name = trimText(payload.name);
  const email = trimText(payload.email);
  const company = trimText(payload.company);
  const summary = trimText(payload.summary);

  if (!name || !email || !company || !summary) {
    return NextResponse.json(
      { ok: false, error: "필수 항목을 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  const content = [
    `성함: ${name}`,
    `연락처(e-mail): ${email}`,
    `회사: ${company}`,
    "",
    "요청 교육 요약(교육 내용, 참석자):",
    summary,
  ].join("\n");

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
          title: richText(`[제안서 요청] ${company} - ${name}`),
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
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return NextResponse.json(
      {
        ok: false,
        error: `접수 저장에 실패했습니다. ${detail.slice(0, 200)}`,
      },
      { status: 500 },
    );
  }

  let emailSent = false;
  try {
    const result = await sendNotificationEmail({
      subject: `[EMxAI 교육 제안서 요청] ${company} - ${name}`,
      text: content,
    });
    emailSent = result.sent;
  } catch (error) {
    const message = error instanceof Error ? error.message : "메일 발송 실패";
    return NextResponse.json({ ok: true, emailSent: false, warning: message });
  }

  return NextResponse.json({ ok: true, emailSent });
}
