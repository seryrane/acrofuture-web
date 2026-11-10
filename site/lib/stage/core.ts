// 스테이지 연출 공용 도구(지연 로드 청크 안): 챕터 타임라인, 문구 등장·퇴장, 경로 그리기, 원형 열림, 이산 상태, 정수 트윈.
// 챕터마다 GSAP 타임라인 하나(start "top top" → end "bottom bottom", scrub 0.4). 타임라인 길이 = L(svh).

import type { GsapBundle } from "../motion";
import { SCRUB, setChapter, setSurface } from "../motion";
import { CHAPTER_BY_ID, chapterAt, surfaceAt, type ChapterDef } from "../scenes";
import { unitFrame, type Pt } from "../geometry";

export type Gsap = GsapBundle["gsap"];
export type ST = GsapBundle["ScrollTrigger"];
export type TL = ReturnType<Gsap["timeline"]>;
export type Frame = { w: number; h: number; u: number; ox: number; oy: number };

export type Env = {
  gsap: Gsap;
  ScrollTrigger: ST;
  frameOf: (stage: Element) => Frame;
  cleanups: (() => void)[];
};

type Listener = (p: number) => void;

export type Chapter = {
  def: ChapterDef;
  section: HTMLElement;
  stage: HTMLElement;
  tl: TL;
  env: Env;
  /** 섹션 안 data-k 요소(없으면 오류) */
  k: <T extends Element = HTMLElement>(key: string) => T;
  /** 섹션 안 data-k 요소(없으면 null) */
  q: <T extends Element = HTMLElement>(key: string) => T | null;
  /** 섹션 안 data-k 요소 전부 */
  all: <T extends Element = HTMLElement>(key: string, root?: Element) => T[];
  frame: () => Frame;
  /** 단위 좌표 → 스테이지 px */
  px: (p: Pt) => Pt;
  /** 매 타임라인 갱신(진행 svh)마다 부른다. 되감기에도 같은 값 → 같은 상태 */
  tick: (fn: Listener) => void;
  /** 진행이 t 를 지나면 on(true), 되돌아오면 on(false). 해제 때 on(true)(서버 HTML = 최종 상태) */
  at: (t: number, on: (after: boolean) => void) => void;
  /** 화면 예시 숫자 정수 트윈(구간 a→b). 해제 때 최종값 */
  count: (el: Element | null, from: number, to: number, a: number, b: number, fmt?: (n: number) => string) => void;
  /** 새로고침(크기 변화) 때 다시 잴 값 */
  measure: (fn: () => void) => void;
};

