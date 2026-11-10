// 4장 디지털금융: 레일과 다섯 업종(4.1) → 시간 비례 레일·기간 막대·패킷(4.2) → 세 갈래가 한 줄로, 폰 화면 3장(4.3)
// → 패널 3개와 상담 토큰(4.4) → 막대 자리에서 떠오르는 창 3장(4.5) → 카버스 차 기호가 차량 화살표로, 레일 평면이 기울어 도로(4.6).

import { FIN, clamp01, lerp, span, type Pt } from "../geometry";
import { createPacketEngine } from "../signal/packets";
import { boxIn, chapter, draw, fadeIn, fadeOut, firstText, seq, setT, text, type Env, tilt } from "./core";

export function finance(env: Env) {
  const c = chapter(env, "finance", {
    onToggle: (active) => {
      plane.style.willChange = active ? "transform" : "";
    },
  });
  const { tl, stage } = c;
  const plane = c.k("plane");

  // ── 측정(새로고침마다): 시간 축 상자, 창 FLIP, 토큰 경로, 차량 기호 ──
  const timeline = c.k("timeline");
  const stations = c.k("stations");
  const geo = {
    axisL: 0,
    axisW: 1,
    railUp: 0,
    railDown: 0,
    axisLU: (FIN.split + 80) as number,
    forkU: FIN.split as number,
    win: [] as { dx: number; dy: number }[],
    token: [] as Pt[],
    glyph: { x: 0, y: 0 },
    car: { x: 0, y: 0 },
  };
  const wins = c.all("win");
  const row = c.k("consultRow");
  const tokenEl = c.k("token");
  const glyph = c.k("carGlyph");
  const carSlot = c.k("carSlot");
  const railUp = c.k<SVGPathElement>("railUp");
  const railDown = c.k<SVGPathElement>("railDown");
  const incoming = c.k<SVGPathElement>("incoming");
  const carFloat = c.k("carFloat");
  c.measure(() => {
    const f = c.frame();
    const tb = boxIn(timeline, stage);
    geo.axisL = tb.x;
    geo.axisW = Math.max(1, tb.w);
    geo.railUp = f.oy + FIN.upper * f.u;
    geo.railDown = f.oy + FIN.lower * f.u;
    const sb = boxIn(stations, stage);
    geo.axisLU = (sb.x - f.ox) / f.u;
    // 두 레일이 갈라지는 자리 = 6열 시작(오버레이는 그 뒤 64px 에서 시작한다)
    geo.forkU = (sb.x - 64 - f.ox) / f.u;
    const k0 = geo.forkU.toFixed(1);
    railUp.setAttribute("d", `M${k0} ${FIN.inY} L${(geo.forkU + 44).toFixed(1)} ${FIN.upper} H1800`);
    railDown.setAttribute("d", `M${k0} ${FIN.inY} L${(geo.forkU + 60).toFixed(1)} ${FIN.lower} H1800`);
    incoming.setAttribute("d", `M${FIN.inX} ${FIN.inY} H${k0}`);
    geo.win = wins.map((w) => {
      const b = boxIn(w, stage);
      const year = Number(w.dataset.bar);
      const bx = geo.axisL + ((year - 2017) / 10) * geo.axisW;
      return { dx: bx - (b.x + b.w / 2), dy: geo.railUp - b.y };
    });
    const center = (el: HTMLElement) => {
      const b = boxIn(el, row);
      return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    };
    // 토큰 길: 타일 → 칩 → (칩 높이로 옆으로) → 검색 칸 돋보기 → 단계 3개. 패널 제목 글자를 지나지 않게 칩 줄 높이로 돌아간다
    // 칩 바로 아래 틈(칩과 패널 사이 16px)으로 지나 칩 글자도 덮지 않는다
    const chip = boxIn(c.k("aoai"), row);
    const aoai = { x: chip.x + chip.w / 2, y: chip.y + chip.h + 8 };
    const lens = center((c.k("search").querySelector("i") as HTMLElement | null) ?? c.k("search"));
    // 패널 ②와 ③ 사이 틈으로 내려와 돋보기로 들어간다(좁은 폭에서 제목이 돋보기 위까지 길어도 지나지 않게)
    const pn = c.all("panel").map((el) => boxIn(el, row));
    const gapX = pn.length > 2 ? (pn[1].x + pn[1].w + pn[2].x) / 2 : lens.x;
    geo.token = [center(c.k("tileOn")), aoai, { x: gapX, y: aoai.y }, { x: gapX, y: lens.y }, lens, ...c.all("aiStep").map(center)];
    const gb = boxIn(carSlot, stage);
    geo.glyph = { x: gb.x, y: gb.y };
    geo.car = { x: f.ox + FIN.car.x * f.u, y: f.oy + FIN.car.y * f.u };
  });

  // ── 패킷(4.2 루프, 4.5 에서 다시): 시간 축 사각 순환로 ──
  const packets = createPacketEngine(c.k<HTMLCanvasElement>("packets"), stage, () => [
    { x: geo.axisL, y: geo.railUp },
    { x: geo.axisL + geo.axisW, y: geo.railUp },
    { x: geo.axisL + geo.axisW, y: geo.railDown },
    { x: geo.axisL, y: geo.railDown },
    { x: geo.axisL, y: geo.railUp },
  ]);
  env.cleanups.push(() => packets.destroy());
  env.ScrollTrigger.addEventListener("refresh", packets.relayout);
  env.cleanups.push(() => env.ScrollTrigger.removeEventListener("refresh", packets.relayout));
  const countAt = (p: number) => {
    if (p < 100) return 0;
    if (p < 200) return lerp(6, 24, (p - 100) / 100);
    if (p < 212) return lerp(24, 0, (p - 200) / 12);
    if (p < 400) return 0;
    if (p < 415) return lerp(0, 24, (p - 400) / 15);
    if (p < 490) return 24;
    if (p < 503) return lerp(24, 0, (p - 490) / 13);
    return 0;
  };
  c.tick((p) => {
    packets.setCount(countAt(p));
    packets.poke();
  });

  // ── 4.1 레일과 다섯 업종 ──
  const fix = c.k<SVGGElement>("fix");
  const fx = { t: 0 };
  const placeFix = () => {
    const t = fx.t;
    // (480, 386) → (700, 386) → 시간 축 왼쪽 끝(위 레일)
    if (t < 0.5) setT(fix, lerp(FIN.inX, geo.forkU, t / 0.5), FIN.inY);
    else {
      const k = (t - 0.5) / 0.5;
      setT(fix, lerp(geo.forkU, geo.axisLU, k), lerp(FIN.inY, FIN.upper, Math.min(1, k * 2.4)));
    }
  };
  tl.fromTo(fx, { t: 0 }, { t: 1, duration: 34, ease: "power2.inOut", onUpdate: placeFix, onStart: placeFix }, 2);
  draw(c, [c.k("railUp"), c.k("railDown")], 6, 40);
  tl.to(c.k("incoming"), { opacity: 0, duration: 16 }, 18);
  fadeIn(c, stations, 20, 8);
  const st = c.all("finStation");
  seq(c, st, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 8, ease: "power2.out" }, 24, 5);
  const railNames = c.all("railName");
  fadeIn(c, railNames, 30, 10);
  firstText(c, "text-4.1", 100);

  // ── 4.2 2017년부터 이어 온 사업: 역이 비켜나고 시간 축이 선다. 측점이 시간 커서가 되어 막대를 세운다 ──
  fadeOut(c, stations, 100, 14);
  fadeIn(c, timeline, 100, 14);
  tl.to(fix, { opacity: 0, duration: 6 }, 116);
  const cursor = c.k("finCursor");
  tl.fromTo(cursor, { opacity: 0 }, { opacity: 1, duration: 6 }, 116);
  tl.fromTo(cursor, { x: 0 }, { x: () => geo.axisW, duration: 54, ease: "none" }, 118);
  tl.to(cursor, { opacity: 0, duration: 8 }, 196);
  const items = [...c.all("finUp"), ...c.all("finDown")].map((el) => ({
    el,
    s: Number(el.dataset.s),
    e: Number(el.dataset.e),
    last: -1,
  }));
  const labels = c.all("finLabel").map((el) => ({ el, s: Number(el.dataset.s), last: -1 }));
  c.tick((p) => {
    const t = clamp01((p - 118) / 54) * 1.01;
    for (const it of items) {
      const v = it.e > it.s ? clamp01((t - it.s) / (it.e - it.s)) : t >= it.s ? 1 : 0;
      const q = Math.round(v * 200) / 200;
      if (q !== it.last) {
        it.last = q;
        it.el.style.transform = it.e > it.s ? `scaleX(${q})` : `scale(${q})`;
      }
    }
    const hide = 1 - span(p, 398, 408);
    for (const lb of labels) {
      const v = Math.round(clamp01((t - lb.s) / 0.03) * hide * 100) / 100;
      if (v !== lb.last) {
        lb.last = v;
        lb.el.style.opacity = String(v);
      }
    }
  });
  env.cleanups.push(() => {
    items.forEach((it) => (it.el.style.transform = ""));
    labels.forEach((lb) => (lb.el.style.opacity = ""));
  });
  text(c, "text-4.2", 110, 200);

  // ── 4.3 대출을 고르고 신청하기까지 ──
  fadeOut(c, timeline, 200, 12);
  const rails = c.k("rails");
  tl.to(rails, { opacity: 0, duration: 12 }, 200);
  const loan = c.k("loan");
  fadeIn(c, loan, 205, 10, { x: 24 });
  const paths = c.all("loanPath");
  paths.forEach((pth) => draw(c, pth, 215, 235));
  const branches = c.all("loanBranch");
  const rects = branches.map((g) => Array.from(g.querySelectorAll("rect")));
  seq(c, rects.flat(), { opacity: 0 }, { opacity: 1, duration: 6 }, 219, 0.8);
  const loanLabels = c.all("loanLabel");
  tl.fromTo(loanLabels, { opacity: 0 }, { opacity: 1, duration: 8 }, 217);
  tl.fromTo(branches[0], { y: 0 }, { y: 110, duration: 25, ease: "power2.inOut" }, 235);
  tl.fromTo(branches[2], { y: 0 }, { y: -110, duration: 25, ease: "power2.inOut" }, 235);
  tl.to(loanLabels, { opacity: 0, duration: 8 }, 235);
  fadeIn(c, c.k("onePass"), 252, 8);
  const scr = c.all("loanScr");
  tl.set(scr[0], { clipPath: "inset(0% 0% 0% 0%)" }, 0);
  tl.fromTo(scr[1], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 6, ease: "power2.inOut" }, 265);
  tl.fromTo(scr[2], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 6, ease: "power2.inOut" }, 278);
  const now = c.all("loanNow");
  tl.fromTo(now[0], { opacity: 0 }, { opacity: 1, duration: 6 }, 250);
  tl.to(now[0], { opacity: 0, duration: 4 }, 264);
  tl.fromTo(now[1], { opacity: 0 }, { opacity: 1, duration: 4 }, 266);
  tl.to(now[1], { opacity: 0, duration: 4 }, 277);
  tl.fromTo(now[2], { opacity: 0 }, { opacity: 1, duration: 4 }, 279);
  text(c, "text-4.3", 210, 300);

  // ── 4.4 AI 고객센터와 셀프서비스: 패널 3개, 상담 토큰이 타일 → Azure OpenAI → 검색 → 단계 ──
  fadeOut(c, loan, 300, 12, { x: -30 });
  const consult = c.k("consult");
  fadeIn(c, consult, 305, 8);
  seq(c, c.all("panel"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 9, ease: "power2.out" }, 305, 4);
  fadeIn(c, c.k("aoai"), 314, 6);
  const tile = c.k("tileOn");
  c.at(330, (after) => (tile.dataset.lit = after ? "true" : "false"));
  const answer = c.k("answer");
  tl.fromTo(answer, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 6 }, 350);
  c.all("aiStep").forEach((el, i) => {
    const chip = el.firstElementChild as HTMLElement | null;
    if (!chip) return;
    const orig = chip.dataset.s ?? "";
    c.at(360 + i * 10, (after) => (chip.dataset.s = after ? orig : "off"));
  });
  tl.fromTo(tokenEl, { opacity: 0 }, { opacity: 1, duration: 4 }, 320);
  tl.to(tokenEl, { opacity: 0, duration: 5 }, 388);
  const SEG = [
    [320, 335],
    [335, 342],
    [342, 347],
    [347, 351],
    [351, 355],
    [355, 365],
    [365, 375],
    [375, 385],
  ];
  const moveToken = (p: number) => {
    const pts = geo.token;
    if (pts.length < SEG.length) return;
    let x = pts[0].x;
    let y = pts[0].y;
    for (let i = 1; i < SEG.length; i++) {
      const [a, b] = SEG[i];
      if (p >= a) {
        const k = clamp01((p - a) / (b - a));
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        x = lerp(pts[i - 1].x, pts[i].x, e);
        y = lerp(pts[i - 1].y, pts[i].y, e);
      }
    }
    tokenEl.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  c.tick((p) => {
    if (p >= 318 && p <= 395) moveToken(p);
  });
  env.cleanups.push(() => (tokenEl.style.transform = ""));
  text(c, "text-4.4", 310, 400);
  // 대출 폰·상담 패널 줄을 장면 동안 원근으로 살짝 돌린다
  tilt(c, c.k("loanPhone").querySelector(".phone"), 205, 300);
  tilt(c, row, 305, 400, -8, 4);

  // ── 4.5 영업 포털, 오토금융, 디지털브랜치: 레일이 돌아오고, 막대 자리에서 창 3장이 떠오른다 ──
  fadeOut(c, consult, 400, 12);
  tl.to(rails, { opacity: 1, duration: 15 }, 400);
  tl.to(timeline, { opacity: 1, duration: 15 }, 400);
  const windows = c.k("windows");
  tl.set(windows, { opacity: 1 }, 414);
  wins.forEach((w, i) => {
    tl.fromTo(
      w,
      { x: () => geo.win[i]?.dx ?? 0, y: () => geo.win[i]?.dy ?? 0, scale: 0.6, opacity: 0, transformOrigin: "50% 0%" },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 12, ease: "power3.out" },
      415 + i * 13,
    );
  });
  c.all("branchLine").forEach((l, i) => draw(c, l, 455 + i * 2, 467 + i * 2));
  text(c, "text-4.5", 410, 490);

  // ── 4.6 창 두 장은 제 막대로 접히고, 카버스 차 기호만 남아 차량 화살표가 된다. 레일 평면이 기울어 도로 ──
  [1, 2].forEach((i) => {
    tl.to(wins[i], { x: () => geo.win[i]?.dx ?? 0, y: () => geo.win[i]?.dy ?? 0, scale: 0.6, opacity: 0, duration: 14, ease: "power2.in" }, 490);
  });
  tl.to(wins[0], { opacity: 0, duration: 10 }, 496);
  tl.to(timeline, { opacity: 0, duration: 10 }, 490);
  tl.set(glyph, { opacity: 0 }, 495);
  tl.fromTo(carFloat, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 495);
  tl.fromTo(
    carFloat,
    { x: () => geo.glyph.x, y: () => geo.glyph.y, scale: 1 },
    { x: () => geo.car.x - 24, y: () => geo.car.y - 24, scale: 0.8, duration: 25, ease: "power2.inOut", immediateRender: false },
    505,
  );
  tl.to(carFloat, { opacity: 0, duration: 8 }, 522);
  const car = c.k<SVGGElement>("car");
  tl.fromTo(car, { opacity: 0 }, { opacity: 1, duration: 10 }, 520);

  const ps = { rx: 0, y: 0, s: 1 };
  const applyPlane = () => {
    plane.style.transform = `translate3d(0, ${ps.y.toFixed(2)}px, 0) rotateX(${ps.rx.toFixed(3)}deg) scale(${ps.s.toFixed(4)})`;
  };
  tl.fromTo(
    ps,
    { rx: 0, y: 0, s: 1 },
    { rx: 62, y: () => c.frame().h * 0.12, s: 1.3, duration: 50, ease: "power3.inOut", onUpdate: applyPlane, onStart: applyPlane },
    505,
  );
  applyPlane();
  env.cleanups.push(() => (plane.style.transform = ""));
  fadeIn(c, c.k("grid"), 505, 50);
  tl.to(rails, { opacity: 0, duration: 25 }, 530);
  fadeIn(c, c.k("haze"), 520, 40);
  text(c, "text-4.6", 490, 555, 10, 10);
}
