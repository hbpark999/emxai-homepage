type EmailParams = {
  subject: string;
  text: string;
};

export async function sendNotificationEmail({ subject, text }: EmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "hbpark@emxai.net";
  const from = process.env.CONTACT_FROM_EMAIL ?? "EMxAI <no-reply@send.emxai.net>";

  if (!apiKey) {
    return { sent: false, reason: "RESEND_API_KEY is not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`메일 발송 실패 (${response.status}). ${detail.slice(0, 300)}`);
  }

  return { sent: true };
}
