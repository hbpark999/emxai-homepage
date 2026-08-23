"use client";

/**
 * 실시간 교육 게시판 — 화면 컴포넌트
 *
 * 용도 : 교육 중 강사가 Notion에 올린 링크·공지·코드를 수강생 화면에 실시간 표시한다.
 *
 * 동작
 *   - 5초마다 /api/board 를 호출해 목록을 갱신한다.
 *   - 브라우저 탭이 백그라운드일 때는 호출하지 않는다(불필요한 트래픽 방지).
 *   - 과정(select 속성)이 여러 개면 상단에 필터 버튼이 나타난다.
 *
 * 수강생은 로그인 없이 주소만으로 열람한다. 글 작성은 Notion에서만 가능하다.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BoardContent } from "./board-content";

const REFRESH_MS = 5_000;

type BoardPost = {
  id: string;
  title: string;
  content: string;
  course: string | null;
  createdAt: string;
};

type BoardResponse = {
  ok: boolean;
  configured?: boolean;
  posts?: BoardPost[];
  error?: string;
  updatedAt?: string;
};

function formatTime(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}

type ClassBoardProps = {
  initialCourse?: string;
  courseAliases?: string[];
  lockedCourse?: boolean;
  compact?: boolean;
};

export function ClassBoard({
  initialCourse = "전체",
  courseAliases = [],
  lockedCourse = false,
  compact = false,
}: ClassBoardProps) {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [course, setCourse] = useState<string>(initialCourse);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current || document.visibilityState === "hidden") {
      return;
    }

    inFlight.current = true;

    try {
      const response = await fetch("/api/board", { cache: "no-store" });
      const payload = (await response.json()) as BoardResponse;

      if (payload.ok) {
        setPosts(payload.posts ?? []);
        setUpdatedAt(payload.updatedAt ?? new Date().toISOString());
        setError(null);
      } else {
        setError(payload.error ?? "게시판을 불러오지 못했습니다.");
      }
    } catch {
      setError("네트워크 연결을 확인해 주세요.");
    } finally {
      inFlight.current = false;
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(load, 0);

    const timer = setInterval(load, REFRESH_MS);
    document.addEventListener("visibilitychange", load);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, [load]);

  const courses = useMemo(() => {
    const names = new Set<string>();
    posts.forEach((post) => {
      if (post.course) {
        names.add(post.course);
      }
    });
    return [...names];
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (lockedCourse) {
      const allowedCourses = new Set([initialCourse, ...courseAliases]);
      return posts.filter((post) => post.course && allowedCourses.has(post.course));
    }

    return course === "전체" ? posts : posts.filter((post) => post.course === course);
  }, [posts, course, initialCourse, courseAliases, lockedCourse]);

  return (
    <section className="bg-white">
      <div className={compact ? "px-0 py-0" : "mx-auto max-w-4xl px-5 py-14 sm:px-8"}>
        <div className={compact ? "border-b border-slate-200 pb-4" : "border-b border-slate-200 pb-8"}>
          <p className={compact ? "text-xs font-black uppercase tracking-[0.16em] text-sky-500" : "text-sm font-black uppercase tracking-[0.16em] text-sky-500"}>
            Live Board
          </p>
          <h1 className={compact ? "mt-2 text-2xl font-black leading-tight text-slate-950" : "mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl"}>
            {lockedCourse ? "과정 게시판" : "교육 게시판"}
          </h1>
          <p className={compact ? "mt-3 text-sm leading-6 text-slate-600" : "mt-5 text-lg leading-8 text-slate-600"}>
            {lockedCourse
              ? "이 과정에 공유되는 링크·공지·실습 코드만 모아 보여줍니다."
              : "교육 중 공유되는 링크·공지·실습 코드가 이곳에 실시간으로 올라옵니다."}
            화면은 자동으로 갱신되니 새로고침하지 않으셔도 됩니다.
          </p>
          <div className={compact ? "mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400" : "mt-5 flex items-center gap-2 text-sm font-semibold text-slate-400"}>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            {updatedAt ? `${formatTime(updatedAt)} 기준 · 5초마다 갱신` : "연결 중..."}
          </div>
        </div>

        {!lockedCourse && courses.length > 1 ? (
          <div className="flex flex-wrap gap-2 py-6">
            {["전체", ...courses].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCourse(name)}
                className={
                  name === course
                    ? "rounded-md border border-sky-500 bg-sky-50 px-4 py-2 text-sm font-black text-sky-700"
                    : "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:border-sky-400 hover:text-sky-600"
                }
              >
                {name}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <p className="text-base font-bold text-amber-900">게시판을 불러오지 못했습니다</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">{error}</p>
          </div>
        ) : null}

        {!error && loaded && visiblePosts.length === 0 ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-base font-semibold text-slate-600">
              아직 올라온 글이 없습니다.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              교육이 시작되면 이곳에 자료가 표시됩니다.
            </p>
          </div>
        ) : null}

        <div className={compact ? "mt-5 space-y-4" : "mt-8 space-y-5"}>
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className={compact ? "rounded-lg border border-slate-200 bg-white p-4 shadow-sm" : "rounded-lg border border-slate-200 bg-white p-6 shadow-sm"}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h2 className={compact ? "text-base font-black text-slate-950" : "text-xl font-black text-slate-950"}>{post.title}</h2>
                <div className="flex items-center gap-2">
                  {post.course ? (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                      {post.course}
                    </span>
                  ) : null}
                  <time className="text-xs font-semibold text-slate-400">
                    {formatTime(post.createdAt)}
                  </time>
                </div>
              </div>
              <div className="pt-4">
                <BoardContent text={post.content} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
