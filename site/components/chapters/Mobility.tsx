import type { CSSProperties } from "react";
import { mobility } from "@/lib/facts";
import { MOB, ROAD } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { ArtSvg, CircleOpen, Fix, at } from "../stage/Art";
import { SceneText } from "../ui/parts";
import { CarApp } from "../screens/CarApp";
import { PoiStatsCard } from "../screens/PoiStatsCard";
import { CAR_D } from "./Finance";
import { SolutionsFirstText } from "./Solutions";
import s from "./Road.module.css";

// 5장 IT서비스·모빌리티(심야, 보라): 원근 주행 → POI 관문 3개 → 공급사별 검수·통계 → 말로 찾고 3D 지도로 → 차 밖까지 잇는 앱 → 조감 상승.
// 도로 평면은 4장 레일 평면이 기운 것(형태 이어받기). 관문·건물·픽업 표지는 평면 자식, 라벨은 평면 밖 DOM(원근으로 뭉개지지 않게).

const X0 = -200;
const X1 = 1800;
const Y0 = -5600;
const Y1 = 1600;

function gridD() {
  const parts: string[] = [];
  for (let x = X0; x <= X1; x += ROAD.cell) parts.push(`M${x} ${Y0} V${Y1}`);
  for (let y = Y0; y <= Y1; y += ROAD.cell) parts.push(`M${X0} ${y} H${X1}`);
  return parts.join(" ");
}

function RoadSurface() {
  return (
    <svg
      className={s.surface}
      viewBox={`${X0} ${Y0} ${X1 - X0} ${Y1 - Y0}`}
      style={{ "--sx": X0, "--sy": Y0, "--sw": X1 - X0, "--sh": Y1 - Y0 } as CSSProperties}
      data-plate=""
      aria-hidden="true"
      focusable="false"
    >
      <path d={gridD()} fill="none" stroke="var(--n-road)" strokeWidth="1.5" />
      <g data-k="routeMain">
        <path d={MOB.route} fill="none" stroke="var(--glow)" strokeWidth="12" data-k="routeGlow" pathLength={1} />
        <path d={MOB.route} fill="none" stroke="var(--mob)" strokeWidth="4" data-k="route" pathLength={1} />
      </g>
      <path data-k="replanDash" d={MOB.replan} fill="none" stroke="var(--mob)" strokeWidth="3" strokeDasharray="10 12" style={{ opacity: 0 }} />
      <path data-k="replan" d={MOB.replan} fill="none" stroke="var(--mob)" strokeWidth="4" pathLength={1} style={{ opacity: 0 }} />
    </svg>
  );
}

/** POI 종류(충전소·주유소·주차·식당): 깃발 대신 입체 지도 마커. 요소 하나에 가상 요소로 핀 몸통·아이콘을 그린다(DOM 절약) */
const POI_KIND = ["ev", "fuel", "park", "food"] as const;

function Flags() {
  return (
    <>
      {MOB.flags.map((p, i) => (
        <div key={i} className={`st-at ${s.poi}`} style={at(p.x, p.y)} data-k="poi" data-y={p.y} data-kind={POI_KIND[i % 4]} data-ok="false" />
      ))}
    </>
  );
}

function Gates() {
  const w = MOB.gateW;
  const h = MOB.gateH;
  return (
    <>
      {MOB.gates.map((y, i) => (
        <div key={i} className={`st-at ${s.gate}`} style={{ ...at(800, y), "--gw": w, "--gh": h } as CSSProperties} data-k="gate">
          <svg viewBox={`0 0 ${w} ${h}`} data-plate="" aria-hidden="true" focusable="false">
            <path d={`M6 ${h} V14 M${w - 6} ${h} V14 M0 14 H${w} M0 34 H${w}`} fill="none" stroke="var(--n-ink)" strokeWidth="1.5" />
            <path d={`M6 ${h} V14 M${w - 6} ${h} V14`} fill="none" stroke="var(--mob)" strokeWidth="2" opacity={i === 1 ? 1 : 0} />
          </svg>
        </div>
      ))}
    </>
  );
}

function Buildings() {
  return (
    <>
      {MOB.buildings.map((b, i) => {
        const left = b.x + b.w / 2 < 800;
        return (
          <div
            key={i}
            className={`st-at ${s.bld}`}
            style={{ ...at(b.x, b.y), "--bw": b.w, "--bd": b.d, "--bh": b.h } as CSSProperties}
            data-k="bld"
            data-side={left ? "right" : "left"}
          >
            <span className={s.bTop} data-k="bTop" />
            <span className={s.bFront} data-k="bFace" />
            <span className={s.bSide} data-k="bSide" />
          </div>
        );
      })}
      <div className={`st-at ${s.pin}`} style={at(MOB.pickup.x, MOB.pickup.y)} data-k="pin">
        <svg viewBox="0 0 40 70" data-plate="" aria-hidden="true" focusable="false">
          <rect x="6" y="4" width="28" height="28" rx="6" fill="var(--n-bg)" stroke="var(--mob)" strokeWidth="2" />
          <rect x="15" y="13" width="10" height="10" rx="2" fill="var(--mob)" />
          <path d="M20 32 V70" stroke="var(--mob)" strokeWidth="2" />
        </svg>
      </div>
    </>
  );
}

