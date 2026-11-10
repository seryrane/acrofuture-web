import type { CSSProperties } from "react";
import { ai, aioffice } from "@/lib/facts";
import s from "./Section.module.css";
import a from "./AiSection.module.css";

// 2 AI 활용 #ai: 지시 흐름 도식(정지판) → 다리(기록 → AI Office) → AI Office 화면 대조(#ai-office) · 효과 3줄 → 운영 숫자 4칸 · 4판 제작 방식.
// 연출(CSS animation-timeline, JS 0): ≥1024 · 모션 허용 · 지원 브라우저에서만 [data-stage="ai-flow"] 가 sticky 무대(AiSection.module.css).
// 각 요소의 --s · --e(0~1)는 무대 스크롤 구간 안의 시작 · 끝 비율. 경로 [data-k="edge"] 는 stroke-dashoffset 으로 그려지고,
// 칸 [data-k="node"] 의 글자 · 바탕은 늘 다 보이고(대비 4.5:1 이상, 2026-11-10 흐림 지적), 강조 테두리 [data-k="lit"] 만 opacity 로 켜진다.
// 경로는 그려지기 전에도 옅은 점선 길(track)이 보인다. 사람 승인 [data-k="gate"] 에서 halo 가 멈춰 있다가 지나간다. 그 밖 조건에서는 모두 최종 상태 정지.
type Span = { s: number; e: number };
const sp = ({ s, e }: Span) => ({ "--s": s, "--e": e }) as CSSProperties;
const [order, plan, work, gate, log] = ai.steps;

type P = [number, number];
const bez = (a: P, b: P, c: P, d: P, u: number): P => {
  const m = 1 - u;
  return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u * u * u * d[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u * u * u * d[1]];
};
/** 하위 지시 흐름 점(M7): 경로 위 4지점을 시작점 기준 이동량(--x1..--y4)으로 주고, 최종 상태에서는 보이지 않는다. 정지 · 모바일에서는 숨김 */
function Dot({ from, c1, c2, to, t }: { from: P; c1: P; c2: P; to: P; t: Span }) {
  const q = [0.3, 0.6, 1].map((u) => bez(from, c1, c2, to, u));
  const st: Record<string, number> = { "--s": t.s, "--e": t.e };
  q.forEach(([x, y], i) => {
    st[`--x${i + 1}`] = +(x - from[0]).toFixed(1);
    st[`--y${i + 1}`] = +(y - from[1]).toFixed(1);
  });
  return <circle data-k="dot" cx={from[0]} cy={from[1]} r="5" fill="var(--fix-core)" style={st as CSSProperties} />;
}

/** 단계 번호 표지(390 세로 목록 · 화면 대조 번호와 같은 번호) */
function Badge({ cx, cy, n, gate }: { cx: number; cy: number; n: number; gate?: boolean }) {
  return (
    <g aria-hidden="true">
      <circle cx={cx} cy={cy} r="12" fill="var(--c-deep-3)" stroke={gate ? "var(--c-warn)" : "var(--fix)"} strokeWidth="1.6" />
      <text x={cx} y={cy + 4} fontSize="12" fontWeight="800" textAnchor="middle" fill={gate ? "var(--c-warn)" : "var(--s-ink)"}>
        {n}
      </text>
    </g>
  );
}

/** 칸 바탕(늘 보임) + 강조 테두리(lit, 무대에서만 0 → 1) */
function Box({ x, y, w, h, gate }: { x: number; y: number; w: number; h: number; gate?: boolean }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="14" fill="var(--s-bg)" stroke="var(--s-edge)" />
      <rect data-k="lit" x={x} y={y} width={w} height={h} rx="14" fill={gate ? "var(--s-lit-warn)" : "var(--s-lit)"} stroke={gate ? "var(--c-warn)" : "var(--fix)"} strokeWidth="2" />
    </>
  );
}

function Node({ x, y, w, h, n, title, sub, t }: { x: number; y: number; w: number; h: number; n: number; title: string; sub: string; t: Span }) {
  return (
    <g data-k="node" style={sp(t)}>
      <Box x={x} y={y} w={w} h={h} />
      <Badge cx={x + 4} cy={y + 4} n={n} />
      <text x={x + 20} y={y + h / 2 - 2} fontSize="14" fontWeight="700" fill="var(--s-ink)">
        {title}
      </text>
      <text x={x + 20} y={y + h / 2 + 20} fontSize="12" fill="var(--s-ink-2)">
        {sub}
      </text>
    </g>
  );
}

/** 경로와 그려지는 구간. 옅은 점선 길(track)도 같은 경로를 쓴다 */
const EDGE_SPANS: [string, Span][] = [
  ["M196 180H262", { s: 0.06, e: 0.16 }],
  ["M452 180C500 180 490 60 548 60", { s: 0.22, e: 0.34 }],
  ["M452 180H548", { s: 0.22, e: 0.34 }],
  ["M452 180C500 180 490 300 548 300", { s: 0.22, e: 0.34 }],
  ["M738 60C790 60 790 180 836 180", { s: 0.44, e: 0.54 }],
  ["M738 180H836", { s: 0.44, e: 0.54 }],
  ["M738 300C790 300 790 180 836 180", { s: 0.44, e: 0.54 }],
  ["M958 180H1004", { s: 0.78, e: 0.88 }],
];
const EDGES = EDGE_SPANS.map(([d]) => d);

