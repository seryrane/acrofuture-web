import type { CSSProperties } from "react";
import { process } from "@/lib/facts";
import { PROCESS, dotPositions, polylineD, processPath } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { OpsBars } from "../screens/OpsBars";
import { ArtSvg, CircleOpen, Fix, at } from "../stage/Art";
import { SceneText } from "../ui/parts";
import { RecordFirstText } from "./Record";
import s from "./Process.module.css";

const GROUPS = process.grades.map((g) => g.count);
const DOTS = dotPositions(GROUPS);
const PATH = processPath();

// 묶음별 첫 점 위치(라벨용)
const GROUP_START = GROUPS.map((_, gi) => DOTS[GROUPS.slice(0, gi).reduce((a, b) => a + b, 0)]);

function Band() {
  // 점은 배경 반복으로 그린다(묶음마다 요소 하나, 노드 절약)
  return (
    <div className={s.band} role="img" aria-label={process.bandLabel}>
      {process.grades.map((g) => (
        <div key={g.name} className={s.group} aria-hidden="true">
          <span className={s.dots} style={{ "--n": g.count } as CSSProperties} />
          <span className={`${s.tick} tnum`}>
            {g.name}&nbsp;{g.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/** 조직: 위 줄 전략기술본부·기업부설연구소, 아래 줄 4개 팀(2026-09-29 대표 지시) */
function Org() {
  return (
    <div className={s.org}>
      <ul className={s.orgTop}>
        {process.orgTop.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <ul className={s.orgTeams}>
        {process.orgTeams.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// 7장 일하는 과정(도면): 6.6 비교표의 행 선이 한 줄로 접혀 트래버스가 되고, 측점이 다섯 역을 밟는다(7.1·7.2).
// 운영 역에서 시간 축이 내려와 오래 지키는 사업의 운영 기간 막대가 찬다(7.2). 측점이 29개 점(보조 정보)으로 갈라지고 대형 97% 가 서며 심야가 열린다(7.3).
export function Process() {
  return (
    <section
      id="process"
      className="st-chapter st-tex"
      data-ch="process"
      data-surface-of="day"
      style={chapterStyle("process") as CSSProperties}
      aria-labelledby="process-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art">
          <span className={s.foldLine} data-k="foldLine" aria-hidden="true" />
          <ArtSvg>
            <g data-k="travGroup">
              <g data-k="trav" style={{ opacity: 0 }}>
                <path d={polylineD(PATH)} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 6" />
                <path data-k="travDrawn" d={polylineD(PATH)} fill="none" stroke="var(--fix)" strokeWidth="2" pathLength={1} />
                {PROCESS.stations.map((p, i) => (
                  <circle key={i} data-k="stop" cx={p.x} cy={p.y} r="9" className={s.stop} data-passed="false" />
                ))}
              </g>
              <path
                data-k="drop"
                d={`M${PROCESS.stations[4].x} ${PROCESS.stations[4].y} V${PROCESS.stations[4].y + 90}`}
                fill="none"
                stroke="var(--fix)"
                strokeWidth="1.5"
                pathLength={1}
                style={{ opacity: 0 }}
              />
            </g>
            <g data-k="dots" style={{ opacity: 0 }}>
              {DOTS.map((p, i) => (
                <circle key={i} data-k="dot" r="4.5" cx="0" cy="0" fill="var(--ink)" transform={`translate(${p.x} ${p.y})`} />
              ))}
            </g>
            <Fix x={PROCESS.stations[0].x} y={PROCESS.stations[0].y} k="fix" hidden />
          </ArtSvg>
          <ol className={s.steps} data-k="steps">
            {process.steps.map((name, i) => (
              <li key={name} className={`st-at ${s.step}`} style={at(PROCESS.stations[i].x, PROCESS.stations[i].y)} data-k="step">
                <span className={s.stepBig}>{name}</span>
                <span className={s.stepSmall} aria-hidden="true">
                  {name}
                </span>
              </li>
            ))}
          </ol>
          <div className={s.groupLabels} data-k="groupLabels" aria-hidden="true" style={{ opacity: 0 }}>
            {process.grades.map((g, i) => (
              <span key={g.name} className="st-at tnum" style={at(GROUP_START[i].x - 5, PROCESS.dotsY + 18)}>
                {g.name}&nbsp;{g.count}
              </span>
            ))}
          </div>
          <div className={`st-at st-giant ${s.giant}`} data-k="giant" style={at(1100, 420)} aria-hidden="true">
            {process.giant}
          </div>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <article className="st-scene" data-scene="7.1">
              <ol className={`st-plate ${s.vertical}`}>
                {process.steps.map((name) => (
                  <li key={name} className={s.vStep}>
                    <span className={s.vDot} aria-hidden="true" />
                    {name}
                  </li>
                ))}
              </ol>
              <SceneText k="text-7.1" as="h2" id="process-title" title={process.title} body={process.body}>
                <p className="meta">{process.stepsCaption}</p>
                <p className="meta">{process.basis}</p>
              </SceneText>
            </article>
            <article className="st-scene" data-scene="7.2">
              <OpsBars />
              <SceneText k="text-7.2" title={process.longTitle} body={process.longBody} />
            </article>
            <article className="st-scene" data-scene="7.3">
              <div className={`st-plate ${s.peoplePlate}`}>
                <p className={s.giantFlowWrap} aria-hidden="true">
                  <span className={`st-giant ${s.giantFlow}`}>{process.giant}</span>
                  <span className={s.giantCap}>{process.giantCaption}</span>
                </p>
                <Band />
              </div>
              <SceneText k="text-7.3" as="h2" title={process.peopleTitle}>
                <p className="st-body tnum">{process.peopleBody}</p>
                <h3 className={s.teamsTitle}>{process.teamsTitle}</h3>
                <Org />
              </SceneText>
            </article>
          </div>
        </div>

        <CircleOpen to="night" cx={PROCESS.center.x} cy={PROCESS.center.y}>
          <ArtSvg>
            <Fix x={PROCESS.center.x} y={PROCESS.center.y} glow />
          </ArtSvg>
          <RecordFirstText copy />
        </CircleOpen>
      </div>
    </section>
  );
}
