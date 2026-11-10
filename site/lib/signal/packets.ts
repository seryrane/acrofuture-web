// 4.2 흐르는 패킷(루프, 3판): 시간 비례 레일 두 줄을 잇는 순환로(위 레일 → 연결선 → 아래 레일 → 연결선) 위를 2400ms/바퀴로 돈다.
// 스크럽이 패킷 수(6→24)를 정한다. 화면에 있고, 탭이 보이고, 마지막 스크롤 뒤 5초가 지나지 않았을 때만 돈다(WCAG 2.2.2).
// 순환로 좌표는 스테이지 px 로 받는다(연출 모듈이 시간 축 DOM 과 레일 y 에서 계산). 색은 캔버스의 --tone.

import { cumulative, pointAt, type Pt } from "../geometry";

const LAP = 2400;
const TAIL = 5;

export type PacketEngine = { setCount(n: number): void; poke(): void; relayout(): void; destroy(): void };

export function createPacketEngine(canvas: HTMLCanvasElement, stage: HTMLElement, getLoop: () => Pt[]): PacketEngine {
  const ctx = canvas.getContext("2d");
  let loop: Pt[] = [];
  let ratios: number[] = [];
  let w = 0;
  let h = 0;
  let dpr = 1;
  let count = 0;
  let raf = 0;
  let visible = false;
  let lastPoke = 0;
  let clock = 0;
  let lastNow = 0;
  let color = "currentColor";

  const layout = () => {
    color = getComputedStyle(canvas).getPropertyValue("--tone").trim() || "currentColor";
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    loop = getLoop();
    ratios = loop.length > 1 ? cumulative(loop).ratios : [];
  };

  const draw = () => {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const n = Math.round(count);
    if (n <= 0 || loop.length < 2) return;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const base = (clock / LAP + i / n) % 1;
      for (let k = TAIL; k >= 0; k--) {
        const t = (base - k * 0.004 + 1) % 1;
        const p = pointAt(loop, t, ratios);
        const next = pointAt(loop, (t + 0.002) % 1, ratios);
        const horizontal = Math.abs(next.x - p.x) >= Math.abs(next.y - p.y);
        ctx.globalAlpha = k === 0 ? 1 : 0.5 * (1 - k / (TAIL + 1));
        if (horizontal) ctx.fillRect(p.x - 4, p.y - 1, 8, 2);
        else ctx.fillRect(p.x - 1, p.y - 4, 2, 8);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  const running = () => visible && !document.hidden && count > 0.5 && performance.now() - lastPoke < 5000;

  const tick = (now: number) => {
    raf = 0;
    clock += Math.min(64, now - (lastNow || now));
    lastNow = now;
    draw();
    if (running()) raf = requestAnimationFrame(tick);
    else lastNow = 0;
  };

  const kick = () => {
    if (running() && !raf) {
      lastNow = 0;
      raf = requestAnimationFrame(tick);
    } else if (!running()) draw();
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    kick();
  });
  io.observe(canvas);
  const onVis = () => kick();
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(() => {
    layout();
    draw();
  });
  ro.observe(stage);
  layout();

  return {
    setCount(n: number) {
      count = n;
      kick();
    },
    poke() {
      lastPoke = performance.now();
      kick();
    },
    relayout() {
      layout();
      draw();
    },
    destroy() {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
