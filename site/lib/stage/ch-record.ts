// 8장 실적과 도착: 103+ 가 오차 원처럼 줄어들며 드러나고 분야 막대가 찬다(8.1). 103+ 는 왼쪽 위로 물러나고 24+ 와
// 고객사 이름(건수 순)이 흐른다(8.2, 루프). 두 기준선이 한 경로로 모여 목적지에 닿고 도면(문의)이 열린다(8.3).

import type { Gsap } from "./core";
import { seq, chapter, circleOpen, draw, fadeIn, firstText, text, type Env } from "./core";

export function record(env: Env) {
  let factor = 1;
  let boost = 1;
  let active = false;
  let userPaused = false;
  let lastScroll = 0;
  let boostTimer = 0;
  let idleTimer = 0;
  const loops: ReturnType<Gsap["fromTo"]>[] = [];

  const syncLoops = () => {
    const run = active && !userPaused && !document.hidden && factor > 0.01 && performance.now() - lastScroll < 5000;
    loops.forEach((l) => {
      l.timeScale(Math.max(0.01, factor * boost));
      if (run) l.play();
      else l.pause();
    });
  };

  const c = chapter(env, "record", {
    onToggle: (a) => {
      active = a;
      syncLoops();
    },
  });
  const tl = c.tl;
  const gsap = env.gsap;
  c.tick((p) => {
    factor = p < 240 ? 1 : Math.max(0, 1 - (p - 240) / 30);
    lastScroll = performance.now();
    const v = Math.abs(c.tl.scrollTrigger?.getVelocity() ?? 0);
    boost = 1 + Math.min(2, v / 1200);
    syncLoops();
    // 스크롤을 멈추면 600ms 뒤 ×1, 5초 뒤 정지
    window.clearTimeout(boostTimer);
    boostTimer = window.setTimeout(() => {
      boost = 1;
      syncLoops();
    }, 600);
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(syncLoops, 5050);
  });

  // 103+ 의 "0" 속 중심을 변환 기준으로(처음엔 "0"의 고리가 화면 밖까지 커서 오차 원처럼 보인다)
  const g103 = c.k("g103");
  const num = c.k("g103num");
  const zero = () => {
    const prev = g103.style.transform;
    g103.style.transform = "translate(-50%, -50%)";
    const box = g103.getBoundingClientRect();
    const node = num.firstChild;
    let cx = box.width * 0.37;
    let cy = num.offsetHeight * 0.5;
    if (node && node.nodeType === Node.TEXT_NODE) {
      const range = document.createRange();
      range.setStart(node, 1);
      range.setEnd(node, 2);
      const r = range.getBoundingClientRect();
      cx = r.left + r.width / 2 - box.left;
      cy = r.top + r.height / 2 - box.top;
    }
    g103.style.transform = prev;
    return { cx, cy, w: box.width, h: box.height };
  };
  let z = zero();
  c.measure(() => (z = zero()));

  const P = () => c.px({ x: 800, y: 470 });
  const target103 = () => {
    const f = c.frame();
    const left = Math.max(40, (f.w - 1320) / 2);
    return { x: left + 0.32 * z.w * 0.5, y: 64 + 40 + 0.32 * z.h * 0.5 };
  };
  gsap.set(g103, { xPercent: -50, yPercent: -50, transformOrigin: () => `${z.cx}px ${z.cy}px` });
  tl.fromTo(
    g103,
    { x: () => z.w / 2 - z.cx, y: () => z.h / 2 - z.cy, scale: 4.2, opacity: 0, transformOrigin: () => `${z.cx}px ${z.cy}px` },
    { opacity: 0.3, duration: 10 },
    0,
  );
  // 크게 겹쳐 있는 동안은 옅게(첫 문구가 "0"의 획 위에서도 읽히게), 제 크기에 가까워지며 짙어진다
  tl.to(g103, { opacity: 1, duration: 28 }, 28);
  tl.fromTo(g103, { scale: 4.2 }, { scale: 1, duration: 60, ease: "power1.out", immediateRender: false }, 0);
  // 제 크기에 닿을 무렵 "0" 기준 자리에서 콘텐츠 영역(1열 ~ 레일 앞) 가운데로 옮긴다(압출 두께 포함해 레일에 닿지 않게)
  const centerX = () => {
    const f = c.frame();
    const left = Math.max(40, (f.w - 1320) / 2);
    const right = Math.min(f.w - left, f.w - 96);
    return (left + right) / 2 - P().x;
  };
  tl.fromTo(g103, { x: () => z.w / 2 - z.cx }, { x: centerX, duration: 24, ease: "power2.inOut", immediateRender: false }, 28);
  tl.to(c.k("fix8"), { opacity: 0, duration: 8 }, 24);
  firstText(c, "text-8.1", 110);

  // 분야 막대: 네 토막이 왼쪽부터 차례로 찬다(LBS·측위 52 → 디지털금융 24 → IT서비스 19 → 그 밖 8)
  const segs = c.all("fseg");
  const labs = c.all("flab");
  seq(c, segs, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 9, ease: "power2.out" }, 65, 9);
  seq(c, labs, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 8, ease: "power2.out" }, 68, 9);
  fadeIn(c, c.k("fcap"), 66, 10);
  tl.to(labs, { opacity: 0, duration: 8 }, 110);

  // 8.2 103+ 가 왼쪽 위로 물러나고 24+ 가 오른쪽에서 들어온다. 이름이 흐른다
  tl.to(
    g103,
    {
      scale: 0.32,
      x: () => z.w / 2 - z.cx + (target103().x - P().x),
      y: () => z.h / 2 - z.cy + (target103().y - P().y),
      duration: 40,
      ease: "power2.inOut",
    },
    110,
  );
  const g24 = c.k("g24");
  tl.fromTo(
    g24,
    { xPercent: -50, yPercent: -50, x: () => c.frame().w * 0.2, y: 0, scale: 0.62, opacity: 0 },
    {
      x: () => {
        const f = c.frame();
        const cx = f.ox + 1080 * f.u;
        // 압출 두께·그림자(약 0.08em)까지 레일 앞에 들어오게
        const half = (g24.offsetWidth * 0.62) / 2 + parseFloat(getComputedStyle(g24).fontSize) * 0.62 * 0.08;
        const artR = Math.min(f.w - Math.max(40, (f.w - 1320) / 2), f.w - 88);
        return Math.min(0, artR - (cx + half));
      },
      opacity: 1,
      duration: 40,
      ease: "power2.out",
    },
    120,
  );
  tl.fromTo(c.k("marquee"), { opacity: 0 }, { opacity: 1, duration: 15 }, 140);
  tl.fromTo(c.k("registry"), { opacity: 0 }, { opacity: 1, duration: 15 }, 150);
  text(c, "text-8.2", 128, 240);

  // 마퀴 루프(40px/s, 스크롤 속도로 최대 ×3, 멈추면 ×1, 방향 고정). 화면 밖·탭 숨김·5초 정지·사용자 정지에서 멈춤
  const tracks = [c.k("row1Track"), c.k("row2Track")];
  tracks.forEach((el, i) => {
    const half = el.scrollWidth / 2;
    const tween = gsap.fromTo(
      el,
      { xPercent: i === 0 ? 0 : -50 },
      { xPercent: i === 0 ? -50 : 0, duration: Math.max(4, half / 40), ease: "none", repeat: -1, paused: true },
    );
    loops.push(tween);
  });
  const onPause = (e: Event) => {
    userPaused = Boolean((e as CustomEvent<boolean>).detail);
    syncLoops();
  };
  window.addEventListener("marquee-pause", onPause);
  document.addEventListener("visibilitychange", syncLoops);
  env.cleanups.push(() => {
    window.removeEventListener("marquee-pause", onPause);
    document.removeEventListener("visibilitychange", syncLoops);
    window.clearTimeout(idleTimer);
    window.clearTimeout(boostTimer);
    loops.forEach((l) => l.kill());
  });

  // 8.3 도착: 이름이 물러나고(대비 4.5:1 이상 유지), 두 기준선이 한 경로로 모여 목적지에 닿는다
  const rows = [c.k("row1"), c.k("row2")];
  tl.to(rows, { opacity: 0.55, duration: 30 }, 240);
  const FADE = 56;
  const mask = `linear-gradient(to right, #000 calc(var(--cut, 200vw) - ${FADE}px), transparent var(--cut, 200vw))`;
  rows.forEach((el) => {
    el.style.setProperty("-webkit-mask-image", mask);
    el.style.setProperty("mask-image", mask);
  });
  env.cleanups.push(() =>
    rows.forEach((el) => {
      el.style.removeProperty("-webkit-mask-image");
      el.style.removeProperty("mask-image");
      el.style.removeProperty("--cut");
    }),
  );
  tl.fromTo(
    rows,
    { "--cut": (_i: number, el: HTMLElement) => `${(el.getBoundingClientRect().width + FADE).toFixed(0)}px` },
    {
      "--cut": (_i: number, el: HTMLElement) => {
        const f = c.frame();
        return `${Math.max(0, f.ox + 660 * f.u - el.getBoundingClientRect().left).toFixed(0)}px`;
      },
      duration: 14,
      ease: "power2.inOut",
    },
    242,
  );
  draw(c, c.all("arrive"), 255, 295);
  tl.fromTo(c.k("dest"), { opacity: 0 }, { opacity: 1, duration: 10 }, 288);
  circleOpen(c, 300, 340);
}
