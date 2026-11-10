import { lbs } from "@/lib/facts";
import { KRMAP, LBS, devicePoints, krTransform, gaussianPair, inPolygon, mulberry32, plateD, polylineD, type Pt } from "@/lib/geometry";
import { dotsD } from "../stage/Art";
import { KR, KR_OTHERS, KR_TARGET } from "@/lib/korea-map";
import "./Plates.css";
import { cls } from "@/lib/cls";

const s = cls("Plates");

// 2장 LBS·측위의 정지 도판(서버 전용). Lbs.tsx(3판 스테이지 장)와 4.1 사업 영역(components/v4/Business)이 함께 쓴다.
// 클라이언트 모듈을 끌어오지 않도록 Lbs.tsx 와 분리했다(첫 로드 JS 예산).

export const F = LBS.fix;
export const PL = LBS.plates;
export const plateY = (i: number) => PL.y0 - i * PL.gap;

/* ───────── 흐름·모션 감소 정지 도판(DOM 절약: 점은 색별 경로 하나) ───────── */

export function Fix2({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="var(--paper)" stroke="var(--fix)" strokeWidth="1.5" />
      <circle r={r * 0.43} fill="var(--fix-core)" />
    </g>
  );
}

/** 2.1 흩어짐: 시드 고정 점 160개(20% 청록) + 위성 4곳 */
export function ScatterPlate() {
  const r = mulberry32(2009);
  const tone: Pt[] = [];
  const cold: Pt[] = [];
  for (let i = 0; i < 160; i++) {
    const p = { x: 12 + r() * 376, y: 12 + r() * 236 };
    (r() < 0.2 ? tone : cold).push(p);
  }
  const sats = [
    { x: 70, y: 40 },
    { x: 330, y: 60 },
    { x: 110, y: 210 },
    { x: 300, y: 205 },
  ];
  return (
    <svg viewBox="0 0 400 260" data-plate="" aria-hidden="true" focusable="false">
      <path d={dotsD(cold, 3)} fill="var(--n-particle)" />
      <path d={dotsD(tone, 3)} fill="var(--tone)" />
      <g fill="var(--n-cold)">
        {sats.map((p, i) => (
          <rect key={i} x={p.x - 4.5} y={p.y - 4.5} width="9" height="9" />
        ))}
      </g>
    </svg>
  );
}

/** 2.2 수렴: 가우스 분포 + 오차 원 게이지 + 측점 */
export function ConvergePlate() {
  const r = mulberry32(2022);
  const pts: Pt[] = [];
  for (let i = 0; i < 170; i++) {
    const [gx, gy] = gaussianPair(r);
    pts.push({ x: 200 + gx * 30, y: 130 + gy * 26 });
  }
  return (
    <svg viewBox="0 0 400 260" data-plate="" aria-hidden="true" focusable="false">
      <circle cx="200" cy="130" r="64" fill="none" stroke="var(--tone)" strokeWidth="1.5" />
      <path d={dotsD(pts, 2.6)} fill="var(--tone)" opacity="0.85" />
      <Fix2 x={200} y={130} />
    </svg>
  );
}

/** 점 격자(도판 안) */
export function DotGrid({ x0, y0, w, h, step, r = 1 }: { x0: number; y0: number; w: number; h: number; step: number; r?: number }) {
  const pts: Pt[] = [];
  for (let x = x0 + step / 2; x < x0 + w; x += step) for (let y = y0 + step / 2; y < y0 + h; y += step) pts.push({ x, y });
  return <path d={dotsD(pts, r * 2)} fill="var(--tone)" opacity="0.28" />;
}

/** 2.4 층 판 5장, 4층의 측점, 1층의 점선 고리, 치수선 */
export function HeightPlate() {
  const ox = LBS.dimX - 90;
  const oy = plateY(4) - PL.h - 30;
  return (
    <svg viewBox={`${ox} ${oy} ${PL.cx + PL.w + 30 - ox} ${PL.y0 + PL.h + 50 - oy}`} data-plate="" aria-hidden="true" focusable="false">
      <HeightShapes />
      <text x={PL.cx + 34} y={PL.y0 + 26} className={s.svgLabel}>
        {lbs.heightLabels.plane}
      </text>
      <text x={LBS.dimX - 16} y={(PL.y0 + plateY(PL.top)) / 2 + 5} className={s.svgLabel} textAnchor="end">
        {lbs.heightLabels.height}
      </text>
      <Fix2 x={PL.cx} y={plateY(PL.top)} r={15} />
    </svg>
  );
}

