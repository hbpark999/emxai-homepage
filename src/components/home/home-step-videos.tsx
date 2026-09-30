"use client";

/**
 * home-step-videos.tsx
 * hero 흐름도(v3_43) 바로 아래에 STEP 1~6 동영상 카드를 깔고, 클릭하면 PiP로 재생한다.
 *
 * 카드의 left/width(%)는 흐름도 PNG에서 STEP 박스의 가로 위치를 실측한 값이다.
 * lg 이상에서는 절대 배치로 박스와 열을 맞추고, 그 아래 화면에서는 일반 그리드로 흐른다.
 * PiP를 지원하지 않는 브라우저(Firefox, iPhone Safari)는 모달 재생으로 넘긴다.
 *
 * 배경 음악은 이 컴포넌트에 하나만 두고 STEP 전환과 무관하게 계속 흐른다.
 * 모달 안 <video>는 STEP을 바꾸면 교체(remount)되지만 음악 객체는 여기 남아 있어
 * STEP 1에서 6까지 넘겨 봐도 노래가 처음으로 되감기지 않는다.
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

type BgmTrack = {
  title: string;
  /** public/audio/ 아래 파일명. 파일이 없으면 음악만 조용히 빠지고 영상은 그대로 나온다. */
  file: string;
};

/**
 * 배경 음악 목록. 접속할 때마다 순서를 섞어 첫 곡이 달라지고,
 * 한 곡이 끝나면 섞인 순서의 다음 곡으로 끊김 없이 이어진다.
 * 곡을 바꾸려면 이 배열과 public/audio/ 파일만 손대면 된다.
 */
const BGM_TRACKS: BgmTrack[] = [
  { title: "Top of the World", file: "top-of-the-world.mp3" },
  { title: "Take Me Home, Country Roads", file: "take-me-home-country-roads.mp3" },
  { title: "Andante, Andante", file: "andante-andante.mp3" },
];

/** 영상 소리를 덮지 않을 정도의 배경 음량. */
const BGM_VOLUME = 0.35;

function bgmSrcOf(file: string) {
  return encodeURI("/audio/" + file);
}

/** 재생 순서를 섞는다. last를 주면 직전에 나온 곡이 연달아 걸리지 않게 한 칸 밀어 준다. */
function shuffledOrder(length: number, last?: number) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (length > 1 && order[0] === last) {
    order.push(order.shift() as number);
  }
  return order;
}

/**
 * STEP 영상과 함께 흐르는 배경 음악.
 *
 * - resume(): 영상이 시작될 때 부른다. 이미 흐르는 중이면 건드리지 않아 STEP을 넘겨도 끊기지 않는다.
 * - pause(): 재생을 멈출 때 부른다. currentTime은 남겨 두어 다음 STEP에서 이어 듣는다.
 * - 오디오 객체는 첫 사용자 클릭 시점에 만든다. 브라우저 자동재생 차단에 걸리지 않고,
 *   섞기도 이때 하므로 서버 렌더 결과와 어긋날 일이 없다.
 */
function useStepBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const orderRef = useRef<number[]>([]);
  const cursorRef = useRef(0);
  const enabledRef = useRef(true);
  const [enabled, setEnabledState] = useState(true);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  // 음악 파일을 아직 올리지 않았거나 불러오지 못하면 음악 UI를 감춘다.
  const [unavailable, setUnavailable] = useState(false);

  /** 현재 순서의 곡을 처음부터 재생한다. 실제로 소리가 나기 시작했으면 true. */
  const playCursor = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    const track = BGM_TRACKS[orderRef.current[cursorRef.current]];
    audio.src = bgmSrcOf(track.file);
    try {
      await audio.play();
      setNowPlaying(track.title);
      return true;
    } catch {
      setNowPlaying(null);
      return false;
    }
  }, []);

  const ensureAudio = useCallback(() => {
    const existing = audioRef.current;
    if (existing) return existing;

    const audio = new Audio();
    audio.volume = BGM_VOLUME;
    audio.preload = "none";
    audio.addEventListener("ended", () => {
      const finished = orderRef.current[cursorRef.current];
      cursorRef.current += 1;
      // 목록을 한 바퀴 돌면 다시 섞어 같은 순서가 반복되지 않게 한다.
      if (cursorRef.current >= orderRef.current.length) {
        orderRef.current = shuffledOrder(BGM_TRACKS.length, finished);
        cursorRef.current = 0;
      }
      void playCursor();
    });
    // 파일이 없거나 형식을 못 읽으면 음악을 접고 영상 소리로 되돌린다.
    audio.addEventListener("error", () => {
      setNowPlaying(null);
      setUnavailable(true);
      enabledRef.current = false;
      setEnabledState(false);
    });

    audioRef.current = audio;
    orderRef.current = shuffledOrder(BGM_TRACKS.length);
    cursorRef.current = 0;
    return audio;
  }, [playCursor]);

  const resume = useCallback(async () => {
    if (!enabledRef.current) return false;
    const audio = ensureAudio();
    if (!audio.paused) return true; // 이미 흐르는 중 — STEP을 넘겨도 그대로 이어 간다
    if (!audio.src) return playCursor();
    try {
      await audio.play();
      return true;
    } catch {
      setNowPlaying(null);
      return false;
    }
  }, [ensureAudio, playCursor]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabledState(next);
    if (next) {
      void resume();
    } else {
      audioRef.current?.pause();
      setNowPlaying(null);
    }
  }, [resume]);

  // 페이지를 떠날 때 소리를 남기지 않는다.
  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  return { enabled, nowPlaying, unavailable, resume, pause, toggle };
}

/** Safari는 표준 PiP API 대신 webkit 전용 API를 쓴다. */
type MaybeWebkitVideo = HTMLVideoElement & {
  webkitSupportsPresentationMode?: (mode: string) => boolean;
  webkitSetPresentationMode?: (mode: "picture-in-picture" | "inline" | "fullscreen") => void;
};

