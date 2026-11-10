import type { CSSProperties } from "react";
import { mobility } from "@/lib/facts";
import { MOB } from "@/lib/geometry";
import "./Plates.css";
import { cls } from "@/lib/cls";

const s = cls("Plates");

// 5장 IT서비스·모빌리티의 정지 도판(서버 전용). Mobility.tsx 와 4.1 사업 영역이 함께 쓴다. 클라이언트 모듈을 끌어오지 않는다.

/** 차량 화살표(Finance.tsx CAR_D 와 같은 도형) */
const CAR_D = "M0 -26 L16 18 L0 9 L-16 18 Z";

/** 5.1 원근 도로 정지 도판(CSS 3D 없음): 소실점으로 모이는 선, 보라 경로, POI 깃발, 차량 화살표(파랑) */
export function RoadPlate({ gates }: { gates?: boolean }) {
  const vx = 400;
  const vy = 40;
  const fan = [-600, -360, -140, 60, 260, 460, 660, 900, 1140, 1400];
  const rows = [80, 110, 150, 200, 265, 350];
  const flags: [number, number, boolean][] = [
    [330, 300, false],
    [470, 215, false],
    [585, 150, true],
    [470, 105, true],
    [300, 170, false],
    [612, 118, true],
  ];
  const gatePos = [
    [400, 330, 92],
    [400, 256, 68],
    [455, 196, 50],
  ];
  return (
    <div className={s.plateBox}>
    <svg viewBox="0 0 800 420" data-plate="" aria-hidden="true" focusable="false">
      <path d={fan.map((x) => `M${vx} ${vy} L${x} 420`).join("")} stroke="var(--n-road)" strokeWidth="1.5" fill="none" data-m="fan" />
      <path d={rows.map((y) => `M0 ${y} H800`).join("")} stroke="var(--n-road)" strokeWidth="1.5" fill="none" data-m="rows" />
      <path d="M400 420 L400 250 L520 150 L520 90" fill="none" stroke="var(--glow)" strokeWidth="10" />
      <path d="M400 420 L400 250 L520 150 L520 90" fill="none" stroke="var(--mob)" strokeWidth="4" />
      {/* POI 입체 마커(핀): 몸통 + 밝은 면 + 발 밑 그림자. 검수를 지난 것은 보라, 아직은 회색 */}
      <path d={flags.map(([x, y]) => `M${x - 11} ${y + 1}a11 3.5 0 1 0 22 0a11 3.5 0 1 0 -22 0z`).join("")} fill="#000" fillOpacity="0.4" />
      <g data-m="pins">
      {[false, true].map((ok) => (
        <path
          key={String(ok)}
          d={flags
            .filter(([, , c]) => (gates ? c : false) === ok)
            .map(([x, y]) => `M${x} ${y}L${x - 11} ${y - 19}A13 13 0 1 1 ${x + 11} ${y - 19}Z`)
            .join("")}
          fill={ok ? "var(--mob)" : "var(--n-ink-3)"}
          stroke={ok ? "color-mix(in srgb, var(--mob) 60%, #fff)" : "var(--n-ink-2)"}
          strokeWidth="1"
        />
      ))}
      <path d={flags.map(([x, y]) => `M${x - 4.5} ${y - 26}a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0z`).join("")} fill="var(--n-bg)" />
      </g>
      {gates ? (
        <>
          {[0, 1].map((ci) => (
            <path
              key={ci}
              d={[
                [400, 330, 150, 92],
                [400, 256, 110, 68],
                [455, 196, 80, 50],
              ]
                .filter((_, i) => (i === 1 ? 1 : 0) === ci)
                .map(([x, y, w, h]) => `M${x - w / 2} ${y} V${y - h} M${x + w / 2} ${y} V${y - h} M${x - w / 2 - 4} ${y - h} H${x + w / 2 + 4}`)
                .join("")}
              fill="none"
              strokeWidth="1.5"
              stroke={ci ? "var(--mob)" : "var(--n-ink)"}
            />
          ))}
        </>
      ) : null}
      <path d={CAR_D} transform="translate(400 380)" fill="var(--fix)" className="st-glow" />
    </svg>
    {gates
      ? gatePos.map(([x, y, h], i) => (
          <span key={i} className={`st-label ${s.plateLabel}`} style={{ left: `${x / 8}%`, top: `${((y - h - 8) / 420) * 100}%` }} aria-hidden="true">
            {mobility.gates[i]}
          </span>
        ))
      : null}
    </div>
  );
}