/** 층 판 도형(스테이지·정지 도판 공용) */
export function HeightShapes({ live }: { live?: boolean }) {
  const top = plateY(PL.top);
  const hidden = live ? { opacity: 0 } : undefined;
  return (
    <g>
      <g data-k={live ? "plates" : undefined}>
        {Array.from({ length: PL.n }, (_, i) => (
          <path
            key={i}
            data-k={live ? "plate" : undefined}
            d={plateD(plateY(i))}
            fill="var(--paper)"
            fillOpacity="0.62"
            stroke={i === PL.top ? "var(--tone)" : "var(--ink-3)"}
            strokeWidth="1.5"
            style={hidden}
          />
        ))}
      </g>
      <ellipse
        data-k={live ? "planeRing" : undefined}
        cx={PL.cx}
        cy={PL.y0}
        rx="26"
        ry="15"
        fill="none"
        stroke="var(--tone)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        style={hidden}
      />
      <g data-k={live ? "dim" : undefined} stroke="var(--tone)" strokeWidth="1.5" fill="none" style={hidden}>
        <path d={`M${PL.cx - 30} ${PL.y0} H${LBS.dimX - 8} M${PL.cx - 20} ${top} H${LBS.dimX - 8}`} strokeDasharray="3 5" stroke="var(--ink-3)" />
        <path d={`M${LBS.dimX} ${PL.y0} V${top} M${LBS.dimX - 8} ${PL.y0} H${LBS.dimX + 8} M${LBS.dimX - 8} ${top} H${LBS.dimX + 8}`} />
      </g>
    </g>
  );
}

export const POLE = { x: KR.target.cx, y: KR.target.cy };

/** 2.5 국내 지도(시·도 경계, 대상 지역만 강조). t = 0 전국, 1 = 대상 지역으로 확대 */
export function KrMap({ id, t, k }: { id: string; t: number; k?: boolean }) {
  return (
    <g data-k={k ? "krMap" : undefined} transform={krTransform(t, POLE, KR.w, KR.h)} style={k ? { opacity: 0 } : undefined}>
      <path id={`${id}-o`} data-k={k ? "krOthers" : undefined} d={KR_OTHERS} fill="var(--tone)" fillOpacity="0.05" stroke="var(--n-ink-3)" strokeWidth="1" />
      <path id={`${id}-t`} d={KR_TARGET} fill="var(--tone)" fillOpacity="0.12" stroke="var(--tone)" strokeWidth="1.5" />
    </g>
  );
}

/** 2.5 작은 전국도(확대한 곳 표시): 바탕판 위에 같은 경로를 다시 쓴다(use) */
export function KrInset({ id, k, m = KRMAP.inset.m }: { id: string; k?: boolean; m?: number }) {
  const { x, y } = KRMAP.inset;
  return (
    <g data-k={k ? "krInset" : undefined} transform={`translate(${x} ${y}) scale(${m})`} style={k ? { opacity: 0 } : undefined}>
      <rect x={-28} y={-28} width={KR.w + 56} height={KR.h + 56} rx={44} fill="var(--n-bg)" stroke="var(--n-ink-3)" strokeWidth="1" />
      <use href={`#${id}-o`} />
      <use href={`#${id}-t`} fill="var(--tone)" fillOpacity="0.55" />
      {/* 확대한 곳 표시(작은 지역이라 둘레 고리) */}
      <circle cx={KR.target.cx} cy={KR.target.cy} r={38} fill="none" stroke="var(--tone)" strokeWidth="1.5" />
    </g>
  );
}

/** 2.5 구역: 시드 고정 단말 140개, 다각형, 안쪽 점만 청록, 방송 원 3개 정지 */
export function ZonePlate() {
  const pts = devicePoints(140, 77);
  const inPts = pts.filter((p) => inPolygon(p.x, p.y, LBS.poly));
  const outPts = pts.filter((p) => !inPolygon(p.x, p.y, LBS.poly));
  const poly = polylineD([...LBS.poly, LBS.poly[0]]);
  return (
    <svg viewBox="700 100 820 780" data-plate="" aria-hidden="true" focusable="false" className={s.rtkPlate}>
      <KrMap id="krP" t={1} />
      <path d={poly} fill="var(--tone)" fillOpacity="0.08" stroke="var(--tone)" strokeWidth="1.5" />
      <g fill="none" stroke="var(--tone)" strokeWidth="1.5">
        {[120, 200, 290].map((rr, i) => (
          <circle key={rr} cx={F.x} cy={F.y} r={rr} opacity={[0.55, 0.35, 0.18][i]} />
        ))}
      </g>
      <path d={dotsD(outPts, 7)} fill="var(--n-cold)" opacity="0.55" />
      <path d={dotsD(inPts, 8)} fill="var(--tone)" />
      <Fix2 x={F.x} y={F.y} r={17} />
      <KrInset id="krP" m={0.36} />
    </svg>
  );
}

