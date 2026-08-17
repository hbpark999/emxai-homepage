"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { StudentCourse } from "@/data/student-courses";
import { ClassBoard } from "./class-board";

type StudentCourseRoomProps = {
  course: StudentCourse;
};

export function StudentCourseRoom({ course }: StudentCourseRoomProps) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [materialAvailable, setMaterialAvailable] = useState<boolean | null>(null);
  const materialHref = `/api/education/materials/${course.slug}`;

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
          <h1 className="mt-4 max-w-5xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            수강생 전용 자료와 해당 과정 게시판을 한 화면에서 확인합니다.
          </p>
        </div>

        {!unlocked ? (
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
                {["PDF 읽기", "PDF 다운로드", "과정별 게시판", "수강 중 공지 확인"].map((item) => (
                  <div key={item} className="rounded-md border border-slate-200 px-4 py-3">
                    <p className="text-sm font-bold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {materialAvailable ? (
                  <iframe
                    title={`${course.title} PDF 자료`}
                    src={materialHref}
                    className="h-[68vh] min-h-[32rem] w-full bg-white"
                  />
                ) : (
                  <div className="flex h-[68vh] min-h-[32rem] items-center justify-center p-6 text-center">
                    <div>
                      <p className="text-xl font-black text-slate-950">
                        PDF 자료 첨부 예정
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                        자료 파일이 등록되면 이 영역에서 바로 읽을 수 있고 다운로드 버튼도
                        활성화됩니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <aside className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-500">
                  Course Materials
                </p>
                <h2 className="mt-3 text-xl font-black text-slate-950">수강생 자료</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  PDF 파일을 아직 첨부하지 않았다면 뷰어에 안내 문구가 표시됩니다. 첨부 후에는
                  같은 주소에서 바로 읽고 내려받을 수 있습니다.
                </p>
                <a
                  href={`${materialHref}?download=1`}
                  aria-disabled={!materialAvailable}
                  className={
                    materialAvailable
                      ? "mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#08a99d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#22c7ba]"
                      : "mt-5 inline-flex w-full pointer-events-none items-center justify-center rounded-md bg-slate-300 px-5 py-3 text-sm font-bold text-white"
                  }
                >
                  PDF 다운로드
                </a>
              </aside>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-4">
              <ClassBoard initialCourse={course.title} lockedCourse />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
