// 3장 연혁(가로 챕터): 트랙이 측점(화면 x 30vw) 아래로 흐르고, 역을 지나면 현재 역 카드가 그 역을 붙든다.
// 2026 에서 세 갈래 머리에 건수가 붙고, 위 갈래 머리에서 심야(디지털금융)가 열린다.

import { route } from "../facts";
import { ROUTE_FIX_X, TRACK_SPAN, clamp01, stationX } from "../geometry";
import { seq, chapter, circleOpen, fadeIn, type Env } from "./core";

export function history(env: Env) {
  const c = chapter(env, "history");
  const { tl } = c;
  const labels = c.all("station");
  const card = {
    kind: c.k("cKind"),
    year: c.k("cYear"),
    name: c.k("cName"),
    no: c.k("cNo"),
  };
  let current = 0;
  const setCard = (i: number) => {
    const st = route.stations[i];
    card.kind.textContent = st.kind ?? "";
    card.year.textContent = st.label;
    card.name.textContent = st.name;
    card.no.textContent = st.no ?? "";
  };
  c.tick((p) => {
    const T = clamp01(p / 360) * TRACK_SPAN;
    let last = 0;
    labels.forEach((li, i) => {
      const x = Number(li.dataset.x) - ROUTE_FIX_X;
      const passed = T + 1 >= x;
      const v = passed ? "true" : "false";
      if (li.dataset.passed !== v) li.dataset.passed = v;
      if (passed) last = i;
    });
    if (last !== current) {
      current = last;
      setCard(last);
    }
  });
  env.cleanups.push(() => setCard(0));

  const move = { x: () => -TRACK_SPAN * c.frame().u };
  const projects = c.k("projects");
  tl.fromTo([c.k("track"), c.k("trackDrawn"), projects], { x: 0 }, { ...move, duration: 360 }, 0);

  // 연도별 대표 사업 카드: 오른쪽(앞으로 올 해)에서는 살짝 돌아선 채 흐리게 다가오고, 측점 가까이서 정면·선명,
  // 측점에 닿으면 사라진다(지나간 해). 원근 회전과 투명도만 쓴다
  const cards = Array.from(projects.children as HTMLCollectionOf<HTMLElement>).map((el) => ({ el, x: Number(el.dataset.x), key: "" }));
  c.tick((p) => {
    const T = clamp01(p / 360) * TRACK_SPAN;
    // 오른쪽 88px(챕터 레일 자리)에 닿기 전에 흐려진다
    const f = c.frame();
    const railU = (f.w - 96 - f.ox) / f.u;
    const cardU = Math.min(232, 234 * f.u) / f.u;
    for (const cd of cards) {
      const sx = cd.x - T;
      let op = 0;
      let rot = 0;
      if (sx < 1750 && sx > ROUTE_FIX_X - 60) {
        op = Math.min(clamp01((sx - ROUTE_FIX_X - 30) / 80), 0.5 + 0.5 * clamp01((1350 - sx) / 520), clamp01((railU - sx - cardU * 0.8) / 90));
        rot = -20 * clamp01((sx - 720) / 820);
      }
      const key = `${op.toFixed(2)}|${rot.toFixed(1)}`;
      if (key === cd.key) continue;
      cd.key = key;
      cd.el.style.opacity = op.toFixed(2);
      cd.el.style.transform = `translateY(-50%) perspective(900px) rotateY(${rot.toFixed(1)}deg)`;
    }
  });
  env.cleanups.push(() => cards.forEach((cd) => ((cd.el.style.opacity = ""), (cd.el.style.transform = ""))));
  const splitP = ((stationX(2012) - ROUTE_FIX_X) / TRACK_SPAN) * 360;
  tl.fromTo(c.k("branchLabels"), { opacity: 0 }, { opacity: 1, duration: 10 }, splitP + 4);
  tl.to(c.k("branchLabels"), { opacity: 0, duration: 10 }, 262);

  // 현재 역 카드: 처음부터 보이고, 갈래 건수가 붙을 때 물러난다
  const cardEl = c.k("currentCard");
  tl.fromTo(cardEl, { opacity: 1 }, { opacity: 0, duration: 10 }, 335);

  // 3.4 갈래 머리 건수 + 캡션
  const counts = c.all("count");
  seq(c, counts, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 330, 4);
  fadeIn(c, c.k("countsCap"), 334, 10);
  circleOpen(c, 360, 420);
}
