"use client";

/**
 * 수강생 HTML 실습 — 실시간 공유 슬롯
 *
 * 용도 : 교재(PDF) 아래에 두 개(슬롯 1/2)를 배치해, 참가자 누구나 코드를 붙여넣으면
 *        그 즉시(수 초 이내) 같은 슬롯을 보고 있는 모든 참가자 화면에 코드와 렌더링
 *        결과가 함께 반영된다. 강사 화면에서도 똑같이 보인다.
 *
 * 동작
 *   - 3초마다 서버(Notion)에서 슬롯 상태를 다시 읽어온다.
 *   - 타이핑 중(입력창에 포커스가 있는 동안)에는 서버 값으로 텍스트를 덮어쓰지 않는다
 *     — 다른 사람이 같은 슬롯을 동시에 건드리지만 않으면 내 타이핑이 끊기지 않는다.
 *   - 입력을 멈추고 700ms가 지나면 자동으로 서버에 저장된다(별도 "미리보기"/"공유"
 *     버튼 없이 코드가 바로 렌더링되고 다른 사람에게도 전달된다).
 *   - "사용 중" 체크박스를 먼저 체크한 사람이 그 슬롯의 소유자가 된다(이 소유
 *     여부는 이 브라우저에만 저장되고 새로고침해도 유지된다). 다른 브라우저에서는
 *     체크박스가 잠긴 채로 켜져 있고, 입력창 대신 "다른 곳에서 입력 중입니다"가
 *     표시되어 동시에 같은 슬롯에 타이핑해 서로 덮어쓰는 걸 막는다.
 *
 * 미리보기는 sandbox 속성이 걸린 iframe에서 렌더링되어 부모 페이지와 격리된다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useFullscreen } from "@/hooks/use-fullscreen";

const POLL_MS = 3_000;
const SAVE_DEBOUNCE_MS = 700;

const CODE_PLACEHOLDER = "<!-- 여기에 HTML을 붙여넣으면 바로 오른쪽과 다른 참가자 화면에 반영됩니다 -->\n<h1>Hello EMxAI</h1>";

type HtmlSandboxProps = {
  slot: 1 | 2;
  label?: string;
};

export function HtmlSandbox({ slot, label = `HTML 실습 ${slot}` }: HtmlSandboxProps) {
  const { ref: previewRef, isFullscreen, toggleFullscreen } = useFullscreen<HTMLDivElement>();
  const ownerStorageKey = `emxai_html_slot_owner_${slot}`;
  const [code, setCode] = useState("");
  const [inUse, setInUse] = useState(false);
  // 이 브라우저가 "사용 중"을 먼저 체크해 소유자가 됐는지. 새로고침해도 유지되도록
  // localStorage에서 지연 초기값으로 읽는다(마운트는 항상 클라이언트에서만 된다).
  const [isOwner, setIsOwner] = useState(() => window.localStorage.getItem(ownerStorageKey) === "1");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isFocusedRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const isLockedByOther = inUse && !isOwner;
  const isOwnerRef = useRef(isOwner);

  useEffect(() => {
    isOwnerRef.current = isOwner;
  }, [isOwner]);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/board/html-slots", { cache: "no-store" });
      const payload = (await response.json()) as {
        ok?: boolean;
        slot1?: { code: string; inUse: boolean };
        slot2?: { code: string; inUse: boolean };
        error?: string;
      };

      if (!payload.ok) {
        return;
      }

      const remote = slot === 1 ? payload.slot1 : payload.slot2;
      if (!remote) {
        return;
      }

      setInUse(remote.inUse);
      // 서버에서 이미 해제됐는데 내가 소유자로 남아 있으면(다른 탭 등) 동기화해서 푼다.
      if (!remote.inUse && isOwnerRef.current) {
        setIsOwner(false);
        window.localStorage.removeItem(ownerStorageKey);
      }
      // 타이핑 중에는 내 입력을 서버 값으로 덮어쓰지 않는다. 다른 곳에서 입력 중이면
      // (내가 소유자가 아니면) 항상 서버 값을 그대로 보여준다.
      if (!isFocusedRef.current || (remote.inUse && !isOwnerRef.current)) {
        setCode(remote.code);
      }
    } catch {
      // 폴링 중 일시적 오류는 무시하고 다음 주기에 재시도한다.
    }
  }, [slot, ownerStorageKey]);

  useEffect(() => {
    const initialTimer = window.setTimeout(load, 0);
    const pollTimer = setInterval(load, POLL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(pollTimer);
    };
  }, [load]);

  async function saveCode(value: string) {
    try {
      const response = await fetch("/api/board/html-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, code: value }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "저장하지 못했습니다.");
        return;
      }

      setError(null);
    } catch {
      setError("연결을 확인해 주세요.");
    }
  }

  function handleChange(value: string) {
    setCode(value);

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => saveCode(value), SAVE_DEBOUNCE_MS);
  }

  async function toggleInUse() {
    if (isLockedByOther) {
      // 다른 사람이 이미 소유한 상태에서는 체크박스가 비활성화돼 있어 여기 오지 않지만, 방어적으로 막는다.
      return;
    }

    const next = !inUse;
    setInUse(next);
    setIsOwner(next);

    if (next) {
      window.localStorage.setItem(ownerStorageKey, "1");
    } else {
      window.localStorage.removeItem(ownerStorageKey);
    }

    try {
      const response = await fetch("/api/board/html-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, inUse: next }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!payload.ok) {
        setError(payload.error ?? "처리하지 못했습니다.");
      }
    } catch {
      setError("연결을 확인해 주세요.");
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-black text-slate-950">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            왼쪽에 HTML 코드를 붙여넣으면 오른쪽과 다른 참가자 화면에 바로 반영됩니다.
          </p>
        </div>
        <label
          className={
            isLockedByOther
              ? "flex shrink-0 cursor-not-allowed items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
              : "flex shrink-0 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
          }
        >
          <input
            type="checkbox"
            checked={inUse}
            onChange={toggleInUse}
            disabled={isLockedByOther}
            className="size-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
          />
          사용 중
        </label>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        {isLockedByOther ? (
          <div className="flex h-72 w-full items-center justify-center border-b border-slate-200 bg-slate-900 p-4 text-center lg:border-b-0 lg:border-r">
            <p className="text-sm font-bold text-amber-300">
              다른 곳에서 입력 중입니다.
              <br />
              <span className="font-normal text-slate-400">
                해제될 때까지 기다리거나 다른 슬롯을 이용해 주세요.
              </span>
            </p>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(event) => handleChange(event.target.value)}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
            }}
            placeholder={CODE_PLACEHOLDER}
            spellCheck={false}
            aria-label="HTML 코드 입력"
            className="h-72 w-full resize-none border-b border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none placeholder:text-slate-500 lg:border-b-0 lg:border-r"
          />
        )}
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
      {error ? (
        <p className="border-t border-slate-100 px-4 py-2 text-xs font-bold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
