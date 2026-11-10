import type { CSSProperties } from "react";
import { finance, type FinItem } from "@/lib/facts";
import { finT } from "@/lib/geometry";
import "./FinTimeline.css";
import { cls } from "@/lib/cls";

const s = cls("FinTimeline");

const { from, to } = finance.axis;
const YEARS = Array.from({ length: to - from + 1 }, (_, i) => from + i);

// 라벨 줄 배치(STORYBOARD 4.2): 오른쪽 절반은 x 가 큰 것부터 위 줄, 왼쪽 절반은 오른쪽과 줄을 나눠 쓴다(지시선이 라벨을 가로지르지 않게)
const LABELED = finance.capital.filter((c) => c.label);
const RIGHT = LABELED.filter((c) => finT(c.s) >= 0.5).sort((a, b) => b.s - a.s);
const LEFT = LABELED.filter((c) => finT(c.s) < 0.5).sort((a, b) => a.s - b.s);
const ROW = new Map<FinItem, number>();
RIGHT.forEach((c, i) => ROW.set(c, i));
LEFT.forEach((c, i) => ROW.set(c, i));
// 흐름(세로) 라벨 위치: 시간순으로 최소 간격 0.045(약 25px)를 둔다
const FY = new Map<FinItem, number>();
let lastY = -1;
[...LABELED].sort((a, b) => a.s - b.s).forEach((c) => {
  const y = Math.max(finT(c.s), lastY + 0.045);
  FY.set(c, y);
  lastY = y;
});

function Item({ it, k }: { it: FinItem; k: string }) {
  const sv = finT(it.s);
  const ev = it.e ? finT(it.e) : sv;
  return (
    <span
      className={it.e ? s.bar : s.dot}
      data-k={k}
      data-s={sv.toFixed(4)}
      data-e={ev.toFixed(4)}
      style={{ "--s": sv, "--e": ev, "--lane": it.lane } as CSSProperties}
    />
  );
}

/**
 * 4.2 시간 비례 레일(2017~2027): 위 = iM캐피탈(구 DGB캐피탈), 아래 = iM라이프(구 DGB생명).
 * 한 DOM 을 스테이지(가로, 금융 레일 위에 겹침)와 흐름 모드(세로 시간 축)가 함께 쓴다(DESIGN D10). 장식 사본이며 원본은 문구 블록의 사업 목록이다.
 */
export function FinTimeline() {
  return (
    <figure className={`st-shot ${s.tl}`} data-k="timeline">
      <div className={s.body} aria-hidden="true">
        <span className={`${s.head} ${s.headUp}`}>{finance.longRails.upper}</span>
        <span className={`${s.head} ${s.headDown}`}>{finance.longRails.lower}</span>
        <span className={s.axisUp} />
        <span className={s.axisDown} />
        <div className={s.ticks}>
          {YEARS.map((y) => (
            <span key={y} className="tnum" style={{ "--s": finT(y) } as CSSProperties}>
              {y}
            </span>
          ))}
        </div>
        <div className={s.up}>
          {finance.capital.map((it, i) => (
            <Item key={i} it={it} k="finUp" />
          ))}
        </div>
        <div className={s.down}>
          {finance.life.map((it, i) => (
            <Item key={i} it={it} k="finDown" />
          ))}
        </div>
        <div className={s.labels}>
          {LABELED.map((it, i) => {
            const sv = finT(it.s);
            const right = sv >= 0.5;
            return (
              <span
                key={i}
                className={right ? `${s.lab} ${s.labR}` : s.lab}
                data-k="finLabel"
                data-s={sv.toFixed(4)}
                style={{ "--s": sv, "--fy": FY.get(it) ?? sv, "--row": ROW.get(it) ?? 0, "--lane": it.lane } as CSSProperties}
              >
                {it.label}
              </span>
            );
          })}
        </div>
        <span className={s.cursor} data-k="finCursor">
          <span className="fixdot sm" />
        </span>
      </div>
      <figcaption className={`meta ${s.cap}`}>{finance.longCaption}</figcaption>
    </figure>
  );
}
