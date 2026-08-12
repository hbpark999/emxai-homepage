"use client";

import { useState } from "react";
import type { AnalyticsSummary } from "@/lib/analytics/types";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAnalytics(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("비밀번호를 확인해 주세요.");
      setSummary(null);
      return;
    }

    setSummary((await response.json()) as AnalyticsSummary);
  }

  if (!summary) {
    return (
      <main className="flex-1 bg-[#f6f9fc]">
        <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center px-6 py-16">
          <form
            onSubmit={loadAnalytics}
            className="w-full rounded-lg border border-slate-200 bg-white p-7 shadow-sm"
          >
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
              Admin
            </p>
            <h1 className="mt-4 text-2xl font-medium text-slate-950">
              방문자 관리 대시보드
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              관리자 비밀번호를 입력하면 방문자 통계를 확인할 수 있습니다.
            </p>
            <label className="mt-6 grid gap-2 text-sm text-slate-600">
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-md border border-slate-200 px-3 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-md bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-wait disabled:bg-slate-300"
            >
              {loading ? "확인 중" : "대시보드 보기"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f6f9fc]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[92vw] px-6 py-14 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-500">
                Admin
              </p>
              <h1 className="mt-4 text-3xl font-medium text-slate-950">
                방문자 관리 대시보드
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                IP 원문은 저장하지 않고 해시만 기록합니다. User-Agent 기반으로 사람,
                AI bot, 검색 bot을 추정합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSummary(null);
                setPassword("");
              }}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-500"
            >
              잠금
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[92vw] px-6 py-10 sm:px-8 lg:max-w-[76vw] xl:max-w-[70vw]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="전체 페이지뷰" value={summary.totalViews} />
          <StatCard label="오늘 페이지뷰" value={summary.todayViews} />
          <StatCard label="익명 방문자" value={summary.uniqueVisitors} />
          <StatCard label="AI bot 추정" value={summary.aiBotViews} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-medium text-slate-950">방문자 유형</h2>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["사람 추정", summary.humanViews],
                ["AI bot 추정", summary.aiBotViews],
                ["검색 bot", summary.searchBotViews],
                ["기타 bot", summary.botViews],
                ["알 수 없음", summary.unknownViews],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-medium text-slate-950">상위 페이지</h2>
            <div className="mt-5 space-y-3 text-sm">
              {summary.topPages.length ? (
                summary.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between gap-4 rounded bg-slate-50 px-4 py-3">
                    <span className="truncate text-slate-600">{page.path}</span>
                    <span className="shrink-0 font-medium text-slate-950">{page.views}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">아직 수집된 방문 기록이 없습니다.</p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium text-slate-950">최근 방문 로그</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">시간</th>
                  <th className="py-3 pr-4 font-medium">유형</th>
                  <th className="py-3 pr-4 font-medium">페이지</th>
                  <th className="py-3 pr-4 font-medium">Referrer</th>
                  <th className="py-3 pr-4 font-medium">IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {summary.recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="py-3 pr-4">{event.timestamp.replace("T", " ").slice(0, 19)}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded bg-sky-50 px-2 py-1 text-sky-600">
                        {event.visitorKind}
                      </span>
                    </td>
                    <td className="max-w-60 truncate py-3 pr-4">{event.path}</td>
                    <td className="max-w-60 truncate py-3 pr-4">{event.referrer || "-"}</td>
                    <td className="py-3 pr-4 font-mono">{event.ipHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
