"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { StudentCourse } from "@/data/student-courses";
import { ClassBoard } from "./class-board";
import { HtmlSandbox } from "./html-sandbox";
import { TimerBadge, TimerControls, useSessionTimer } from "./session-timer";

type StudentCourseRoomProps = {
  course: StudentCourse;
};

export function StudentCourseRoom({ course }: StudentCourseRoomProps) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [materialAvailable, setMaterialAvailable] = useState<boolean | null>(null);
  const [showPdfToc, setShowPdfToc] = useState(false);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfShellRef = useRef<HTMLDivElement>(null);
  const materialHref = `/api/education/materials/${course.slug}`;
  const pdfViewerHref = `${materialHref}#page=${currentPdfPage}&toolbar=0&navpanes=${showPdfToc ? "1" : "0"}&pagemode=${
    showPdfToc ? "bookmarks" : "none"
  }&view=Fit`;
  const pageCount = course.pdfPageCount;
  const timer = useSessionTimer();

  // 이전에 비밀번호를 확인한 적이 있으면(서버가 8시간 유지되는 쿠키를 이미 갖고 있음)
  // 새로고침해도 다시 입력하지 않도록, 마운트 시 한 번 조용히 접근 가능 여부를 확인한다.
  useEffect(() => {
    let ignore = false;

    async function checkExistingAccess() {
      try {
        const response = await fetch(`${materialHref}?status=1`, { cache: "no-store" });

        if (!ignore && response.ok) {
          setUnlocked(true);
        }
      } finally {
        if (!ignore) {
          setCheckingAccess(false);
        }
      }
    }

    checkExistingAccess();

    return () => {
      ignore = true;
    };
  }, [materialHref]);

  useEffect(() => {
    if (!unlocked) {
      return;
    }

    let ignore = false;

    async function checkMaterial() {
      const response = await fetch(`${materialHref}?status=1`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { available?: boolean } | null;

      if (!ignore) {
        setMaterialAvailable(Boolean(payload?.available));
      }
    }

    checkMaterial();

    return () => {
      ignore = true;
    };
  }, [materialHref, unlocked]);

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(document.fullscreenElement === pdfShellRef.current);
    }

    async function exitOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || document.fullscreenElement !== pdfShellRef.current) {
        return;
      }

      await document.exitFullscreen();
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("keydown", exitOnEscape);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener("keydown", exitOnEscape);
    };
  }, []);

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await pdfShellRef.current?.requestFullscreen();
  }

  function movePdfPage(offset: number) {
    setCurrentPdfPage((page) => {
      const nextPage = page + offset;

      if (pageCount) {
        return Math.min(Math.max(nextPage, 1), pageCount);
      }

      return Math.max(nextPage, 1);
    });
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/education/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: course.slug, password }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "입장할 수 없습니다.");
        return;
      }

      setUnlocked(true);
      setPassword("");
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8">
        <div className="border-b border-slate-200 pb-8">
          <Link href="/education" className="text-sm font-bold text-sky-600 hover:text-sky-700">
            Education으로 돌아가기
          </Link>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-sky-500">
            Student Corner
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <h1 className="max-w-5xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
              {course.title}
            </h1>
            <TimerBadge state={timer} />
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            수강생 전용 자료와 해당 과정 게시판을 한 화면에서 확인합니다.
          </p>
          <TimerControls state={timer} />
        </div>

        {checkingAccess ? null : !unlocked ? (
          <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form
              onSubmit={submitPassword}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6"
            >
              <label htmlFor="course-password" className="text-sm font-black text-slate-950">
                과정 비밀번호
              </label>
              <input
                id="course-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-3 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-sky-500"
                autoComplete="current-password"
                required
              />
              {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={pending}
                className="mt-5 w-full rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {pending ? "확인 중..." : "입장하기"}
              </button>
            </form>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <p className="text-sm font-black text-slate-950">이 과정에서 제공되는 기능</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["PDF 읽기", "과정별 게시판", "수강 중 공지 확인"].map((item) => (
                  <div key={item} className="rounded-md border border-slate-200 px-4 py-3">
                    <p className="text-sm font-bold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 py-10 xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="flex flex-col gap-6">
            <div
              ref={pdfShellRef}
              className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 fullscreen:rounded-none fullscreen:border-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-black text-slate-950">수강생 자료</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => movePdfPage(-1)}
                    disabled={currentPdfPage <= 1}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-sky-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    이전
                  </button>
                  <span className="min-w-24 text-center text-sm font-bold text-slate-500">
                    {currentPdfPage}
                    {pageCount ? ` / ${pageCount}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => movePdfPage(1)}
                    disabled={Boolean(pageCount && currentPdfPage >= pageCount)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-sky-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    다음
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPdfToc((current) => !current)}
                    className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-sky-400 hover:text-sky-600"
                  >
                    {showPdfToc ? "목차 숨기기" : "목차 보기"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-pressed={isFullscreen}
                    className="rounded-md bg-[#08a99d] px-4 py-2 text-sm font-black text-white transition hover:bg-[#22c7ba]"
                  >
                    {isFullscreen ? "Exit Full Screen" : "Full Screen"}
                  </button>
                </div>
              </div>
              <div>
                {materialAvailable ? (
                  <div
                    className={
                      isFullscreen
                        ? "flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-950"
                        : "w-full"
                    }
                  >
                    {/* 자료가 16:9 슬라이드라서, 컨테이너를 페이지와 같은 비율로 맞춰야
                        브라우저 내장 PDF 뷰어가 다음 페이지를 이어서 보여주지 않는다. */}
                    <iframe
                      key={`${showPdfToc ? "toc-on" : "toc-off"}-${currentPdfPage}`}
                      title={`${course.title} PDF 자료`}
                      src={pdfViewerHref}
                      className={
                        isFullscreen
                          ? "aspect-video max-h-full w-full bg-white"
                          : "aspect-video w-full bg-white"
                      }
                    />
                  </div>
                ) : (
                  <div className={isFullscreen ? "flex h-[calc(100vh-4rem)] w-full items-center justify-center p-6 text-center" : "flex h-[82vh] min-h-[44rem] items-center justify-center p-6 text-center"}>
                    <div>
                      <p className="text-xl font-black text-slate-950">
                        PDF 자료 첨부 예정
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                        자료 파일이 등록되면 이 영역에서 바로 읽을 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <HtmlSandbox slot={1} label="HTML 실습 1" />
            <HtmlSandbox slot={2} label="HTML 실습 2 (비교용)" />
            </div>
            <aside className="xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:rounded-lg xl:border xl:border-slate-200 xl:bg-white xl:p-5">
              <ClassBoard
                initialCourse={course.title}
                courseAliases={course.boardCourseNames}
                lockedCourse
                compact
                allowPosting
              />
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
