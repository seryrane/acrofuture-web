import type { CSSProperties } from "react";
import { finance } from "@/lib/facts";
import "./FinStations.css";
import { cls } from "@/lib/cls";

const s = cls("FinStations");

const POS = [0.08, 0.29, 0.5, 0.71, 0.92];

/**
 * 4.1 레일과 다섯 업종: 두 레일(채널, 내부 시스템)과 채널 레일 위 역 5개(업종 + 고객사).
 * 스테이지에서는 3D 평면 위 금융 레일(단위 y 342·558)에 겹치고, 흐름·감소에서는 정지 도판(390 은 세로 레일)이 된다. 장식 사본.
 */
export function FinStations() {
  return (
    <figure className={`st-shot ${s.wrap}`} data-k="stations" aria-hidden="true">
      <div className={s.rails}>
        <span className={`${s.railName} ${s.up}`} data-k="railName">
          {finance.rails.upper}
        </span>
        <span className={`${s.railName} ${s.down}`} data-k="railName">
          {finance.rails.lower}
        </span>
        <ol className={s.list}>
          {finance.sectors.map((sec, i) => (
            <li
              key={sec.name}
              className={s.station}
              data-k="finStation"
              data-side={i % 2 === 0 ? "above" : "below"}
              data-edge={i === 0 ? "start" : i === POS.length - 1 ? "end" : undefined}
              style={{ "--p": POS[i] } as CSSProperties}
            >
              <span className={s.conn} />
              <span className={s.dot} />
              <span className={s.lab}>
                <b>{sec.name}</b>
                {sec.clients.map((c) => (
                  <span key={c} className={s.client}>
                    {c}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
