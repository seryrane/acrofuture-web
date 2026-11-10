import type { CSSProperties } from "react";
import { contact, contactSection, record } from "@/lib/facts";
import { ARRIVAL } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { ArtSvg, CircleOpen, at } from "../stage/Art";
import { SceneText } from "../ui/parts";
import { MarqueeButton } from "./MarqueeButton";
import s from "./Record.module.css";

const ROW_Y = [636, 712];
/** 줄 윗변에서 기준선까지(단위). 윗줄은 두 줄 사이 틈, 아랫줄은 이름 줄 바로 아래 */
const ARRIVE_DY = [62, 56];
/** 기준선이 목적지로 꺾여 오르는 x. 이 오른쪽의 이름 줄은 8.3 에서 먼저 비운다 */
export const ARRIVE_TURN = 700;

type Client = { name: string; n: number };

function Row({ names, k }: { names: readonly Client[]; k: string }) {
  const items = (hidden: boolean) => (
    <ul className={s.rowList} aria-hidden={hidden ? "true" : undefined}>
      {names.map((c) => (
        <li key={c.name} data-n={`${c.n}건`}>
          {c.name}
        </li>
      ))}
    </ul>
  );
  // 두 벌을 이어 붙여 끊김 없이 흐른다. 두 번째 벌은 장식 사본
  return (
    <div className={s.row} data-k={k}>
      <div className={s.rowTrack} data-k={`${k}Track`}>
        {items(false)}
        {items(true)}
      </div>
    </div>
  );
}

/** 도착 측점(3.4 규격): 연두 중심점 12px + 파랑 고리 32px + 십자선 */
export function Destination({ className }: { className?: string }) {
  const { x, y } = ARRIVAL;
  return (
    <g className={className} data-k="dest">
      <g stroke="var(--ink-3)" strokeWidth="1">
        <path d={`M${x - 60} ${y} H${x + 60} M${x} ${y - 60} V${y + 60}`} />
      </g>
      <circle cx={x} cy={y} r="35" fill="none" stroke="var(--fix)" strokeWidth="1.5" />
      <circle cx={x} cy={y} r="6.7" fill="var(--fix-core)" />
    </g>
  );
}

/** 분야 막대(103건을 분야별로): 네 토막, 라벨은 막대 아래 */
function FieldBar({ live }: { live?: boolean }) {
  return (
    <div className={live ? `${s.fbar} ${s.fbarLive}` : s.fbar} data-k={live ? "fbar" : undefined} aria-hidden={live ? "true" : undefined}>
      <div className={live ? s.fbarTrack : `${s.fbarTrack} bar-fill`}>
        {record.byField.map((f) => (
          <span key={f.field} className={s.seg} data-k={live ? "fseg" : undefined} style={{ flexGrow: f.n, "--c": `var(--${f.field})` } as CSSProperties} />
        ))}
      </div>
      <ul className={s.fbarLabels}>
        {record.byField.map((f) => (
          <li key={f.field} style={{ flexGrow: f.n, "--c": `var(--${f.field})` } as CSSProperties} data-k={live ? "flab" : undefined}>
            {f.label} <b className="tnum">{f.n}건</b>
          </li>
        ))}
      </ul>
      {live ? null : <p className="meta">{record.byFieldCaption}</p>}
    </div>
  );
}

/** 8.1 첫 문구(7.3 원형 열림 레이어 사본과 같은 자리) */
export function RecordFirstText({ copy }: { copy?: boolean }) {
  return (
    <SceneText k="text-8.1" first copy={copy} as="h2" id="record-title" title={record.projectsTitle} titleClass="h2 tnum">
      <p className="meta st-stageonly" data-k={copy ? undefined : "fcap"}>
        {record.byFieldCaption}
      </p>
    </SceneText>
  );
}

