import type { CSSProperties } from "react";
import { cta, origin } from "@/lib/facts";
import { ORIGIN } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { Icon } from "../Icon";
import { ArtSvg, CircleOpen, Fix, at } from "../stage/Art";
import { SceneText, TitleBlock } from "../ui/parts";
import { OrbitsFinal, OrbitsLive } from "./Orbits";
import { HeroPlate } from "./HeroPlate";
import { LbsFirstText } from "./Lbs";
import s from "./Origin.module.css";

const COLS = ["A", "B", "C", "D", "E", "F"];
const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"];

// 1장 원점(청사진 도면): 1.1 측점 고정 → 1.2 오차 원이 위성 궤도로 → 1.3 측점에서 심야가 열린다.
// 헤드라인·부제·버튼·표제란은 움직이지 않는다(LCP). DOM 순서 = 보이는 순서(글 → 표제란 → 도면).
export function Origin() {
  const { x, y } = ORIGIN.fix;
  return (
    <section
      id="top"
      className={`st-chapter ${s.origin}`}
      data-ch="top"
      data-surface-of="day"
      style={chapterStyle("top") as CSSProperties}
      aria-labelledby="hero-title"
    >
      <div className={`container ${s.hero}`}>
        <div className={s.heroText}>
          <h1 id="hero-title" className={s.title}>
            {origin.titleLines.map((line, i) => (
              <span key={line} className={i === 1 ? `${s.line} ${s.accent}` : s.line}>
                {line}
              </span>
            ))}
          </h1>
          <p className={`lead ${s.lead}`}>{origin.lead}</p>
          <div className={s.actions}>
            <a href="#contact" className={`btn-primary ${s.cta}`}>
              {cta.primary}
            </a>
            <a href="#history" className={s.secondary}>
              {origin.secondary}
              <Icon name="arrowDown" size={20} />
            </a>
          </div>
          <TitleBlock className={s.titleBlock} />
        </div>
        <div className={`${s.heroPlate} st-flowonly`}>
          <HeroPlate />
        </div>
      </div>

      <div className="st-stage">
        <div className={`st-art ${s.art}`} aria-hidden="true">
          <div className={s.gridWrap} data-k="grid">
            <div className={s.grid} />
          </div>
          <div className={s.border}>
            <div className={s.borderTop}>
              {COLS.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <div className={s.borderRight}>
              {ROWS.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          </div>
          <ArtSvg>
            <g stroke="var(--ink-3)" strokeWidth="1">
              <path className={s.crossH} d={`M${x - 320} ${y} H${x + 320} M${x - 320} ${y - 8} V${y + 8} M${x + 320} ${y - 8} V${y + 8}`} />
              <path className={s.crossV} d={`M${x} ${y - 320} V${y + 320} M${x - 8} ${y - 320} H${x + 8} M${x - 8} ${y + 320} H${x + 8}`} />
            </g>
            <OrbitsLive ringClass={s.ring} />
            <Fix x={x} y={y} className={s.fixIn} />
          </ArtSvg>
          <p className={`st-at ${s.caption} tnum`} style={at(x - 34, y + 34)}>
            <span>{origin.captionOrigin}</span>
            <span>{origin.captionField}</span>
          </p>
        </div>

        <div className={`container st-flow ${s.flow}`}>
          <div className="st-scenes">
            <article className="st-scene" data-scene="1.2">
              <figure className="st-plate">
                <svg viewBox="452 -100 1400 1100" data-plate="" aria-hidden="true" focusable="false">
                  <OrbitsFinal color="var(--fix)" satColor="var(--ink)" lineColor="var(--ink-3)" />
                  <Fix x={x} y={y} />
                </svg>
              </figure>
              <SceneText k="text-1.2" as="h2" title={origin.orbitTitle} body={origin.orbitBody} />
            </article>
          </div>
        </div>

        <CircleOpen to="night" cx={x} cy={y} className="tone-lbs">
          <ArtSvg>
            <OrbitsFinal color="var(--n-cold)" satColor="var(--n-cold)" lineColor="var(--n-road)" />
            <Fix x={x} y={y} glow />
          </ArtSvg>
          <LbsFirstText copy />
        </CircleOpen>
      </div>
    </section>
  );
}
