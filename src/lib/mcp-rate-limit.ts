/**
 * mcp-rate-limit.ts
 * MCP 라우트별 하루 전체 호출 횟수를 제한한다. Vercel 서버리스는 요청 간
 * 메모리를 공유하지 않으므로 카운트는 Supabase(increment_mcp_usage RPC,
 * 원자적 증가)에 둔다. Supabase가 설정돼 있지 않으면 제한 없이 통과시킨다
 * (로컬 개발 등에서 이 기능 하나 때문에 전체가 막히지 않도록).
 */

import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function checkAndIncrementDailyUsage(
  route: string,
  limit: number
): Promise<{ allowed: boolean; count: number }> {
  if (!isSupabaseConfigured()) {
    return { allowed: true, count: 0 };
  }

  const { data, error } = await getSupabaseAdmin().rpc("increment_mcp_usage", {
    p_route: route,
    p_limit: limit,
  });

  if (error) {
    // 사용량 집계 실패로 툴 자체를 막지는 않는다 - 계측 문제가 서비스
    // 장애로 번지면 안 된다.
    console.error(`[mcp-rate-limit] ${route} 사용량 집계 실패:`, error.message);
    return { allowed: true, count: 0 };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return { allowed: Boolean(row?.allowed ?? true), count: row?.count ?? 0 };
}
