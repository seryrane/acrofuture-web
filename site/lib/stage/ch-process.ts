// 7장 일하는 과정: 6.6 에서 접힌 한 줄이 트래버스가 되고 측점이 다섯 역을 밟는다(7.1·7.2). 트래버스가 오른쪽 위로 물러나고
// 운영 역에서 세로선이 내려와 운영 기간 막대 6개가 찬다(7.2). 막대·트래버스를 visibility 로 끝내고 29개 점, 심야가 열린다(7.3).

import { process as facts } from "../facts";
import { PROCESS, cumulative, dotPositions, easeInOut, easeOut, lerp, pointAt, processPath, span, type Pt } from "../geometry";
import { chapter, circleOpen, draw, fadeIn, fadeOut, seq, setT, text, type Env } from "./core";

const SH = PROCESS.shrink;
/** 7.2 물러난 트래버스 좌표(오른쪽 끝 기준 배율 0.6, 위로 380) */
function shrunk(p: Pt, k: number): Pt {
  const s = 1 + (SH.s - 1) * k;
  return { x: SH.ox + (p.x - SH.ox) * s, y: SH.oy + (p.y - SH.oy) * s + SH.dy * k };
}

export function process(env: Env) {
  const c = chapter(env, "process");
  const { tl } = c;
  const path = processPath();
  const { ratios } = cumulative(path);
  const stationRatio = ratios.slice(0, 5);
  const stops = c.all<SVGCircleElement>("stop");
  c.tick((p) => {
    stops.forEach((s, i) => {
      const v = p >= PROCESS.arrive[i] ? "true" : "false";
      if (s.dataset.passed !== v) s.dataset.passed = v;
    });
  });

  const fix = c.k<SVGGElement>("fix");
  const drawn = c.k<SVGPathElement>("travDrawn");
  const trav = c.k("trav");
  const group = c.k<SVGGElement>("travGroup");

  // 7.1 접힌 한 줄(6.6 행 선)이 트래버스가 된다
  const fold = c.k("foldLine");
  tl.fromTo(fold, { opacity: 1 }, { opacity: 0, duration: 18 }, 6);
  tl.fromTo(trav, { opacity: 0 }, { opacity: 1, duration: 15 }, 4);
  tl.fromTo(fix, { opacity: 0 }, { opacity: 1, duration: 6 }, 2);
  tl.set(drawn, { strokeDasharray: 1, strokeDashoffset: 1.002 }, 0);

  // 측점 이동: 역 1 → … → 역 5(운영), 이어서 선은 화면 밖으로. 7.2 에서는 트래버스와 함께 물러난다
  const sh = { k: 0 };
  const mv = { p: 0 };
  const applyMove = () => {
    const p = mv.p;
    let r = 0;
    let seg = 0;
    while (seg < 4 && p > PROCESS.arrive[seg + 1]) seg++;
    if (p <= PROCESS.arrive[0]) r = 0;
    else if (seg >= 4) r = stationRatio[4];
    else {
      const t = easeInOut((p - PROCESS.arrive[seg]) / (PROCESS.arrive[seg + 1] - PROCESS.arrive[seg]));
      r = lerp(stationRatio[seg], stationRatio[seg + 1], t);
    }
    const pos = shrunk(pointAt(path, r, ratios), easeInOut(sh.k));
    setT(fix, pos.x, pos.y);
    const ext = span(p, PROCESS.arrive[4], PROCESS.arrive[4] + 20);
    const drawnR = p >= PROCESS.arrive[4] ? lerp(stationRatio[4], 1, ext) : r;
    drawn.style.strokeDashoffset = String(p <= PROCESS.arrive[0] ? 1.002 : 1 - drawnR);
    drawn.style.opacity = p <= PROCESS.arrive[0] ? "0" : "1";
  };
  tl.fromTo(mv, { p: 0 }, { p: 190, duration: 190, onUpdate: applyMove, onStart: applyMove }, 0);

  // 단계명: 역을 밟을 때 아래에서 올라와 크게, 다음 역에서 위로 빠지고 역 아래 작은 라벨로 내려앉는다
  const steps = c.all("step");
  steps.forEach((li, i) => {
    const big = li.firstElementChild as HTMLElement;
    const small = li.lastElementChild as HTMLElement;
    const a = PROCESS.arrive[i];
    tl.fromTo(big, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 8, ease: "power2.out" }, a);
    const out = i < 4 ? PROCESS.arrive[i + 1] - 3 : 168;
    tl.to(big, { clipPath: "inset(0% 0% 100% 0%)", duration: 6, ease: "power1.in" }, out);
    tl.fromTo(small, { opacity: 0 }, { opacity: 1, duration: 6 }, out + 2);
  });
  text(c, "text-7.1", 0, 120, 12, 10);

  // 7.2 트래버스가 오른쪽 위로 물러나고(배율 0.6), 운영 역에서 세로선이 내려와 운영 기간 막대가 찬다
  const applyShrink = () => {
    const k = easeInOut(sh.k);
    const s = 1 + (SH.s - 1) * k;
    group.setAttribute("transform", `translate(${SH.ox} ${(SH.oy + SH.dy * k).toFixed(2)}) scale(${s.toFixed(4)}) translate(${-SH.ox} ${-SH.oy})`);
    const f = c.frame();
    // k = 0 이면 변환을 비운다(변환이 있으면 안쪽 큰 단계명의 position: fixed 기준이 li 로 바뀐다)
    steps.forEach((li, i) => {
      const st = PROCESS.stations[i];
      const q = shrunk(st, k);
      li.style.transform = k <= 0 ? "" : `translate(${((q.x - st.x) * f.u).toFixed(1)}px, ${((q.y - st.y) * f.u).toFixed(1)}px)`;
    });
    applyMove();
  };
  tl.fromTo(sh, { k: 0 }, { k: 1, duration: 15, onUpdate: applyShrink, onStart: applyShrink }, 170);
  env.cleanups.push(() => {
    group.removeAttribute("transform");
    steps.forEach((li) => (li.style.transform = ""));
  });
  draw(c, c.k("drop"), 185, 195);
  const ops = c.k("ops");
  fadeIn(c, ops, 188, 8);
  seq(c, c.all("opsBar"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 12, ease: "power2.out" }, 195, 5);
  text(c, "text-7.2", 175, 250);

  // 7.3 트래버스·막대·단계 라벨을 visibility 까지 끝낸다(2판: 흐린 선과 "검" 글자가 29 뒤로 비치던 결함)
  const gone = [trav, c.k("drop"), ops, ...steps.map((s) => s.lastElementChild as HTMLElement)];
  fadeOut(c, gone, 250, 14);
  c.at(265, (after) => gone.forEach((el) => ((el as HTMLElement).style.visibility = after ? "hidden" : "")));
  env.cleanups.push(() => gone.forEach((el) => ((el as HTMLElement).style.visibility = "")));

  // 측점이 29개 점으로 갈라져 네 묶음(5/6/7/11)의 띠가 된다. 오른쪽에 대형 29 가 차오른다
  const dots = c.all<SVGCircleElement>("dot");
  const band = dotPositions(facts.grades.map((g) => g.count));
  const origin5 = shrunk(PROCESS.stations[4], 1);
  const center = PROCESS.center;
  const sp = { t: 0 };
  const gather = { t: 0 };
  const placeDots = () => {
    dots.forEach((d, i) => {
      const delay = (i / dots.length) * 0.25;
      const t = easeOut((sp.t - delay) / 0.75);
      const b = band[i];
      const x0 = lerp(origin5.x, b.x, t);
      const y0 = lerp(origin5.y, b.y, t);
      const g = easeInOut(gather.t);
      setT(d, lerp(x0, center.x, g), lerp(y0, center.y, g));
    });
  };
  tl.fromTo(c.k("dots"), { opacity: 0 }, { opacity: 1, duration: 4 }, 254);
  tl.to(fix, { opacity: 0, duration: 8 }, 254);
  tl.fromTo(sp, { t: 0 }, { t: 1, duration: 55, onUpdate: placeDots, onStart: placeDots }, 256);
  tl.fromTo(c.k("groupLabels"), { opacity: 0 }, { opacity: 1, duration: 12 }, 306);
  const giant = c.k("giant");
  tl.fromTo(
    giant,
    // 끝 상태는 상자보다 조금 넓게(압출 두께·그림자가 잘리지 않게)
    { clipPath: "inset(100% -8% -14% -4%)", scale: 1.25, xPercent: -50, yPercent: -50, x: 0, y: 0 },
    { clipPath: "inset(-6% -8% -14% -4%)", scale: 1, duration: 40, ease: "power2.out" },
    280,
  );
  text(c, "text-7.3", 264, 372, 12, 12);

  // 전환: 29개 점이 화면 가운데 한 점으로 모이고 그 점에서 심야가 열린다
  tl.to([giant, c.k("groupLabels")], { opacity: 0, duration: 16 }, 360);
  tl.fromTo(gather, { t: 0 }, { t: 1, duration: 26, onUpdate: placeDots }, 360);
  circleOpen(c, 385, 420);
}