/** 스테이지 안 요소의 레이아웃 상자(변환 무시, 스테이지 기준 px) */
export function boxIn(el: HTMLElement, root: HTMLElement): { x: number; y: number; w: number; h: number } {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export function chapter(env: Env, id: string, hooks: { onToggle?: (active: boolean) => void } = {}): Chapter {
  const def = CHAPTER_BY_ID[id];
  const section = document.querySelector<HTMLElement>(`[data-ch="${id}"]`);
  if (!def || !section) throw new Error(`chapter ${id}`);
  const stage = section.querySelector<HTMLElement>(".st-stage")!;
  const q = <T extends Element = HTMLElement>(key: string) => section.querySelector(`[data-k="${key}"]`) as T | null;
  const k = <T extends Element = HTMLElement>(key: string) => {
    const el = q<T>(key);
    if (!el) throw new Error(`${id}:${key}`);
    return el;
  };
  const all = <T extends Element = HTMLElement>(key: string, root: Element = section) =>
    Array.from(root.querySelectorAll(`[data-k="${key}"]`)) as T[];
  const frame = () => env.frameOf(stage);
  const px = (p: Pt) => {
    const f = frame();
    return { x: f.ox + p.x * f.u, y: f.oy + p.y * f.u };
  };

  const listeners: Listener[] = [];
  const restores: (() => void)[] = [];
  const measures: (() => void)[] = [];
  let lastChapter = "";

  const sync = (self: { isActive: boolean; progress: number }) => {
    if (!self.isActive) return;
    const p = self.progress * def.L;
    setSurface(surfaceAt(def, p));
    const ch = chapterAt(def, p);
    if (ch !== lastChapter) {
      lastChapter = ch;
      setChapter(ch);
    }
  };

  const tl = env.gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        sync(self);
        const hide = self.progress >= 0.9995 ? "hidden" : "";
        if (stage.style.visibility !== hide) stage.style.visibility = hide;
      },
      onToggle: (self) => {
        lastChapter = "";
        sync(self);
        hooks.onToggle?.(self.isActive);
      },
      // 끝을 지나면 이 스테이지를 숨겨 겹쳐 있던 다음 챕터의 첫 프레임을 드러낸다(되돌아오면 다시 보임)
      onLeave: () => (stage.style.visibility = "hidden"),
      onEnterBack: () => (stage.style.visibility = ""),
      onRefresh: (self) => (stage.style.visibility = self.scroll() >= self.end - 1 ? "hidden" : ""),
    },
    onUpdate: () => {
      const p = tl.time();
      for (const fn of listeners) fn(p);
    },
  });
  // 타임라인 길이를 L 로 고정(스크롤 거리 L svh = 시간 L)
  tl.set({}, {}, def.L);

  const onRefreshInit = () => measures.forEach((m) => m());
  env.ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
  env.cleanups.push(() => {
    env.ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    restores.forEach((r) => r());
  });

  const tick = (fn: Listener) => {
    listeners.push(fn);
    fn(tl.time());
  };

  const at = (t: number, on: (after: boolean) => void) => {
    let state: boolean | null = null;
    tick((p) => {
      const next = p >= t;
      if (next !== state) {
        state = next;
        on(next);
      }
    });
    restores.push(() => on(true));
  };

  const count = (el: Element | null, from: number, to: number, a: number, b: number, fmt = (n: number) => String(n)) => {
    if (!el) return;
    const final = el.textContent ?? "";
    let last = "";
    tick((p) => {
      const t = p <= a ? 0 : p >= b ? 1 : (p - a) / (b - a);
      const v = fmt(Math.round(from + (to - from) * t));
      if (v !== last) {
        last = v;
        el.textContent = v;
      }
    });
    restores.push(() => (el.textContent = final));
  };

  const measure = (fn: () => void) => {
    measures.push(fn);
    fn();
  };

  return { def, section, stage, tl, env, k, q, all, frame, px, tick, at, count, measure };
}

/** 장면 문구: a 에서 들어오고(12), b 에서 나간다(10). DESIGN 9.2 */
export function text(c: Chapter, key: string, a: number, b?: number, fadeIn = 12, fadeOut = 10) {
  const el = c.q(key);
  if (!el) return;
  c.tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: fadeIn, ease: "power2.out" }, a);
  if (b !== undefined) c.tl.to(el, { opacity: 0, y: -8, duration: fadeOut, ease: "power1.in" }, b - fadeOut);
}

/** 첫 장면 문구: +0 에 이미 보이고 b 에서 나간다 */
export function firstText(c: Chapter, key: string, b: number, fadeOut = 10) {
  const el = c.q(key);
  if (!el) return;
  c.tl.fromTo(el, { opacity: 1, y: 0 }, { opacity: 0, y: -8, duration: fadeOut, ease: "power1.in" }, b - fadeOut);
}

/**
 * 차례로(스태거) fromTo: 대상마다 따로 트윈을 만든다. 타임라인 안 stagger fromTo 는 아직 시작하지 않은 대상의
 * 시작 상태를 즉시 그리지 않아(immediateRender 가 첫 대상에만 적용) 스크럽 전에 최종 상태가 비치는 것을 막는다.
 */
export function seq(c: Chapter, targets: Element[] | null, from: gsap.TweenVars, to: gsap.TweenVars, at: number, each: number) {
  if (!targets) return;
  targets.forEach((el, i) => c.tl.fromTo(el, { ...from }, { ...to }, at + i * each));
}

