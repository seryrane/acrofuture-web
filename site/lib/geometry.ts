import { KR, KR_TARGET } from "./korea-map";
// 도면 좌표 계산. 스테이지 도판은 1600×900 단위 좌표계(SVG viewBox, preserveAspectRatio slice)를 쓴다.
// HTML 층은 CSS 변수 --u(1단위 = px), --ox, --oy 로 같은 좌표계에 놓인다.

export const VIEW = { w: 1600, h: 900 } as const;

export type Pt = { x: number; y: number };

/** 스테이지 크기에서 1단위의 px 과 원점 오프셋(slice 와 같은 계산) */
export function unitFrame(width: number, height: number) {
  const u = Math.max(width / VIEW.w, height / VIEW.h);
  return { u, ox: (width - VIEW.w * u) / 2, oy: (height - VIEW.h * u) / 2 };
}

export function toPx(p: Pt, f: { u: number; ox: number; oy: number }): Pt {
  return { x: f.ox + p.x * f.u, y: f.oy + p.y * f.u };
}

export function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export function polylineD(points: Pt[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`).join(" ");
}

/** 꺾은선 누적 길이 비율(0~1) */
export function cumulative(points: Pt[]): { total: number; ratios: number[] } {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    lengths.push(lengths[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = lengths[lengths.length - 1] || 1;
  return { total, ratios: lengths.map((l) => l / total) };
}

/** 꺾은선 위 진행 비율 t 의 좌표 */
export function pointAt(points: Pt[], t: number, ratios = cumulative(points).ratios): Pt {
  const target = Math.min(1, Math.max(0, t));
  for (let i = 1; i < points.length; i++) {
    if (target <= ratios[i] || i === points.length - 1) {
      const span = ratios[i] - ratios[i - 1] || 1;
      const local = Math.min(1, Math.max(0, (target - ratios[i - 1]) / span));
      const a = points[i - 1];
      const b = points[i];
      return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
    }
  }
  return points[points.length - 1];
}

/** 3차 베지어 */
export function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const m = 1 - t;
  const a = m * m * m;
  const b = 3 * m * m * t;
  const c = 3 * m * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** 구간 [a, b] 안의 진행 비율 */
export function span(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a));
}

/** --ease-out: cubic-bezier(0.23, 1, 0.32, 1) 근사(지수형 감속) */
export function easeOut(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3.2);
}

export function easeInOut(t: number) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/* ── 1장: 원점과 궤도 ── */
export const ORIGIN = {
  fix: { x: 1152, y: 450 } as Pt,
  rings: [24, 88, 220],
  // 궤도: 눕힘 70°, 회전 0/28/-36°, 배율 1.8/2.6/3.4 (최종 상태)
  orbits: [
    { r: 24, rot: 0, s: 1.8 },
    { r: 88, rot: 28, s: 2.6 },
    { r: 220, rot: -36, s: 3.4 },
  ],
  tilt: 70,
  // 위성: 궤도 번호, 시작 각도(도). 스크럽으로 +120° 이동
  sats: [
    { orbit: 0, a0: 200 },
    { orbit: 1, a0: 110 },
    { orbit: 2, a0: 20 },
    { orbit: 2, a0: 250 },
  ],
} as const;

/** 궤도 위 점: 원(r·s) → 눕힘(cos tilt) → 회전(rot) */
export function orbitPoint(r: number, s: number, tiltDeg: number, rotDeg: number, angleDeg: number, c: Pt): Pt {
  const th = (angleDeg * Math.PI) / 180;
  const x = r * s * Math.cos(th);
  const y = r * s * Math.cos((tiltDeg * Math.PI) / 180) * Math.sin(th);
  const rot = (rotDeg * Math.PI) / 180;
  return { x: c.x + x * Math.cos(rot) - y * Math.sin(rot), y: c.y + x * Math.sin(rot) + y * Math.cos(rot) };
}

export function finalSatellites(): Pt[] {
  return ORIGIN.sats.map((s) => {
    const o = ORIGIN.orbits[s.orbit];
    return orbitPoint(o.r, o.s, ORIGIN.tilt, o.rot, s.a0 + 120, ORIGIN.fix);
  });
}

/* ── 2.5 확대 대상(서울, 2026-09-29 대표 지시): 서울 안쪽 중심이 측점에 오고 배율 KR_ZOOM(원본 1 = 화면 KR_ZOOM 단위).
   서울 경계를 화면 단위로 옮겨 지오펜스(서울 모양을 안쪽으로 줄인 다각형)와 단말 배치(서울 안에 더 조밀하게)에 쓴다 ── */
const FIX25: Pt = { x: 1152, y: 450 };
export const KR_ZOOM = 14;

function seoulUnits(): Pt[] {
  const ring = KR_TARGET.split("Z")[0].replace("M", "").split("L").map((q) => {
    const [x, y] = q.trim().split(" ").map(Number);
    return { x: FIX25.x + (x - KR.target.cx) * KR_ZOOM, y: FIX25.y + (y - KR.target.cy) * KR_ZOOM };
  });
  return ring;
}
/** 화면 단위의 서울 경계와 가로 범위 */
export const SEOUL = seoulUnits();
export const SEOUL_X = { min: Math.min(...SEOUL.map((q) => q.x)), max: Math.max(...SEOUL.map((q) => q.x)) };

/** 지오펜스: 서울 경계를 안쪽 중심 쪽으로 0.62 배 줄이고, 12방향으로 골라 꼭짓점 12개 */
function zonePoly(): Pt[] {
  const k = 0.62;
  const out: Pt[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    // 이 방향에서 가장 먼 경계점(각도 차가 가장 작은 점)
    let best = SEOUL[0];
    let bd = Infinity;
    for (const q of SEOUL) {
      const qa = Math.atan2(q.y - FIX25.y, q.x - FIX25.x);
      let d = Math.abs(qa - (a > Math.PI ? a - 2 * Math.PI : a));
      if (d > Math.PI) d = 2 * Math.PI - d;
      if (d < bd) {
        bd = d;
        best = q;
      }
    }
    out.push({ x: Math.round(FIX25.x + (best.x - FIX25.x) * k), y: Math.round(FIX25.y + (best.y - FIX25.y) * k) });
  }
  return out;
}

/* ── 2장 LBS·측위(3판): 측점은 1.1 의 원점 자리. 1024 폭에서도 보이도록 오른쪽 끝 x ≤ 1320 ── */
export const LBS = {
  fix: { x: 1152, y: 450 } as Pt,
  /** 2.3 RTK 보정 신호: 화면 위쪽 한 점에서 내려오는 방송 호 3개(각도: 0 = 오른쪽, 90 = 아래) */
  arcs: { cx: 1152, cy: 36, r: [118, 228, 336], a0: 62, a1: 118 },
  /** 2.4 등각 층 판 5장(마름모 반폭 w, 반높이 h, 간격 gap). 측점은 1층(0)에서 4층(3)으로 오른다 */
  plates: { cx: 1100, y0: 566, gap: 56, w: 212, h: 122, n: 5, top: 3 },
  /** 2.4 치수선 x */
  dimX: 852,
  /** 2.5 구역 다각형: 서울 모양을 안쪽으로 줄인 지오펜스 */
  poly: zonePoly(),
  /** 2.5 단말이 흩어지는 영역 */
  devices: { x0: 740, x1: 1490, y0: 118, y1: 858, n: 400 },
} as const;

/**
 * 2.3 RTK 원근 지면: 카메라 높이 H 에서 지면(gx 가로, gz 깊이)을 본 투영(화면 단위 1600×900).
 * 수신 단말(측점)은 지면 위 gy 높이에 떠 있고 그 발 밑에 오차 원이 눕는다. 기준국은 왼쪽 뒤, 위성 2기는 하늘.
 */
export const RTK = {
  vx: 1152,
  hy: 250,
  f: 900,
  H: 2.1,
  z0: 3,
  foot: { gx: 0, gz: 4 },
  fixH: 0.544,
  base: { gx: -1.25, gz: 2.6, h: 0.9 },
  sats: [
    { x: 905, y: 150 },
    { x: 1392, y: 172 },
  ] as Pt[],
  rMeter: 1.2,
  rCm: 0.07,
  plane: { gx0: -1.7, gx1: 3.2, gz0: 0.6, gz1: 13, step: 0.5 },
} as const;

export function rtkP(gx: number, gz: number, gy = 0): Pt {
  const d = RTK.z0 + gz;
  return { x: RTK.vx + (RTK.f * gx) / d, y: RTK.hy + (RTK.f * (RTK.H - gy)) / d };
}

const f1 = (v: number) => v.toFixed(1);

/** 지면 위 원(반지름 r, 중심 = 단말 발 밑)을 원근 투영한 닫힌 경로 */
export function rtkCircleD(r: number, n = 40): string {
  const { gx, gz } = RTK.foot;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const q = rtkP(gx + r * Math.cos(a), gz + r * Math.sin(a));
    d += `${i ? "L" : "M"}${f1(q.x)} ${f1(q.y)}`;
  }
  return d + "Z";
}

/** 지면 판: 가장자리 사각형 + 격자선(경로 하나) */
export function rtkPlane(): { edge: string; grid: string; slab: string } {
  const { gx0, gx1, gz0, gz1, step } = RTK.plane;
  const q = (x: number, z: number) => {
    const p = rtkP(x, z);
    return `${f1(p.x)} ${f1(p.y)}`;
  };
  const edge = `M${q(gx0, gz0)}L${q(gx1, gz0)}L${q(gx1, gz1)}L${q(gx0, gz1)}Z`;
  let grid = "";
  for (let x = gx0 + step; x < gx1 - 1e-6; x += step) grid += `M${q(x, gz0)}L${q(x, gz1)}`;
  for (let z = gz0 + 1; z < gz1 - 1e-6; z += 1) grid += `M${q(gx0, z)}L${q(gx1, z)}`;
  const nl = rtkP(gx0, gz0);
  const nr = rtkP(gx1, gz0);
  const slab = `M${f1(nl.x)} ${f1(nl.y)}L${f1(nr.x)} ${f1(nr.y)}L${f1(nr.x)} ${f1(nr.y + 12)}L${f1(nl.x)} ${f1(nl.y + 12)}Z`;
  return { edge, grid, slab };
}

/** 기준국 안테나 꼭대기, 단말(측점), 보정 신호 3차원 호(기준국 → 단말, 지면 위로 솟았다 내려온다) */
export function rtkPoints() {
  const b = RTK.base;
  const top = rtkP(b.gx, b.gz, b.h);
  const fix = rtkP(RTK.foot.gx, RTK.foot.gz, RTK.fixH);
  const foot = rtkP(RTK.foot.gx, RTK.foot.gz);
  const n = 28;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const gx = b.gx + (RTK.foot.gx - b.gx) * t;
    const gz = b.gz + (RTK.foot.gz - b.gz) * t;
    const gy = b.h + (RTK.fixH - b.h) * t + 1.15 * Math.sin(Math.PI * t);
    pts.push(rtkP(gx, gz, gy));
  }
  const signal = pts.map((p, i) => `${i ? "L" : "M"}${f1(p.x)} ${f1(p.y)}`).join("");
  return { top, fix, foot, signal, mid: pts[Math.round(n * 0.42)] };
}

/** 기준국: 세 다리 삼각대 + 안테나 원반(원근 타원) */
export function rtkBaseD(): { legs: string; disc: string } {
  const b = RTK.base;
  const top = rtkP(b.gx, b.gz, b.h);
  const feet = [rtkP(b.gx - 0.22, b.gz - 0.1), rtkP(b.gx + 0.22, b.gz - 0.1), rtkP(b.gx, b.gz + 0.25)];
  const legs = feet.map((p) => `M${f1(top.x)} ${f1(top.y)}L${f1(p.x)} ${f1(p.y)}`).join("");
  let disc = "";
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const p = rtkP(b.gx + 0.26 * Math.cos(a), b.gz + 0.26 * Math.sin(a), b.h + 0.06);
    disc += `${i ? "L" : "M"}${f1(p.x)} ${f1(p.y)}`;
  }
  return { legs, disc: disc + "Z" };
}

/**
 * 2.5 국내 지도 → 한 지역 확대(도식). 원본 좌표(lib/korea-map, 524×631)를 화면 단위로:
 * 전국은 배율 m 으로 (mx, my) 에, 확대 끝은 대상 지역 안쪽 중심이 측점(LBS.fix)에 오고 배율 M.
 * 작은 전국도(inset)는 확대 뒤 도판 왼쪽 위에 둔다.
 */
export const KRMAP = { m: 0.85, cx: 1090, cy: 450, M: KR_ZOOM, inset: { x: 752, y: 120, m: 0.27 } } as const;

export function krTransform(t: number, pole: Pt, w: number, h: number): string {
  const { m, cx, cy, M } = KRMAP;
  const mx = cx - (m * w) / 2;
  const my = cy - (m * h) / 2;
  const p0 = { x: mx + m * pole.x, y: my + m * pole.y };
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const sc = m * Math.pow(M / m, e);
  const px = p0.x + (LBS.fix.x - p0.x) * e;
  const py = p0.y + (LBS.fix.y - p0.y) * e;
  return `translate(${px.toFixed(2)} ${py.toFixed(2)}) scale(${sc.toFixed(4)}) translate(${-pole.x} ${-pole.y})`;
}

export function plateD(cy: number): string {
  const { cx, w, h } = LBS.plates;
  return `M${cx} ${cy - h} L${cx + w} ${cy} L${cx} ${cy + h} L${cx - w} ${cy} Z`;
}

export function arcD(r: number): string {
  const { cx, cy, a0, a1 } = LBS.arcs;
  const p = (a: number) => ({ x: cx + r * Math.cos((a * Math.PI) / 180), y: cy + r * Math.sin((a * Math.PI) / 180) });
  const s = p(a1);
  const e = p(a0);
  return `M${round(s.x)} ${round(s.y)} A${r} ${r} 0 0 0 ${round(e.x)} ${round(e.y)}`;
}

/** 점-다각형 안 판정(짝홀 규칙) */
export function inPolygon(x: number, y: number, poly: readonly Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** 2.5 단말 좌표(시드 고정, 단위 좌표) */
/** 2.5 단말: 절반은 서울 경계 안에 조밀하게, 나머지는 둘레 넓게(구역 밖 단말). 시드 고정 */
export function devicePoints(n: number = LBS.devices.n, seed = 2015): Pt[] {
  const r = mulberry32(seed);
  const { x0, x1, y0, y1 } = LBS.devices;
  const xs = SEOUL.map((q) => q.x);
  const ys = SEOUL.map((q) => q.y);
  const bx0 = Math.min(...xs);
  const bx1 = Math.max(...xs);
  const by0 = Math.min(...ys);
  const by1 = Math.max(...ys);
  const out: Pt[] = [];
  const nIn = Math.round(n * 0.55);
  for (let i = 0; i < n; i++) {
    if (i < nIn) {
      for (let tries = 0; tries < 40; tries++) {
        const q = { x: bx0 + r() * (bx1 - bx0), y: by0 + r() * (by1 - by0) };
        if (inPolygon(q.x, q.y, SEOUL) || tries === 39) {
          out.push(q);
          break;
        }
      }
    } else out.push({ x: x0 + r() * (x1 - x0), y: y0 + r() * (y1 - y0) });
  }
  return out;
}

/* ── 2장·3장: 가로선과 연혁 트랙 ── */
export const ROUTE_Y = 486; // 화면 54%: 고정 제목과 위 라벨이 겹치지 않는 높이
export const ROUTE_FIX_X = 480; // 화면 x 30vw
export const TRACK_SPAN = 5760; // 360vw (1600단위 = 100vw)
export const BRANCH_GAP = 100; // 세 갈래 간격(약 96px)
export const YEAR0 = 2009.54;
export const YEARS = 16.46;

export function stationX(year: number) {
  return ROUTE_FIX_X + ((year - YEAR0) / YEARS) * TRACK_SPAN;
}

export const SPLIT_X = stationX(2012);
export const END_X = stationX(2026);

export function branchD(dir: -1 | 1): string {
  const y = ROUTE_Y + dir * BRANCH_GAP;
  return `M${round(SPLIT_X)} ${ROUTE_Y} L${round(SPLIT_X + BRANCH_GAP)} ${y} H${round(END_X)}`;
}

export const MAIN_D = `M${ROUTE_FIX_X} ${ROUTE_Y} H${round(END_X)}`;

/** 트랙 이동량 T(단위)에서 각 갈래가 그려진 비율 */
export function branchDrawn(T: number): { main: number; side: number } {
  const head = ROUTE_FIX_X + T;
  const main = clamp01(T / TRACK_SPAN);
  const diag = BRANCH_GAP * Math.SQRT2;
  const len = diag + (END_X - SPLIT_X - BRANCH_GAP);
  let d = 0;
  if (head > SPLIT_X) {
    const dx = head - SPLIT_X;
    d = dx <= BRANCH_GAP ? dx * Math.SQRT2 : diag + (dx - BRANCH_GAP);
  }
  return { main, side: clamp01(d / len) };
}

/* ── 4장: 금융 레일 ── */
export const RAIL = {
  inY: ROUTE_Y - BRANCH_GAP, // 3장 위 갈래 높이(386)
  inX: ROUTE_FIX_X,
  upper: 342, // 화면 38%
  lower: 558, // 화면 62%
  stations: [700, 900, 1100, 1300],
} as const;

/** 패킷 순환로: 채널 레일(좌→우) → 연결선 아래 → 내부 시스템 레일(우→좌) → 연결선 위 */
export const PACKET_LOOP: Pt[] = [
  { x: RAIL.stations[0], y: RAIL.upper },
  { x: RAIL.stations[3], y: RAIL.upper },
  { x: RAIL.stations[3], y: RAIL.lower },
  { x: RAIL.stations[0], y: RAIL.lower },
  { x: RAIL.stations[0], y: RAIL.upper },
];

/* ── 4.3~5장: 도로 평면(평면 좌표 = 화면 단위 좌표, 평면은 위로 길게 이어진다) ── */
export const ROAD = {
  cell: 200,
  minX: -1600,
  maxX: 3200,
  minY: -4200,
  maxY: 1600,
  drive: 1200, // 6칸
  carX: 800,
  route: "M800 1600 V-600 H1200 V-2400 H1000 V-4200",
  pois: [
    { x: 640, y: -400 },
    { x: 1040, y: -900 },
    { x: 1360, y: -1500 },
    { x: 1040, y: -2200 },
  ],
} as const;

export function roadGridD(): string {
  const parts: string[] = [];
  for (let x = ROAD.minX; x <= ROAD.maxX; x += ROAD.cell) parts.push(`M${x} ${ROAD.minY} V${ROAD.maxY}`);
  for (let y = ROAD.minY; y <= ROAD.maxY; y += ROAD.cell) parts.push(`M${ROAD.minX} ${y} H${ROAD.maxX}`);
  return parts.join(" ");
}

/* ── 6장: 솔루션 도판(오른쪽, 4:3 화면에서도 잘리지 않는 x 200~1400 안쪽) ── */
export const SOL = {
  box: { x: 820, y: 150, s: 540 },
  c: { x: 1090, y: 450 } as Pt,
  // AcTrack 궤적(5.3 조감 측점 위치에서 들어와 도판 안으로)
  track: [
    { x: 800, y: 700 },
    { x: 960, y: 820 },
    { x: 980, y: 330 },
    { x: 1190, y: 330 },
  ] as Pt[],
  gps: { x: 900, y: 210 } as Pt,
  wifi: { x: 1320, y: 250 } as Pt,
  hubA: { x: 900, y: 650 } as Pt,
  hubB: { x: 1300, y: 250 } as Pt,
  zoneR: 100,
  ledger: { cells: 4, size: 440 },
} as const;

export function trackPoint(t: number): Pt {
  const [a, b, c, d] = SOL.track;
  return bezier(a, b, c, d, t);
}

export const CACAGO_ROUTES: Pt[][] = [
  [SOL.hubA, { x: SOL.hubB.x, y: SOL.hubA.y }, SOL.hubB],
  [SOL.hubA, { x: SOL.hubA.x, y: SOL.hubB.y }, SOL.hubB],
];

export function ledgerCell(col: number, row: number): Pt {
  const { size, cells } = SOL.ledger;
  const cs = size / cells;
  return { x: SOL.c.x - size / 2 + cs * (col + 0.5), y: SOL.c.y - size / 2 + cs * (row + 0.5) };
}

export const LEDGER_ASSETS: [number, number][] = [
  [0, 0],
  [2, 0],
  [1, 1],
  [3, 2],
  [0, 3],
  [2, 3],
];
export const LEDGER_FIX: [number, number] = [3, 0];

/* ── 7장: 과정 트래버스(3판: 문구 블록 아래로 내리고, 오른쪽 끝은 1024 폭에서도 레일 앞) ── */
export const PROCESS = {
  stations: [
    { x: 280, y: 660 },
    { x: 540, y: 580 },
    { x: 800, y: 660 },
    { x: 1060, y: 580 },
    { x: 1300, y: 660 },
  ] as Pt[],
  exit: { x: 1640, y: 580 } as Pt,
  // 역 도착 진행(svh)
  arrive: [8, 45, 85, 135, 165],
  /** 7.2 트래버스가 오른쪽 위로 물러나는 변환(오른쪽 끝 기준 배율 0.6, 위로 380) */
  shrink: { ox: 1300, oy: 620, s: 0.6, dy: -380 },
  /** 6.6 표 행 선이 접히는 y(= 7.1 시작 선) */
  foldY: 660,
  // 7.3 개발자 29개 점 띠(보조 정보, 작게): 도판 6~12열 아래, 대형 97% 밑
  dotsY: 736,
  dotsX0: 770,
  dotStep: 16,
  groupGap: 34,
  center: { x: 800, y: 450 } as Pt,
} as const;

export function processPath(): Pt[] {
  return [...PROCESS.stations, PROCESS.exit];
}

export function dotPositions(groups: number[]): Pt[] {
  const out: Pt[] = [];
  let x = PROCESS.dotsX0;
  groups.forEach((n, gi) => {
    for (let i = 0; i < n; i++) {
      out.push({ x, y: PROCESS.dotsY });
      x += PROCESS.dotStep;
    }
    x += gi < groups.length - 1 ? PROCESS.groupGap - PROCESS.dotStep : 0;
  });
  return out;
}

/* ── 8장: 도착 ── */
export const ARRIVAL = { x: 1120, y: 495 } as Pt;

/* ── 결정적 난수(정지 도판의 수렴 점, 입자 초기값) ── */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussianPair(rand: () => number): [number, number] {
  const u = Math.max(1e-6, rand());
  const v = rand();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
}

/* ── 4장 디지털금융(3판): 3.4 위 갈래 머리에서 들어와 x 700 에서 두 레일로 갈라진다 ── */
export const FIN = {
  inX: ROUTE_FIX_X,
  inY: ROUTE_Y - BRANCH_GAP,
  split: 700,
  upper: 342,
  lower: 558,
  /** 4.6 차량 화살표 자리(화면 아래 가운데) */
  car: { x: 800, y: 790 } as Pt,
} as const;

/** 4.2 시간 축 위치(0~1): 2017 → 2027 */
export function finT(year: number, from = 2017, to = 2027): number {
  return (year - from) / (to - from);
}

/* ── CSS 3D 평면 투영(4.6~5장): 스테이지 perspective 1000px, 평면 중심 = 화면 중심 ── */
export type PlaneState = { rx: number; rz?: number; y: number; s: number; worldY?: number };

/** 평면 단위 좌표(월드) → 화면 px */
export function projectPlane(ux: number, uy: number, st: PlaneState, f: { w: number; h: number; u: number }, d = 1000, uz = 0): Pt {
  const rx = (st.rx * Math.PI) / 180;
  const rz = ((st.rz ?? 0) * Math.PI) / 180;
  let x = (ux - 800) * f.u * st.s;
  let y = ((uy - 450) * f.u + (st.worldY ?? 0)) * st.s;
  const z0 = uz * f.u * st.s;
  const z = y * Math.sin(rx) + z0 * Math.cos(rx);
  y = y * Math.cos(rx) - z0 * Math.sin(rx);
  const xr = x * Math.cos(rz) - y * Math.sin(rz);
  const yr = x * Math.sin(rz) + y * Math.cos(rz);
  x = xr;
  y = yr + st.y;
  const k = d / (d - z);
  return { x: f.w / 2 + x * k, y: f.h / 2 + y * k };
}

/** 화면 px → 평면 단위 좌표(rz = 0 일 때). 5.3 지역 블록을 원하는 화면 자리에 눕힌다 */
export function unprojectPlane(sx: number, sy: number, st: PlaneState, f: { w: number; h: number; u: number }, d = 1000): Pt {
  const rx = (st.rx * Math.PI) / 180;
  const X = sx - f.w / 2;
  const Y = sy - f.h / 2;
  const y1 = (d * (Y - st.y)) / (d * Math.cos(rx) + Y * Math.sin(rx));
  const z = y1 * Math.sin(rx);
  const k = d / (d - z);
  const x1 = X / k;
  return { x: 800 + x1 / st.s / f.u, y: 450 + (y1 / st.s - (st.worldY ?? 0)) / f.u };
}

/* ── 5장 IT서비스·모빌리티(3판): 도로 평면(월드 단위 좌표). 차량 화살표는 화면 (800, 790) ── */
export const MOB = {
  /** 5.1~5.2 주행 거리(월드 y 이동, 단위) */
  drive: 2100,
  route: "M800 1600 V-1900 H1200 V-3600 H1000 V-5400",
  /** POI 깃발 12개(길 양옆) */
  flags: [
    { x: 610, y: -620 },
    { x: 1000, y: -760 },
    { x: 570, y: -900 },
    { x: 1040, y: -1040 },
    { x: 630, y: -1200 },
    { x: 980, y: -1330 },
    { x: 560, y: -1520 },
    { x: 1030, y: -1650 },
    { x: 620, y: -1780 },
    { x: 1360, y: -2000 },
    { x: 1080, y: -2180 },
    { x: 1350, y: -2360 },
  ] as Pt[],
  /** 관문 3개(수집, 검토·승인, 검색): 경로 위 월드 y */
  gates: [-1080, -1430, -1760],
  gateW: 260,
  gateH: 150,
  /** 5.4 건물 8채(앞면 아래 가운데 x, 윗면 y, 폭, 깊이, 높이), 높이를 크게 달리해 도시 블록처럼 */
  buildings: [
    { x: 570, y: -1560, w: 120, d: 110, h: 140 },
    { x: 1010, y: -1500, w: 110, d: 100, h: 92 },
    { x: 540, y: -1800, w: 110, d: 120, h: 210 },
    { x: 1040, y: -1760, w: 130, d: 110, h: 160 },
    { x: 790, y: -2150, w: 120, d: 100, h: 120 },
    { x: 1150, y: -2080, w: 110, d: 110, h: 240 },
    { x: 400, y: -1660, w: 100, d: 100, h: 118 },
    { x: 1250, y: -1860, w: 100, d: 120, h: 186 },
  ],
  /** 5.4 다시 세운 경로와 픽업 표지 */
  replan: "M800 -1330 V-1440 H880 V-1680 H700 V-1940 H900",
  pickup: { x: 900, y: -1940 } as Pt,
} as const;

/* ── 6장 솔루션 화면 예시(지도 패널 viewBox 320×220) ── */
export const SCR = {
  act: {
    zone: [
      { x: 108, y: 54 },
      { x: 246, y: 44 },
      { x: 290, y: 122 },
      { x: 250, y: 184 },
      { x: 150, y: 194 },
      { x: 98, y: 134 },
    ] as Pt[],
    trails: [
      [
        { x: 34, y: 196 },
        { x: 82, y: 168 },
        { x: 128, y: 146 },
        { x: 170, y: 118 },
      ],
      [
        { x: 204, y: 84 },
        { x: 232, y: 104 },
        { x: 246, y: 142 },
      ],
      [
        { x: 186, y: 150 },
        { x: 226, y: 176 },
        { x: 262, y: 196 },
        { x: 300, y: 206 },
      ],
    ] as Pt[][],
  },
  cac: {
    stops: [
      { x: 34, y: 186 },
      { x: 108, y: 106 },
      { x: 204, y: 146 },
      { x: 286, y: 52 },
    ] as Pt[],
  },
  zone: {
    poly: [
      { x: 96, y: 62 },
      { x: 196, y: 40 },
      { x: 268, y: 94 },
      { x: 250, y: 172 },
      { x: 150, y: 188 },
      { x: 82, y: 134 },
    ] as Pt[],
    c: { x: 176, y: 114 } as Pt,
  },
} as const;
