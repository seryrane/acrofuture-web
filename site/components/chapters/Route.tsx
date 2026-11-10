import type { CSSProperties } from "react";
import { route } from "@/lib/facts";
import { BRANCH_GAP, END_X, ROUTE_FIX_X, ROUTE_Y, SPLIT_X, round, stationX } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { ArtSvg, CircleOpen, Fix, at } from "../stage/Art";
import { SceneText } from "../ui/parts";
import { FinanceFirstText } from "./Finance";
import s from "./Route.module.css";

const TRACK_W = 6400;
const UP = ROUTE_Y - BRANCH_GAP;
const DOWN = ROUTE_Y + BRANCH_GAP;
// 라벨 위치: 위 갈래 위(2012, 2025) / 아래 갈래 아래(나머지)
const ABOVE = new Set(["s2012", "s2025"]);
const X2025 = stationX(2025);

/** 연도별 대표 사업 카드: 분야 갈래 위에 꿰어 놓는다(금융 = 위, LBS·그 밖 = 가운데, IT서비스 = 아래).
 *  같은 갈래 안에서는 시간순으로 폭 CARD_W 만큼 띄우고, 역(동그라미) 자리는 비켜 둔다 */
const CARD_W = 252;
const OBST: Record<number, number[]> = {
  [ROUTE_Y]: [stationX(2016.84), stationX(2021.17), X2025, END_X],
  [UP]: [X2025, END_X],
  [DOWN]: [X2025, END_X],
};
const PROJECTS = (() => {
  const last: Record<number, number> = {};
  return route.projects.map((p) => {
    const lane = p.f === "fin" ? UP : p.f === "mob" ? DOWN : ROUTE_Y;
    let x = stationX(p.d);
    if (lane !== ROUTE_Y) x = Math.max(x, SPLIT_X + BRANCH_GAP + 20);
    x = Math.max(x, (last[lane] ?? -1e9) + CARD_W);
    for (const o of OBST[lane]) if (x < o + 26 && x + CARD_W - 16 > o - 26) x = o + 26;
    last[lane] = x;
    return { ...p, x: Math.round(x), lane };
  });
})();

/** 연도별 대표 사업 목록(원본 DOM 한 벌): 흐름·감소에서는 세로 목록, 스테이지에서는 갈래 위 카드(연출 모듈이 흐름을 준다) */
function Projects() {
  return (
    <div className={`st-wide ${s.projWrap}`}>
      <h3 className={`st-flowonly ${s.flowCountsTitle}`}>{route.projectsTitle}</h3>
      <p className="meta st-flowonly">{route.projectsCaption}</p>
      <ol className={s.projects} data-k="projects">
        {PROJECTS.map((p) => (
          <li key={p.t} data-f={p.f} data-y={p.y} data-x={p.x} style={{ "--x": p.x, "--ly": p.lane } as CSSProperties}>
            {p.t}
          </li>
        ))}
      </ol>
    </div>
  );
}

const PRE = `M${ROUTE_FIX_X} ${ROUTE_Y} H${round(SPLIT_X)}`;
const MID = `M${round(SPLIT_X)} ${ROUTE_Y} H${round(END_X)}`;
const branch = (dir: -1 | 1) => `M${round(SPLIT_X)} ${ROUTE_Y} L${round(SPLIT_X + BRANCH_GAP)} ${ROUTE_Y + dir * BRANCH_GAP} H${round(END_X)}`;

