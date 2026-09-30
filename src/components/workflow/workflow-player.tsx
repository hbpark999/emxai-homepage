"use client";

/**
 * workflow-player.tsx
 * 공유 링크(/workflow)로 들어온 방문자에게 STEP 1~6 시연 영상을 보여 준다.
 *
 * 홈의 카드/PiP와 달리 자동재생을 하지 않는다. LinkedIn 앱 내장 브라우저는 소리 있는
 * 자동재생을 막고, 링크를 눌러 막 들어온 시점에는 사용자 동작이 없어 재생이 거부된다.
 * 그래서 첫 진입에는 대표 화면만 띄우고, 방문자가 고른 뒤부터 이어서 재생한다.
 */

import { useCallback, useRef, useState } from "react";

import { stepVideoPosterSrc, stepVideos } from "@/data/step-videos";

export function WorkflowPlayer() {
  const [activeIndex, setActiveIndex] = useState(0);
  // 방문자가 STEP을 고른 경우에만 이어서 재생한다. 첫 진입은 대표 화면에서 멈춰 있는다.
  const playOnLoadRef = useRef(false);
  const active = stepVideos[activeIndex];

  const select = useCallback((index: number) => {
    playOnLoadRef.current = true;
    setActiveIndex(index);
  }, []);

  return (
    <div>
      {/* key로 STEP마다 <video>를 새로 만든다. src만 바꾸면 이전 재생 위치가 남는다. */}
      <video
        key={active.file}
        src={stepVideoPosterSrc(active)}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full rounded-xl bg-slate-950 shadow-lg"
        onLoadedMetadata={(event) => {
          const el = event.currentTarget;
          if (playOnLoadRef.current) {
            playOnLoadRef.current = false;
            el.currentTime = 0;
            // 방문자 클릭에서 이어진 호출이라 소리를 낸 채로 재생해도 막히지 않는다.
            void el.play().catch(() => {});
            return;
          }
          // 첫 진입: 0초는 제목 슬라이드라 내용이 보이는 지점의 화면을 띄운다.
          // preload="metadata"는 길이만 읽고 프레임을 그리지 않아 직접 옮겨 줘야 한다.
          const target = Math.min(active.posterTime, Math.max(0, el.duration - 0.1));
          if (Number.isFinite(target)) {
            el.currentTime = target;
          }
        }}
      />

      <p className="mt-4 text-center text-sm text-slate-500">
        지금 보는 영상 —{" "}
        <span className="font-semibold text-slate-700">
          STEP {active.step}. {active.title}
        </span>
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {stepVideos.map((item, index) => (
          <li key={item.step}>
            <button
              type="button"
              onClick={() => select(index)}
              aria-current={index === activeIndex ? "true" : undefined}
              className={
                index === activeIndex
                  ? "flex h-full w-full flex-col rounded-lg border border-sky-500 bg-sky-500 px-3 py-3 text-left transition"
                  : "flex h-full w-full flex-col rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-sky-400 hover:shadow-sm"
              }
            >
              <span
                className={
                  index === activeIndex
                    ? "text-xs font-bold text-white"
                    : "text-xs font-bold text-sky-600"
                }
              >
                STEP {item.step}
              </span>
              <span
                className={
                  index === activeIndex
                    ? "mt-1 text-sm font-semibold leading-snug text-white [word-break:keep-all]"
                    : "mt-1 text-sm font-semibold leading-snug text-slate-800 [word-break:keep-all]"
                }
              >
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
