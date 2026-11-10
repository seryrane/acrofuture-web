import { captions, finance } from "@/lib/facts";
import { Sk, StatusChip } from "../ui/parts";
import "./ConsultPanels.css";
import { cls } from "@/lib/cls";

const s = cls("ConsultPanels");

/**
 * 4.4 AI 고객센터와 셀프서비스: 패널 3개(필요한 서비스 고르기 → 이렇게 물어보면 됩니다 → 접수부터 완료까지)와
 * 그 사이를 지나는 상담 토큰. 흐름·감소에서는 단계가 "완료"까지 찬 상태, 토큰 없음. 한 DOM 을 두 모드가 함께 쓴다.
 */
export function ConsultPanels() {
  const [p1, p2, p3] = finance.aiPanels;
  const [st1, st2, st3] = finance.aiSteps;
  return (
    <figure className={`st-shot ${s.wrap}`} data-k="consult">
      <div className={s.frame} role="img" aria-label={`AI 고객센터 ${finance.aiPanels.join(", ")}. ${captions.client}`}>
        <div className={s.row} aria-hidden="true" data-k="consultRow">
          <div className={`card ${s.panel}`} data-k="panel">
            <p className={s.title}>{p1}</p>
            <div className={s.tiles}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i === 1 ? s.tileOn : undefined} data-k={i === 1 ? "tileOn" : undefined} />
              ))}
            </div>
          </div>
          <div className={`card ${s.panel}`} data-k="panel">
            <p className={s.title}>{p2}</p>
            <span className={s.search} data-k="search">
              <i />
            </span>
            <div className={s.hints}>
              <span />
              <span />
              <span />
            </div>
            <div className={s.answer} data-k="answer">
              <Sk w={88} strong />
              <Sk w={64} />
            </div>
          </div>
          <div className={`card ${s.panel}`} data-k="panel">
            <p className={s.title}>{p3}</p>
            <div className={s.steps}>
              <span data-k="aiStep">
                <StatusChip s="wait">{st1}</StatusChip>
              </span>
              <span data-k="aiStep">
                <StatusChip s="move">{st2}</StatusChip>
              </span>
              <span data-k="aiStep">
                <StatusChip s="done">{st3}</StatusChip>
              </span>
            </div>
            <div className={s.list}>
              <span>
                <Sk w={70} strong />
                <Sk w={40} />
              </span>
              <span>
                <Sk w={55} strong />
                <Sk w={35} />
              </span>
            </div>
          </div>
          <span className={`chip ${s.aoai}`} data-k="aoai">
            {finance.aiChip}
          </span>
          <span className={s.token} data-k="token" />
        </div>
      </div>
      <figcaption className={`meta ${s.cap}`}>{captions.client}</figcaption>
    </figure>
  );
}
