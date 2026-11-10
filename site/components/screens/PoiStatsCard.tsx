import { captions, mobility } from "@/lib/facts";
import { ScreenFrame } from "../ui/parts";
import "./PoiStatsCard.css";
import { cls } from "@/lib/cls";

const s = cls("PoiStatsCard");

// 지역 줄마다 공급사 3곳의 비율(숫자 없음, 막대 길이만). 도식이며 실제 수치가 아니다
const ROWS = [
  [0.46, 0.22, 0.14],
  [0.3, 0.28, 0.2],
  [0.52, 0.12, 0.1],
  [0.24, 0.2, 0.26],
];

/** 5.3 지역별 EV 충전소·POI 수집 통계(화면 예시 프레임 규격, 도식): 지역 줄 4개 + 공급사 범례 3단 보라 */
export function PoiStatsCard() {
  return (
    <div className={`st-shot ${s.wrap}`} data-k="stats">
      <ScreenFrame title={mobility.statsCard} name={mobility.statsCard} caption={captions.service} className={s.frame} k="statsFrame">
        <div className={s.legend}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={s.sw} style={{ opacity: [1, 0.62, 0.34][i] }} />
          ))}
        </div>
        <ul className={s.rows}>
          {mobility.statsRegions.map((r, i) => (
            <li key={r} data-k="statRow">
              <span className="scr-label">{r}</span>
              <span className={s.track}>
                {ROWS[i].map((w, j) => (
                  <span key={j} className={s.seg} data-k="statSeg" style={{ flexGrow: w, opacity: [1, 0.62, 0.34][j] }} />
                ))}
                <span className={s.rest} style={{ flexGrow: 1 - ROWS[i][0] - ROWS[i][1] - ROWS[i][2] }} />
              </span>
            </li>
          ))}
        </ul>
      </ScreenFrame>
    </div>
  );
}
