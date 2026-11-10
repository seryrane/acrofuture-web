"use client";

// 흐름 모드의 "17": 대형 숫자(장식 사본)와, 모션 허용일 때 한 번만 도는 입자 수렴 캔버스.

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./SeventeenGather.module.css";

export function SeventeenGather({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const num = numRef.current;
    if (!wrap || !canvas || !num) return;
    if (document.documentElement.dataset.scrub === "on" || prefersReducedMotion()) return;
    if (!("IntersectionObserver" in window)) return;
    wrap.dataset.state = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("@/lib/signal/gather")
          .then(({ playGather }) => playGather(canvas, num, window.innerWidth >= 768 ? 1400 : 700))
          .finally(() => {
            wrap.dataset.state = "done";
          });
      },
      { threshold: 0.5 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={s.wrap}>
      <span ref={numRef} className={`st-giant ${s.num}`} aria-hidden="true">
        {text}
      </span>
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
    </div>
  );
}
