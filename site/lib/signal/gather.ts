// 모바일·태블릿 "17" 입자 수렴(핵심 연출 ②): 트리거 1회, 1400ms, 끝나면 rAF 정지. DPR 상한 2.

import { easeOut } from "../geometry";
import { GLYPH_FAMILY, glyph, jitter, scatter } from "./targets";

export async function playGather(canvas: HTMLCanvasElement, numberEl: HTMLElement, count = 700): Promise<void> {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  try {
    await document.fonts.load(`800 100px ${GLYPH_FAMILY}`);
  } catch {
    // 글꼴을 못 받아도 대체 글꼴로 진행
  }
  const nb = numberEl.getBoundingClientRect();
  const fontPx = parseFloat(getComputedStyle(numberEl).fontSize) || 160;
  const box = { x: nb.left - rect.left, y: nb.top - rect.top, w: nb.width, h: nb.height };
  const from = scatter(count, { x: 0, y: 0, w: rect.width, h: rect.height }, 5);
  const to = glyph(count, numberEl.textContent ?? "17", box, fontPx, GLYPH_FAMILY, 9);
  const { delay } = jitter(count, 13);
  const color = getComputedStyle(numberEl).color || "currentColor";

  const D = 1400;
  const t0 = performance.now();
  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / D);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const k = easeOut((t - delay[i]) / (1 - 0.25));
        const x = from[i * 2] + (to[i * 2] - from[i * 2]) * k;
        const y = from[i * 2 + 1] + (to[i * 2 + 1] - from[i * 2 + 1]) * k;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}