/** 트랙 도형: drawn=false 는 남은 구간(--ink-3 점선, 빈 역), drawn=true 는 지난 구간(갈래 색 실선, 채운 역) */
function TrackShapes({ drawn }: { drawn: boolean }) {
  const line = (d: string, color: string) => (
    <path d={d} stroke={drawn ? color : "var(--ink-3)"} strokeWidth={drawn ? 2 : 1.5} strokeDasharray={drawn ? undefined : "4 6"} />
  );
  const circle = (x: number, y: number, color: string, key: string) => (
    <circle
      key={key}
      cx={x}
      cy={y}
      r="8"
      fill={drawn ? color : "var(--paper)"}
      stroke={drawn ? color : "var(--ink-3)"}
      strokeWidth="1.5"
    />
  );
  const heads: [number, string][] = [
    [UP, "var(--fin)"],
    [ROUTE_Y, "var(--lbs)"],
    [DOWN, "var(--mob)"],
  ];
  return (
    <svg className={s.trackSvg} viewBox={`0 0 ${TRACK_W} 900`} data-plate="" aria-hidden="true" focusable="false">
      <g fill="none">
        {line(PRE, "var(--fix)")}
        {line(MID, "var(--lbs)")}
        {line(branch(-1), "var(--fin)")}
        {line(branch(1), "var(--mob)")}
        <path d={`M${X2025} ${UP - 44} V${DOWN + 44}`} stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray={drawn ? undefined : "4 6"} />
      </g>
      {route.stations.map((st) =>
        st.id === "s2026"
          ? heads.map(([y, c]) => circle(END_X, y, c, `${st.id}-${y}`))
          : st.id === "s2025"
            ? heads.map(([y, c]) => circle(X2025, y, c, `${st.id}-${y}`))
            : circle(stationX(st.year), ROUTE_Y, st.year < 2012 || st.id === "s2012" ? "var(--fix)" : "var(--lbs)", st.id),
      )}
    </svg>
  );
}

/** 3장 첫 문구(2.7 원형 열림 레이어 사본과 같은 자리) */
export function HistoryFirstText({ copy }: { copy?: boolean }) {
  return (
    <SceneText k="title" first copy={copy} as="h2" id="history-title" title={route.title} className={s.title}>
      <p className="meta st-stageonly">{route.captionScaled}</p>
      <p className="meta st-flowonly">{route.captionOrdered}</p>
      <p className={`meta st-stageonly ${s.countsCap}`} data-k={copy ? undefined : "countsCap"}>
        {route.countsCaption}
      </p>
    </SceneText>
  );
}

