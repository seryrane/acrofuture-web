// 입자 목표점 생성: 흩어짐, 가우스, 글리프("17"), 가로선. 모두 px 좌표의 Float32Array(x, y 교대).

import { gaussianPair, mulberry32 } from "../geometry";

export type Box = { x: number; y: number; w: number; h: number };

export function scatter(n: number, box: Box, seed = 7): Float32Array {
  const r = mulberry32(seed);
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    out[i * 2] = box.x + r() * box.w;
    out[i * 2 + 1] = box.y + r() * box.h;
  }
  return out;
}

/** 단위 가우스 벡터(반경 σ 는 그릴 때 곱한다) */
export function gaussUnit(n: number, seed = 11): Float32Array {
  const r = mulberry32(seed);
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const [gx, gy] = gaussianPair(r);
    out[i * 2] = gx;
    out[i * 2 + 1] = gy;
  }
  return out;
}

/**
 * 글리프 표본: 오프스크린 캔버스(1/4 해상도)에 글자를 그려 알파 > 128 픽셀을 모은 뒤 입자 수만큼 섞어 반복.
 * box 는 글자가 놓일 화면 상자(DOM 대형 숫자의 getBoundingClientRect 기준), fontPx 는 그 글자 크기.
 */
export function glyph(n: number, text: string, box: Box, fontPx: number, family: string, seed = 17): Float32Array {
  const q = 4;
  const w = Math.max(8, Math.ceil(box.w / q));
  const h = Math.max(8, Math.ceil(box.h / q));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const out = new Float32Array(n * 2);
  if (!ctx) return out;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${fontPx / q}px ${family}`;
  ctx.fillText(text, w / 2, h / 2 + fontPx / q * 0.04);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const r = mulberry32(seed);
  const count = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const k = count > 0 ? Math.floor(r() * count) : 0;
    const px = count > 0 ? pts[k * 2] : w / 2;
    const py = count > 0 ? pts[k * 2 + 1] : h / 2;
    out[i * 2] = box.x + (px + r()) * q;
    out[i * 2 + 1] = box.y + (py + r()) * q;
  }
  return out;
}

/** 가로선(y 고정, x0~x1 균등 + 작은 흔들림) */
export function hline(n: number, x0: number, x1: number, y: number, seed = 23): Float32Array {
  const r = mulberry32(seed);
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    out[i * 2] = x0 + (i / n) * (x1 - x0) + r() * 2;
    out[i * 2 + 1] = y + (r() - 0.5) * 2;
  }
  return out;
}

/** 입자별 지연(0~0.25)과 색 순번(0~1) */
export function jitter(n: number, seed = 31): { delay: Float32Array; hue: Float32Array; phase: Float32Array } {
  const r = mulberry32(seed);
  const delay = new Float32Array(n);
  const hue = new Float32Array(n);
  const phase = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    delay[i] = r() * 0.25;
    hue[i] = r();
    phase[i] = r() * Math.PI * 2;
  }
  return { delay, hue, phase };
}

/** "17" 글리프 글꼴: DOM 대형 숫자와 같은 표시용 PJS 800(로고 스타일) */
export const GLYPH_FAMILY = '"PJS Display", "Pretendard Variable", "Malgun Gothic", sans-serif';
