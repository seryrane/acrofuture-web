import type { CSSProperties } from "react";
import { hero } from "@/lib/facts";
import { CX, CY, H, NODES, OUTS, R_CORE, R_NODE, R_OUT, W, at } from "@/lib/hero/geometry";
import { HeroMotion } from "./HeroMotion";
import c from "./Company.module.css";

// 히어로 도식(#510). 서버 SVG 가 완성된 정지 도식이다(모션 감소 · JS 없음 · 로드 전 모두 이 상태).
// 모션 허용이면 styles/stages.css M1 이 조립 연출(오차 원 수렴 → 바퀴살 그리기 → 가운데 켜짐 → 결과 떠오름)을 돌리고,
// 그 뒤 흐름 층(.fx)이 반복한다: 사업 → 가운데로 들어오는 점, 가운데 → 결과로 나가는 점, 측점 신호 고리, 가운데 퍼지는 고리,
// 결과 칸 빛남, 궤도 불꽃. 모두 HTML 요소의 transform · opacity CSS 애니메이션이라 합성 단계에서만 돈다(매 프레임 JS · 다시 그리기 0).
// 처음 판(캔버스 rAF)은 1920 에서 3초 중 0.5초를 메인 스레드에 썼다(docs/R510.md §4). 모션 감소면 .fx 는 display: none.
// 깊이: 뒤에 옅은 격자(.mesh)와 빛 번짐(.glow). HeroMotion 은 화면 밖 · 오래 입력 없음에서 흐름을 멈추고, ≥1024 정밀 포인터에서만 시차 모듈을 부른다.

const delay = (sec: number) => ({ "--rd": `${sec}s` }) as CSSProperties;

// 바퀴살: 가운데 원 가장자리에서 바깥으로. 선은 가로로 그리고 바깥 g 가 돌려서 놓는다(그리기 연출은 scaleX, 원점 = 가운데 쪽)
const spoke = (a: number, r1: number) => ({ a, r0: R_CORE + 8, r1 });

// 흐름 층 좌표: viewBox 단위 → 상자 폭 기준 컨테이너 단위(1 단위 = 100cqw / 600). 소수 셋째 자리까지
const v = (n: number) => Math.round(n * 1000) / 1000;
const fx = (o: Record<string, string | number>) => o as CSSProperties;
// 박자 격자: 모든 반복의 주기 · 지연을 G(0.8초)의 배수로 맞춘다. 반복 경계(animationiteration)마다 메인 프레임이 한 번 생기므로,
// 주기 · 위상이 제각각이면 초당 수십 번 메인 스레드가 깨어난다(처음 판 실측: 1920 에서 3초 중 0.45초). 격자에 맞추면 0.8초에 한 번.
// 흐름 한 바퀴 P = 4.8초(6칸). 들어오는 점은 바퀴의 절반(2.4초) 동안 달리고, 나가는 점은 1/3(1.6초) 동안 달린다(Company.module.css 키프레임).
const G = 0.8;
const T0 = 2.4; // 흐름 시작(조립이 끝나는 무렵, 격자 위)
const slot = (k: number) => `${v(T0 + G * (((k % 6) + 6) % 6))}s`;

