import "server-only";

import { createHash, createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

export const BASE_LIMIT = 100;
export const BONUS_LIMIT = 100;
export const MAX_LIMIT = BASE_LIMIT + BONUS_LIMIT;

type OtpRecord = { hash: string; email: string; expiresAt: number; attempts: number };

const memory = new Map<string, { value: string; expiresAt: number }>();

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function command(parts: Array<string | number>) {
  const config = redisConfig();
  if (!config) {
    if (process.env.NODE_ENV === "production") throw new Error("CMC quota store is not configured");
    const [name, key, value, , ttl] = parts;
    if (name === "GET") {
      const item = memory.get(String(key));
      if (!item || item.expiresAt < Date.now()) return null;
      return item.value;
    }
    if (name === "SET") {
      memory.set(String(key), { value: String(value), expiresAt: Date.now() + Number(ttl) * 1000 });
      return "OK";
    }
    if (name === "INCR") {
      const item = memory.get(String(key));
      const next = (item && item.expiresAt >= Date.now() ? Number(item.value) : 0) + 1;
      memory.set(String(key), { value: String(next), expiresAt: item?.expiresAt ?? Date.now() + 172800000 });
      return next;
    }
    if (name === "EXPIRE") {
      const item = memory.get(String(key));
      if (item) item.expiresAt = Date.now() + Number(value) * 1000;
      return 1;
    }
    if (name === "DEL") return memory.delete(String(key)) ? 1 : 0;
    return null;
  }
  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(parts),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Quota store error (${response.status})`);
  const body = (await response.json()) as { result: unknown };
  return body.result;
}

function secret() {
  const value = process.env.CMC_QUOTA_SECRET;
  if (!value) throw new Error("CMC_QUOTA_SECRET is not configured");
  return value;
}

export function koreaDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function hash(value: string) {
  return createHmac("sha256", secret()).update(value.trim().toLowerCase()).digest("hex");
}

export function makeVisitorId() {
  return createHash("sha256").update(`${randomUUID()}-${Date.now()}`).digest("hex").slice(0, 32);
}

export function validEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function createOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function saveOtp(visitorId: string, email: string, code: string) {
  const record: OtpRecord = { email: email.trim().toLowerCase(), hash: hash(`${email}:${code}`), expiresAt: Date.now() + 10 * 60_000, attempts: 0 };
  await command(["SET", `cmc:otp:${visitorId}`, JSON.stringify(record), "EX", 600]);
}

export async function allowOtpRequest(visitorId: string) {
  const key = `cmc:otp-send:${koreaDate()}:${visitorId}`;
  const count = Number(await command(["INCR", key]));
  if (count === 1) await command(["EXPIRE", key, 900]);
  return count <= 3;
}

export async function verifyOtp(visitorId: string, email: string, code: string) {
  const key = `cmc:otp:${visitorId}`;
  const raw = await command(["GET", key]);
  if (typeof raw !== "string") return { ok: false, reason: "인증번호가 만료되었습니다." };
  const record = JSON.parse(raw) as OtpRecord;
  if (record.expiresAt < Date.now()) return { ok: false, reason: "인증번호가 만료되었습니다." };
  if (record.attempts >= 5) return { ok: false, reason: "입력 횟수를 초과했습니다. 인증번호를 다시 요청하세요." };
  const expected = Buffer.from(record.hash, "hex");
  const actual = Buffer.from(hash(`${email}:${code}`), "hex");
  if (record.email !== email.trim().toLowerCase() || expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    record.attempts += 1;
    await command(["SET", key, JSON.stringify(record), "EX", Math.max(1, Math.ceil((record.expiresAt - Date.now()) / 1000))]);
    return { ok: false, reason: "인증번호가 일치하지 않습니다." };
  }
  await command(["DEL", key]);
  await command(["SET", `cmc:bonus:${koreaDate()}:${visitorId}`, hash(email), "EX", 172800]);
  return { ok: true, reason: "이메일 인증이 완료되어 오늘 100회가 추가되었습니다." };
}

export async function quotaStatus(visitorId: string) {
  const date = koreaDate();
  const usedRaw = await command(["GET", `cmc:used:${date}:${visitorId}`]);
  const bonus = Boolean(await command(["GET", `cmc:bonus:${date}:${visitorId}`]));
  const used = Number(usedRaw ?? 0);
  const limit = bonus ? MAX_LIMIT : BASE_LIMIT;
  return { used, limit, remaining: Math.max(0, limit - used), bonus };
}

export async function consumeQuota(visitorId: string) {
  const status = await quotaStatus(visitorId);
  if (status.remaining <= 0) return { ...status, allowed: false };
  const key = `cmc:used:${koreaDate()}:${visitorId}`;
  const used = Number(await command(["INCR", key]));
  if (used === 1) await command(["EXPIRE", key, 172800]);
  const limit = status.limit;
  return { used, limit, remaining: Math.max(0, limit - used), bonus: status.bonus, allowed: used <= limit };
}
