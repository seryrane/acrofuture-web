import { captions, mobility } from "@/lib/facts";
import { PhoneFrame, Sk } from "../ui/parts";
import "./CarApp.css";
import { cls } from "@/lib/cls";

const s = cls("CarApp");

/** 5.5 차 밖까지 잇는 앱: 폰 도식(화면 3장) + 운전연수 매칭 카드(세 단계). 스켈레톤이며 브랜드·실제 문구 없음 */
export function CarApp() {
  const [n1, n2, n3] = mobility.appScreens;
  return (
    <div className={`st-shot ${s.wrap}`} data-k="carApp">
      <PhoneFrame label={`차량 앱 ${mobility.appScreens.join(", ")}`} caption={captions.service} k="carPhone" className={s.phone}>
        <div className={s.screens}>
          <div className={s.scr} data-k="appScr">
            <p className={s.title}>{n1}</p>
            <div className={s.carCard}>
              <Sk w={45} strong />
              <span className={s.gauge}>
                <i style={{ width: "72%" }} />
              </span>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className={s.switchRow}>
                <span className={s.swIcon} />
                <Sk w={42} />
                <span className={i === 0 ? `${s.switch} ${s.on}` : s.switch}>
                  <i />
                </span>
              </div>
            ))}
            <Sk w={60} style={{ marginTop: 6 }} />
          </div>
          <div className={s.scr} data-k="appScr">
            <p className={s.title}>{n2}</p>
            <div className={s.map} data-k="appMap">
              <svg viewBox="0 0 180 150" aria-hidden="true" focusable="false">
                <g stroke="var(--s-grid)" strokeWidth="1">
                  {[30, 60, 90, 120].map((v) => (
                    <path key={`h${v}`} d={`M0 ${v} H180`} />
                  ))}
                  {[36, 72, 108, 144].map((v) => (
                    <path key={`v${v}`} d={`M${v} 0 V150`} />
                  ))}
                </g>
                <path d="M22 128 V90 H96 V44 H150" fill="none" stroke="var(--mob)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="22" cy="128" r="5" fill="var(--s-bg)" stroke="var(--mob)" strokeWidth="2" />
                <rect x="144" y="37" width="13" height="13" rx="3" fill="var(--mob)" />
              </svg>
            </div>
            <Sk w={70} strong />
            <Sk w={45} />
            <span className={s.send} data-k="appSend" />
          </div>
          <div className={s.scr} data-k="appScr">
            <p className={s.title}>{n3}</p>
            <svg className={s.cal} viewBox="0 0 196 82" aria-hidden="true" focusable="false">
              <path
                d={Array.from({ length: 21 }, (_, i) => `M${(i % 7) * 28 + 1} ${Math.floor(i / 7) * 28 + 1}h24v24h-24z`).join("")}
                fill="var(--s-sk-1)"
              />
              <rect x={4 * 28 + 1} y={28 + 1} width="24" height="24" rx="6" fill="var(--mob)" />
            </svg>
            <div className={s.slot}>
              <Sk w={55} strong />
              <Sk w={35} />
            </div>
            <span className={s.send} />
          </div>
        </div>
      </PhoneFrame>
      <div className={`card ${s.lesson}`} data-k="lesson" aria-hidden="true">
        <p className={s.lessonTitle}>{mobility.lessonTitle}</p>
        <ol className={s.steps}>
          {mobility.lessonSteps.map((t, i) => (
            <li key={t} data-k="lessonStep">
              <span className={s.num}>{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="meta">{captions.service}</p>
      </div>
      <ol className="sr-only" aria-label={mobility.lessonTitle}>
        {mobility.lessonSteps.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
    </div>
  );
}