import { RoadPlate, IsoPlate } from "./MobilityPlates";

export function Mobility() {
  return (
    <section
      id="mobility"
      className="st-chapter night tone-mob st-tex"
      data-ch="mobility"
      data-surface-of="night"
      style={chapterStyle("mobility") as CSSProperties}
      aria-labelledby="mobility-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art" aria-hidden="true">
          <div className={s.scene3d}>
            <div className={`st-at ${s.plane} ${s.tilted}`} style={{ "--x": 0, "--y": 0 } as CSSProperties} data-k="plane">
              <div className={s.world} data-k="world">
                <RoadSurface />
                <Flags />
                <Gates />
                <Buildings />
              </div>
            </div>
          </div>
          <div className={s.haze} data-k="haze" />
          {/* 평면 밖 오버레이(px): 관문 라벨, 5.3 지역 블록·연결선, 5.4 라벨, 5.5 폰에서 차로 가는 경로 */}
          <svg className={s.over} data-k="over" aria-hidden="true" focusable="false">
            <g data-k="blocks" />
            <g data-k="links" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 6" />
            <path data-k="sendPath" fill="none" stroke="var(--mob)" strokeWidth="1.5" strokeDasharray="5 6" style={{ opacity: 0 }} />
            <circle data-k="sendDot" r="5" fill="var(--mob)" className="st-glow-tone" style={{ opacity: 0 }} />
          </svg>
          <div className={s.overLabels}>
            {mobility.gates.map((g) => (
              <span key={g} className={`st-label ${s.gateLabel}`} data-k="gateLabel">
                {g}
              </span>
            ))}
            <span className={`st-label ${s.gateLabel}`} data-k="pinLabel">
              {mobility.mapLabels.pickup}
            </span>
            <span className={`st-label ${s.mapLabel}`} data-k="mapLabel">
              {mobility.mapLabels.map}
            </span>
          </div>
          <div className={`${s.bubble}`} data-k="bubble">
            <span className={`card ${s.bubbleCard}`}>
              {[10, 18, 13, 22, 9].map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </span>
            <span className="st-label">{mobility.mapLabels.voice}</span>
          </div>
          <ArtSvg>
            <g data-k="car" transform="translate(800 790)">
              <path d={CAR_D} fill="var(--fix)" className="st-glow" />
            </g>
            <Fix x={800} y={700} glow k="fix" hidden />
          </ArtSvg>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <article className="st-scene" data-scene="5.1">
              <figure className="st-plate">
                <RoadPlate />
              </figure>
              <SceneText k="text-5.1" as="h2" id="mobility-title" title={mobility.title} meta={mobility.meta} body={mobility.body} recs={mobility.rec51}>
                <ul className="chips" aria-label="주요 업무">
                  {mobility.keywords.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </SceneText>
            </article>
            <article className="st-scene" data-scene="5.2">
              <figure className="st-plate">
                <RoadPlate gates />
                <figcaption className="meta">{mobility.poiCaption}</figcaption>
              </figure>
              <SceneText k="text-5.2" title={mobility.poiTitle} body={mobility.poiBody} stageCaption={mobility.poiCaption} recs={mobility.rec52}>
                <ol className="st-sronly-stage st-list" aria-label="POI 관문">
                  {mobility.gates.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ol>
              </SceneText>
            </article>
            <article className="st-scene" data-scene="5.3">
              <PoiStatsCard />
              <SceneText k="text-5.3" title={mobility.statsTitle} body={mobility.statsBody} recs={mobility.rec53}>
                <ul className="chips" aria-label={mobility.statsTechTitle}>
                  {mobility.statsTech.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </SceneText>
            </article>
            <article className="st-scene" data-scene="5.4">
              <figure className="st-plate">
                <IsoPlate />
                <figcaption className="meta">{mobility.mapCaption}</figcaption>
              </figure>
              <SceneText k="text-5.4" title={mobility.mapTitle} body={mobility.mapBody} stageCaption={mobility.mapCaption} recs={mobility.rec54} />
            </article>
            <article className="st-scene" data-scene="5.5">
              <CarApp />
              <SceneText k="text-5.5" title={mobility.appTitle} body={mobility.appBody} recs={mobility.rec55} />
              <SceneText k="text-5.6" className={s.clients}>
                <p className="meta">{mobility.clientsMeta}</p>
                <ul className={s.clientList}>
                  {mobility.clients.map((c) => (
                    <li key={c.name}>
                      <span>{c.name}</span>
                      <b className="tnum">{c.n}건</b>
                    </li>
                  ))}
                </ul>
                <p className="st-body">{mobility.clientsBody}</p>
              </SceneText>
            </article>
          </div>
        </div>

        <CircleOpen to="day" cx={800} cy={700}>
          <ArtSvg>
            <Fix x={800} y={700} />
          </ArtSvg>
          <SolutionsFirstText copy />
        </CircleOpen>
      </div>
    </section>
  );
}
