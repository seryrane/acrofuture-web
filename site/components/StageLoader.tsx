"use client";

// 스테이지 연출 로더: ≥1024 · 모션 허용일 때만 GSAP 과 연출 모듈(lib/stage/director)을 지연 로드한다.
// 조건이 바뀌면(창 크기·모션 설정) 스테이지 모드 표시를 고치고, 실패하면 정지 도판으로 되돌린다.

import { useEffect } from "react";
import { MQ_STAGE, loadGsap, setScrub } from "@/lib/motion";

export function StageLoader() {
  useEffect(() => {
    const mql = window.matchMedia(MQ_STAGE);
    let cleanup: (() => void) | null = null;
    let disposed = false;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      loadGsap()
        .then(async (bundle) => {
          if (!bundle || disposed) return;
          const { startDirector } = await import("@/lib/stage/director");
          if (disposed) return;
          cleanup = startDirector(bundle);
        })
        .catch(() => setScrub(false));
    };

    const sync = () => {
      setScrub(mql.matches);
      if (mql.matches) start();
    };
    sync();
    mql.addEventListener("change", sync);
    return () => {
      disposed = true;
      mql.removeEventListener("change", sync);
      cleanup?.();
    };
  }, []);
  return null;
}
