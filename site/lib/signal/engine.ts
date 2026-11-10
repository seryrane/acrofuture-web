// 2장 LBS·측위 캔버스 엔진(3판). 스크럽 진행도(svh, 0~660)를 목표로 받아 rAF 에서 18%씩 보간해 그린다.
// rAF 는 캔버스가 화면에 있고, 탭이 보이고, 보간 차이가 남아 있을 때만 돈다. 매 프레임 할당 0, DPR 상한 2.
// 구간(STORYBOARD 2장):
//   0~90 흩어짐(위성 4곳 → 화면) · 90~180 수렴(σ 45vmin → 3px, 오차 원 게이지 r = 2σ) · 180~190 측점으로 모여 사라짐
//   180~385 측정 격자(점 격자 배율 1 → 10 → 1, 280~300 등각으로 눕힘) + 오차 원(미터 → 센티미터)
//   375~470 단말 400개(415~440 방송 원이 지나며 구역 안 단말만 청록 + 빛) · 470~580 "17" 글리프 · 580~620 가로선
// 색은 캔버스 요소의 계산된 CSS 변수에서 읽는다(하드코딩 없음, V3-PLAN 3.4).

import { LBS, ROUTE_FIX_X, ROUTE_Y, VIEW, clamp01, devicePoints, easeInOut, easeOut, finalSatellites, inPolygon, span, unitFrame } from "../geometry";
import { GLYPH_FAMILY, gaussUnit, glyph, hline, jitter, scatter } from "./targets";

export type SignalEngine = { setTarget(p: number): void; destroy(): void };

/** 색은 캔버스 요소의 계산된 CSS 변수에서 읽는다 */
export function readColors(el: Element) {
  const cs = getComputedStyle(el);
  const v = (name: string, fb: string) => cs.getPropertyValue(name).trim() || fb;
  return {
    cold: v("--n-particle", "rgba(80,90,110,0.5)"),
    tone: v("--tone", "#3fc0e6"),
    glow: v("--glow", "rgba(63,192,230,0.45)"),
    paper: v("--paper", "#070c1a"),
  };
}

const CM_R = 14; // 센티미터 오차 원 반지름(px)

