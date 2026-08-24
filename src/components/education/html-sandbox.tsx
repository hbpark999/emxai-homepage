"use client";

/**
 * 수강생 HTML 실습 — 붙여넣기 + 즉시 미리보기 + 게시판 공유
 *
 * 용도 : 교재(PDF) 아래에 배치해, 수강생이 실습으로 만든 HTML을 붙여넣으면
 *        바로 옆(아래)에서 렌더링 결과를 확인하고, 완성되면 한 번의 클릭으로
 *        과정 게시판에 공유해 강사가 볼 수 있게 한다.
 *
 * 미리보기는 sandbox 속성이 걸린 iframe에서 렌더링되어 부모 페이지와 격리된다.
 */

import { useState, type FormEvent } from "react";
import { useFullscreen } from "@/hooks/use-fullscreen";

const DEFAULT_HTML = `<!-- 여기에 HTML을 붙여넣고 확인해 보세요 -->
<h1>Hello EMxAI</h1>
`;

type HtmlSandboxProps = {
  postCourse: string | null;
};

export function HtmlSandbox({ postCourse }: HtmlSandboxProps) {
  const { ref: previewRef, isFullscreen, toggleFullscreen } = useFullscreen<HTMLDivElement>();
  const [code, setCode] = useState(DEFAULT_HTML);
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function shareToBoard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const content = "```html\n" + code + "\n```";
      const response = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, course: postCourse }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "공유하지 못했습니다.");
        return;
      }

      setMessage("게시판에 공유했습니다.");
    } catch {
      setError("연결을 확인해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-black text-slate-950">HTML 실습</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          왼쪽에 HTML 코드를 붙여넣으면 오른쪽에서 바로 결과를 확인할 수 있습니다. 완성되면
          아래에서 이름을 입력하고 게시판에 공유해 강사에게 보여줄 수 있습니다.
        </p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          spellCheck={false}
          aria-label="HTML 코드 입력"
          className="h-72 w-full resize-none border-b border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none lg:border-b-0 lg:border-r"
        />
        <div ref={previewRef} className="relative fullscreen:flex fullscreen:flex-col">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute right-2 top-2 z-10 rounded-md border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600"
          >
            {isFullscreen ? "전체화면 나가기" : "전체화면"}
          </button>
          <iframe
            title="HTML 미리보기"
            srcDoc={code}
            sandbox="allow-scripts allow-modals"
            className={isFullscreen ? "h-full w-full flex-1 bg-white" : "h-72 w-full bg-white"}
          />
        </div>
      </div>
      <form
        onSubmit={shareToBoard}
        className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3"
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          required
          className="w-32 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {pending ? "공유 중..." : "게시판에 공유"}
        </button>
        {message ? <span className="text-xs font-bold text-emerald-600">{message}</span> : null}
        {error ? <span className="text-xs font-bold text-red-600">{error}</span> : null}
      </form>
    </div>
  );
}