// 8장 실적과 도착(심야 → 도면): 103+ 가 오차 원처럼 줄어들며 드러나고 분야 막대가 찬다. 24+ 와 고객사 이름(건수 순)이 흐르다가,
// 두 줄 기준선이 한 줄 경로로 모여 목적지(회사 주소)에 도착한다.
export function Record() {
  return (
    <section
      id="record"
      className="st-chapter night st-opens st-tex"
      data-ch="record"
      data-surface-of="night"
      style={chapterStyle("record") as CSSProperties}
      aria-labelledby="record-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art">
          <div className={`st-at ${s.g103wrap}`} data-k="g103" style={at(800, 470)} aria-hidden="true">
            <span className={`st-giant ${s.g103}`} data-k="g103num">
              {record.projectsGiant}
            </span>
            <FieldBar live />
          </div>
          <div className={`st-at st-giant ${s.g24}`} data-k="g24" style={at(1080, 300)} aria-hidden="true">
            {record.clientsGiant}
          </div>
          <div className={s.fix8} data-k="fix8" aria-hidden="true" />
          <div className={s.marquee} data-k="marquee" style={{ "--r1": ROW_Y[0], "--r2": ROW_Y[1] } as CSSProperties}>
            <p className={`meta ${s.rowCaption}`} style={at(0, ROW_Y[0] - 46)} id="clients-caption">
              {record.clientsCaption}
            </p>
            <div role="group" aria-labelledby="clients-caption">
              <div className={s.rowWrap} style={at(0, ROW_Y[0])}>
                <Row names={record.rowTop} k="row1" />
              </div>
              <div className={s.rowWrap} style={at(0, ROW_Y[1])}>
                <Row names={record.rowBottom} k="row2" />
              </div>
            </div>
            <MarqueeButton label={record.marqueePause} />
          </div>
          <ul className={s.registry} data-k="registry">
            {record.registry.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <ArtSvg>
            <g fill="none" stroke="var(--fix)" strokeWidth="2">
              <path data-k="arrive" d={`M0 ${ROW_Y[0] + ARRIVE_DY[0]} H${ARRIVE_TURN} L${ARRIVAL.x} ${ARRIVAL.y}`} pathLength={1} />
              <path data-k="arrive" d={`M0 ${ROW_Y[1] + ARRIVE_DY[1]} H${ARRIVE_TURN} L${ARRIVAL.x} ${ARRIVAL.y}`} pathLength={1} />
            </g>
            <Destination className={s.destLive} />
          </ArtSvg>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <article className="st-scene" data-scene="8.1">
              <div className={`st-plate ${s.flowGiant}`}>
                <span className="st-giant" aria-hidden="true">
                  {record.projectsGiant}
                </span>
                <FieldBar />
              </div>
              <RecordFirstText />
            </article>
            <article className="st-scene" data-scene="8.2">
              <div className={`st-plate ${s.flowGiant}`}>
                <span className="st-giant" aria-hidden="true">
                  {record.clientsGiant}
                </span>
              </div>
              <SceneText k="text-8.2" as="h2" title={record.clientsTitle} titleClass="h2 tnum" className={s.clientsText}>
                <p className="meta st-flowonly">{record.clientsCaption}</p>
                <ul className={`${s.names} st-flowonly`}>
                  {[...record.rowTop, ...record.rowBottom].map((c) => (
                    <li key={c.name}>
                      {c.name}
                      <span className={`${s.count} tnum`}>{c.n}건</span>
                    </li>
                  ))}
                </ul>
                <ul className={`${s.flowRegistry} st-flowonly`}>
                  {record.registry.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </SceneText>
            </article>
          </div>
        </div>

        <CircleOpen to="day" cx={ARRIVAL.x} cy={ARRIVAL.y}>
          <ArtSvg>
            <Destination />
          </ArtSvg>
          <p className={`st-at meta ${s.addressCopy}`} style={at(ARRIVAL.x + 50, ARRIVAL.y + 30)}>
            {contact.address}
          </p>
          <h2 className={`h2 ${s.contactCopy}`}>{contactSection.title}</h2>
        </CircleOpen>
      </div>
    </section>
  );
}

