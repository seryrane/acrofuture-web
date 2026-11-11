"use client";

// 히어로 흐름 층 제어(#510). 흐름(점 · 고리 · 불꽃)은 CSS 만으로 돌고, 여기서는 배터리 · 발열만 챙긴다:
// - 도식이 화면 밖이거나, 입력(포인터 · 휠 · 터치 · 키)이 오래 없으면(<768 15초, 그 밖 30초) data-run="0" 으로 흐름을 걷고 멈춘다.
// - 흐름 층은 load 뒤 쉬는 틈에 처음 data-run 을 세워 만든다(그 전에는 display: none, 첫 그리기 프레임을 가볍게).
// - ≥1024 · 정밀 포인터 · 모션 허용일 때만 시차 모듈(lib/hero/parallax)을 쉬는 틈에 지연 로드한다. 모바일 · 모션 감소는 요청 0.
// 모션 감소면 흐름 층이 display: none 이라 아무것도 하지 않는다. 도중에 바뀌면 시차를 걷는다.

import { useEffect } from "react";
import { MQ_MOTION_OK } from "@/lib/motion";

const MQ_PARALLAX = `(min-width: 1024px) and (hover: hover) and (pointer: fine) and ${MQ_MOTION_OK}`;

export function HeroMotion() {
  useEffect(() => {
    const box = document.querySelector<HTMLElement>('[data-stage="hero"] [data-k="box"]');
    const fx = box?.querySelector<HTMLElement>('[data-k="fx"]');
    if (!box || !fx) return;
    const mq = window.matchMedia(MQ_PARALLAX);
    const idleMs = window.matchMedia("(min-width: 768px)").matches ? 30000 : 15000;
    let visible = true;
    let awake = true;
    let idleTimer = 0;
    let stopParallax: (() => void) | null = null;
    let disposed = false;
    let ready = false; // load 뒤 첫 쉼까지는 흐름 층을 만들지 않는다

    const sync = () => {
      if (!ready) return;
      const run = visible && awake && !document.hidden ? "1" : "0";
      if (fx.dataset.run !== run) fx.dataset.run = run;
    };
    const armIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        awake = false;
        sync();
      }, idleMs);
    };
    const onInput = () => {
      if (!awake) {
        awake = true;
        sync();
      }
      armIdle();
    };

    const io = new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(box);

    const startParallax = () => {
      if (stopParallax || disposed || !mq.matches) return;
      import("@/lib/hero/parallax")
        .then(({ startParallax: start }) => {
          if (!disposed && mq.matches && !stopParallax) stopParallax = start(box);
        })
        .catch(() => {
          /* 청크 실패: 시차 없이 흐름만 */
        });
    };
    const onMq = () => {
      if (mq.matches) startParallax();
      else {
        stopParallax?.();
        stopParallax = null;
      }
    };
    let idleCb = 0;
    const go = () => {
      const later = (fn: () => void, t: number) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: t }) : window.setTimeout(fn, t));
      idleCb = later(() => {
        ready = true;
        sync();
        if (mq.matches) idleCb = later(startParallax, 1500);
      }, 1000);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });

    const opts = { passive: true } as const;
    window.addEventListener("pointermove", onInput, opts);
    window.addEventListener("wheel", onInput, opts);
    window.addEventListener("touchstart", onInput, opts);
    window.addEventListener("keydown", onInput, opts);
    document.addEventListener("visibilitychange", sync);
    mq.addEventListener("change", onMq);
    armIdle();
    sync();

    return () => {
      disposed = true;
      io.disconnect();
      window.clearTimeout(idleTimer);
      if (idleCb && window.cancelIdleCallback) window.cancelIdleCallback(idleCb);
      window.removeEventListener("load", go);
      window.removeEventListener("pointermove", onInput);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchstart", onInput);
      window.removeEventListener("keydown", onInput);
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", onMq);
      stopParallax?.();
    };
  }, []);
  return null;
}