function FlowSvg() {
  return (
    <svg className={a.flowD} viewBox="0 0 1120 360" role="img" aria-label={ai.flowLabel}>
      <defs>
        <marker id="ai-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0L8 4L0 8z" fill="var(--fix)" />
        </marker>
      </defs>
      <g fill="none" stroke="var(--s-edge)" strokeWidth="1.6" strokeDasharray="3 5" aria-hidden="true">
        {EDGES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="var(--fix)" strokeWidth="1.8" markerEnd="url(#ai-arrow)">
        {EDGE_SPANS.map(([d, t]) => (
          <path key={d} data-k="edge" d={d} pathLength="1" style={sp(t)} />
        ))}
      </g>
      <g aria-hidden="true">
        <Dot from={[452, 180]} c1={[500, 180]} c2={[490, 60]} to={[548, 60]} t={{ s: 0.34, e: 0.46 }} />
        <Dot from={[452, 180]} c1={[483, 180]} c2={[517, 180]} to={[548, 180]} t={{ s: 0.34, e: 0.46 }} />
        <Dot from={[452, 180]} c1={[500, 180]} c2={[490, 300]} to={[548, 300]} t={{ s: 0.34, e: 0.46 }} />
        <Dot from={[738, 60]} c1={[790, 60]} c2={[790, 180]} to={[836, 180]} t={{ s: 0.54, e: 0.64 }} />
        <Dot from={[738, 180]} c1={[771, 180]} c2={[803, 180]} to={[836, 180]} t={{ s: 0.54, e: 0.64 }} />
        <Dot from={[738, 300]} c1={[790, 300]} c2={[790, 180]} to={[836, 180]} t={{ s: 0.54, e: 0.64 }} />
      </g>
      <g data-k="node" style={sp({ s: 0, e: 0.06 })}>
        <Box x={16} y={146} w={180} h={68} />
        <Badge cx={20} cy={150} n={1} />
        <circle cx="40" cy="180" r="7" fill="var(--fix-core)" />
        <text x="58" y="176" fontSize="14" fontWeight="700" fill="var(--s-ink)">
          {order.title}
        </text>
        <text x="58" y="198" fontSize="12" fill="var(--s-ink-2)">
          {order.sub}
        </text>
      </g>
      <Node x={262} y={146} w={190} h={68} n={2} title={plan.title} sub={plan.sub} t={{ s: 0.16, e: 0.23 }} />
      <Node x={548} y={28} w={190} h={64} n={3} title={work.title} sub={`${ai.floors[0]} · ${work.sub}`} t={{ s: 0.32, e: 0.4 }} />
      <Node x={548} y={148} w={190} h={64} n={3} title={work.title} sub={`${ai.floors[1]} · ${work.sub}`} t={{ s: 0.34, e: 0.42 }} />
      <Node x={548} y={268} w={190} h={64} n={3} title={work.title} sub={`${ai.floors[2]} · ${work.sub}`} t={{ s: 0.36, e: 0.44 }} />
      <g data-k="gate" style={sp({ s: 0.54, e: 0.6 })}>
        <rect x="836" y="140" width="122" height="80" rx="14" fill="var(--s-bg)" stroke="var(--c-warn)" strokeWidth="1.4" />
        <rect data-k="lit" x="836" y="140" width="122" height="80" rx="14" fill="var(--s-lit-warn)" stroke="var(--c-warn)" strokeWidth="2.4" />
        <Badge cx={840} cy={144} n={4} gate />
        <rect x="882" y="170" width="30" height="24" rx="4" fill="var(--c-warn)" />
        <path d="M888 170v-8a9 9 0 0 1 18 0v8" fill="none" stroke="var(--c-warn)" strokeWidth="2.4" />
        <rect data-k="halo" style={sp({ s: 0.6, e: 0.76 })} x="828" y="132" width="138" height="96" rx="18" fill="none" stroke="var(--c-warn)" strokeWidth="2" opacity="0" />
        <text x="897" y="212" fontSize="12" textAnchor="middle" fill="var(--c-warn)">
          {gate.title}
        </text>
      </g>
      <g data-k="node" style={sp({ s: 0.88, e: 0.95 })}>
        <Box x={1004} y={146} w={100} h={68} />
        <Badge cx={1008} cy={150} n={5} />
        <text x="1054" y="176" fontSize="14" fontWeight="700" textAnchor="middle" fill="var(--s-ink)">
          {log.title}
        </text>
        <text x="1054" y="198" fontSize="12" textAnchor="middle" fill="var(--s-ink-2)">
          {log.sub}
        </text>
      </g>
    </svg>
  );
}

const pct = (v: number, of: number) => `${+((v / of) * 100).toFixed(3)}%`;

/** 도식 → 제품 다리: 도식 끝 «기록» 칸(같은 모양 · 번호)에서 화살표로 AI Office 화면 대조로 넘어간다 */
function OfficeBridge() {
  const { w, h } = ai.officeShot;
  const stepOf = (id: string) => ai.steps.findIndex((x) => x.id === id);
  return (
    <section id="ai-office" className={a.office} aria-labelledby="ai-office-title">
      <div className={a.bridge}>
        <span className={a.bridgeFrom} aria-hidden="true">
          <span className={a.mini}>5</span>
          {ai.steps[4].title}
        </span>
        <svg className={a.bridgeArrow} viewBox="0 0 64 16" width="64" height="16" aria-hidden="true">
          <path d="M2 8H58" stroke="var(--fix)" strokeWidth="1.8" fill="none" />
          <path d="M54 3L62 8L54 13z" fill="var(--fix)" />
        </svg>
        <p className={a.bridgeLead}>{ai.bridgeLead}</p>
      </div>
      <h3 id="ai-office-title" className={a.officeName}>
        {aioffice.name}
      </h3>
      <p className={a.officeLine}>{ai.officeLine}</p>

      <div className={a.officeGrid}>
        <figure className={a.shot}>
          <div className={a.shotBox}>
            <img src={ai.officeShot.src} alt={ai.officeShot.alt} width={w} height={h} loading="lazy" decoding="async" />
            {ai.map.map((m) => {
              const [x, y, bw, bh] = m.box;
              const n = stepOf(m.step) + 1;
              return (
                <span
                  key={m.step}
                  className={a.mark}
                  data-side={m.side}
                  data-gate={m.step === "gate" ? "" : undefined}
                  style={{ left: pct(x, w), top: pct(y, h), width: pct(bw, w), height: pct(bh, h) }}
                  aria-hidden="true"
                >
                  <b>{n}</b>
                </span>
              );
            })}
          </div>
          <figcaption className="meta">{ai.officeShot.caption}</figcaption>
        </figure>
        <ol className={a.legend} aria-label="도식 단계와 AI Office 화면의 자리">
          {ai.map.map((m) => {
            const i = stepOf(m.step);
            return (
              <li key={m.step} data-gate={m.step === "gate" ? "" : undefined}>
                <span className={a.dot} aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <b>
                    {ai.steps[i].title} <span className={a.ui}>화면: {m.ui}</span>
                  </b>
                  <span>{m.body}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <ul className={a.better}>
        {aioffice.better.map((b) => (
          <li key={b.title} className="card">
            <h4>{b.title}</h4>
            <p>{b.body}</p>
          </li>
        ))}
      </ul>
      <div className={a.officeFoot}>
        <p className="meta">{ai.privacy}</p>
        <a className={a.toSol} href="#office">
          {ai.toSolutions}
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </section>
  );
}

export function AiSection() {
  return (
    <section id="ai" className={`${s.sec} day st-tex`} data-surface-of="day" data-chapter-of="ai" aria-labelledby="ai-title">
      <div className="container">
        <div className={s.head}>
          <p className={s.label}>{ai.label}</p>
          <h2 id="ai-title" className={s.title}>
            {ai.titleBefore}
            <br />
            <span className={s.em}>{ai.titleEm}</span> {ai.titleAfter}
          </h2>
          <p className={s.lede}>{ai.lead}</p>
        </div>

        <div className={a.stage}>
        <figure className={`${a.flow} screen`} data-stage="ai-flow">
          <FlowSvg />
          <ol className={a.flowM}>
            {ai.steps.map((st, i) => (
              <li key={st.id} className={a.step} data-gate={st.id === "gate" ? "" : undefined}>
                <span className={a.dot} aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <b>{st.title}</b>
                  <span>{st.detail}</span>
                </div>
              </li>
            ))}
          </ol>
          <figcaption className={a.cap}>
            <span className="meta">{ai.flowCaption}</span>
            <span className="meta">{ai.flowRule}</span>
          </figcaption>
        </figure>
        <div className={a.spacer} aria-hidden="true" />
        </div>

        <OfficeBridge />

        <dl className={a.nums}>
          {ai.nums.map((n) => (
            <div key={n.label} className="card" data-rise="">
              <dt className={a.numLabel}>{n.label}</dt>
              <dd className={`${s.num} ${a.numBig}`}>
                {n.n}
                <small>{n.unit}</small>
              </dd>
            </div>
          ))}
        </dl>
        <p className={`meta ${a.numNote}`}>
          {ai.numsLabel}. {ai.numsNote}
        </p>

        <aside className={`card ${a.self}`} data-rise="">
          <h3>{ai.selfTitle}</h3>
          <p>{ai.selfBody}</p>
        </aside>
      </div>
    </section>
  );
}
