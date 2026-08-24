"use client";

import { useEffect, useRef, useState } from "react";

/** 임의의 엘리먼트를 전체화면으로 전환/해제하는 훅. Esc로도 빠져나갈 수 있다. */
export function useFullscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(document.fullscreenElement === ref.current);
    }

    async function exitOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || document.fullscreenElement !== ref.current) {
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

    await ref.current?.requestFullscreen();
  }

  return { ref, isFullscreen, toggleFullscreen };
}
