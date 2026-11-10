"use client";

// 페이지 안 앵커 링크 클릭만 부드럽게 이동(모션 감소면 즉시). 키보드 Tab 초점 이동에는 애니메이션이 없다.
// 첫 화면 아래 절은 content-visibility: auto(어림 높이)라, 앵커로 옮기기 전에 모든 절을 실제로 그리게 한다(html[data-cv-off]).
// 그러지 않으면 이동 중에 앞 절들이 실제 높이로 바뀌며 도착 위치가 수백~수천 px 어긋난다(PM 실측 2026-11-09).

import { useEffect } from "react";
import { scrollToHash } from "@/lib/motion";

export function SmoothAnchors() {
  useEffect(() => {
    const cvOff = () => document.documentElement.setAttribute("data-cv-off", "");
    if (location.hash.length > 1) {
      cvOff();
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el instanceof HTMLDetailsElement) el.open = true; // 주소로 바로 #cases-* 에 들어와도 펼침(#508)
      el?.scrollIntoView();
    }
    const onHash = () => cvOff();
    window.addEventListener("hashchange", onHash);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      if (hash.length < 2) return;
      cvOff();
      if (scrollToHash(hash)) e.preventDefault();
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return null;
}
