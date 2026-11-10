import type { CSSProperties } from "react";
import { finance } from "@/lib/facts";
import { FIN, ROAD } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { ArtSvg, Fix } from "../stage/Art";
import { Chips, SceneText } from "../ui/parts";
import { CarGlyph, FinanceWindows } from "../screens/FinanceWindows";
import { ConsultPanels } from "../screens/ConsultPanels";
import { FinStations } from "../screens/FinStations";
import { FinTimeline } from "../screens/FinTimeline";
import { LoanFlow } from "../screens/LoanFlow";
import s from "./Road.module.css";

// 4장 디지털금융(심야, 금융 파랑): 누구에게(업종·고객사) → 얼마나 오래(2017년부터) → 무엇을(대출, AI 고객센터, 영업·오토·브랜치) → 레일이 기울어 도로가 된다.
// 레일과 도로 격자는 3D 평면(단위 좌표), 역·시간 축·화면 예시는 6~12열 DOM(스테이지·흐름 공용)이다.

const X0 = -200;
const X1 = 1800;
const Y0 = -3200;
const Y1 = 1600;
export const CAR_D = "M0 -26 L16 18 L0 9 L-16 18 Z";

function gridD() {
  const parts: string[] = [];
  for (let x = X0; x <= X1; x += ROAD.cell) parts.push(`M${x} ${Y0} V${Y1}`);
  for (let y = Y0; y <= Y1; y += ROAD.cell) parts.push(`M${X0} ${y} H${X1}`);
  parts.push(`M${X0} ${FIN.upper} H${X1}`, `M${X0} ${FIN.lower} H${X1}`);
  return parts.join(" ");
}

/** 평면 위 레일(4.1)과 도로 격자(4.6) */
function RailSurface() {
  const { split, upper, lower, inX, inY } = FIN;
  return (
    <svg
      className={s.surface}
      viewBox={`${X0} ${Y0} ${X1 - X0} ${Y1 - Y0}`}
      style={{ "--sx": X0, "--sy": Y0, "--sw": X1 - X0, "--sh": Y1 - Y0 } as CSSProperties}
      data-plate=""
      aria-hidden="true"
      focusable="false"
    >
      <path data-k="grid" d={gridD()} fill="none" stroke="var(--n-road)" strokeWidth="1.5" style={{ opacity: 0 }} />
      <path data-k="incoming" d={`M${inX} ${inY} H${split}`} fill="none" stroke="var(--fin)" strokeWidth="2" />
      <g fill="none" stroke="var(--n-ink)" strokeWidth="2" data-k="rails">
        <path data-k="railUp" d={`M${split} ${inY} L${split + 44} ${upper} H${X1}`} pathLength={1} />
        <path data-k="railDown" d={`M${split} ${inY} L${split + 172} ${lower} H${X1}`} pathLength={1} />
      </g>
      <g fill="none" stroke="var(--n-ink)" strokeWidth="2" data-k="railLeft" style={{ opacity: 0 }}>
        <path d={`M${X0} ${upper} H${split + 44}`} />
        <path d={`M${X0} ${lower} H${split + 172}`} />
      </g>
    </svg>
  );
}

/** 4.1 첫 문구(3.4 원형 열림 레이어 사본과 같은 자리) */
export function FinanceFirstText({ copy }: { copy?: boolean }) {
  return (
    <SceneText k="text-4.1" first copy={copy} as="h2" id={copy ? undefined : "finance-title"} title={finance.title} meta={finance.meta} body={finance.body} recs={finance.rec41}>
      <ul className="chips" aria-label="주요 업무">
        {finance.keywords.map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
      </ul>
      {copy ? null : (
        <dl className="st-dl sr-only" aria-label={finance.sectorsTitle}>
          {finance.sectors.map((sec) => (
            <div key={sec.name}>
              <dt>{sec.name}</dt>
              <dd>{sec.clients.join(", ")}</dd>
            </div>
          ))}
        </dl>
      )}
    </SceneText>
  );
}

export function Finance() {
  return (
    <section
      id="finance"
      className="st-chapter night tone-fin st-opens st-tex"
      data-ch="finance"
      data-surface-of="night"
      style={chapterStyle("finance") as CSSProperties}
      aria-labelledby="finance-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art" aria-hidden="true">
          <div className={s.scene3d}>
            <div className={`st-at ${s.plane}`} style={{ "--x": 0, "--y": 0 } as CSSProperties} data-k="plane">
              <div className={s.world}>
                <RailSurface />
              </div>
            </div>
          </div>
          <div className={s.haze} data-k="haze" style={{ opacity: 0 }} />
          <canvas className="st-canvas" data-k="packets" />
          <ArtSvg>
            <Fix x={FIN.inX} y={FIN.inY} glow k="fix" />
            <g data-k="car" style={{ opacity: 0 }} transform={`translate(${FIN.car.x} ${FIN.car.y})`}>
              <path d={CAR_D} fill="var(--fix)" className="st-glow" />
            </g>
          </ArtSvg>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <article className="st-scene" data-scene="4.1">
              <FinStations />
              <FinanceFirstText />
            </article>
            <article className="st-scene" data-scene="4.2">
              <FinTimeline />
              <SceneText k="text-4.2" title={finance.longTitle} body={finance.longBody}>
                <ol className={`st-sronly-stage ${s.longList}`} aria-label="사업 목록">
                  {finance.longList.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </SceneText>
            </article>
            <article className="st-scene" data-scene="4.3">
              <LoanFlow />
              <SceneText k="text-4.3" title={finance.loanTitle} body={finance.loanBody} recs={finance.rec43} />
            </article>
            <article className="st-scene" data-scene="4.4">
              <ConsultPanels />
              <SceneText k="text-4.4" title={finance.aiTitle} body={finance.aiBody} recs={finance.rec44} />
            </article>
            <article className="st-scene" data-scene="4.5">
              <FinanceWindows />
              <SceneText k="text-4.5" title={finance.toolsTitle} body={finance.toolsBody} recs={finance.rec45} stageCaption="화면 예시(도식). 실제 고객사 화면이 아닙니다.">
                <dl className="st-dl sr-only" aria-label="구축한 도구">
                  {finance.windows.map((w) => (
                    <div key={w.id}>
                      <dt>{w.name}</dt>
                      <dd className="tnum">{w.meta}</dd>
                    </div>
                  ))}
                </dl>
              </SceneText>
              <SceneText k="text-4.6" className={s.techText}>
                <Chips title={finance.techTitle} items={finance.tech} />
              </SceneText>
            </article>
          </div>
        </div>
        {/* 4.6 카버스 창의 차량 기호(떠 있는 사본): 창이 접힐 때 이 사본이 차량 화살표 자리로 간다 */}
        <span className={s.carFloat} data-k="carFloat" aria-hidden="true">
          <CarGlyph className={s.carFloatSvg} />
        </span>
      </div>
    </section>
  );
}
