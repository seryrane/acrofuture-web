// 모션 조건 상수, GSAP 지연 로드, 바탕 동기화, 앵커 이동.
// 스테이지(고정 + 스크럽)는 ≥1024 · 모션 허용에서만 켠다(검수 P2: 768~1023 은 GSAP 을 받지 않음).

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { Surface } from "./scenes";

export const MQ_MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MQ_REDUCED = "(prefers-reduced-motion: reduce)";
export const MQ_MD = "(min-width: 768px)";
export const MQ_LG = "(min-width: 1024px)";
export const MQ_STAGE = `${MQ_LG} and ${MQ_MOTION_OK}`;

export const SCRUB = 0.4;

export type GsapBundle = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let pending: Promise<GsapBundle | null> | null = null;

/** 스테이지 모드 표시: 페인트 전 인라인 스크립트가 세우고, 조건이 바뀌거나 로드가 실패하면 여기서 고친다 */
export function setScrub(on: boolean) {
  const root = document.documentElement;
  if (on) root.dataset.scrub = "on";
  else delete root.dataset.scrub;
}

/** 스테이지 조건일 때만 gsap + ScrollTrigger 를 동적으로 불러온다. 실패하면 정지 도판(흐름 모드)으로 되돌린다. */
export function loadGsap(): Promise<GsapBundle | null> {
  if (typeof window === "undefined" || !window.matchMedia(MQ_STAGE).matches) {
    return Promise.resolve(null);
  }
  pending ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
    .then(([g, st]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      return { gsap, ScrollTrigger };
    })
    .catch(() => {
      // ChunkLoadError 등: 스테이지를 풀어 최종 상태 도판을 보인다
      pending = null;
      setScrub(false);
      return null;
    });
  return pending;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MQ_REDUCED).matches;
}

/** 챕터 바탕 동기화: <html data-surface="day|night"> (헤더·레일·선택색이 따른다) */
export function setSurface(surface: Surface) {
  const root = document.documentElement;
  if (root.dataset.surface !== surface) root.dataset.surface = surface;
}

/**
 * 지금 장 동기화: <html data-chapter="top|lbs|…|contact"> (DESIGN D8).
 * 헤더 내비 현재 표시·챕터 레일 현재 칸은 CSS 와 이 속성으로만 칠한다. 스크린리더용 aria-current 만 여기서 함께 고친다.
 */
export function setChapter(id: string) {
  const root = document.documentElement;
  if (root.dataset.chapter === id) return;
  root.dataset.chapter = id;
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) => {
    if (a.dataset.nav === id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  window.dispatchEvent(new CustomEvent("chapterchange", { detail: id }));
}

/** 앵커 이동: 키보드 초점 이동에는 애니메이션을 붙이지 않고, 링크 클릭에서만 부드럽게(모션 감소면 즉시) */
export function scrollToHash(hash: string): boolean {
  const el = document.getElementById(hash.replace(/^#/, ""));
  if (!el) return false;
  // 접힌 목록(<details>, 사례 절 분야별 목록 #cases-*)으로 가는 링크면 펼친 뒤 이동(#508)
  if (el instanceof HTMLDetailsElement) el.open = true;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", hash);
  // 초점도 목적지로(스크롤은 이미 시작했으므로 다시 움직이지 않게)
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}
