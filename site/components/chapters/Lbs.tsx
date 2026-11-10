import type { CSSProperties } from "react";
import { disasterNet, lbs } from "@/lib/facts";
import { KRMAP, LBS, ROUTE_FIX_X, ROUTE_Y, devicePoints, krTransform, gaussianPair, inPolygon, mulberry32, plateD, polylineD, type Pt } from "@/lib/geometry";
import { chapterStyle } from "@/lib/scenes";
import { ArtSvg, CircleOpen, Fix, at, dotsD } from "../stage/Art";
import { SceneText } from "../ui/parts";
import { KR, KR_CREDIT, KR_OTHERS, KR_TARGET } from "@/lib/korea-map";
import { OrbitsFinal } from "./Orbits";
import { RTK_LABELS as RL, RtkPlate, RtkShapes } from "./RtkScene";
import { HistoryFirstText } from "./Route";
import { SeventeenGather } from "./SeventeenGather";
import s from "./Lbs.module.css";

import { F, PL, plateY, POLE, Fix2, DotGrid, HeightShapes, KrMap, KrInset, ScatterPlate, ConvergePlate, HeightPlate, ZonePlate } from "./LbsPlates";

/** 2.5 중간 수치(장식 사본, 확정 값이 있을 때만) */
function MidNums({ live }: { live?: boolean }) {
  if (!disasterNet.orgs || !disasterNet.users) return null;
  return (
    <p className={live ? `${s.mid} ${s.midLive}` : s.mid} data-k={live ? "mid" : undefined} aria-hidden="true">
      <span>{disasterNet.orgs}</span>
      <span>{disasterNet.users}</span>
    </p>
  );
}

/** 2.1 첫 문구(1.3 원형 열림 레이어 사본과 같은 자리) */
export function LbsFirstText({ copy }: { copy?: boolean }) {
  return (
    <SceneText k="text-2.1" first copy={copy} as="h2" id="lbs-title" title={lbs.title} meta={lbs.meta} body={lbs.body} recs={lbs.rec21} />
  );
}

