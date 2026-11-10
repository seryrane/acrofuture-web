"use client";

// 마퀴 "흐름 멈춤" 토글(WCAG 2.2.2): 스테이지 안 유일한 포커스 요소. 연출 모듈에 사용자 이벤트로 알린다.

import { useState } from "react";
import { Icon } from "../Icon";
import s from "./Record.module.css";

export function MarqueeButton({ label }: { label: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className={s.pause}
      aria-pressed={paused}
      data-k="pause"
      onClick={() => {
        const next = !paused;
        setPaused(next);
        window.dispatchEvent(new CustomEvent("marquee-pause", { detail: next }));
      }}
    >
      <Icon name={paused ? "play" : "pause"} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
