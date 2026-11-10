import type { CSSProperties } from "react";
import { rec4 } from "@/lib/facts";
import { casesByField } from "@/lib/cases";
import { CaseLists } from "./CaseLists";
import s from "./Section.module.css";
import c from "./RecordSection.module.css";

// 4 사례 · 신뢰 #record: 업종 · 사업 성격으로 쓴 사례 2건, 분야별 사업 건수 막대, 운영 기간 막대, 재난안전통신망, 특허 · 수상 · 국책과제, 구축 · 운영 단계.
// 고객사 이름은 쓰지 않는다(V4-PLAN D2). 막대 연출 자리(다음 하위 지시): [data-k="bar"] (transform-origin 왼쪽, 지금은 최종 길이).
const { from, to } = rec4.runAxis;
const span = to - from;
const pct = (v: number) => `${(((v - from) / span) * 100).toFixed(2)}%`;

// 되살린 «사업 사례 링크»(#508): 사례 카드 → 사업 절 패널(#biz-*) · 분야별 사례 목록(#cases-*, 펼침).
const BIZ_OF = { lbs: "lbs", fin: "fin", mob: "it" } as const;
type LinkField = keyof typeof BIZ_OF;

function CaseLinks({ field }: { field: LinkField }) {
  const f = rec4.byField.find((x) => x.field === field)!;
  return (
    <p className={c.links} data-k="case-links">
      <a href={`#biz-${BIZ_OF[field]}`}>
        {f.label} {rec4.bizLink}
      </a>
      <a href={`#cases-${field}`}>
        {f.label} {rec4.caseLink} <span className="tnum">{f.n}건</span>
      </a>
    </p>
  );
}

export function RecordSection() {
  return (
    <section id="record" className={`${s.sec} day st-tex`} data-surface-of="day" data-chapter-of="record" aria-labelledby="record-title">
      <div className="container">
        <div className={s.head}>
          <p className={s.label}>{rec4.label}</p>
          <h2 id="record-title" className={s.title}>
            {rec4.titleBefore}
            <br />
            {rec4.titleAfter}
          </h2>
          <p className={s.lede}>{rec4.lead}</p>
        </div>

        <div className={c.cases}>
          {rec4.cases.map((k) => (
            <article key={k.id} className={`card ${c.case}`} style={{ "--c": `var(--${k.field})` } as CSSProperties} data-k="case">
              <span className={`chip ${c.chipTone}`}>{k.chip}</span>
              <h3>{k.title}</h3>
              <p>{k.body}</p>
              <ul>
                {k.items.map((it) => (
                  <li key={it.t}>
                    <b className="tnum">{it.y}</b>
                    {it.t}
                  </li>
                ))}
              </ul>
              <CaseLinks field={k.field} />
            </article>
          ))}
        </div>

        <div className={c.proof}>
          <section className="card" aria-labelledby="field-title" data-rise="">
            <h3 id="field-title" className={c.h3}>
              {rec4.fieldTitle}
            </h3>
            <p className={`meta ${c.cap}`}>{rec4.fieldCaption}</p>
            <ul className={c.bars}>
              {rec4.byField.map((f) => {
                return (
                  <li key={f.field} style={{ "--c": `var(--${f.field})` } as CSSProperties}>
                    <details id={`cases-${f.field}`} className={c.fieldBox} name="cases" data-k="field-cases">
                      <summary className={c.barRow}>
                        <span>{f.label}</span>
                        <span className={c.track} aria-hidden="true">
                          <i data-k="bar" style={{ width: `${((f.n / rec4.fieldTotal) * 100).toFixed(1)}%` }} />
                        </span>
                        <b className={`${s.num} ${c.v}`}>
                          {f.n}
                          <span className="sr-only">건</span>
                        </b>
                        <span className={c.chev} aria-hidden="true" />
                      </summary>
                      {/* 목록(103건 · DOM 약 350개)은 첫 로드에 싣지 않고 펼칠 때 CaseLists 가 만든다(첫 로드 DOM · 스타일 계산을 줄임) */}
                    </details>
                  </li>
                );
              })}
            </ul>
            <p className={`meta ${c.cap}`}>{rec4.listNote}</p>
            <CaseLists
              lists={casesByField}
              labels={Object.fromEntries(rec4.byField.map((f) => [f.field, `${f.label} ${rec4.listAria} ${casesByField[f.field].length}건`]))}
              ongoing={rec4.ongoing}
              cls={{ list: c.caseList, who: c.who, on: c.on }}
            />
          </section>

          <section className="card" aria-labelledby="net-title" data-rise="">
            <h3 id="net-title" className={c.h3}>
              {rec4.netTitle}
            </h3>
            <p className={c.netBody}>{rec4.netBody}</p>
            <CaseLinks field={rec4.netField} />
            <h4 className={c.h4}>{rec4.proofTitle}</h4>
            <ul className="chips">
              <li className="chip">{rec4.patentLabel}</li>
              <li className="chip">{rec4.award}</li>
              <li className="chip">{rec4.rd}</li>
            </ul>
            <ul className={c.patents}>
              {rec4.patents.map((p) => (
                <li key={p.no}>
                  <b className="tnum">{p.date}</b>
                  <span>
                    특허 <span className="tnum">{p.no}</span> {p.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={`card ${c.run}`} aria-labelledby="run-title" data-rise="">
          <h3 id="run-title" className={c.h3}>
            {rec4.runTitle}
          </h3>
          <ul className={c.runList}>
            {rec4.run.map((r) => (
              <li key={r.name} style={{ "--c": `var(--${r.field})` } as CSSProperties}>
                <p className={c.runName}>
                  {r.name} <span className="tnum">{r.period}</span>
                </p>
                <span className={c.runTrack} aria-hidden="true">
                  <i data-k="bar" data-open={r.open ? "" : undefined} style={{ left: pct(r.s), width: `${(((r.e - r.s) / span) * 100).toFixed(2)}%` }} />
                </span>
              </li>
            ))}
          </ul>
          <p className={`meta ${c.axis}`}>
            <span className="tnum">{from}</span>
            <span className="tnum">{to}</span>
          </p>
          <p className="meta">{rec4.runCaption}</p>
        </section>

        <section className={c.process} aria-labelledby="process-title">
          <h3 id="process-title" className={c.h3}>
            {rec4.processTitle}
          </h3>
          <p className={c.processBody}>{rec4.processBody}</p>
          <ol className={c.steps}>
            {rec4.steps.map((st) => (
              <li key={st} className="chip">
                {st}
              </li>
            ))}
          </ol>
          <p className="meta">{rec4.stepsCaption}</p>
        </section>
      </div>
    </section>
  );
}
