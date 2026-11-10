// 솔루션 기호 4개: 48×48 격자, 선 굵기 1.5px. 선은 pathLength=1 로 정규화해 한 번 그려진다.

import styles from "./SolutionGlyphs.module.css";

type GlyphId = "actrack" | "cacago" | "zonecast" | "rental";

function Draw({ d }: { d: string }) {
  return <path className={styles.draw} d={d} pathLength={1} />;
}

function Dot({ cx, cy, r = 3, fix = false }: { cx: number; cy: number; r?: number; fix?: boolean }) {
  return <circle className={styles.dot} cx={cx} cy={cy} r={r} fill={fix ? "var(--tone, var(--fix))" : "currentColor"} stroke="none" />;
}

// 원을 path 로(선 그리기용)
function circlePath(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy}`;
}

export function SolutionGlyph({ id }: { id: GlyphId }) {
  return (
    <svg className={styles.glyph} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {id === "actrack" ? (
        <>
          {/* 점선 궤적 → 측점 */}
          {[
            [6, 42],
            [10, 37],
            [15, 33],
            [20, 30],
            [24, 26],
            [27, 21],
          ].map(([x, y]) => (
            <Dot key={`${x}-${y}`} cx={x} cy={y} r={1.1} />
          ))}
          <Draw d={circlePath(34, 14, 7)} />
          <Dot cx={34} cy={14} fix />
        </>
      ) : null}
      {id === "cacago" ? (
        <>
          <Draw d="M5 34 H13 V42 H5 Z" />
          <Draw d="M35 6 H43 V14 H35 Z" />
          <Draw d="M13 38 H25 V10 H35" />
          <Dot cx={25} cy={30} r={2.2} />
          <Dot cx={25} cy={18} r={2.2} />
        </>
      ) : null}
      {id === "zonecast" ? (
        <>
          <Draw d={circlePath(24, 30, 9)} />
          <Draw d="M11.7 19.7 A16 16 0 0 1 36.3 19.7" />
          <Draw d="M7.2 15.9 A22 22 0 0 1 40.8 15.9" />
          <Dot cx={24} cy={30} fix />
        </>
      ) : null}
      {id === "rental" ? (
        <>
          <Draw d="M7 7 H41 V41 H7 Z" />
          <Draw d="M18.33 7 V41 M29.67 7 V41" />
          <Draw d="M7 18.33 H41 M7 29.67 H41" />
          <Dot cx={35.33} cy={12.67} fix />
        </>
      ) : null}
    </svg>
  );
}
