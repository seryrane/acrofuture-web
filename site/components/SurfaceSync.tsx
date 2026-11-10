"use client";

// 바탕 · 절 동기화(4판): 헤더 아래 선을 지나는 절의 바탕(data-surface-of)과 이름(data-chapter-of)을
// <html data-surface>, <html data-chapter> 로. 헤더 색과 내비 현재 표시가 이 두 속성을 따른다.
// 5절이 모두 일반 문서 흐름이라 장면 스테이지 분기는 없다(무대 연출 2곳은 다음 하위 지시).

import { useEffect } from "react";
import { setChapter, setSurface } from "@/lib/motion";

/** 헤더 아래 판정선의 화면 위쪽 거리(px): 헤더 64 + 여유. 앵커 이동은 절 윗변을 80px 에 세운다 */
const HEADER_LINE = 96;

export function SurfaceSync() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-surface-of]"));
    const inTop = new Set<HTMLElement>();

    const apply = () => {
      // 헤더 아래 선에 걸친 절 중 문서 순서로 가장 뒤의 것
      let cur: HTMLElement | null = null;
      for (const s of sections) if (inTop.has(s)) cur = s;
      if (!cur) return;
      const id = cur.dataset.chapterOf ?? cur.id;
      setSurface(cur.dataset.surfaceOf === "night" ? "night" : "day");
      setChapter(id);
      // 첫 절은 페인트 전 스크립트가 이름을 먼저 세우지 않으므로 여기서 처음 표시된다. 같은 이름이어도 aria-current 는 맞춘다
      document.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) => {
        if (a.dataset.nav === id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) inTop.add(el);
          else inTop.delete(el);
        }
        apply();
      },
      // 고정 헤더 바로 아래 2px 띠에 걸친 절이 지금 절이다(앵커 이동 뒤 scroll-margin 80px 이 띠 위에 오게)
      { rootMargin: `-${HEADER_LINE}px 0px -${Math.max(0, window.innerHeight - HEADER_LINE - 2)}px 0px` },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}
