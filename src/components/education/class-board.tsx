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

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
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
  allowPosting?: boolean;
};

function ChatBubble({ post }: { post: BoardPost }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-black text-slate-950">{post.title}</span>
        <time className="text-[10px] font-semibold text-slate-400">{formatTime(post.createdAt)}</time>
      </div>
      <div className="mt-1 text-sm leading-6 text-slate-700">
        <BoardContent text={post.content} />
      </div>
    </div>
  );
}

function CompleteCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/board/complete-count", { cache: "no-store" });
      const payload = (await response.json()) as { ok?: boolean; count?: number };

      if (payload.ok) {
        setCount(payload.count ?? 0);
      }
    } catch {
      // 폴링 중 일시적 오류는 무시하고 다음 주기에 재시도한다.
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(load, 0);
    const timer = setInterval(load, REFRESH_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [load]);

  async function act(action: "increment" | "reset") {
    if (action === "reset" && !window.confirm("카운트를 0으로 초기화할까요?")) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/board/complete-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = (await response.json()) as { ok?: boolean; count?: number; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "처리하지 못했습니다.");
        return;
      }

      setCount(payload.count ?? 0);
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-black text-slate-950">
          작업완료 <span className="text-sky-600">{count ?? 0}</span>명
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => act("increment")}
            disabled={pending}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            작업완료
          </button>
          <button
            type="button"
            onClick={() => act("reset")}
            disabled={pending}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            초기화
          </button>
        </div>
      </div>
      {error ? <p className="mt-1 text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}

function PostForm({
  postCourse,
  onPosted,
}: {
  postCourse: string | null;
  onPosted: () => void;
}) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, course: postCourse }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "글을 올리지 못했습니다.");
        return;
      }

      setContent("");
      onPosted();
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submitPost} className="shrink-0 border-t border-slate-200 bg-slate-50 p-3">
      {error ? <p className="mb-2 text-xs font-bold text-red-600">{error}</p> : null}
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="이름"
        required
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
      />
      <div className="mt-2 flex items-end gap-2">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="질문이나 공유할 내용을 입력하세요."
          rows={2}
          required
          className="w-full flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md bg-sky-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {pending ? "올리는 중..." : "올리기"}
        </button>
      </div>
    </form>
  );
}

export function ClassBoard({
  initialCourse = "전체",
  courseAliases = [],
  lockedCourse = false,
  compact = false,
  allowPosting = false,
}: ClassBoardProps) {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [course, setCourse] = useState<string>(initialCourse);
  const inFlight = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const filtered = lockedCourse
      ? posts.filter((post) => {
          const allowedCourses = new Set([initialCourse, ...courseAliases]);
          return post.course && allowedCourses.has(post.course);
        })
      : course === "전체"
        ? posts
        : posts.filter((post) => post.course === course);

    // 글쓰기가 켜진 화면(채팅형)은 오래된 글이 위, 최신 글이 입력창 바로 위에 오도록 순서를 뒤집는다.
    // 조회 API는 항상 최신순으로 내려주므로(공개 게시판은 그대로 최신순 유지), 여기서만 뒤집는다.
    return allowPosting ? [...filtered].reverse() : filtered;
  }, [posts, course, initialCourse, courseAliases, lockedCourse, allowPosting]);

  useEffect(() => {
    if (!allowPosting || !scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visiblePosts, allowPosting]);

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

        {allowPosting ? (
          <>
            <div className="mt-5 flex aspect-square w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
                {loaded && visiblePosts.length === 0 ? (
                  <p className="py-6 text-center text-sm font-semibold text-slate-400">
                    아직 올라온 글이 없습니다. 첫 글을 남겨보세요!
                  </p>
                ) : (
                  visiblePosts.map((post) => <ChatBubble key={post.id} post={post} />)
                )}
              </div>
              <CompleteCounter />
              <PostForm
                postCourse={courseAliases[0] ?? (lockedCourse ? initialCourse : null)}
                onPosted={load}
              />
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-400">→ 작성하면 이렇게 보입니다</p>
              <div className="mt-2 opacity-70">
                <ChatBubble
                  post={{
                    id: "example",
                    title: "홍길동",
                    content: "질문 있습니다! 1페이지 링크가 안 열려요 https://example.com",
                    course: null,
                    createdAt: new Date().toISOString(),
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
