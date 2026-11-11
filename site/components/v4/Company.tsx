import type { CSSProperties } from "react";
import { hero } from "@/lib/facts";
import { HeroFigure } from "./HeroFigure";
import s from "./Section.module.css";
import c from "./Company.module.css";

// 1 회사 #company: 히어로 + 세 사업 · AI · A-Flow 바로 가기 네 칸(#509). 서버 컴포넌트.
// 도식(#510 확대 · 연출 강화)은 HeroFigure: 세 사업의 업무 → 가운데 AI 도입 · A-Flow → 화면 · API · DB.
export function Company() {
  return (
    <section id="company" className={`${s.sec} ${c.hero} night`} data-surface-of="night" data-chapter-of="company" aria-labelledby="hero-title">
      <div className="container">
        <div className={c.grid}>
          <div>
            <p className={s.label}>{hero.label}</p>
            <h1 id="hero-title" className={c.h1}>
              <span className={c.line} data-k="line">
                <span className={c.lineIn}>{hero.titleBefore}</span>
              </span>
              <span className={c.line} data-k="line">
                <span className={c.lineIn}>
                  <span className={s.em}>{hero.titleEm}</span>
                  {hero.titleAfter}
                </span>
              </span>
            </h1>
            <p className={s.lede}>{hero.lead}</p>
            <div className={c.cta}>
              <a href="#contact" className="btn-primary">
                {hero.primary}
              </a>
              <a href="#aflow" className={c.ghost}>
                {hero.secondary}
              </a>
            </div>
          </div>
          <HeroFigure />
        </div>
        <ul className={c.fields} aria-label={hero.fieldsLabel}>
          {hero.fields.map((f) => (
            <li key={f.href} data-k="fact" style={{ "--c": `var(--${f.field})` } as CSSProperties}>
              <a href={f.href} className={c.field}>
                <span className={c.fieldName}>{f.name}</span>
                <span className={`${s.num} ${c.factNum}`}>
                  {f.n}
                  {f.unit ? <small>{f.unit}</small> : null}
                </span>
                <span className={c.factLabel}>
                  {f.since}
                  <br />
                  {f.meta}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className={c.fieldsNote}>
          {hero.fieldsNote[0]} <span className={c.nowrap}>{hero.fieldsNote[1]}</span> {hero.fieldsNote[2]}
        </p>
      </div>
    </section>
  );
}
