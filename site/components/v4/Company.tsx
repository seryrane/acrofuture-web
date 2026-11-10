import type { CSSProperties } from "react";
import { hero } from "@/lib/facts";
import s from "./Section.module.css";
import c from "./Company.module.css";

// 1 회사 #company: 히어로 + 세 사업 · AI · A-Flow 바로 가기 네 칸(#509). 서버 컴포넌트.
// 도식: 세 사업(위치 · 모빌리티 · 금융)이 각자 측점 + 오차 원이고, 가운데 AI 도입 · A-Flow 층이 셋을 잇는다.
// 연출(styles/stages.css M1): [data-k="ring"] 오차 원이 바깥에서 줄어들고(--rd 지연), [data-k="fix"] 이음선 · 가운데 글이 나타난다.
// transform · opacity 만, reduced-motion 이면 이 최종 상태 그대로 정지.
const C = 200;
const R = 132; // 세 사업 측점이 놓이는 궤도 반지름
const NODES = [
  { field: "lbs", label: "위치", a: -90 },
  { field: "mob", label: "모빌리티", a: 150 },
  { field: "fin", label: "금융", a: 30 },
] as const;

const at = (a: number, r: number) => {
  const t = (a * Math.PI) / 180;
  return { x: Math.round((C + r * Math.cos(t)) * 10) / 10, y: Math.round((C + r * Math.sin(t)) * 10) / 10 };
};

const delay = (sec: number) => ({ "--rd": `${sec}s` }) as CSSProperties;

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
          <figure className={c.fig} data-stage="hero">
            <svg viewBox="0 -4 400 352" role="img" aria-label={hero.figLabel}>
              {/* 세 사업이 놓인 궤도 */}
              <circle cx={C} cy={C} r={R} fill="none" stroke="var(--fix)" strokeOpacity="0.22" strokeDasharray="2 6" />
              {/* 가운데 → 세 사업 이음선 */}
              <g data-k="fix" stroke="var(--fix)" strokeOpacity="0.55" strokeWidth="1.5" style={delay(0.9)}>
                {NODES.map((n) => {
                  const p0 = at(n.a, 62);
                  const p1 = at(n.a, R - 28);
                  return <line key={n.field} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} />;
                })}
              </g>
              {/* 세 사업: 측점 + 오차 원 2겹 */}
              {NODES.map((n, i) => {
                const p = at(n.a, R);
                const below = n.a > 0;
                return (
                  <g key={n.field}>
                    <circle data-k="ring" cx={p.x} cy={p.y} r="40" fill="none" stroke={`var(--${n.field})`} strokeOpacity="0.3" style={delay(0.1 * i)} />
                    <circle data-k="ring" cx={p.x} cy={p.y} r="24" fill="none" stroke={`var(--${n.field})`} strokeOpacity="0.7" strokeWidth="1.5" style={delay(0.1 * i + 0.15)} />
                    <circle cx={p.x} cy={p.y} r="7" fill={`var(--${n.field})`} />
                    <text x={p.x} y={below ? p.y + 64 : p.y - 50} textAnchor="middle" fill="var(--ink)" fontSize="19" fontWeight="700">
                      {n.label}
                    </text>
                  </g>
                );
              })}
              {/* 가운데 AI 도입 · A-Flow 층 */}
              <circle data-k="ring" cx={C} cy={C} r="58" fill="var(--fix)" fillOpacity="0.12" stroke="var(--fix)" strokeWidth="1.5" style={delay(0.45)} />
              <g data-k="fix" style={delay(0.8)}>
                <text x={C} y={C - 4} textAnchor="middle" fill="var(--ink)" fontSize="17" fontWeight="700">
                  {hero.figCore[0]}
                </text>
                <text x={C} y={C + 20} textAnchor="middle" fill="var(--fix-core)" fontSize="17" fontWeight="800">
                  {hero.figCore[1]}
                </text>
              </g>
              {/* 궤도 점: 정지 상태에서는 고정 각도, 모션 허용에서만 원을 돈다(장식 반복 1개) */}
              <g data-k="orbit" fill="var(--fix)">
                <circle cx={C} cy={C - R} r="3.5" transform={`rotate(60 ${C} ${C})`} />
              </g>
            </svg>
            <figcaption className="meta">{hero.figCaption}</figcaption>
          </figure>
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
