export async function POST(request: Request) {
  const base = process.env.CMC_API_URL;
  if (!base) return Response.json({ error: "예측 서버 연결 전입니다. CMC_API_URL을 설정하세요." }, { status: 503 });
  try {
    const body = await request.text();
    if (body.length > 2048) return Response.json({ error: "입력이 너무 큽니다." }, { status: 413 });
    JSON.parse(body);
    const response = await fetch(`${base.replace(/\/$/, "")}/predict`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body,
      signal: AbortSignal.timeout(30000), cache: "no-store",
    });
    if (!response.ok) return Response.json({ error: "입력 범위 또는 예측 서버 상태를 확인하세요." }, { status: response.status });
    return Response.json(await response.json());
  } catch {
    return Response.json({ error: "예측 요청을 처리하지 못했습니다." }, { status: 502 });
  }
}
