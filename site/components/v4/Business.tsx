import type { CSSProperties, ReactNode } from "react";
import { biz, type BizTeam } from "@/lib/facts";
import { ConvergePlate, HeightPlate, ScatterPlate, ZonePlate } from "../chapters/LbsPlates";
import { RtkPlate } from "../chapters/RtkScene";
import { IsoPlate, RoadPlate } from "../chapters/MobilityPlates";
import { CarApp } from "../screens/CarApp";
import { ConsultPanels } from "../screens/ConsultPanels";
import { FinStations } from "../screens/FinStations";
import { FinTimeline } from "../screens/FinTimeline";
import { FinanceWindows } from "../screens/FinanceWindows";
import { LoanFlow } from "../screens/LoanFlow";
import { PoiStatsCard } from "../screens/PoiStatsCard";
import s from "./Section.module.css";
import "./Business.css";
import { cls } from "@/lib/cls";

const b = cls("Business");

// 4.1 사업 영역 #business: 연혁 띠 + 세 팀 패널(LBS·측위 · 디지털금융 · IT서비스). 서버 컴포넌트, 클라이언트 JS 0.
// 모션은 다음 하위 지시(#489)가 붙인다. 이 파일이 남겨 둔 자리:
//   [data-stage="biz-lbs|biz-fin|biz-it"]: 패널의 장면 무대(M2 · M3 · M4, styles/stages.css). 안의 ol > [data-frame="1".."4"] 가 장면 순서(V4-PLAN §11.3).
//   [data-stage="history"]: 연혁 띠(M5). 안의 [data-year] 가 연도 칸.
// 3판 도판 · 화면 예시 부품을 정지 상태로 재사용한다(3판 스테이지 · lib/stage 는 쓰지 않음). 고객사 이름은 업종 · 사업 성격으로 바꿨다(D2).

/** 장면 도판: 3판 부품은 늘 어두운 도판 면(night)에 놓는다 */
function Plate({ field, children, caption }: { field: BizTeam["field"]; children: ReactNode; caption?: boolean }) {
  return (
    <figure className={`night tone-${field} ${b.plate}`}>
      {children}
      {caption ? <figcaption className={`meta ${b.cap}`}>{biz.figCaption}</figcaption> : null}
    </figure>
  );
}

/** 팀별 · 장면별 도판(3판 부품). 장면 id 는 lib/facts.ts biz.teams 와 같다 */
function framePlate(team: BizTeam, id: string): ReactNode {
  const f = team.field;
  switch (`${team.id}/${id}`) {
    case "lbs/converge":
      return (
        <Plate field={f} caption>
          <div className={b.pair}>
            <ScatterPlate />
            <ConvergePlate />
          </div>
        </Plate>
      );
    case "lbs/rtk":
      return (
        <Plate field={f} caption>
          <RtkPlate />
        </Plate>
      );
    case "lbs/height":
      return (
        <Plate field={f} caption>
          <HeightPlate />
        </Plate>
      );
    case "lbs/zone":
      return (
        <Plate field={f} caption>
          <ZonePlate />
        </Plate>
      );
    case "fin/sectors":
      return (
        <Plate field={f}>
          <FinStations />
          <FinTimeline />
        </Plate>
      );
    case "fin/loan":
      return (
        <Plate field={f}>
          <LoanFlow />
        </Plate>
      );
    case "fin/ai":
      return (
        <Plate field={f}>
          <ConsultPanels />
        </Plate>
      );
    case "fin/tools":
      return (
        <Plate field={f}>
          <FinanceWindows />
        </Plate>
      );
    case "it/road":
      return (
        <Plate field={f} caption>
          <RoadPlate gates />
        </Plate>
      );
    case "it/stats":
      return (
        <Plate field={f}>
          <PoiStatsCard />
        </Plate>
      );
    case "it/map":
      return (
        <Plate field={f} caption>
          <IsoPlate />
        </Plate>
      );
    case "it/app":
      return (
        <Plate field={f}>
          <CarApp />
        </Plate>
      );
    default:
      return null;
  }
}