export function HeroFigure() {
  const spokes = [...NODES.map((n) => ({ ...spoke(n.a, R_NODE - 52), k: n.field, out: false })), ...OUTS.map((o) => ({ ...spoke(o.a, R_OUT - 30), k: o.label, out: true }))];
  return (
    <figure className={c.fig} data-stage="hero">
      <div className={c.figBox} data-k="box">
        <div className={c.glow} data-k="glow" aria-hidden="true" />
        <div className={c.mesh} data-k="mesh" aria-hidden="true" />
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={hero.figLabel} data-k="svg">
          <defs>
            <radialGradient id="hero-core" cx="50%" cy="45%" r="60%">
              <stop offset="0" stopColor="var(--fix)" stopOpacity="0.42" />
              <stop offset="1" stopColor="var(--fix)" stopOpacity="0.08" />
            </radialGradient>
          </defs>

          {/* 궤도 두 겹(안: 세 사업, 밖: 결과) + 눈금. 모션 허용이면 아주 느리게 돈다(장식) */}
          <g data-k="orbits" fill="none" stroke="var(--fix)">
            <circle cx={CX} cy={CY} r={R_NODE} strokeOpacity="0.28" strokeDasharray="2 7" />
            <circle cx={CX} cy={CY} r={R_OUT} strokeOpacity="0.16" strokeDasharray="1 9" />
            {Array.from({ length: 24 }, (_, i) => {
              const p0 = at(i * 15, R_OUT + 10);
              const p1 = at(i * 15, R_OUT + (i % 6 === 0 ? 20 : 15));
              return <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} strokeOpacity={i % 6 === 0 ? 0.4 : 0.18} />;
            })}
          </g>

          {/* 바퀴살 여섯: 세 사업 → 가운데(분야 색), 가운데 → 결과(잎색) */}
          {spokes.map((sp, i) => (
            <g key={sp.k} transform={`rotate(${sp.a} ${CX} ${CY})`}>
              <line
                data-k="spoke"
                x1={CX + sp.r0}
                y1={CY}
                x2={CX + sp.r1}
                y2={CY}
                stroke={sp.out ? "var(--fix-core)" : `var(--${sp.k})`}
                strokeOpacity={sp.out ? 0.5 : 0.6}
                strokeWidth="1.5"
                strokeDasharray={sp.out ? "3 5" : undefined}
                style={delay(sp.out ? 1.25 + 0.06 * (i - 3) : 0.75 + 0.06 * i)}
              />
            </g>
          ))}

          {/* 세 사업: 측점 + 오차 원 2겹 */}
          {NODES.map((n, i) => {
            const p = at(n.a, R_NODE);
            const below = n.a > 0;
            return (
              <g key={n.field} data-k="biz">
                <circle data-k="ring" cx={p.x} cy={p.y} r="46" fill="none" stroke={`var(--${n.field})`} strokeOpacity="0.3" style={delay(0.12 * i)} />
                <circle data-k="ring" cx={p.x} cy={p.y} r="28" fill={`var(--${n.field})`} fillOpacity="0.08" stroke={`var(--${n.field})`} strokeOpacity="0.75" strokeWidth="1.5" style={delay(0.12 * i + 0.15)} />
                <circle cx={p.x} cy={p.y} r="8" fill={`var(--${n.field})`} />
                <text data-k="label" x={p.x} y={below ? p.y + 76 : p.y - 62} textAnchor="middle" fill="var(--ink)" fontSize="22" fontWeight="700" style={delay(0.5 + 0.12 * i)}>
                  {n.label}
                </text>
              </g>
            );
          })}

          {/* 결과: A-Flow 가 만드는 화면 · API · DB */}
          {OUTS.map((o, i) => {
            const p = at(o.a, R_OUT);
            const w = o.label.length > 2 ? 64 : 58;
            return (
              <g key={o.label} data-k="out" style={delay(1.45 + 0.1 * i)}>
                <rect x={p.x - w / 2} y={p.y - 16} width={w} height="32" rx="16" fill="var(--paper)" stroke="var(--fix-core)" strokeOpacity="0.7" />
                <text x={p.x} y={p.y + 6} textAnchor="middle" fill="var(--fix-core)" fontSize="16" fontWeight="700">
                  {o.label}
                </text>
              </g>
            );
          })}

          {/* 가운데 AI 도입 · A-Flow */}
          <circle data-k="ring" cx={CX} cy={CY} r={R_CORE + 16} fill="none" stroke="var(--fix)" strokeOpacity="0.25" style={delay(0.45)} />
          <circle data-k="core" cx={CX} cy={CY} r={R_CORE} fill="url(#hero-core)" stroke="var(--fix)" strokeWidth="2" style={delay(0.6)} />
          <g data-k="fix" style={delay(0.95)}>
            <text x={CX} y={CY - 4} textAnchor="middle" fill="var(--ink)" fontSize="21" fontWeight="700">
              {hero.figCore[0]}
            </text>
            <text x={CX} y={CY + 24} textAnchor="middle" fill="var(--fix-core)" fontSize="21" fontWeight="800">
              {hero.figCore[1]}
            </text>
          </g>

          {/* 궤도 점: 정지 상태에서는 고정 각도, 모션 허용에서만 원을 돈다(장식 반복) */}
          <g data-k="orbit" fill="var(--fix)">
            <circle cx={CX} cy={CY - R_NODE} r="3.5" transform={`rotate(60 ${CX} ${CY})`} />
            <circle cx={CX} cy={CY - R_OUT} r="2.5" fillOpacity="0.7" transform={`rotate(200 ${CX} ${CY})`} />
          </g>
        </svg>
        <div className={c.fx} data-k="fx" aria-hidden="true" style={fx({ "--cx": CX, "--cy": CY })}>
          {/* 사업 → 가운데: 바퀴살마다 점 셋(1.6초 간격), 가운데 쪽으로 빨려 들어가듯 빨라진다 */}
          {NODES.map((n, i) => (
            <div key={n.field} className={c.lane} style={fx({ "--a": `${n.a}deg` })}>
              {[0, 1, 2].map((j) => (
                <i key={j} className={c.runIn} style={fx({ "--r0": R_CORE + 2, "--len": R_NODE - 30 - (R_CORE + 2), "--c": `var(--${n.field})`, "--d": slot(i + 2 * j) })} />
              ))}
            </div>
          ))}
          {/* 가운데 → 결과(잎색): 점 둘(2.4초 간격) */}
          {OUTS.map((o, i) => (
            <div key={o.label} className={c.lane} style={fx({ "--a": `${o.a}deg` })}>
              {[0, 1].map((j) => (
                <i key={j} className={c.runOut} style={fx({ "--r0": R_CORE + 2, "--len": R_OUT - 30 - (R_CORE + 2), "--d": slot(2 * i + 1 + 3 * j) })} />
              ))}
            </div>
          ))}
          {/* 측점 신호 고리: 그 사업의 점이 떠날 때마다(1.6초 주기) */}
          {NODES.map((n, i) => {
            const p = at(n.a, R_NODE);
            return <i key={n.field} className={c.ping} style={fx({ "--x": p.x, "--y": p.y, "--c": `var(--${n.field})`, "--d": slot(i % 2) })} />;
          })}
          {/* 결과 칸 빛남: 점이 닿을 때마다(떠난 뒤 1.6초, 2.4초 주기) */}
          {OUTS.map((o, i) => {
            const p = at(o.a, R_OUT);
            return <i key={o.label} className={c.flash} style={fx({ "--x": p.x, "--y": p.y, "--w": o.label.length > 2 ? 64 : 58, "--d": slot(2 * i + 1 + 2) })} />;
          })}
          {/* 가운데 퍼지는 고리 둘(2.4초 간격) */}
          {[0, 1].map((j) => (
            <i key={j} className={c.ripple} style={fx({ "--d": slot(1 + 3 * j) })} />
          ))}
          {/* 궤도 불꽃: 안 궤도 둘(시계 방향), 바깥 궤도 하나(반대) */}
          {[
            { r: R_NODE, t: 33.6, a0: 20, c: "var(--fix)", rev: false },
            { r: R_NODE, t: 33.6, a0: 200, c: "var(--fix)", rev: false },
            { r: R_OUT, t: 57.6, a0: 110, c: "var(--fix-core)", rev: true },
          ].map((sp, j) => (
            <div key={j} className={c.orbitFx} data-rev={sp.rev ? "1" : undefined} style={fx({ "--a0": `${sp.a0}deg`, "--t": `${sp.t}s` })}>
              <i className={c.spark} style={fx({ "--r": sp.r, "--c": sp.c })} />
            </div>
          ))}
        </div>
        <HeroMotion />
      </div>
      <figcaption className="meta">{hero.figCaption}</figcaption>
    </figure>
  );
}
