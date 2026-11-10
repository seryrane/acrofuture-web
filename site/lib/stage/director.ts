// 스테이지 연출 모듈(≥1024 · 모션 허용에서만 지연 로드, 3판 39장면).
// 챕터마다 GSAP 타임라인 하나(start "top top" → end "bottom bottom", scrub 0.4). 타임라인 길이 = L(svh),
// 장면 트윈은 lib/scenes.ts 구간을 그대로 위치로 쓴다. 문구 등장·퇴장도 같은 타임라인 안에 둔다(검수 P2-4).
// 고정은 CSS sticky 가 맡고 GSAP pin 은 쓰지 않는다. 조건이 풀리면 gsap.matchMedia 가 전부 되돌린다.

import type { GsapBundle } from "../motion";
import { MQ_STAGE } from "../motion";
import { makeFrame, type Env, type Frame } from "./core";
import { origin } from "./ch-origin";
import { lbs } from "./ch-lbs";
import { history } from "./ch-history";
import { finance } from "./ch-finance";
import { mobility } from "./ch-mobility";
import { solutions } from "./ch-solutions";
import { process } from "./ch-process";
import { record } from "./ch-record";

export function startDirector({ gsap, ScrollTrigger }: GsapBundle): () => void {
  // 지연 렌더(lazy) 끄기: 타임라인 뒤쪽 fromTo 의 시작 상태가 한 틱 미뤄지다 스크럽 새로고침에 묻혀,
  // 아직 시작하지 않은 막대·라벨이 최종 상태로 비치던 문제를 막는다(시작 상태 = 진행도 0 원칙).
  gsap.defaults({ lazy: false });
  const mm = gsap.matchMedia();
  mm.add(MQ_STAGE, () => {
    const cleanups: (() => void)[] = [];
    const frames = new Map<Element, Frame>();
    const onRefresh = () => frames.clear();
    ScrollTrigger.addEventListener("refreshInit", onRefresh);
    cleanups.push(() => ScrollTrigger.removeEventListener("refreshInit", onRefresh));

    const frameOf = (stage: Element): Frame => {
      let f = frames.get(stage);
      if (!f) {
        f = makeFrame(stage);
        frames.set(stage, f);
      }
      return f;
    };

    const env: Env = { gsap, ScrollTrigger, frameOf, cleanups };
    for (const build of [origin, lbs, history, finance, mobility, solutions, process, record]) {
      try {
        build(env);
      } catch (err) {
        // 한 챕터가 실패해도 나머지는 돈다(그 챕터는 시작 상태 도판으로 남음)
        console.warn("stage", err);
      }
    }
    ScrollTrigger.refresh();
    return () => {
      cleanups.forEach((c) => c());
      document.querySelectorAll<HTMLElement>(".st-stage").forEach((s) => (s.style.visibility = ""));
    };
  });
  return () => mm.revert();
}
