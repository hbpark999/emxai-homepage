"use client";

/**
 * 교시/휴식 타이머 — 모래시계 표시 + 강사용 설정 컨트롤
 *
 * 강사가 "남은 시간(분)"을 입력하고 [설정]을 누르면, 그 시점 + N분을 종료 시각으로
 * Notion에 저장한다(완료 카운터와 같은 페이지의 날짜 속성). 모든 화면은 이 절대
 * 시각을 5초마다 다시 읽어와서, 각자 1초 단위로 카운트다운을 표시한다 — 그래서
 * 모든 수강생이 같은 종료 시각을 보게 된다(브라우저별 상태가 아님).
 */

import { useCallback, useEffect, useState, type FormEvent } from "react";

const POLL_MS = 5_000;

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatClock(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}

export function SessionTimer() {
  const [endsAt, setEndsAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [minutesInput, setMinutesInput] = useState("50");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/board/timer", { cache: "no-store" });
      const payload = (await response.json()) as { ok?: boolean; endsAt?: string | null };

      if (payload.ok) {
        setEndsAt(payload.endsAt ?? null);
      }
    } catch {
      // 폴링 중 일시적 오류는 무시하고 다음 주기에 재시도한다.
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(load, 0);
    const pollTimer = setInterval(load, POLL_MS);
    const tickTimer = setInterval(() => setNow(Date.now()), 1_000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(pollTimer);
      clearInterval(tickTimer);
    };
  }, [load]);

  async function act(action: "start" | "clear") {
    setPending(true);
    setError(null);

    try {
      const body = action === "start" ? { action, minutes: Number(minutesInput) } : { action };
      const response = await fetch("/api/board/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        endsAt?: string | null;
        error?: string;
      };

      if (!payload.ok) {
        setError(payload.error ?? "처리하지 못했습니다.");
        return;
      }

      setEndsAt(payload.endsAt ?? null);
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  async function submitStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await act("start");
  }

  const endsAtMs = endsAt ? new Date(endsAt).getTime() : null;
  const remainingMs = endsAtMs !== null ? endsAtMs - now : null;
  const isRunning = remainingMs !== null && remainingMs > 0;
  const isFinished = remainingMs !== null && remainingMs <= 0;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {isRunning ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-base font-black text-amber-700">
          ⏳ {formatRemaining(remainingMs)} 남음
          <span className="font-semibold text-amber-500">
            (종료 예정 {formatClock(endsAt as string)})
          </span>
        </span>
      ) : isFinished ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-base font-black text-slate-500">
          ⏳ 시간 종료
        </span>
      ) : null}

      <form onSubmit={submitStart} className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min={1}
          value={minutesInput}
          onChange={(event) => setMinutesInput(event.target.value)}
          className="w-20 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
        />
        <span className="text-sm font-semibold text-slate-500">분 남음으로 설정</span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-sky-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          설정
        </button>
        {endsAt ? (
          <button
            type="button"
            onClick={() => act("clear")}
            disabled={pending}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            중지
          </button>
        ) : null}
      </form>
      {error ? <p className="text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
