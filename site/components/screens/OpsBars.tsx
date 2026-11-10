import type { CSSProperties } from "react";
import { process } from "@/lib/facts";
import s from "./OpsBars.module.css";

const { from, to } = process.longRunAxis;
const T = (y: number) => (y - from) / (to - from);
const TICKS = [2009, 2012, 2015, 2018, 2021, 2024, 2027];

/**
 * 7.2 운영 기간 막대 6개(2009~2027 시간 축). 진행 중인 사업은 막대 끝이 열린 화살 머리.
 * 스테이지에서는 운영 역 아래 시간 축 위에서 차례로 차오르고, 흐름에서는 CSS view() 로 차오른다(연출 ④). 원본 목록(스크린리더도 읽음).
 */
export function OpsBars() {
  return (
    <figure className={`st-shot ${s.ops}`} data-k="ops">
      <ul className={s.rows}>
        {process.longRun.map((r) => (
          <li key={r.name} className={s.row} style={{ "--s": T(r.s), "--e": T(r.e), "--c": `var(--${r.field})` } as CSSProperties} data-k="opsRow">
            <span className={s.label}>
              <span className={s.name}>{r.name}</span> <span className={`${s.period} tnum`}>{r.period}</span>
            </span>
            <span className={s.track} aria-hidden="true">
              <span className={`${s.bar} bar-fill`} data-k="opsBar" data-open={r.open ? "true" : "false"} />
            </span>
          </li>
        ))}
      </ul>
      <div className={s.axis} aria-hidden="true" data-k="opsAxis">
        {TICKS.map((y) => (
          <span key={y} className="tnum" style={{ "--s": T(y) } as CSSProperties}>
            {y}
          </span>
        ))}
      </div>
      <figcaption className={`meta ${s.cap}`}>{process.longRunCaption}</figcaption>
    </figure>
  );
}