/** 5.4 등각 정지 도판: 건물 6채, 다시 세운 경로, 픽업 표지, 말풍선 */
export function IsoPlate() {
  const cos = Math.cos(Math.PI / 6);
  const iso = (x: number, y: number, z = 0) => ({ x: 300 + (x - y) * cos, y: 60 + (x + y) * 0.5 - z });
  // 건물 면: 앞·옆면(바탕), 윗면(보라) 경로를 모아 그린다(DOM 절약)
  const faces = { left: [] as string[], right: [] as string[], top: [] as string[] };
  const box = (x: number, y: number, w: number, d: number, h: number) => {
    const a = iso(x, y + d, 0);
    const b = iso(x + w, y + d, 0);
    const c = iso(x + w, y, 0);
    const aT = iso(x, y + d, h);
    const bT = iso(x + w, y + d, h);
    const cT = iso(x + w, y, h);
    const dT = iso(x, y, h);
    const P = (pts: { x: number; y: number }[]) => "M" + pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("L") + "Z";
    faces.left.push(P([a, b, bT, aT]));
    faces.right.push(P([b, c, cT, bT]));
    faces.top.push(P([aT, bT, cT, dT]));
  };
  const grid: string[] = [];
  for (let v = 0; v <= 300; v += 30) {
    const a = iso(v, 0);
    const b = iso(v, 300);
    const c = iso(0, v);
    const d = iso(300, v);
    grid.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`, `M${c.x.toFixed(1)} ${c.y.toFixed(1)} L${d.x.toFixed(1)} ${d.y.toFixed(1)}`);
  }
  const route = [iso(150, 300), iso(150, 240), iso(180, 240), iso(180, 150), iso(110, 150), iso(110, 70), iso(190, 70)];
  const pin = iso(190, 70);
  const L = (x: number, y: number) => ({ left: `${(x / 600) * 100}%`, top: `${((y - 20) / 330) * 100}%` });
  [
    [40, 170, 50, 45, 80],
    [220, 160, 45, 40, 50],
    [40, 90, 45, 50, 120],
    [220, 80, 55, 45, 90],
    [130, 10, 50, 40, 62],
    [240, 10, 45, 45, 132],
  ].forEach(([x, y, w, d, h]) => box(x, y, w, d, h));
  return (
    <div className={s.plateBox}>
    <svg viewBox="0 20 600 330" data-plate="" aria-hidden="true" focusable="false">
      <path d={grid.join(" ")} stroke="var(--n-road)" strokeWidth="1" fill="none" />
      <path d={route.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")} fill="none" stroke="var(--mob)" strokeWidth="3" strokeLinejoin="round" />
      {/* 앞(왼쪽) 면은 중간, 옆(오른쪽) 면은 어두운 명암. 창문 줄은 면 기울기에 맞춘 무늬(skewY ±30°) */}
      <defs>
        <pattern id="isoWinL" patternUnits="userSpaceOnUse" width="9" height="11" patternTransform="skewY(30)">
          <rect x="2.5" y="3" width="4" height="5" fill="var(--lbs)" fillOpacity="0.4" />
        </pattern>
        <pattern id="isoWinR" patternUnits="userSpaceOnUse" width="9" height="11" patternTransform="skewY(-30)">
          <rect x="2.5" y="3" width="4" height="5" fill="var(--lbs)" fillOpacity="0.22" />
        </pattern>
      </defs>
      <path d={faces.left.join("")} fill="color-mix(in srgb, var(--n-raised) 88%, var(--mob))" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={faces.right.join("")} fill="color-mix(in srgb, var(--n-bg) 80%, var(--mob))" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={faces.left.join("")} fill="url(#isoWinL)" />
      <path d={faces.right.join("")} fill="url(#isoWinR)" />
      <path d={faces.top.join("")} fill="color-mix(in srgb, var(--mob) 34%, var(--n-bg))" stroke="var(--mob)" strokeWidth="1.5" strokeLinejoin="round" />
      <g transform={`translate(${pin.x.toFixed(1)} ${pin.y.toFixed(1)})`}>
        <path d="M0 0 V-26" stroke="var(--mob)" strokeWidth="2" />
        <rect x="-11" y="-48" width="22" height="22" rx="5" fill="var(--n-bg)" stroke="var(--mob)" strokeWidth="2" />
        <rect x="-4" y="-41" width="8" height="8" rx="2" fill="var(--mob)" />
      </g>
      <g transform="translate(62 250)">
        <rect x="0" y="0" width="92" height="40" rx="14" fill="var(--card-bg)" stroke="var(--card-border)" />
        <path
          d={[16, 30, 44, 58, 72].map((x, i) => `M${x} ${20 - [6, 11, 8, 13, 5][i]} v${[12, 22, 16, 26, 10][i]}`).join("")}
          stroke="var(--mob)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
      <span className={`st-label ${s.plateLabel} ${s.left}`} style={L(62, 300)} aria-hidden="true">
        {mobility.mapLabels.voice}
      </span>
      <span className={`st-label ${s.plateLabel} ${s.left}`} style={L(pin.x + 16, pin.y - 44)} aria-hidden="true">
        {mobility.mapLabels.pickup}
      </span>
      <span className={`st-label ${s.plateLabel} ${s.left}`} style={L(470, 290)} aria-hidden="true">
        {mobility.mapLabels.map}
      </span>
    </div>
  );
}

