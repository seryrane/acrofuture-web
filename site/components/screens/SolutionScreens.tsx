import type { CSSProperties } from "react";
import { solutions } from "@/lib/facts";
import { SCR, mulberry32, inPolygon, polylineD, type Pt } from "@/lib/geometry";
import { circlesD } from "../stage/Art";
import { ScreenFrame, StatusChip } from "../ui/parts";
import s from "./SolutionScreens.module.css";

// 6장 솔루션 화면 예시 4종(코드로 그린 추상 도식, FACTS 의 화면 요소만). 금액·매출·할인·전환율 없음.
// 서버 HTML 은 최종 상태(흐름·모션 감소). 스테이지에서는 연출 모듈이 시작 상태로 돌렸다가 스크럽에 따라 채운다.

const VB = "0 0 320 220";

function Grid() {
  const d: string[] = [];
  for (let x = 32; x < 320; x += 32) d.push(`M${x} 0 V220`);
  for (let y = 22; y < 220; y += 22) d.push(`M0 ${y} H320`);
  return <path d={d.join("")} stroke="var(--s-grid)" strokeWidth="1" fill="none" />;
}

/** 화면 안 측점(주인공): 파랑 고리 + 연두 중심점 */
function MiniFix({ x = 0, y = 0, k }: { x?: number; y?: number; k?: string }) {
  return (
    <g data-k={k} transform={`translate(${x} ${y})`}>
      <circle r="9" fill="var(--s-bg)" stroke="var(--fix)" strokeWidth="1.5" />
      <circle r="4" fill="var(--fix-core)" />
    </g>
  );
}

function Kpi({ label, value, k }: { label: string; value: string; k?: string }) {
  return (
    <div className={s.kpi}>
      <span className="scr-kpi" data-k={k}>
        {value}
      </span>
      <span className="scr-xs">{label}</span>
    </div>
  );
}

