import { lbs } from "@/lib/facts";
import { RTK, rtkBaseD, rtkCircleD, rtkPlane, rtkPoints } from "@/lib/geometry";
import "./Plates.css";
import { cls } from "@/lib/cls";

const s = cls("Plates");

// 2.3 RTK 원근 장면(피드백 4차 1): 기울어진 지면 위에 떠 있는 수신 단말(측점)과 발 밑 그림자, 지면에 누운 오차 원(원근 타원),
// 하늘의 위성 2기와 왼쪽 앞 기준국, 기준국에서 솟아 단말로 내려오는 보정 신호 호. 좌표는 lib/geometry RTK 투영(1600×900 단위).

const PLANE = rtkPlane();
const PTS = rtkPoints();
const BASE = rtkBaseD();

const satD = RTK.sats.map(({ x, y }) => `M${x - 7} ${y - 7}h14v14h-14zM${x - 34} ${y - 5}h22v10h-22zM${x + 12} ${y - 5}h22v10h-22z`).join("");
const raysD = RTK.sats.map(({ x, y }) => `M${x} ${y + 8}L${PTS.top.x.toFixed(1)} ${(PTS.top.y - 6).toFixed(1)}M${x} ${y + 8}L${PTS.fix.x} ${(PTS.fix.y - 16).toFixed(1)}`).join("");
const shadowD = rtkCircleD(0.16, 24);

/** 라벨 자리(스테이지 HTML 라벨·흐름 SVG 글자 공용) */
export const RTK_LABELS = {
  sat: { x: RTK.sats[0].x + 44, y: RTK.sats[0].y },
  base: { x: PTS.top.x - 58, y: PTS.top.y + 4 },
  signal: { x: PTS.mid.x, y: PTS.mid.y - 26 },
  meter: { x: RTK.vx, y: PTS.foot.y + 84 },
  cm: { x: RTK.vx + 30, y: PTS.foot.y + 2 },
};

/**
 * live = 스테이지(연출 모듈이 data-k 로 나타나게 하고 오차 원 경로를 바꾼다), 아니면 흐름·감소 정지 도판(센티미터 상태, 미터 원은 점선으로 남김).
 * id 는 그러데이션 이름이 겹치지 않게(스테이지·흐름 도판이 한 문서에 함께 있다).
 */
export function RtkShapes({ id, live }: { id: string; live?: boolean }) {
  const hide = live ? { opacity: 0 } : undefined;
  const fade = `url(#${id}-fade)`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="368" x2="0" y2="775">
          <stop offset="0" stopColor="var(--tone)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--tone)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* 지면 판: 옅은 바탕 + 원근 격자(먼 쪽이 흐려짐) */}
      <g data-k={live ? "rtkGround" : undefined} style={hide}>
        <path d={PLANE.edge} fill="var(--tone)" fillOpacity="0.06" stroke={fade} strokeWidth="1.5" />
        {/* 판 두께(앞 가장자리 아래 띠): 지면이 한 장의 판으로 읽히게 */}
        <path d={PLANE.slab} fill="var(--tone)" fillOpacity="0.14" />
        <path d={PLANE.grid} fill="none" stroke={fade} strokeWidth="1" />
      </g>
      {/* 위성 2기와 위성 신호(가는 점선) */}
      <g data-k={live ? "rtkSky" : undefined} style={hide}>
        <path d={raysD} fill="none" stroke="var(--n-ink-3)" strokeWidth="1" strokeDasharray="3 6" data-k={live ? "rtkRays" : undefined} />
        <path d={satD} fill="var(--tone)" fillOpacity="0.16" stroke="var(--n-cold)" strokeWidth="1.5" />
      </g>
      {/* 기준국: 삼각대 + 안테나 원반 */}
      <g data-k={live ? "rtkBase" : undefined} style={hide} fill="none" stroke="var(--n-ink-2)" strokeWidth="1.5">
        <path d={BASE.legs} />
        <path d={BASE.disc} fill="var(--n-bg)" stroke="var(--tone)" />
      </g>
      {/* 오차 원(지면에 누운 원근 타원): 미터 → 센티미터 */}
      {live ? null : <path d={rtkCircleD(RTK.rMeter)} fill="none" stroke="var(--tone)" strokeWidth="1.5" strokeDasharray="5 7" opacity="0.6" />}
      <path
        data-k={live ? "rtkErr" : undefined}
        d={rtkCircleD(live ? RTK.rMeter : RTK.rCm * 2)}
        fill="var(--tone)"
        fillOpacity="0.1"
        stroke="var(--tone)"
        strokeWidth="1.5"
        style={hide}
      />
      {/* 단말의 발 밑 그림자와 받침선(떠 있는 높이) */}
      <g data-k={live ? "rtkStem" : undefined} style={hide}>
        <path d={shadowD} fill="#000" fillOpacity="0.35" />
        <path d={`M${PTS.fix.x} ${(PTS.fix.y + 16).toFixed(1)}V${PTS.foot.y.toFixed(1)}`} stroke="var(--tone)" strokeWidth="1.5" strokeDasharray="2 4" />
      </g>
      {/* 보정 신호: 기준국에서 솟아 단말로 내려오는 3차원 호 + 흐르는 신호 조각 */}
      <path
        data-k={live ? "rtkSignal" : undefined}
        d={PTS.signal}
        fill="none"
        stroke="var(--tone)"
        strokeWidth="2"
        pathLength={live ? 1 : undefined}
        style={hide}
      />
      {live ? (
        <g data-k="rtkPackets" fill="var(--tone)" className="st-glow-tone" style={hide}>
          <circle r="4" />
          <circle r="4" />
          <circle r="4" />
        </g>
      ) : null}
      {live ? null : (
        <>
          <circle cx={PTS.fix.x} cy={PTS.fix.y} r="15.5" fill="var(--paper)" stroke="var(--fix)" strokeWidth="1.5" />
          <circle cx={PTS.fix.x} cy={PTS.fix.y} r="6.7" fill="var(--fix-core)" />
          <g className={`${s.svgLabel} ${s.halo}`}>
            <text x={RTK_LABELS.sat.x} y={RTK_LABELS.sat.y + 8}>
              {lbs.rtkLabels.sat}
            </text>
            <text x={RTK_LABELS.base.x} y={RTK_LABELS.base.y + 8} textAnchor="end">
              {lbs.rtkLabels.base}
            </text>
            <text x={RTK_LABELS.signal.x} y={RTK_LABELS.signal.y + 8} textAnchor="middle">
              {lbs.rtkLabels.signal}
            </text>
            <text x={RTK_LABELS.meter.x} y={RTK_LABELS.meter.y + 8} textAnchor="middle">
              {lbs.rtkLabels.meter}
            </text>
            <text x={RTK_LABELS.cm.x} y={RTK_LABELS.cm.y + 8}>
              {lbs.rtkLabels.cm}
            </text>
          </g>
        </>
      )}
    </g>
  );
}

/** 흐름·모션 감소 정지 도판(센티미터 상태) */
export function RtkPlate() {
  return (
    <svg viewBox="700 110 760 700" data-plate="" aria-hidden="true" focusable="false" className={s.rtkPlate}>
      <RtkShapes id="rtkP" />
    </svg>
  );
}