/** 요소 페이드(들어옴) */
export function fadeIn(c: Chapter, el: Element | Element[] | null, a: number, d = 10, from: gsap.TweenVars = {}) {
  if (!el || (Array.isArray(el) && !el.length)) return;
  c.tl.fromTo(el, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, duration: d, ease: "power2.out" }, a);
}

/** 요소 페이드(나감) */
export function fadeOut(c: Chapter, el: Element | Element[] | null, a: number, d = 10, to: gsap.TweenVars = {}) {
  if (!el || (Array.isArray(el) && !el.length)) return;
  c.tl.to(el, { opacity: 0, duration: d, ease: "power1.in", ...to }, a);
}

/** pathLength=1 경로 그리기: 진행도 0 에서는 완전히 숨김(잔상 금지, 검수 P2-7) */
export function draw(c: Chapter, el: Element | Element[] | null, a: number, b: number) {
  if (!el) return;
  const list = Array.isArray(el) ? el : [el];
  if (!list.length) return;
  // autoRound: false — px 반올림이 0~1 사이 대시 값을 0 이나 1 로 굳혀 중간 진행이 사라지지 않게
  c.tl.fromTo(list, { strokeDasharray: 1, strokeDashoffset: 1.002, opacity: 0 }, { opacity: 1, duration: 0.5, autoRound: false }, a);
  c.tl.fromTo(list, { strokeDashoffset: 1.002 }, { strokeDashoffset: 0, duration: b - a, immediateRender: false, autoRound: false }, a);
}

/** 원형 열림: 측점 위치에서 clip-path 원 + 가장자리 --fix 고리 */
export function circleOpen(c: Chapter, a: number, b: number) {
  const layer = c.stage.querySelector<HTMLElement>(':scope > [data-k="layer"]');
  const ring = c.stage.querySelector<SVGCircleElement>(':scope > svg [data-k="ring"]');
  if (!layer || !ring) return;
  const cx = Number(layer.dataset.cx);
  const cy = Number(layer.dataset.cy);
  const st = { t: 0 };
  const apply = () => {
    const f = c.frame();
    const R = st.t * 1.5 * Math.max(f.w, f.h);
    const x = f.ox + cx * f.u;
    const y = f.oy + cy * f.u;
    layer.style.clipPath = `circle(${R.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
    ring.setAttribute("r", (R / f.u).toFixed(1));
  };
  c.tl.fromTo(st, { t: 0 }, { t: 1, duration: b - a, onUpdate: apply, onStart: apply }, a);
}

export function setT(el: Element, x: number, y: number, extra = "") {
  el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})${extra}`);
}

/** 진행(구간 a→b)으로 0~1 을 돌려주는 onUpdate 용 트윈 */
export function drive(c: Chapter, a: number, b: number, fn: (t: number) => void, ease = "none") {
  const st = { t: 0 };
  c.tl.fromTo(st, { t: 0 }, { t: 1, duration: b - a, ease, onUpdate: () => fn(st.t), onStart: () => fn(st.t) }, a);
  fn(0);
}

/** 원근 판 돌리기(피드백 4차 7): 장면 a~b 동안 화면 예시·폰을 왼쪽으로 돌아선 상태에서 정면 쪽으로 천천히 돌린다(transform 만) */
export function tilt(c: Chapter, el: Element | null, a: number, b: number, from = -6, to = 5) {
  if (!el) return;
  c.tl.fromTo(
    el,
    { rotationY: from, rotationX: 3, transformPerspective: 1600 },
    { rotationY: to, rotationX: 1, duration: b - a, ease: "none", immediateRender: false },
    a,
  );
}

/** 새 Frame(스테이지 크기에서 1단위 px 과 원점) */
export function makeFrame(stage: Element): Frame {
  const r = stage.getBoundingClientRect();
  return { w: r.width, h: r.height, ...unitFrame(r.width, r.height) };
}