/* ───────── AcTrack ───────── */
export function AcTrackScreen() {
  const { zone, trails } = SCR.act;
  const ends = trails.map((t) => t[t.length - 1]);
  return (
    <ScreenFrame title="AcTrack 실시간 추적 현황" name="AcTrack" k="frame-actrack" className={s.frame} style={{ "--t": "var(--fin)" } as CSSProperties}>
      <div className={s.twoCol}>
        <div className={`scr-panel ${s.map}`}>
          <svg viewBox={VB} data-plate="" aria-hidden="true" focusable="false">
            <Grid />
            <path d={polylineD([...zone, zone[0]])} fill="var(--t)" fillOpacity="0.1" stroke="var(--t)" strokeWidth="1.5" />
            <text x="118" y="74" className={s.mapLabel}>
              ZONE A
            </text>
            <g fill="none" stroke="var(--s-ink-3)" strokeWidth="1.2" strokeDasharray="3 4">
              {trails.map((t, i) => (
                <path key={i} d={polylineD(t)} data-k="actTrail" />
              ))}
            </g>
            {/* T1 이 측점(주인공), T2·T3 는 단말 점 */}
            <g data-k="actDev" transform={`translate(${ends[0].x} ${ends[0].y})`}>
              <circle r="9" fill="var(--s-bg)" stroke="var(--fix)" strokeWidth="1.5" />
              <circle r="4" fill="var(--fix-core)" />
              <text x="13" y="-9" className={s.devLabel}>
                T1
              </text>
            </g>
            <g data-k="actDev" transform={`translate(${ends[1].x} ${ends[1].y})`}>
              <circle r="4.5" fill="var(--t)" />
              <text x="9" y="-7" className={s.devLabel}>
                T2
              </text>
            </g>
            <g data-k="actDev" transform={`translate(${ends[2].x} ${ends[2].y})`}>
              <circle r="4.5" fill="#f2b441" />
              <text x="9" y="-7" className={s.devLabel}>
                T3
              </text>
            </g>
          </svg>
        </div>
        <div className={s.side}>
          <div className={s.kpis}>
            <Kpi label="활성 기기" value="24/30" />
            <Kpi label="이동 중" value="18" k="kpiMove" />
            <Kpi label="존 이탈" value="2" k="kpiOut" />
          </div>
          <div className={`scr-panel ${s.list}`}>
            <p className="scr-label">이동 이력(24시간)</p>
            <ul>
              <li data-k="actRow">
                <span className="scr-meta">09:12</span>
                <span className={s.rowText}>T1 Zone A 진입 감지</span>
                <StatusChip s="move">이동 중</StatusChip>
              </li>
              <li data-k="actRow">
                <span className="scr-meta">09:47</span>
                <span className={s.rowText}>T3 존 이탈 알림</span>
                <StatusChip s="warn">존 이탈</StatusChip>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

/* ───────── Cacago ───────── */
const WEEK = ["월", "화", "수", "목", "금", "토", "일"];
const CAC_BARS = [0.62, 0.74, 0.58, 0.86, 0.94, 0.42, 0.3];

export function CacagoScreen() {
  const st = SCR.cac.stops;
  const names = ["출발", "경유1", "경유2", "도착"];
  return (
    <ScreenFrame title="Cacago 배차 현황" name="Cacago" k="frame-cacago" className={s.frame} style={{ "--t": "var(--mob)" } as CSSProperties}>
      <div className={s.quad}>
        <div className={`scr-panel ${s.map}`}>
          <svg viewBox={VB} data-plate="" aria-hidden="true" focusable="false">
            <Grid />
            <path data-k="cacRoute" d={polylineD(st)} fill="none" stroke="var(--t)" strokeWidth="2" pathLength={1} />
            {st.map((p, i) => (
              <g key={i} transform={`translate(${p.x} ${p.y})`}>
                <circle r="5" fill="var(--s-bg)" stroke="var(--t)" strokeWidth="1.5" />
                <text
                  x={[10, -8, 8, -12][i]}
                  y={[16, -12, 22, 4][i]}
                  textAnchor={i === 1 || i === 3 ? "end" : "start"}
                  className={s.devLabel}
                >
                  {names[i]}
                </text>
              </g>
            ))}
            {/* 차량 1 이 측점(주인공), 차량 3 은 지연 */}
            <g data-k="cacCar" transform="translate(286 52)">
              <circle r="8" fill="var(--s-bg)" stroke="var(--fix)" strokeWidth="1.5" />
              <circle r="3.6" fill="var(--fix-core)" />
            </g>
            <g data-k="cacCar" transform="translate(170 132)">
              <circle r="4.5" fill="var(--t)" />
            </g>
            <g data-k="cacCar" transform="translate(84 132)">
              <circle r="4.5" fill="#f2b441" />
            </g>
          </svg>
        </div>
        <div className={`scr-panel ${s.list}`}>
          <p className="scr-label">배차 현황</p>
          <ul>
            <li>
              <span className={s.rowText}>차량 1</span>
              <StatusChip s="done">배차 완료</StatusChip>
            </li>
            <li>
              <span className={s.rowText}>
                차량 2 <span className="scr-meta">도착 예정 14:20</span>
              </span>
              <span className={s.chipSlot} data-k="cac2">
                <StatusChip s="done">배차 완료</StatusChip>
                <StatusChip s="move">이동 중</StatusChip>
              </span>
            </li>
            <li>
              <span className={s.rowText}>
                차량 3 <span className="scr-meta">도착 예정 15:05</span>
              </span>
              <span className={s.chipSlot} data-k="cac3">
                <StatusChip s="move">이동 중</StatusChip>
                <StatusChip s="warn">지연</StatusChip>
              </span>
            </li>
          </ul>
        </div>
        <div className={`scr-panel ${s.today}`}>
          <p className="scr-label">오늘의 지표</p>
          <div className={s.kpis}>
            <Kpi label="배차" value="12" k="cacK1" />
            <Kpi label="완료" value="9" k="cacK2" />
            <Kpi label="지연" value="1" k="cacK3" />
          </div>
        </div>
        <div className={`scr-panel ${s.bars}`}>
          <p className="scr-label">주간 배차량</p>
          <div className={s.barRow}>
            {CAC_BARS.map((v, i) => (
              <span key={i} className={s.barCol}>
                <i data-k="cacBar" style={{ height: `${v * 100}%` }} />
                <em>{WEEK[i]}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

/* ───────── Smart Zone Cast ───────── */
const HOURS = [0.08, 0.05, 0.04, 0.04, 0.06, 0.12, 0.28, 0.46, 0.62, 0.55, 0.5, 0.58, 0.72, 0.6, 0.52, 0.5, 0.56, 0.7, 0.9, 0.82, 0.64, 0.44, 0.26, 0.14];

function zoneDevices() {
  const r = mulberry32(1674367);
  const inside: Pt[] = [];
  const outside: Pt[] = [];
  let guard = 0;
  while ((inside.length < 12 || outside.length < 8) && guard++ < 2000) {
    const p = { x: 18 + r() * 284, y: 14 + r() * 192 };
    if (inPolygon(p.x, p.y, SCR.zone.poly)) {
      if (inside.length < 12 && Math.hypot(p.x - SCR.zone.c.x, p.y - SCR.zone.c.y) > 16) inside.push(p);
    } else if (outside.length < 8) outside.push(p);
  }
  return { inside, outside };
}

export function ZoneCastScreen() {
  const { poly, c } = SCR.zone;
  const dev = zoneDevices();
  const edges = polylineD([...poly, poly[0]]);
  return (
    <ScreenFrame
      title="Smart Zone Cast 캠페인"
      name="Smart Zone Cast"
      k="frame-zonecast"
      className={s.frame}
      style={{ "--t": "var(--etc)" } as CSSProperties}
    >
      <ol className={s.stepsBar}>
        {solutions.zoneSteps.map((t) => (
          <li key={t} data-k="zStep">
            {t}
          </li>
        ))}
      </ol>
      <div className={s.twoCol}>
        <div className={`scr-panel ${s.map}`}>
          <svg viewBox={VB} data-plate="" aria-hidden="true" focusable="false">
            <Grid />
            <path data-k="zFill" d={edges} fill="var(--t)" fillOpacity="0.1" stroke="none" />
            <path data-k="zEdge" d={edges} fill="none" stroke="var(--t)" strokeWidth="1.5" pathLength={1} />
            <path data-k="zVerts" d={circlesD(poly, 3)} fill="var(--t)" />
            <text x={poly[0].x + 8} y={poly[0].y + 22} className={s.mapLabel}>
              ZONE
            </text>
            <g fill="none" stroke="var(--t)" strokeWidth="1.5">
              {[0, 1, 2].map((i) => (
                <circle key={i} data-k="zRing" cx={c.x} cy={c.y} r={46 + i * 18} style={{ opacity: [0.5, 0.3, 0.14][i] }} />
              ))}
            </g>
            <path d={circlesD(dev.outside, 3)} fill="#7a89a9" />
            <path data-k="zOff" d={circlesD(dev.inside, 3)} fill="#7a89a9" style={{ opacity: 0 }} />
            <path data-k="zOn" d={circlesD(dev.inside, 3.4)} fill="var(--t)" />
            <MiniFix x={c.x} y={c.y} />
          </svg>
        </div>
        <div className={`${s.side} ${s.sideSplit}`}>
          <div className={`scr-panel ${s.campaign}`}>
            <p className="scr-label">캠페인</p>
            <span className="sk strong" style={{ width: "70%" }} />
            <span className="sk" style={{ width: "46%" }} />
            <span className={s.chipSlot} data-k="zState">
              <StatusChip s="draft">초안</StatusChip>
              <StatusChip s="wait">예약</StatusChip>
              <StatusChip s="done">송출</StatusChip>
            </span>
          </div>
          <div className={`scr-panel ${s.report}`}>
            <p className="scr-label">리포트</p>
            <div className={s.kpis}>
              <Kpi label="발송" value="3,120" k="zSent" />
              <Kpi label="오픈율" value="41%" k="zOpen" />
            </div>
            <svg className={s.hours} viewBox="0 0 240 64" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-k="zBars">
              <path d={HOURS.map((v, i) => `M${i * 10 + 1} 64 v${(-v * 62).toFixed(1)} h8 V64 z`).join("")} fill="var(--t)" />
            </svg>
            <p className="scr-meta">시간대별 발송</p>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

/* ───────── Smart Rental ───────── */
const ASSETS: { id: string; s: "move" | "wait" | "draft" | "done"; label: string; date: string }[] = [
  { id: "R-01", s: "move", label: "대여 중", date: "10.14" },
  { id: "R-02", s: "wait", label: "반납 예정", date: "10.03" },
  { id: "R-03", s: "done", label: "회수 완료", date: "" },
  { id: "R-04", s: "move", label: "대여 중", date: "10.21" },
  { id: "R-05", s: "draft", label: "점검", date: "" },
  { id: "R-06", s: "done", label: "회수 완료", date: "" },
];
const UTIL = [0.64, 0.7, 0.68, 0.78, 0.82, 0.56, 0.48];

export function RentalScreen() {
  return (
    <ScreenFrame title="Smart Rental 자산 대장" name="Smart Rental" k="frame-rental" className={s.frame} style={{ "--t": "var(--lbs)" } as CSSProperties}>
      <div className={s.rentCol}>
        <div className={`scr-panel ${s.table}`} data-k="rentTable">
          <div className={`${s.tr} ${s.th}`}>
            <span>자산</span>
            <span>상태</span>
            <span>반납 예정일</span>
          </div>
          {ASSETS.map((a) => (
            <div key={a.id} className={s.tr} data-k="rentRow">
              <span className={s.assetId}>{a.id}</span>
              {a.id === "R-03" ? (
                <span className={s.chipSlot} data-k="r3">
                  <StatusChip s="wait">반납 예정</StatusChip>
                  <StatusChip s="done">회수 완료</StatusChip>
                </span>
              ) : (
                <span>
                  <StatusChip s={a.s}>{a.label}</StatusChip>
                </span>
              )}
              <span className="scr-meta">{a.id === "R-03" ? <MiniFixDom /> : a.date}</span>
            </div>
          ))}
        </div>
        <div className={`${s.side} ${s.sideSplit}`}>
          <div className={`scr-panel ${s.gaugeBox}`}>
            <p className="scr-label">보유 대비 대여</p>
            <span className="scr-kpi">18/24</span>
            <span className={s.gauge}>
              <i data-k="rentGauge" style={{ width: "75%" }} />
            </span>
          </div>
          <div className={`scr-panel ${s.bars}`}>
            <p className="scr-label">주간 가동률</p>
            <div className={s.barRow}>
              {UTIL.map((v, i) => (
                <span key={i} className={s.barCol}>
                  <i data-k="rentBar" style={{ height: `${v * 100}%` }} />
                  <em>{WEEK[i]}</em>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

/** 대장 칸의 측점(DOM) */
function MiniFixDom() {
  return <span className={s.rowFix} data-k="rentFix" aria-hidden="true" />;
}

/* ───────── 6.6 표 썸네일(compact 변형, 120×75) ───────── */
export function SolutionThumb({ id }: { id: (typeof solutions.items)[number]["id"] }) {
  const tone = { actrack: "var(--fin)", cacago: "var(--mob)", zonecast: "var(--etc)", rental: "var(--lbs)" }[id];
  return (
    <span className={`screen ${s.thumb}`} style={{ "--t": tone } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 120 75" focusable="false">
        <rect x="0.5" y="0.5" width="119" height="74" rx="8" fill="var(--s-bg)" stroke="rgba(255,255,255,.08)" />
        <rect x="6" y="6" width="108" height="8" rx="2" fill="var(--s-sk-1)" />
        {id === "actrack" ? (
          <>
            <path d="M18 24 L66 20 L80 44 L62 64 L26 62 L14 44 Z" fill="var(--t)" fillOpacity=".12" stroke="var(--t)" />
            <path d="M41 42a3 3 0 1 0 6 0a3 3 0 1 0 -6 0zM88 22h24v6h-24zM88 32h18v6h-18z" fill="var(--t)" />
            <circle cx="92" cy="58" r="3" fill="#f2b441" />
          </>
        ) : null}
        {id === "cacago" ? (
          <>
            <path d="M14 62 L38 32 L66 46 L92 22" fill="none" stroke="var(--t)" strokeWidth="2" />
            <path
              d={[14, 38, 66, 92].map((x, i) => `M${x - 3} ${[62, 32, 46, 22][i]}a3 3 0 1 0 6 0a3 3 0 1 0 -6 0z`).join("") + [0, 1, 2, 3, 4].map((i) => `M${98 + i * 3.4} 66v-${[10, 14, 9, 16, 12][i]}h2.2V66z`).join("")}
              fill="var(--t)"
            />
          </>
        ) : null}
        {id === "zonecast" ? (
          <>
            <path d="M24 26 L58 20 L82 36 L74 60 L40 64 L18 48 Z" fill="var(--t)" fillOpacity=".12" stroke="var(--t)" />
            <path d="M38 42a12 12 0 1 0 24 0a12 12 0 1 0 -24 0M30 42a20 20 0 1 0 40 0a20 20 0 1 0 -40 0" fill="none" stroke="var(--t)" opacity=".4" />
            <path d={[0, 1, 2, 3, 4, 5].map((i) => `M${90 + i * 4} 66v-${[6, 10, 14, 11, 16, 8][i]}h2.6V66z`).join("")} fill="var(--t)" />
          </>
        ) : null}
        {id === "rental" ? (
          <>
            <path d={[22, 32, 42, 52, 62].map((y) => `M8 ${y - 3}h20v5h-20z`).join("") + "M72 22h40v6h-40z"} fill="var(--s-sk-2)" />
            <path
              d={[22, 32, 42, 52, 62].map((y) => `M34 ${y - 3.5}h24v7h-24z`).join("") + "M72 22h30v6h-30z" + [0, 1, 2, 3, 4].map((i) => `M${74 + i * 7} 66v-${[16, 20, 18, 24, 14][i]}h4V66z`).join("")}
              fill="var(--t)"
            />
          </>
        ) : null}
      </svg>
    </span>
  );
}