// 3장 연혁(도면, ≥1024 가로 챕터): 측점은 화면 x 30vw 에 고정되고 도면이 그 아래로 흐른다.
// 2012 에서 세 갈래가 분야 색으로 갈라지고, 측점이 역을 지나면 현재 역 카드가 그 역을 붙들어 둔다.
export function Route() {
  const first = route.stations[0];
  return (
    <section
      id="history"
      className="st-chapter st-tex"
      data-ch="history"
      data-surface-of="day"
      style={chapterStyle("history") as CSSProperties}
      aria-labelledby="history-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art">
          <div className={s.track} data-k="track" style={{ "--tw": TRACK_W } as CSSProperties}>
            <TrackShapes drawn={false} />
            <ol className={s.labels}>
              {route.stations.map((st, i) => {
                const x = st.id === "s2026" ? END_X : stationX(st.year);
                const above = ABOVE.has(st.id);
                return (
                  <li
                    key={st.id}
                    className={`st-at ${s.label}`}
                    style={at(x, above ? UP - 44 : DOWN + 44)}
                    data-pos={st.id === "s2025" ? "award" : above ? "above" : "below"}
                    data-k="station"
                    data-x={x}
                    data-passed={i === 0 ? "true" : "false"}
                  >
                    <time className={`${s.year} tnum`} dateTime={st.iso}>
                      {st.label}
                    </time>
                    {st.kind ? <span className={s.kind}>{st.kind}</span> : null}
                    <span className={s.name}>{st.name}</span>
                    {st.no ? <span className={`${s.no} tnum`}>{st.no}</span> : null}
                  </li>
                );
              })}
            </ol>
            {/* 3.4 갈래 머리 건수(장식 사본, 원본은 흐름 모드 목록) */}
            <div className={s.counts} aria-hidden="true">
              {route.counts.map((c, i) => (
                <span
                  key={c.field}
                  className={`st-at ${s.count}`}
                  data-k="count"
                  style={{ ...at(END_X + 24, [UP, ROUTE_Y, DOWN][i]), "--c": `var(--${c.field})` } as CSSProperties}
                >
                  {c.label} <b className="tnum">{c.n}건</b>
                </span>
              ))}
            </div>
          </div>
          <div className={s.window} aria-hidden="true">
            <div className={s.track} data-k="trackDrawn" style={{ "--tw": TRACK_W } as CSSProperties}>
              <TrackShapes drawn />
            </div>
          </div>
          <ArtSvg>
            <Fix x={ROUTE_FIX_X} y={ROUTE_Y} />
          </ArtSvg>
          <div className={s.branchLabels} data-k="branchLabels" aria-hidden="true">
            <span className="st-at" style={{ ...at(ROUTE_FIX_X + 22, UP - 26), color: "var(--fin)" }}>
              {route.branches.upper}
            </span>
            <span className="st-at" style={{ ...at(ROUTE_FIX_X + 22, ROUTE_Y - 26), color: "var(--lbs)" }}>
              {route.branches.middle}
            </span>
            <span className="st-at" style={{ ...at(ROUTE_FIX_X + 22, DOWN - 26), color: "var(--mob)" }}>
              {route.branches.lower}
            </span>
          </div>
          {/* 현재 역 카드(장식 사본): 트랙이 흘러가 라벨이 화면 밖으로 나가도 지금 역을 읽는다 */}
          <div className={`card ${s.current}`} data-k="currentCard" aria-hidden="true">
            <span className={s.cKind} data-k="cKind">
              {first.kind ?? ""}
            </span>
            <span className={`${s.cYear} tnum`} data-k="cYear">
              {first.label}
            </span>
            <span className={s.cName} data-k="cName">
              {first.name}
            </span>
            <span className={`${s.cNo} tnum`} data-k="cNo">
              {first.no ?? ""}
            </span>
          </div>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <div className="st-scene">
              <HistoryFirstText />
            </div>
            <div className="st-scene">
              <ol className={`st-plate st-wide ${s.vertical}`}>
                {route.stations.map((st, i) => (
                  <li key={st.id} className={s.vStation} data-branch={i >= 1 ? "3" : "1"}>
                    <span className={s.vDot} aria-hidden="true" />
                    <time className={`${s.year} tnum`} dateTime={st.iso}>
                      {st.label}
                    </time>
                    {st.kind ? <span className={s.kind}>{st.kind}</span> : null}
                    <span className={s.name}>{st.name}</span>
                    {st.no ? <span className={`${s.no} tnum`}>{st.no}</span> : null}
                  </li>
                ))}
              </ol>
              <div className={`st-wide st-flowonly ${s.flowCounts}`}>
                <h3 className={s.flowCountsTitle}>{route.countsTitle}</h3>
                <ul>
                  {route.counts.map((c) => (
                    <li key={c.field} style={{ "--c": `var(--${c.field})`, "--w": c.n / 52 } as CSSProperties}>
                      <span className={s.fcName}>{c.label}</span>
                      <span className={s.fcBar} aria-hidden="true">
                        <span className="bar-fill" />
                      </span>
                      <span className={`${s.fcN} tnum`}>{c.n}건</span>
                    </li>
                  ))}
                </ul>
                <p className="meta">{route.countsCaption}</p>
              </div>
              <Projects />
            </div>
          </div>
        </div>

        <CircleOpen to="night" cx={ROUTE_FIX_X} cy={UP} className="tone-fin">
          <ArtSvg>
            <Fix x={ROUTE_FIX_X} y={UP} glow />
          </ArtSvg>
          <FinanceFirstText copy />
        </CircleOpen>
      </div>
    </section>
  );
}
