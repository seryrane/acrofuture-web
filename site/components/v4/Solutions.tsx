import type { CSSProperties } from "react";
import { aflow, aioffice, move4, sol4 } from "@/lib/facts";
import { AflowStage } from "./AflowStage";
import { MoveToggle } from "./MoveToggle";
import { MoveScreen } from "./MoveScreen";
import s from "./Section.module.css";
import c from "./Solutions.module.css";
import "./Cards.css";
import { cls } from "@/lib/cls";

const k = cls("Cards");

// 3 솔루션 #solutions: AI 제작 · 운영 묶음(A-Flow 큰 카드, AI Office 짧은 카드 #office: 지시 흐름 · 효과는 AI 활용 절 #ai-office 로 되링크) + 위치 · 이동 묶음(4종 카드: 화면 예시 + 펼침 상세, #508).
// 서버 컴포넌트. 클라이언트 JS 는 A-Flow 영상 + 역할 탭 한 섬(AflowStage), 위치 · 이동 카드 여닫기(MoveToggle) · 화면 예시(MoveScreen, 지연 청크)다.
export function Solutions() {
  return (
    <section id="solutions" className={`${s.sec} night`} data-surface-of="night" data-chapter-of="solutions" aria-labelledby="solutions-title">
      <div className="container">
        <div className={s.head}>
          <p className={s.label}>{sol4.label}</p>
          <h2 id="solutions-title" className={s.title}>
            {sol4.titleBefore}
            <br />
            {sol4.titleAfter}
          </h2>
        </div>

        <div className={c.bento}>
          {/* A-Flow: 소개(이름 · 결과 문장) → 영상(주인공, 카드 폭의 2/3 이상) + 역할 탭(= 영상 장 바로 가기) → 잰 값 각주(#507) */}
          <article id="aflow" className={`card ${c.big} ${c.aflow}`} aria-labelledby="aflow-title" data-k="card-aflow">
            <div className={c.intro}>
              <div>
                <span className="chip">{sol4.groupMake}</span>
                <h3 id="aflow-title" className={c.name}>
                  {aflow.name}
                </h3>
                <p className={c.sub}>{aflow.tagline}</p>
                <p className={c.body}>{aflow.body}</p>
              </div>
              <div>
                <h4 className={c.betterLabel}>{aflow.betterLabel}</h4>
                <ul className={c.better}>
                  {aflow.better.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <AflowStage roles={aflow.roles} cols={aflow.cols} label={aflow.tabsAria} hint={aflow.tabsLabel} />
            <p className={`meta ${c.note}`}>{aflow.measuredNote}</p>
          </article>

          <article id="office" className={`card ${c.big} ${c.office}`} aria-labelledby="office-title" data-k="card-office">
            <div className={c.bigMain}>
              <span className="chip">{sol4.groupMake}</span>
              <h3 id="office-title" className={c.name}>
                {aioffice.name}
              </h3>
              <p className={c.sub}>{aioffice.tagline}</p>
              <p className={c.body}>{aioffice.body}</p>
              <p className={`meta ${c.note}`}>{aioffice.portal}</p>
              <a className={c.back} href="#ai-office">
                <span aria-hidden="true">↑ </span>
                {aioffice.back}
              </a>
            </div>
            <figure className={c.shot}>
              <img
                src={aioffice.shot.src}
                alt={aioffice.shot.alt}
                width={aioffice.shot.w}
                height={aioffice.shot.h}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="meta">{aioffice.shot.caption}</figcaption>
            </figure>
          </article>
        </div>

        <div className={c.moveHead}>
          <div>
            <span className="chip">{sol4.groupMove}</span>
            <h3 className={c.moveTitle}>{sol4.moveTitle}</h3>
          </div>
          <p className="meta">{sol4.moveMeta}</p>
        </div>
        {/* 위치 · 이동 4종(#508): 카드마다 화면 예시(3판 SolutionScreens) + «자세히 보기» 상세(큰 화면 · 쓰임새 · 핵심 기능 · 특허 · 적용 사업).
            3판 → 4판 병합 때 빠졌던 화면 예시와 받치는 사업 목록을 되살렸다. 가로 핀(M8)은 첫 카드가 잘리고 아래가 비어 걷었다. */}
        <ul id="move-cards" className={c.move} data-k="move-cards">
          {move4.map((m) => {
            const d = m.detail;
            return (
              <li key={m.id} className={c.item} data-k="move-item" data-id={m.id} style={{ "--c": `var(--${m.field})` } as CSSProperties}>
                <div className={`card ${c.sm}`} data-k="card-move">
                  <div aria-hidden="true">
                    <MoveScreen id={m.id} className={c.thumb} k="move-thumb" />
                  </div>
                  <h4 id={`move-${m.id}`}>{m.name}</h4>
                  <p>{m.line}</p>
                  <ul className={k.feat} aria-label={`${m.name} 기능`}>
                    {m.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <dl className={k.facts}>
                    <div>
                      <dt>받치는 특허</dt>
                      <dd>{m.patent ?? sol4.ownLabel}</dd>
                    </div>
                    <div>
                      <dt>적용 사업</dt>
                      <dd className="tnum">{m.projects}건</dd>
                    </div>
                    <div>
                      <dt>첫 적용</dt>
                      <dd className="tnum">{m.first}년</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className={c.more}
                    data-move-open={m.id}
                    aria-expanded="false"
                    aria-controls={`move-d-${m.id}`}
                    aria-describedby={`move-${m.id}`}
                  >
                    <span className={c.moreOpen}>{sol4.open}</span>
                    <span className={c.moreClose}>{sol4.close}</span>
                    <span className={c.moreIcon} aria-hidden="true" />
                  </button>
                </div>

                <section id={`move-d-${m.id}`} className={`card ${c.detail}`} aria-labelledby={`move-d-${m.id}-title`} data-k="move-detail" hidden>
                  {/* 큰 화면 예시: 펼쳐 보일 때 그린다(MoveScreen). 서버 HTML 에 화면 예시를 실으면 첫 로드 HTML 이 늘어 모바일 TBT 가 커졌다(#508 측정) */}
                  <MoveScreen id={m.id} className={c.detailShot} k="move-big" />
                  <div className={c.detailText}>
                    <h4 id={`move-d-${m.id}-title`} className={c.detailName}>
                      {m.name}
                    </h4>
                    <p className={c.detailLead}>{d.lead}</p>
                    <p className={c.detailBody}>{d.body}</p>
                    <dl className={c.use}>
                      <div>
                        <dt>{sol4.who}</dt>
                        <dd>{d.who}</dd>
                      </div>
                      <div>
                        <dt>{sol4.when}</dt>
                        <dd>{d.when}</dd>
                      </div>
                    </dl>
                    <h5 className={c.mini}>{sol4.betterLabel}</h5>
                    <p className={c.betterOne}>{d.better}</p>
                    <h5 className={c.mini}>{sol4.featLabel}</h5>
                    <ul className={k.feat}>
                      {d.allFeatures.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <h5 className={c.mini}>{sol4.patentLabel}</h5>
                    <p className={c.plain}>{m.patent ? `${m.patent}(${m.patentDate} 등록)` : sol4.ownLabel}</p>
                    <h5 className={c.mini}>
                      {sol4.supportLabel} <span className="tnum">{m.projects}건</span> · 첫 적용 <span className="tnum">{m.first}년</span>
                    </h5>
                    <ul className={c.support}>
                      {d.support.map((r) => (
                        <li key={r.t}>
                          <span className="tnum">{r.y}</span> {r.t}
                        </li>
                      ))}
                    </ul>
                    {d.links ? (
                      <>
                        <h5 className={c.mini}>{sol4.linksLabel}</h5>
                        <p className={c.plain}>{d.links}</p>
                      </>
                    ) : null}
                    <button type="button" className={c.closeBtn} data-move-close={m.id}>
                      {sol4.close}
                      <span className="sr-only"> {m.name} 상세</span>
                    </button>
                  </div>
                </section>
              </li>
            );
          })}
        </ul>
        <MoveToggle root="move-cards" />
      </div>
    </section>
  );
}