// 2장 LBS·측위(신호, 캔버스 엔진 하나가 2.1~2.7 을 그린다): 흩어짐 → 복합측위 수렴(오차 원 게이지) → 미터에서 센티미터로(RTK)
// → 층 판 위 3차원 측위 → 구역 안 단말만 켜지는 지오펜싱·재난망 → 17 → 선으로 풀려 연혁 도면이 열린다.
export function Lbs() {
  const top = plateY(PL.top);
  const polyD = polylineD([...LBS.poly, LBS.poly[0]]);
  return (
    <section
      id="lbs"
      className="st-chapter night tone-lbs st-opens st-tex"
      data-ch="lbs"
      data-surface-of="night"
      style={chapterStyle("lbs") as CSSProperties}
      aria-labelledby="lbs-title"
    >
      <div className="st-stage st-tex">
        <div className="st-art" aria-hidden="true">
          <ArtSvg k="lbsArt1">
            <g data-k="orbits">
              <OrbitsFinal color="var(--n-cold)" satColor="var(--n-cold)" lineColor="var(--n-road)" />
            </g>
            {/* 2.5 국내 지도 → 한 지역 확대(캔버스 단말 아래). 왼쪽 문구 열 쪽은 흐리게 가린다(경계선이 글자를 지나지 않게) */}
            <defs>
              <linearGradient id="krS-fade" gradientUnits="userSpaceOnUse" x1="740" y1="0" x2="850" y2="0">
                <stop offset="0" stopColor="#000" />
                <stop offset="1" stopColor="#fff" />
              </linearGradient>
              <mask id="krS-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
                <rect width="1600" height="900" fill="url(#krS-fade)" />
              </mask>
            </defs>
            <g mask="url(#krS-mask)">
              <KrMap id="krS" t={0} k />
            </g>
            <Fix x={F.x} y={F.y} glow k="fixStart" />
          </ArtSvg>
          <canvas className={`st-canvas ${s.canvas}`} data-k="canvas" />
          <ArtSvg k="lbsArt2">
            {/* 2.3 RTK 원근 장면: 지면·위성·기준국·보정 신호 호·오차 원 */}
            <RtkShapes id="rtkS" live />
            {/* 2.4 층 판 */}
            <HeightShapes live />
            {/* 2.5 구역 다각형 + 방송 원 */}
            <path data-k="polyFill" d={polyD} fill="var(--tone)" fillOpacity="0.08" style={{ opacity: 0 }} />
            <path data-k="poly" d={polyD} fill="none" stroke="var(--tone)" strokeWidth="1.5" pathLength={1} style={{ opacity: 0 }} />
            <g fill="none" stroke="var(--tone)" strokeWidth="1.5">
              {[0, 1, 2].map((i) => (
                <circle key={i} data-k="zring" cx={F.x} cy={F.y} r="150" style={{ opacity: 0 }} />
              ))}
            </g>
            <Fix x={F.x} y={F.y} glow k="fix" hidden />
            {/* 2.7 가로선 */}
            <line
              data-k="lineGhost"
              x1={ROUTE_FIX_X}
              y1={ROUTE_Y}
              x2={1600}
              y2={ROUTE_Y}
              stroke="var(--n-road)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              style={{ opacity: 0 }}
            />
            <Fix x={ROUTE_FIX_X} y={ROUTE_Y} glow k="fixEnd" hidden />
          </ArtSvg>
          <ArtSvg>
            <KrInset id="krS" k />
          </ArtSvg>
          <div className={s.labels}>
            <span className={`st-at st-label ${s.center}`} data-k="lblMeter" style={at(RL.meter.x, RL.meter.y)}>
              {lbs.rtkLabels.meter}
            </span>
            <span className="st-at st-label" data-k="lblCm" style={at(RL.cm.x, RL.cm.y)}>
              {lbs.rtkLabels.cm}
            </span>
            <span className={`st-at st-label ${s.center}`} data-k="lblSignal" style={at(RL.signal.x, RL.signal.y)}>
              {lbs.rtkLabels.signal}
            </span>
            <span className="st-at st-label" data-k="lblSat" style={at(RL.sat.x, RL.sat.y)}>
              {lbs.rtkLabels.sat}
            </span>
            <span className={`st-at st-label ${s.right}`} data-k="lblBase" style={at(RL.base.x, RL.base.y)}>
              {lbs.rtkLabels.base}
            </span>
            <span className="st-at st-label" data-k="lblPlane" style={at(PL.cx + 34, PL.y0 + 14)}>
              {lbs.heightLabels.plane}
            </span>
            <span className={`st-at st-label ${s.right}`} data-k="lblHeight" style={at(LBS.dimX - 16, (PL.y0 + top) / 2)}>
              {lbs.heightLabels.height}
            </span>
          </div>
          <MidNums live />
          <div className={`st-at st-giant ${s.giant}`} data-k="giant" style={at(F.x, F.y)}>
            {lbs.giant}
          </div>
        </div>

        <div className="container st-flow">
          <div className="st-scenes">
            <article className="st-scene" data-scene="2.1">
              <figure className="st-plate">
                <ScatterPlate />
              </figure>
              <LbsFirstText />
            </article>
            <article className="st-scene" data-scene="2.2">
              <figure className="st-plate">
                <ConvergePlate />
                <figcaption className="meta">{lbs.hybridCaption}</figcaption>
              </figure>
              <SceneText k="text-2.2" title={lbs.hybridTitle} body={lbs.hybridBody} stageCaption={lbs.hybridCaption} recs={lbs.rec22} />
            </article>
            <article className="st-scene" data-scene="2.3">
              <figure className="st-plate">
                <RtkPlate />
                <figcaption className="meta">{lbs.rtkCaption}</figcaption>
              </figure>
              <SceneText k="text-2.3" title={lbs.rtkTitle} body={lbs.rtkBody} stageCaption={lbs.rtkCaption} recs={lbs.rec23} />
            </article>
            <article className="st-scene" data-scene="2.4">
              <figure className="st-plate">
                <HeightPlate />
                <figcaption className="meta">{lbs.heightCaption}</figcaption>
              </figure>
              <SceneText k="text-2.4" title={lbs.heightTitle} body={lbs.heightBody} stageCaption={lbs.heightCaption} recs={lbs.rec24} />
            </article>
            <article className="st-scene" data-scene="2.5">
              <figure className="st-plate">
                <ZonePlate />
                <figcaption className="meta">{lbs.zoneCaption}</figcaption>
                <MidNums />
              </figure>
              <SceneText k="text-2.5" title={lbs.zoneTitle} body={lbs.zoneBody} stageCaption={lbs.zoneCaption} recs={lbs.rec25}>
                <p className="meta">{KR_CREDIT}</p>
              </SceneText>
            </article>
            <article className="st-scene" data-scene="2.6">
              <div className={`st-plate ${s.seventeen}`}>
                <SeventeenGather text={lbs.giant} />
              </div>
              <SceneText k="text-2.6" as="h2" title={lbs.seventeenTitle} body={lbs.seventeenBody} />
            </article>
          </div>
        </div>

        <CircleOpen to="day" cx={ROUTE_FIX_X} cy={ROUTE_Y}>
          <ArtSvg>
            <line x1={ROUTE_FIX_X} y1={ROUTE_Y} x2={1600} y2={ROUTE_Y} stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 6" />
            <Fix x={ROUTE_FIX_X} y={ROUTE_Y} />
          </ArtSvg>
          <HistoryFirstText copy />
        </CircleOpen>
      </div>
    </section>
  );
}