export function createSignalEngine(canvas: HTMLCanvasElement, stage: HTMLElement, giant: HTMLElement, count: number): SignalEngine {
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  let src: Float32Array = new Float32Array(count * 2);
  let scat: Float32Array = new Float32Array(count * 2);
  let gly: Float32Array = new Float32Array(count * 2);
  let line: Float32Array = new Float32Array(count * 2);
  const nDev = LBS.devices.n;
  let dev: Float32Array = new Float32Array(nDev * 2);
  const inside = new Uint8Array(nDev);
  const devDist = new Float32Array(nDev);
  const gauss = gaussUnit(count, 41);
  const { delay, hue, phase } = jitter(count, 43);
  let P = { x: 0, y: 0 };
  let vmin = 0;
  let maxDist = 1;
  let target = 0;
  let current = 0;
  let raf = 0;
  let visible = false;
  let ready = false;
  let colors = readColors(canvas);

  const layout = async () => {
    colors = readColors(canvas);
    const r = stage.getBoundingClientRect();
    w = r.width;
    h = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const f = unitFrame(w, h);
    const px = (x: number, y: number) => ({ x: f.ox + x * f.u, y: f.oy + y * f.u });
    const sats = finalSatellites().map((s) => px(s.x, s.y));
    P = px(LBS.fix.x, LBS.fix.y);
    vmin = Math.min(w, h) / 100;
    src = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const s = sats[i % sats.length];
      src[i * 2] = s.x + gauss[i * 2] * 5;
      src[i * 2 + 1] = s.y + gauss[i * 2 + 1] * 5;
    }
    scat = scatter(count, { x: 0, y: 0, w, h }, 47);
    const lx = px(ROUTE_FIX_X, ROUTE_Y);
    line = hline(count, lx.x, px(VIEW.w, 0).x, lx.y, 53);
    // 단말(시드 고정) + 구역 안 판정 + 측점에서의 거리(방송 원이 닿는 순서)
    const pts = devicePoints(nDev);
    dev = new Float32Array(nDev * 2);
    maxDist = 1;
    for (let i = 0; i < nDev; i++) {
      const q = px(pts[i].x, pts[i].y);
      dev[i * 2] = q.x;
      dev[i * 2 + 1] = q.y;
      inside[i] = inPolygon(pts[i].x, pts[i].y, LBS.poly) ? 1 : 0;
      devDist[i] = Math.hypot(q.x - P.x, q.y - P.y);
      if (inside[i] && devDist[i] > maxDist) maxDist = devDist[i];
    }
    try {
      await document.fonts.load(`800 200px ${GLYPH_FAMILY}`);
    } catch {
      // 대체 글꼴로 진행
    }
    const gr = giant.getBoundingClientRect();
    const fontPx = parseFloat(getComputedStyle(giant).fontSize) || 400;
    gly = glyph(count, giant.textContent ?? "17", { x: gr.left - r.left, y: gr.top - r.top, w: gr.width, h: gr.height }, fontPx, GLYPH_FAMILY, 59);
    ready = true;
    kick(true);
  };

  /** 측정 격자: 3단 점 격자, 배율 z(1~10), 등각 k(0~1) */
  const drawGrid = (z: number, k: number, alpha: number) => {
    if (!ctx || alpha <= 0.01) return;
    const base = 48;
    const cos30 = Math.cos(Math.PI / 6);
    // 등각: (x, y) → ((x - y)·cos30, (x + y)·0.5) 를 평면 좌표에 섞는다
    ctx.fillStyle = colors.tone;
    for (const lvl of [base / 5, base, base * 5]) {
      const s = lvl * z; // 화면 간격
      const a = clamp01((s - 10) / 22) * (1 - clamp01((s - 520) / 520));
      if (a <= 0.01) continue;
      ctx.globalAlpha = alpha * a * (lvl === base * 5 ? 0.7 : 0.45);
      const size = lvl === base * 5 ? 2.6 : 1.8;
      const reach = Math.max(w, h) * (k > 0 ? 1.1 : 0.75);
      const n = Math.ceil(reach / s);
      if (n > 90) continue;
      for (let gx = -n; gx <= n; gx++) {
        for (let gy = -n; gy <= n; gy++) {
          const fx = gx * s;
          const fy = gy * s;
          const ix = (fx - fy) * cos30;
          const iy = (fx + fy) * 0.5;
          const x = P.x + fx + (ix - fx) * k;
          const y = P.y + fy + (iy - fy) * k;
          if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  const circle = (x: number, y: number, r: number, stroke: boolean, fillAlpha: number, alpha: number) => {
    if (!ctx || r <= 0.5) return;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fillAlpha > 0) {
      ctx.globalAlpha = alpha * fillAlpha;
      ctx.fillStyle = colors.tone;
      ctx.fill();
    }
    if (stroke) {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = colors.tone;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const draw = (p: number) => {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (p <= 0.05) return;

    // ── 측정 격자(2.4): 2.3 의 원근 지면(SVG)이 빠진 뒤 평면 격자가 서고 등각으로 눕는다 ──
    const gridIn = span(p, 274, 288) * (1 - span(p, 372, 388));
    if (gridIn > 0) {
      ctx.globalAlpha = gridIn;
      ctx.fillStyle = colors.paper;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      const iso = easeInOut(span(p, 280, 300)) * (1 - span(p, 372, 386));
      drawGrid(1, iso, gridIn);
    }

    // ── 입자 ──
    ctx.globalCompositeOperation = "lighter";
    const a1 = p / 90;
    const a2 = (p - 90) / 80;
    const sigmaStart = 45 * vmin;
    const sigmaEnd = 3;
    const noiseAmp = p < 90 ? 2 + 4 * clamp01(a1) : p < 180 ? 6 * (1 - clamp01(a2)) : 0;

    if (p < 190) {
      // 흩어짐 → 수렴 → 측점으로 모여 사라짐
      const collapse = span(p, 178, 190);
      const alpha = 1 - collapse;
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass === 0 ? colors.cold : colors.tone;
        ctx.globalAlpha = alpha;
        const share = p < 90 ? 0.2 : 0.2 + 0.8 * clamp01(a2);
        for (let i = 0; i < count; i++) {
          const isTone = hue[i] < share;
          if ((pass === 1) !== isTone) continue;
          const d = delay[i];
          const ix = i * 2;
          const iy = ix + 1;
          const nx = noiseAmp * Math.sin(p * 0.35 + phase[i]);
          const ny = noiseAmp * Math.cos(p * 0.3 + phase[i]);
          let x: number;
          let y: number;
          if (p < 90) {
            const t = easeOut((a1 - d) / 0.75);
            x = src[ix] + (scat[ix] - src[ix]) * t + nx;
            y = src[iy] + (scat[iy] - src[iy]) * t + ny;
          } else {
            const t = easeOut((a2 - d) / 0.75);
            const sigma = (sigmaStart + (sigmaEnd - sigmaStart) * t) * (1 - collapse);
            const gx = P.x + gauss[ix] * sigma;
            const gy = P.y + gauss[iy] * sigma;
            x = scat[ix] + nx + (gx - scat[ix] - nx) * t;
            y = scat[iy] + ny + (gy - scat[iy] - ny) * t;
          }
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
      // 빛(신호 입자에만, 수렴 구간)
      if (p > 90) {
        const t = easeOut(clamp01(a2));
        const r = sigmaStart + (sigmaEnd - sigmaStart) * t;
        ctx.globalAlpha = 0.28 * alpha;
        ctx.fillStyle = colors.glow;
        ctx.beginPath();
        ctx.arc(P.x, P.y, Math.max(8, Math.min(r * 0.35, 64)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      // 오차 원 게이지(2.2): 반지름 = 2σ, 분포를 둘러싼 채 함께 줄어든다
      if (p > 90) {
        const t = easeOut(clamp01(a2));
        const sigma = sigmaStart + (sigmaEnd - sigmaStart) * t;
        const ga = span(p, 92, 104) * (1 - span(p, 172, 184));
        circle(P.x, P.y, Math.max(CM_R, 2 * sigma), true, 0, ga);
      }
      return;
    }

    if (p >= 375 && p < 470) {
      // 단말(2.5): 국내 지도가 한 지역으로 확대된 뒤 측점에서 퍼져 제자리에 서고, 방송 원이 지나면 구역 안 단말만 켜진다
      const appear = easeOut(span(p, 404, 420));
      const lit = span(p, 420, 442);
      for (let pass = 0; pass < 2; pass++) {
        ctx.globalCompositeOperation = pass === 0 ? "source-over" : "lighter";
        ctx.fillStyle = pass === 0 ? colors.cold : colors.tone;
        for (let i = 0; i < nDev; i++) {
          const on = inside[i] && lit * 1.0001 >= devDist[i] / maxDist;
          if ((pass === 1) !== Boolean(on)) continue;
          const t = clamp01((appear - delay[i] * 0.6) / 0.6);
          const x = P.x + (dev[i * 2] - P.x) * t;
          const y = P.y + (dev[i * 2 + 1] - P.y) * t;
          ctx.globalAlpha = t;
          const s = pass === 1 ? 3 : 2.5;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      // 켜진 단말의 빛
      if (lit > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = colors.glow;
        for (let i = 0; i < nDev; i++) {
          if (!inside[i] || lit < devDist[i] / maxDist) continue;
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(dev[i * 2], dev[i * 2 + 1], 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      return;
    }

    if (p >= 470) {
      // "17" 글리프 → 가로선(2.6·2.7): 단말 400개는 제자리에서, 나머지는 측점 둘레에서 나와 모인다
      const a3 = (p - 470) / 80;
      const a4 = (p - 582) / 38;
      let alpha = 1;
      if (p > 550 && p <= 580) alpha = 1 - 0.75 * ((p - 550) / 30);
      else if (p > 580) alpha = 0.25 + 0.6 * clamp01((p - 590) / 30);
      ctx.fillStyle = colors.tone;
      for (let i = 0; i < count; i++) {
        const d = delay[i];
        const ix = i * 2;
        const iy = ix + 1;
        let sx: number;
        let sy: number;
        let aIn = 1;
        if (i < nDev) {
          sx = dev[ix];
          sy = dev[iy];
        } else {
          sx = P.x + gauss[ix] * 18 * vmin;
          sy = P.y + gauss[iy] * 18 * vmin;
          aIn = clamp01((p - 470 - d * 40) / 24);
        }
        const t = easeOut((a3 - d) / 0.75);
        let x = sx + (gly[ix] - sx) * t;
        let y = sy + (gly[iy] - sy) * t;
        if (p > 582) {
          const t2 = easeOut((a4 - d) / 0.75);
          x = gly[ix] + (line[ix] - gly[ix]) * t2;
          y = gly[iy] + (line[iy] - gly[iy]) * t2;
        }
        ctx.globalAlpha = alpha * aIn;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const tick = () => {
    raf = 0;
    const diff = target - current;
    current = Math.abs(diff) < 0.05 ? target : current + diff * 0.18;
    draw(current);
    if (current !== target && visible && !document.hidden) raf = requestAnimationFrame(tick);
  };

  function kick(force = false) {
    if (!ready || !visible || document.hidden) return;
    if (force) draw(current);
    if (!raf && current !== target) raf = requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) kick(true);
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: "10% 0px" },
  );
  io.observe(canvas);
  const onVis = () => kick(true);
  document.addEventListener("visibilitychange", onVis);
  const onTheme = () => {
    colors = readColors(canvas);
    kick(true);
  };
  window.addEventListener("themechange", onTheme);
  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => void layout(), 120);
  });
  ro.observe(stage);
  void layout();

  return {
    setTarget(p: number) {
      target = p;
      kick();
    },
    destroy() {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("themechange", onTheme);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
