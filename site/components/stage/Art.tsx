// 스테이지 공용 조각: 1600×900 단위 SVG, 측점 기호, 원형 열림 레이어, 단위 좌표 스타일.

import type { CSSProperties, ReactNode } from "react";

export function at(x: number, y: number, extra?: Record<string, string | number>): CSSProperties {
  return { "--x": x, "--y": y, ...(extra ?? {}) } as CSSProperties;
}

type SvgProps = { children: ReactNode; className?: string; k?: string; style?: CSSProperties };

/** 스테이지 도판 SVG(화면을 채우는 slice). 선 굵기는 non-scaling-stroke 로 고정 */
export function ArtSvg({ children, className, k, style }: SvgProps) {
  return (
    <svg
      className={className ? `st-svg ${className}` : "st-svg"}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      data-plate=""
      data-k={k}
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      {children}
    </svg>
  );
}

type FixProps = { x: number; y: number; glow?: boolean; k?: string; className?: string; hidden?: boolean; r?: number };

/** 측점(로고의 두 색): 지름 28px 파랑 고리 + 지름 12px 연두 중심점(단위 좌표, 1단위 ≈ 0.9px). DESIGN 3.4 */
export function Fix({ x, y, glow, k, className, hidden, r = 15.5 }: FixProps) {
  return (
    <g
      data-k={k}
      className={className}
      transform={`translate(${x} ${y})`}
      style={hidden ? { opacity: 0 } : undefined}
    >
      <circle r={r} fill="var(--paper)" stroke="var(--fix)" strokeWidth="1.5" className={glow ? "st-glow" : undefined} />
      <circle r="6.7" fill="var(--fix-core)" data-leaf="" />
    </g>
  );
}

type OpenProps = {
  to: "day" | "night";
  cx: number;
  cy: number;
  children?: ReactNode;
  /** 다음 챕터의 장 색(tone-*) 등 */
  className?: string;
};

/**
 * 원형 열림: 다음 챕터 바탕 레이어(측점에서 clip-path 원으로 열림) + 가장자리 1.5px --fix 고리.
 * 레이어 안에는 같은 자리의 측점과 다음 챕터 첫 문구의 장식 사본을 둔다(DESIGN D11).
 */
export function CircleOpen({ to, cx, cy, children, className }: OpenProps) {
  return (
    <>
      <div
        className={`st-layer ${to} st-tex${className ? ` ${className}` : ""}`}
        data-k="layer"
        data-cx={cx}
        data-cy={cy}
        aria-hidden="true"
      >
        {children}
      </div>
      <svg
        className="st-ring"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        data-plate=""
        aria-hidden="true"
        focusable="false"
      >
        <circle data-k="ring" cx={cx} cy={cy} r="0" fill="none" stroke="var(--fix)" strokeWidth="1.5" />
      </svg>
    </>
  );
}

/** 점 여러 개를 경로 하나로(DOM 노드 절약): 한 변 s 인 정사각 점 */
export function dotsD(pts: readonly { x: number; y: number }[], s = 3): string {
  const h = s / 2;
  return pts.map((p) => `M${(p.x - h).toFixed(1)} ${(p.y - h).toFixed(1)}h${s}v${s}h-${s}z`).join("");
}

/** 원 점 여러 개를 경로 하나로 */
export function circlesD(pts: readonly { x: number; y: number }[], r = 2): string {
  return pts
    .map((p) => `M${(p.x - r).toFixed(1)} ${p.y.toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 -${2 * r} 0z`)
    .join("");
}