function Panel({ team }: { team: BizTeam }) {
  const tid = `biz-${team.id}-title`;
  return (
    <article id={`biz-${team.id}`} className={b.panel} style={{ "--c": `var(--${team.field})` } as CSSProperties} aria-labelledby={tid} data-k="biz-panel" data-team={team.id}>
      <header className={b.panelHead}>
        <h3 id={tid} className={b.teamName}>
          {team.name}
        </h3>
        <dl className={b.meters}>
          <div>
            <dt>{biz.sinceLabel}</dt>
            <dd className={`${s.num} ${b.meterNum}`}>
              {team.since}
              <small>년</small>
            </dd>
          </div>
          <div>
            <dt>{biz.countLabel}</dt>
            <dd className={`${s.num} ${b.meterNum}`}>
              {team.count}
              <small>건</small>
            </dd>
          </div>
        </dl>
        {/* 3판 첫 화면의 «사업 52건» 칸 링크를 되살림(#508): 사례 절의 분야별 목록(펼침)으로 */}
        <a className={b.caseLink} href={`#cases-${team.field}`} data-k="biz-cases">
          {team.name} {biz.casesLink} <span className="tnum">{team.count}건</span>
        </a>
      </header>

      <div className={b.summary}>
        <div>
          <h4 className={b.mini}>{biz.didLabel}</h4>
          <p className={b.did}>{team.did}</p>
        </div>
        <div>
          <h4 className={b.mini}>{biz.betterLabel}</h4>
          <ul className={b.better}>
            {team.better.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={b.stage} data-stage={`biz-${team.id}`}>
      <ol className={b.frames} aria-label={`${team.name} ${biz.framesLabel}`}>
        {team.frames.map((fr, i) => (
          <li key={fr.id} className={b.frame} data-frame={i + 1} data-k="biz-frame">
            <div className={b.framePlate}>{framePlate(team, fr.id)}</div>
            <div className={b.frameText}>
              <h4 className={b.frameTitle}>
                <span className={b.step} aria-hidden="true">
                  {i + 1}
                </span>
                {fr.title}
              </h4>
              <p>{fr.body}</p>
              {fr.rec ? (
                <ul className={b.rec}>
                  {fr.rec.map((r) => (
                    <li key={r.t}>
                      <span className="tnum">{r.y}</span> {r.t}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      </div>
      {team.frames.some((fr) => fr.rec) ? (
        <ul className={b.recAll} data-k="biz-recs" aria-label={`${team.name} ${biz.framesLabel} 기록`}>
          {team.frames.flatMap((fr) =>
            (fr.rec ?? []).map((r) => (
              <li key={`${fr.id}-${r.t}`}>
                <span className="tnum">{r.y}</span> {r.t}
              </li>
            )),
          )}
        </ul>
      ) : null}
    </article>
  );
}

export function Business() {
  return (
    <section id="business" className={`${s.sec} day st-tex`} data-surface-of="day" data-chapter-of="business" aria-labelledby="business-title">
      <div className="container">
        <div className={s.head}>
          <p className={s.label}>{biz.label}</p>
          <h2 id="business-title" className={s.title}>
            {biz.titleBefore}
            <br />
            {biz.titleAfter}
          </h2>
          <p className={s.lede}>{biz.lead}</p>
        </div>

        <div className={b.histStage} data-stage="history" style={{ "--n": biz.history.length } as CSSProperties}>
        <div className={b.history} role="region" aria-label={biz.historyTitle} tabIndex={0}>
          <h3 className={b.histTitle}>{biz.historyTitle}</h3>
          <ol className={b.band}>
            {biz.history.map((h, i) => (
              <li key={`${h.y}-${h.name}`} className={b.year} data-year={h.y} data-k="year" style={{ "--i": i } as CSSProperties}>
                <span className={`${s.num} ${b.yearNum}`}>{h.y}</span>
                <b>{h.name}</b>
                <span>{h.body}</span>
              </li>
            ))}
          </ol>
          <p className={`meta ${b.histCap}`}>{biz.historyCaption}</p>
        </div>
        <div className={b.histSpacer} aria-hidden="true" />
        </div>

        <div className={b.panels}>
          {biz.teams.map((t) => (
            <Panel key={t.id} team={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