export function HomeStepVideos() {
  const cardRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  // 지금 PiP로 돌고 있는 카드. 같은 카드를 다시 누르면 멈추게 하려고 들고 있는다.
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const bgm = useStepBgm();

  /** 재생을 멈추고 카드를 대표 화면으로 되돌린다. */
  const stopCard = useCallback(
    (index: number) => {
      const video = cardRefs.current[index];
      if (!video) return;
      video.pause();
      video.muted = true;
      video.currentTime = STEP_VIDEOS[index].posterTime;
      if (document.pictureInPictureElement === video) {
        void document.exitPictureInPicture().catch(() => {});
      }
      setPlayingIndex(null);
      bgm.pause();
    },
    [bgm],
  );

  /** 클릭한 카드를 PiP로 띄운다. 이미 돌고 있으면 멈춘다. */
  const playInPip = useCallback(
    async (index: number) => {
      const video = cardRefs.current[index] as MaybeWebkitVideo | null;
      if (!video) {
        setModalIndex(index);
        return;
      }

      // 같은 카드를 다시 누르면 정지, 다른 카드가 돌고 있으면 그것부터 정리한다.
      if (playingIndex === index) {
        stopCard(index);
        return;
      }
      if (playingIndex !== null) {
        stopCard(playingIndex);
      }

      // 음악은 기다리지 않고 건다. 여기서 await로 붙잡으면 "사용자가 방금 눌렀다"는
      // 권한(transient activation)이 풀려서 아래 requestPictureInPicture()가 거부된다.
      void bgm.resume().then((musicPlaying) => {
        video.muted = musicPlaying;
      });

      try {
        video.currentTime = 0;
        // 자동재생 차단을 피하려고 늘 무음으로 시작한다. 음악 여부는 위 then에서 정해 준다.
        video.muted = true;

        const canPip =
          document.pictureInPictureEnabled &&
          !video.disablePictureInPicture &&
          video.readyState >= HTMLMediaElement.HAVE_METADATA;

        if (canPip) {
          // play()보다 먼저 부른다. 클릭과 이 호출 사이에 await가 끼면 브라우저가 거부한다.
          await video.requestPictureInPicture();
          // PiP 창을 닫으면 카드가 소리를 낸 채 계속 돌지 않도록 되돌린다.
          video.addEventListener("leavepictureinpicture", () => stopCard(index), { once: true });
          setPlayingIndex(index);
          await video.play();
          return;
        }
        if (video.webkitSupportsPresentationMode?.("picture-in-picture")) {
          video.webkitSetPresentationMode?.("picture-in-picture");
          setPlayingIndex(index);
          await video.play();
          return;
        }
        // PiP를 지원하지 않거나 아직 메타데이터를 못 읽었으면 모달로 돌린다.
        video.muted = true;
        setModalIndex(index);
      } catch {
        video.pause();
        video.muted = true;
        setPlayingIndex(null);
        setModalIndex(index);
      }
    },
    [bgm, playingIndex, stopCard],
  );

  /** 모달을 열 때도 음악을 이어 붙인다. */
  const openModal = useCallback(
    (index: number) => {
      setModalIndex(index);
      void bgm.resume();
    },
    [bgm],
  );

  const closeModal = useCallback(() => {
    setModalIndex(null);
    bgm.pause();
  }, [bgm]);

  return (
    <div className="mt-2 lg:mt-3">

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
              onLoadedMetadata={(event) => {
                // src의 #t=<초>만으로는 그 시점 화면을 그려 주지 않는 브라우저가 많다.
                // (preload="metadata"는 길이·크기만 읽고 프레임을 디코딩하지 않는다.)
                // 메타데이터를 읽은 뒤 직접 그 지점으로 이동시켜야 카드에 대표 화면이 뜬다.
                const el = event.currentTarget;
                const target = Math.min(item.posterTime, Math.max(0, el.duration - 0.1));
                if (Number.isFinite(target) && Math.abs(el.currentTime - target) > 0.5) {
                  el.currentTime = target;
                }
              }}
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
              {/* lg 이상에서는 카드 바로 위 흐름도 박스가 제목을 달고 있어 중복이다.
                  그 아래 화면에서는 카드가 흐름도에서 떨어져 나와 제목이 사라지므로 여기에 적는다. */}
              <span className="max-w-full px-1.5 text-center text-[10px] font-semibold leading-tight text-white/85 sm:text-xs lg:hidden">
                {item.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 lg:mt-3">
        <p className="text-sm font-semibold text-slate-700 sm:text-base">
          화면을 누르면 PIP 재생됩니다.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {!bgm.unavailable && (
            <button
              type="button"
              onClick={bgm.toggle}
              aria-pressed={bgm.enabled}
              className={
                bgm.enabled
                  ? "flex max-w-[15rem] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-600"
                  : "flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-sky-400 hover:text-sky-600"
              }
              title={bgm.enabled ? "배경 음악 끄기" : "배경 음악 켜기"}
            >
              <span aria-hidden="true">{bgm.enabled ? "♪" : "✕"}</span>
              <span className="truncate">
                {bgm.enabled ? (bgm.nowPlaying ?? "배경 음악 켜짐") : "배경 음악 꺼짐"}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => openModal(0)}
            className="shrink-0 rounded-md border border-sky-500 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-500 hover:text-white"
          >
            전체 재생
          </button>
        </div>
      </div>

      {modalIndex !== null && (
        <StepVideoModal
          index={modalIndex}
          muted={bgm.enabled}
          onSelect={setModalIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function StepVideoModal({
  index,
  muted,
  onSelect,
  onClose,
}: {
  index: number;
  /** 배경 음악이 흐르는 동안에는 영상을 무음으로 재생한다. */
  muted: boolean;
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

        {/* key로 STEP마다 <video>를 새로 만든다. 음악은 부모에 있어 이 교체에 영향을 받지 않는다. */}
        <video
          key={active.file}
          src={srcOf(active.file)}
          controls
          autoPlay
          muted={muted}
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
