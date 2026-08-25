"use client";

/**
 * 수강생 HTML 실습 — 붙여넣기 + 미리보기
 *
 * 용도 : 교재(PDF) 아래에 배치해, 수강생이 실습으로 만든 HTML을 붙여넣고
 *        [미리보기]를 눌러 결과를 바로 확인할 수 있게 한다.
 *
 * 미리보기는 sandbox 속성이 걸린 iframe에서 렌더링되어 부모 페이지와 격리된다.
 */

import { useState } from "react";
import { useFullscreen } from "@/hooks/use-fullscreen";

const CODE_PLACEHOLDER = "<!-- 여기에 HTML을 붙여넣고 [미리보기]를 눌러 확인해 보세요 -->\n<h1>Hello EMxAI</h1>";

type HtmlSandboxProps = {
  label?: string;
};

export function HtmlSandbox({ label = "HTML 실습" }: HtmlSandboxProps) {
  const { ref: previewRef, isFullscreen, toggleFullscreen } = useFullscreen<HTMLDivElement>();
  const [code, setCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-black text-slate-950">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          왼쪽에 HTML 코드를 붙여넣고 <span className="font-bold text-slate-700">미리보기</span>를
          누르면 오른쪽에서 결과를 확인할 수 있습니다.
        </p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={CODE_PLACEHOLDER}
          spellCheck={false}
          aria-label="HTML 코드 입력"
          className="h-72 w-full resize-none border-b border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none placeholder:text-slate-500 lg:border-b-0 lg:border-r"
        />
        <div ref={previewRef} className="relative fullscreen:flex fullscreen:flex-col">
          <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewHtml(code)}
              className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky-600"
            >
              미리보기
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-md border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600"
            >
              {isFullscreen ? "전체화면 나가기" : "전체화면"}
            </button>
          </div>
          {previewHtml ? (
            <iframe
              title="HTML 미리보기"
              srcDoc={previewHtml}
              sandbox="allow-scripts allow-modals"
              className={isFullscreen ? "h-full w-full flex-1 bg-white" : "h-72 w-full bg-white"}
            />
          ) : (
            <div
              className={
                isFullscreen
                  ? "flex h-full w-full flex-1 items-center justify-center bg-white"
                  : "flex h-72 w-full items-center justify-center bg-white"
              }
            >
              <p className="text-sm font-semibold text-slate-300">
                코드를 입력하고 [미리보기]를 눌러주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
