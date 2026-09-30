"use client";

/**
 * home-step-videos.tsx
 * hero 흐름도(v3_43) 바로 아래에 STEP 1~6 동영상 카드를 깔고, 클릭하면 PiP로 재생한다.
 *
 * 카드의 left/width(%)는 흐름도 PNG에서 STEP 박스의 가로 위치를 실측한 값이다.
 * lg 이상에서는 절대 배치로 박스와 열을 맞추고, 그 아래 화면에서는 일반 그리드로 흐른다.
 * PiP를 지원하지 않는 브라우저(Firefox, iPhone Safari)는 모달 재생으로 넘긴다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type StepVideo = {
  step: number;
  title: string;
  file: string;
  /** 흐름도 이미지 폭 대비 STEP 박스의 왼쪽 위치(%) */
  left: string;
  /** 흐름도 이미지 폭 대비 STEP 박스의 폭(%) */
  width: string;
  /**
   * 카드에 대표 화면으로 띄울 시점(초). 0초는 제목 슬라이드라 내용이 보이지 않아
   * 영상 길이의 약 35% 지점을 기본값으로 잡았다. 더 나은 장면이 있으면 이 숫자만 바꾸면 된다.
   */
  posterTime: number;
};

const STEP_VIDEOS: StepVideo[] = [
  {
    step: 1,
    title: "Design",
    file: "Step1. AI Agent Workflow_given Design.mp4",
    left: "1.87%",
    width: "12.79%",
    posterTime: 7,
  },
  {
    step: 2,
    title: "Guide → AI DRC",
    file: "Step2. Guide_Guide Parsing and Design Guide.mp4",
    left: "16.21%",
    width: "14.56%",
    posterTime: 15,
  },
  {
    step: 3,
    title: "Fast Local Evaluation & Optimization",
    file: "step3. AI Agent Workflow SG Model Optimize.mp4",
    left: "32.23%",
    width: "16.10%",
    posterTime: 10,
  },
  {
    step: 4,
    title: "PCB Update",
    file: "step4. AI Agent Workflow_updated Design.mp4",
    left: "49.82%",
    width: "14.56%",
    posterTime: 19,
  },
  {
    step: 5,
    title: "Simulation-based EMI/SI Verification",
    file: "step5. AI Agent Workflow_HFSS1.mp4",
    left: "66.25%",
    width: "16.65%",
    posterTime: 14,
  },
  {
    step: 6,
    title: "AI Report",
    file: "step6. AI Agent Workflow_정리.mp4",
    left: "84.53%",
    width: "12.77%",
    posterTime: 7,
  },
];

/** 파일명에 공백과 한글이 있어 그대로 쓰면 깨진다. */
function srcOf(file: string) {
  return encodeURI("/images/" + file);
}

/** 카드용 주소. #t=<초>로 그 시점 화면을 대표 화면처럼 띄운다. */
function posterSrcOf(item: StepVideo) {
  return srcOf(item.file) + "#t=" + item.posterTime;
}

/** Safari는 표준 PiP API 대신 webkit 전용 API를 쓴다. */
type MaybeWebkitVideo = HTMLVideoElement & {
  webkitSupportsPresentationMode?: (mode: string) => boolean;
  webkitSetPresentationMode?: (mode: "picture-in-picture" | "inline" | "fullscreen") => void;
};

export function HomeStepVideos() {
  const cardRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  /** 클릭한 카드를 PiP로 띄운다. 지원하지 않으면 모달 재생으로 넘긴다. */
  const playInPip = useCallback(async (index: number) => {
    const video = cardRefs.current[index] as MaybeWebkitVideo | null;
    if (!video) {
      setModalIndex(index);
      return;
    }

    try {
      video.currentTime = 0;
      video.muted = false;
      await video.play();

      if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
        await video.requestPictureInPicture();
        // PiP 창을 닫으면 카드가 소리를 낸 채 계속 돌지 않도록 되돌린다.
        video.addEventListener(
          "leavepictureinpicture",
          () => {
            video.pause();
            video.currentTime = 0;
            video.muted = true;
          },
          { once: true },
        );
        return;
      }
      if (video.webkitSupportsPresentationMode?.("picture-in-picture")) {
        video.webkitSetPresentationMode?.("picture-in-picture");
        return;
      }
      // PiP를 지원하지 않으면 모달로 돌린다.
      video.pause();
      video.muted = true;
      setModalIndex(index);
    } catch {
      video.pause();
      video.muted = true;
      setModalIndex(index);
    }
  }, []);

  return (
    <div className="mt-4 lg:mt-6">
      <div className="mb-2 flex items-center justify-between gap-3 lg:mb-3">
        <p className="text-xs font-semibold tracking-wide text-slate-500 sm:text-sm">
          STEP별 시연 영상 — 카드를 누르면 PiP 창으로 재생됩니다
        </p>
        <button
          type="button"
          onClick={() => setModalIndex(0)}
          className="shrink-0 rounded-md border border-sky-500 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-500 hover:text-white sm:text-sm"
        >
          전체보기
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:relative lg:block lg:aspect-[10] lg:gap-0">
        {STEP_VIDEOS.map((item, index) => (
          <button
            key={item.step}
            type="button"
            onClick={() => playInPip(index)}
            style={{ "--card-left": item.left, "--card-width": item.width } as CSSProperties}
            className="group relative aspect-video w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-900 shadow-sm transition hover:border-sky-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 lg:absolute lg:inset-y-0 lg:aspect-auto lg:left-[var(--card-left)] lg:h-full lg:w-[var(--card-width)]"
            aria-label={`STEP ${item.step} ${item.title} 시연 영상을 PiP로 재생`}
          >
            <video
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              src={posterSrcOf(item)}
              preload="metadata"
              muted
              playsInline
              // 카드가 흐름도 박스 폭에 묶여 있어 16:9가 아니다. contain으로 화면을 잘리지 않게 담는다.
              className="h-full w-full object-contain opacity-85 transition group-hover:opacity-100"
            />
            <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-950/35 transition group-hover:bg-slate-950/20">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 lg:h-8 lg:w-8">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 h-3.5 w-3.5 fill-sky-600 lg:h-4 lg:w-4"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-[10px] font-bold text-white lg:text-xs">STEP {item.step}</span>
            </span>
          </button>
        ))}
      </div>

      {modalIndex !== null && (
        <StepVideoModal
          index={modalIndex}
          onSelect={setModalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </div>
  );
}

function StepVideoModal({
  index,
  onSelect,
  onClose,
}: {
  index: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const active = STEP_VIDEOS[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // 모달이 열린 동안 배경 스크롤을 막는다.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="STEP별 시연 영상"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-xl bg-white p-4 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">
              STEP {active.step}
            </p>
            <h2 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
              {active.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            닫기 ✕
          </button>
        </div>

        <video
          key={active.file}
          src={srcOf(active.file)}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full rounded-lg bg-slate-950"
        />

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEP_VIDEOS.map((item, itemIndex) => (
            <button
              key={item.step}
              type="button"
              onClick={() => onSelect(itemIndex)}
              className={
                itemIndex === index
                  ? "rounded-md border border-sky-500 bg-sky-500 px-2 py-2 text-xs font-semibold text-white transition"
                  : "rounded-md border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-600"
              }
            >
              STEP {item.step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
