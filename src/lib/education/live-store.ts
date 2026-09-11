import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

const SESSION_ID = "default";

export type CompleteCounterState = { count: number; round: number };
export type HtmlSlotState = {
  code: string;
  inUse: boolean;
  ownerId: string | null;
  lockExpiresAt: string | null;
};
export type HtmlSlotsState = { slot1: HtmlSlotState; slot2: HtmlSlotState };

export { isSupabaseConfigured as isEducationLiveStoreConfigured };

function throwDatabaseError(error: { message: string } | null, fallback: string) {
  if (error) throw new Error(`${fallback}: ${error.message}`);
}

export async function getCompleteCount(): Promise<CompleteCounterState> {
  const { data, error } = await getSupabaseAdmin()
    .from("education_live_state")
    .select("complete_count, round")
    .eq("id", SESSION_ID)
    .single();
  throwDatabaseError(error, "카운터 조회 실패");
  return { count: data?.complete_count ?? 0, round: data?.round ?? 0 };
}

export async function incrementCompleteCount(studentId: string): Promise<CompleteCounterState> {
  const { data, error } = await getSupabaseAdmin().rpc("increment_complete_count", {
    p_session_id: SESSION_ID,
    p_student_id: studentId,
  });
  throwDatabaseError(error, "카운터 갱신 실패");
  const row = Array.isArray(data) ? data[0] : data;
  return { count: row?.complete_count ?? 0, round: row?.round ?? 0 };
}

export async function resetCompleteCount(): Promise<CompleteCounterState> {
  const { data, error } = await getSupabaseAdmin().rpc("reset_complete_count", {
    p_session_id: SESSION_ID,
  });
  throwDatabaseError(error, "카운터 초기화 실패");
  const row = Array.isArray(data) ? data[0] : data;
  return { count: row?.complete_count ?? 0, round: row?.round ?? 0 };
}

export async function getTimerEndsAt(): Promise<string | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("education_live_state")
    .select("timer_ends_at")
    .eq("id", SESSION_ID)
    .single();
  throwDatabaseError(error, "타이머 조회 실패");
  return data?.timer_ends_at ?? null;
}

async function writeTimerEndsAt(endsAt: string | null) {
  const { error } = await getSupabaseAdmin()
    .from("education_live_state")
    .update({ timer_ends_at: endsAt, updated_at: new Date().toISOString() })
    .eq("id", SESSION_ID);
  throwDatabaseError(error, "타이머 갱신 실패");
  return endsAt;
}

export function startTimer(minutes: number) {
  return writeTimerEndsAt(new Date(Date.now() + minutes * 60_000).toISOString());
}

export function clearTimer() {
  return writeTimerEndsAt(null);
}

function mapSlot(row: Record<string, unknown> | undefined): HtmlSlotState {
  const lockExpiresAt = typeof row?.lock_expires_at === "string" ? row.lock_expires_at : null;
  const lockExpired = lockExpiresAt !== null && new Date(lockExpiresAt).getTime() <= Date.now();
  return {
    code: typeof row?.code === "string" ? row.code : "",
    inUse: Boolean(row?.in_use) && !lockExpired,
    ownerId: lockExpired ? null : typeof row?.owner_id === "string" ? row.owner_id : null,
    lockExpiresAt: lockExpired ? null : lockExpiresAt,
  };
}

export async function getHtmlSlots(): Promise<HtmlSlotsState> {
  const { data, error } = await getSupabaseAdmin()
    .from("education_html_slots")
    .select("slot, code, in_use, owner_id, lock_expires_at")
    .eq("session_id", SESSION_ID)
    .order("slot");
  throwDatabaseError(error, "실습 슬롯 조회 실패");
  const slot1 = data?.find((row) => row.slot === 1);
  const slot2 = data?.find((row) => row.slot === 2);
  return { slot1: mapSlot(slot1), slot2: mapSlot(slot2) };
}

export async function setHtmlSlot(
  slot: 1 | 2,
  update: { code?: string; inUse?: boolean },
  ownerId: string,
  forceRelease = false,
) {
  const { data, error } = await getSupabaseAdmin().rpc("update_html_slot", {
    p_session_id: SESSION_ID,
    p_slot: slot,
    p_owner_id: ownerId,
    p_code: update.code ?? null,
    p_in_use: update.inUse ?? null,
    p_force_release: forceRelease,
  });
  throwDatabaseError(error, "실습 슬롯 갱신 실패");
  const row = Array.isArray(data) ? data[0] : data;
  return mapSlot(row);
}
