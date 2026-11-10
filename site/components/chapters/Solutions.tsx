import type { CSSProperties } from "react";
import { firstAppliedLabel, solutions, type Solution } from "@/lib/facts";
import { chapterStyle } from "@/lib/scenes";
import { AcTrackScreen, CacagoScreen, RentalScreen, SolutionThumb, ZoneCastScreen } from "../screens/SolutionScreens";
import { Chips, Evidence, FixDot, SceneText } from "../ui/parts";
import { SolutionGlyph } from "./SolutionGlyphs";
import s from "./Solutions.module.css";

// 6장 솔루션(도면): 6.1 한눈에(타일 4개) → 6.2~6.5 솔루션마다 설명·근거 칸·받치는 사업·기능 칩 + 코드로 그린 화면 예시 → 6.6 한 표로.
// 화면 예시 프레임은 흐름·스테이지 공용 DOM(스테이지에서는 같은 자리에 겹쳐 두고 교대).

const TONE: Record<Solution["id"], string> = { actrack: "var(--fin)", cacago: "var(--mob)", zonecast: "var(--etc)", rental: "var(--lbs)" };
const SCREENS = { actrack: AcTrackScreen, cacago: CacagoScreen, zonecast: ZoneCastScreen, rental: RentalScreen } as const;

/** 6.1 첫 문구(5.6 원형 열림 레이어 사본과 같은 자리) */
export function SolutionsFirstText({ copy }: { copy?: boolean }) {
  return <SceneText k="text-6.1" first copy={copy} as="h2" id="solutions-title" title={solutions.title} body={solutions.body} />;
}

function Tiles() {
  return (
    <div className={`st-shot ${s.tilesWrap}`} data-k="tiles">
      <ul className={s.tiles}>
        {solutions.items.map((it) => (
          <li key={it.id} className={`card ${s.tile}`} data-k="tile" style={{ "--tone": TONE[it.id] } as CSSProperties}>
            <span className={s.tileGlyph} data-k="tileGlyph">
              <SolutionGlyph id={it.id} />
            </span>
            <span className={s.tileName} lang="en">
              {it.name}
            </span>
            <span className={s.tileRole}>{it.role}</span>
            <span className={`meta ${s.tileEv}`}>
              {it.patent ? `${solutions.evidence.patent} ${it.patent}` : `${solutions.evidence.own} ${solutions.evidence.ownLabel}`}
            </span>
          </li>
        ))}
      </ul>
      <FixDot k="solFix" className={s.solFix} />
    </div>
  );
}

function SolutionText({ it, n }: { it: Solution; n: string }) {
  return (
    <SceneText k={`text-${n}`} className={s.solText} style={{ "--tone": TONE[it.id], "--tone-ink": TONE[it.id] } as CSSProperties}>
      <h3 className={s.name} data-k="solName" lang="en">
        {it.name}
      </h3>
      <p className={`lead ${s.lead}`}>{it.lead}</p>
      <p className={`st-body ${s.body}`}>{it.body}</p>
      <Evidence s={it} />
      <div className={s.support}>
        <p className="meta">{solutions.supportTitle}</p>
        <ul>
          {it.support.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      {it.features.length ? <Chips items={it.features} className={s.features} /> : null}
    </SceneText>
  );
}

function CompareTable() {
  const head = solutions.tableHead;
  return (
    <figure className={`st-shot ${s.tableWrap}`} data-k="solTable">
      <div className={s.tags} aria-hidden="true">
        {solutions.patents.map((p) => (
          <span key={p.no} className={`card ${s.tag}`} data-k="patTag" data-row={p.row}>
            <b className="tnum">{p.no}</b> {p.name}
            <span className="tnum">({p.date})</span>
          </span>
        ))}
      </div>
      <table className={s.table}>
        <caption className={s.caption}>{solutions.tableCaption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {solutions.items.map((it) => {
            const first = firstAppliedLabel(it.firstApplied);
            return (
              <tr key={it.id} data-k="solRow" data-id={it.id} style={{ "--tone": TONE[it.id] } as CSSProperties}>
                <th scope="row" data-label={head[0]}>
                  <span className={s.rowName}>
                    <SolutionThumb id={it.id} />
                    <span lang="en">{it.name}</span>
                  </span>
                </th>
                <td data-label={head[1]}>{it.role}</td>
                <td data-label={head[2]} data-k="evCell">
                  {it.patentNo ? `특허 ${it.patentNo}` : `${solutions.evidence.own} ${solutions.evidence.ownLabel}`}
                </td>
                <td data-label={head[3]} className="tnum">
                  {it.projects}건
                </td>
                <td data-label={head[4]} className="tnum">
                  {first ?? ""}
                </td>
                <td data-label={head[5]} data-k="linkCell">
                  {it.links}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}

export function Solutions() {
  const numbers = ["6.2", "6.3", "6.4", "6.5"];
  return (
    <section
      id="solutions"
      className="st-chapter st-tex"
      data-ch="solutions"
      data-surface-of="day"
      style={chapterStyle("solutions") as CSSProperties}
      aria-labelledby="solutions-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art" aria-hidden="true">
          <div className={s.legend} data-k="legend">
            {solutions.items.map((item, i) => (
              <span key={item.id} data-k="legendItem" data-on={i === 0 ? "true" : "false"} style={{ "--tone": TONE[item.id] } as CSSProperties}>
                <SolutionGlyph id={item.id} />
              </span>
            ))}
          </div>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <article className="st-scene" data-scene="6.1">
              <SolutionsFirstText />
              <Tiles />
            </article>
            {solutions.items.map((it, i) => {
              const Screen = SCREENS[it.id];
              return (
                <article key={it.id} className="st-scene st-textfirst" data-scene={numbers[i]}>
                  <SolutionText it={it} n={numbers[i]} />
                  <div className={`st-shot ${s.shot}`} data-k={`shot-${it.id}`}>
                    <Screen />
                  </div>
                </article>
              );
            })}
            <article className="st-scene" data-scene="6.6">
              <SceneText k="text-6.6" title={solutions.tableTitle} body={solutions.tableBody} className={s.tableText} />
              <CompareTable />
            </article>
          </div>
        </div>
        <svg className="st-over" data-k="solOver" aria-hidden="true" focusable="false">
          <g data-k="patLines" fill="none" stroke="var(--fix)" strokeWidth="1.5" />
          <g data-k="linkLines" fill="none" stroke="var(--fix)" strokeWidth="1.5" strokeDasharray="4 5" />
        </svg>
      </div>
    </section>
  );
}
