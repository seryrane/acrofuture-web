// 1.2~2.1 궤도 도형. 살아 있는 버전(스크럽 시작 상태 = 오차 원)과 최종 버전(누운 궤도 + 위성 + 거리선).

import { ORIGIN, finalSatellites, orbitPoint } from "@/lib/geometry";

const COS_TILT = Math.cos((ORIGIN.tilt * Math.PI) / 180);
// 오차 원 반지름(px 기준 24/88/220 → 단위)
export const RING_R = [27, 98, 244];

function orbitTransform(i: number) {
  const o = ORIGIN.orbits[i];
  const { x, y } = ORIGIN.fix;
  return `translate(${x} ${y}) rotate(${o.rot}) scale(${o.s} ${(o.s * COS_TILT).toFixed(4)}) translate(${-x} ${-y})`;
}

type FinalProps = { color: string; satColor: string; lineColor: string };

/** 최종 상태 궤도(1.3 레이어, 2장 첫 프레임, 정지 도판) */
export function OrbitsFinal({ color, satColor, lineColor }: FinalProps) {
  const { x, y } = ORIGIN.fix;
  const sats = finalSatellites();
  return (
    <g>
      <g fill="none" stroke={color} strokeWidth="1.5">
        {RING_R.map((r, i) => (
          <g key={r} transform={orbitTransform(i)}>
            <circle cx={x} cy={y} r={r} />
          </g>
        ))}
      </g>
      <g stroke={lineColor} strokeWidth="1" strokeDasharray="3 6">
        {sats.map((s, i) => (
          <line key={i} x1={s.x} y1={s.y} x2={x} y2={y} />
        ))}
      </g>
      <g fill={satColor}>
        {sats.map((s, i) => (
          <rect key={i} x={s.x - 4.5} y={s.y - 4.5} width="9" height="9" />
        ))}
      </g>
    </g>
  );
}

/** 스크럽용 살아 있는 궤도: 서버 HTML 은 진행도 0(오차 원 3개, 위성·거리선 숨김) */
export function OrbitsLive({ ringClass }: { ringClass?: string }) {
  const { x, y } = ORIGIN.fix;
  const start = ORIGIN.sats.map((s) => orbitPoint(RING_R[s.orbit], 1, 0, 0, s.a0, ORIGIN.fix));
  return (
    <g>
      <g fill="none" strokeWidth="1.5">
        {RING_R.map((r, i) => (
          <g key={r} data-k="orbit">
            <circle
              className={ringClass}
              style={{ animationDelay: `${i * 60}ms` }}
              cx={x}
              cy={y}
              r={r}
              stroke={`var(--d-ring-${i + 1})`}
            />
          </g>
        ))}
      </g>
      <g stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 6">
        {start.map((s, i) => (
          <line key={i} data-k="satline" x1={s.x} y1={s.y} x2={s.x} y2={s.y} style={{ opacity: 0 }} />
        ))}
      </g>
      <g fill="var(--ink)">
        {start.map((s, i) => (
          <rect key={i} data-k="sat" x="-4.5" y="-4.5" width="9" height="9" transform={`translate(${s.x} ${s.y})`} style={{ opacity: 0 }} />
        ))}
      </g>
    </g>
  );
}
