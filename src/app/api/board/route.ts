/**
 * 실시간 교육 게시판 — 조회 API
 *
 * 용도 : GET /api/board 로 게시글 목록(JSON)을 내려준다.
 *        게시판 페이지가 5초마다 이 주소를 호출해 화면을 갱신한다.
 *
 * 참고 : Notion 토큰은 서버에서만 사용되며 브라우저로 노출되지 않는다.
 *        실제 Notion 호출은 5초 캐시가 걸려 있다(src/lib/board/notion.ts).
 */

import { NextResponse } from "next/server";
import { getBoardPosts, isBoardConfigured } from "@/lib/board/notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isBoardConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "게시판이 아직 설정되지 않았습니다. 환경변수를 확인하세요.",
        posts: [],
      },
      { status: 200 },
    );
  }

  try {
    const posts = await getBoardPosts();

    return NextResponse.json({
      ok: true,
      configured: true,
      posts,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";

    return NextResponse.json(
      { ok: false, configured: true, error: message, posts: [] },
      { status: 500 },
    );
  }
}
