// 5장 IT서비스·모빌리티: 원근 주행(5.1) → POI 관문 3개(5.2) → 반쯤 들린 시점의 지역 블록과 통계 카드(5.3)
// → 건물이 솟고 말로 찾아 픽업까지(5.4) → 폰에서 차로 경로 보내기, 운전연수 매칭(5.5) → 조감 상승, 도면이 열린다(5.6).
// 평면 상태(기울기·이동·배율·주행)는 한 객체로 들고 있어, 평면 밖 라벨·오버레이를 같은 값으로 투영한다.

import { MOB, clamp01, projectPlane, span, unprojectPlane, type PlaneState, type Pt } from "../geometry";
import { boxIn, chapter, circleOpen, draw, fadeIn, fadeOut, seq, setT, text, type Env, tilt } from "./core";

const SVGNS = "http://www.w3.org/2000/svg";

export function mobility(env: Env) {
  const c = chapter(env, "mobility", {
    onToggle: (active) => {
      plane.style.willChange = active ? "transform" : "";
    },
  });
  const { tl, stage } = c;
  const plane = c.k("plane");
  const world = c.k("world");

  // ── 평면 상태: 4.6 끝(기운 평면)에서 시작 ──
  const ps: PlaneState & { worldY: number; rz: number } = { rx: 62, rz: 0, y: 0, s: 1.3, worldY: 0 };
  const applyPlane = () => {
    plane.style.transform = `translate3d(0, ${ps.y.toFixed(2)}px, 0) rotateZ(${ps.rz.toFixed(3)}deg) rotateX(${ps.rx.toFixed(3)}deg) scale(${ps.s.toFixed(4)})`;
    world.style.transform = `translate3d(0, ${ps.worldY.toFixed(2)}px, 0)`;
  };
  const H12 = () => c.frame().h * 0.12;
  ps.y = H12();
  applyPlane();
  env.cleanups.push(() => {
    plane.style.transform = "";
    world.style.transform = "";
  });
  const P = (vars: Record<string, unknown>, at: number, duration: number, ease = "power2.inOut") =>
    tl.to(ps, { ...vars, duration, ease, onUpdate: applyPlane }, at);
  tl.fromTo(ps, { y: H12 }, { y: H12, duration: 1, onUpdate: applyPlane }, 0);

  // 5.1 원근 주행(꺾임에서 살짝 돌았다가 되돌아옴) + 5.2 까지 계속 다가온다
  tl.fromTo(ps, { worldY: 0 }, { worldY: () => MOB.drive * c.frame().u, duration: 190, ease: "none", onUpdate: applyPlane }, 0);
  P({ rz: -8 }, 30, 30, "power1.inOut");
  P({ rz: 0 }, 60, 35, "power1.inOut");
  draw(c, [c.k("route"), c.k("routeGlow")], 0, 110);
  text(c, "text-5.1", 10, 100);

  // 5.2 POI 마커가 서고, 관문 3개가 차례로 선다. 관문 ② 를 지난 마커는 검수 완료 색
  const flags = c.all("poi");
  seq(c, flags, { rotationX: 0 }, { rotationX: -62, duration: 10, ease: "power2.out" }, 100, 4);
  const gates = c.all("gate");
  const GATE_AT = [105, 130, 150];
  gates.forEach((g, i) => tl.fromTo(g, { rotationX: 0 }, { rotationX: -62, duration: 15, ease: "power2.out" }, GATE_AT[i]));
  // 관문 ② 를 지난 POI 마커는 검수 완료(회색 → 분야 색)
  flags
    .filter((f) => Number(f.dataset.y) < MOB.gates[1])
    .forEach((f, i) => c.at(145 + i * 4, (after) => (f.dataset.ok = after ? "true" : "false")));
  env.cleanups.push(() => flags.forEach((f) => (f.dataset.ok = "false")));
  const gateLabels = c.all("gateLabel");
  const pinLabel = c.k("pinLabel");
  const mapLabel = c.k("mapLabel");
  const place = (el: HTMLElement, pt: Pt, op: number) => {
    el.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px) translate(-50%, -100%)`;
    el.style.opacity = op.toFixed(3);
  };
  // 평면 밖 라벨: 선 관문·픽업 표지·건물의 화면 상자(getBoundingClientRect)를 읽어 윗변 가운데에 붙인다(3D 변환 결과 그대로).
  // 보이는 라벨이 있을 때만 읽고, 읽기를 모두 마친 뒤 쓴다(프레임마다 강제 레이아웃 한 번)
  const pinEl = c.k("pin");
  const bldEls = c.all("bld");
  const bTop = bldEls[3]?.querySelector<HTMLElement>('[data-k="bTop"]') ?? null;
  const hide = (el: HTMLElement) => {
    if (el.style.opacity !== "0") el.style.opacity = "0";
  };
  c.tick((p) => {
    const gOps = [0, 1, 2].map((i) => span(p, GATE_AT[i] + 8, GATE_AT[i] + 15) * (1 - span(p, 192, 202)));
    const pinOp = span(p, 362, 370) * (1 - span(p, 388, 396));
    const mapOp = bTop ? span(p, 322, 332) * (1 - span(p, 386, 394)) : 0;
    if (!gOps.some((o) => o > 0) && pinOp <= 0 && mapOp <= 0) {
      [...gateLabels.slice(0, 3), pinLabel, mapLabel].forEach(hide);
      return;
    }
    const f = c.frame();
    const sb = stage.getBoundingClientRect();
    const gr = gOps.map((o, i) => (o > 0 ? gates[i].getBoundingClientRect() : null));
    const pr = pinOp > 0 ? pinEl.getBoundingClientRect() : null;
    const mr = mapOp > 0 && bTop ? bTop.getBoundingClientRect() : null;
    const mw = mr ? mapLabel.offsetWidth : 0;
    gateLabels.slice(0, 3).forEach((el, i) => {
      const r = gr[i];
      if (!r) return hide(el);
      const lower = clamp01((r.bottom - sb.top - f.h / 2) / 40);
      place(el, { x: (r.left + r.right) / 2 - sb.left, y: r.top - sb.top - 8 }, gOps[i] * lower);
    });
    if (pr) place(pinLabel, { x: pr.right - sb.left + 30, y: pr.top - sb.top + 6 }, pinOp);
    else hide(pinLabel);
    // 오른쪽 88px(챕터 레일 자리)에 걸리지 않게
    if (mr) place(mapLabel, { x: Math.min(mr.right - sb.left, f.w - 96 - mw / 2), y: mr.top - sb.top - 6 }, mapOp);
    else hide(mapLabel);
  });
  env.cleanups.push(() => [...gateLabels, pinLabel, mapLabel].forEach((el) => ((el.style.transform = ""), (el.style.opacity = ""))));
  text(c, "text-5.2", 110, 200);

  // 5.3 반쯤 들린 시점, 통계 카드가 들어오고 평면 위 지역 블록이 카드 속 자기 줄과 이어진다
  P({ rx: 40 }, 200, 20);
  tl.to(flags, { rotationX: 0, duration: 14, ease: "power2.inOut" }, 200);
  tl.to(gates, { opacity: 0, duration: 10 }, 198);
  const stats = c.k("stats");
  fadeIn(c, stats, 215, 20, { x: 24 });
  const over = c.k<SVGSVGElement>("over");
  const blocksG = c.k<SVGGElement>("blocks");
  const linksG = c.k<SVGGElement>("links");
  const rowsEl = c.all("statRow");
  const blocks: SVGPolygonElement[] = [];
  const links: SVGPathElement[] = [];
  rowsEl.forEach(() => {
    const pg = document.createElementNS(SVGNS, "polygon");
    pg.setAttribute("fill", "var(--mob)");
    pg.setAttribute("fill-opacity", "0.1");
    pg.setAttribute("stroke", "var(--mob)");
    pg.setAttribute("stroke-width", "1.5");
    pg.style.opacity = "0";
    blocksG.appendChild(pg);
    blocks.push(pg);
    const ln = document.createElementNS(SVGNS, "path");
    ln.setAttribute("pathLength", "1");
    ln.style.opacity = "0";
    linksG.appendChild(ln);
    links.push(ln);
  });
  env.cleanups.push(() => {
    blocksG.replaceChildren();
    linksG.replaceChildren();
  });
  c.measure(() => {
    const f = c.frame();
    over.setAttribute("viewBox", `0 0 ${f.w.toFixed(0)} ${f.h.toFixed(0)}`);
    // 카드(프레임) 가로 범위와 캡션까지 포함한 아래 끝
    const fig = c.k("statsFrame");
    const sb = boxIn((fig.querySelector(".sf-frame") as HTMLElement | null) ?? fig, stage);
    const fb = boxIn(fig, stage);
    const st: PlaneState = { rx: 40, y: f.h * 0.12, s: 1.3, worldY: MOB.drive * f.u };
    // 지역 블록 자리: 통계 카드 아래 띠(문구 열·차량 화살표와 겹치지 않게), 카드 너비 안에 네 칸, 높이는 번갈아.
    // 연결선은 블록 윗변에서 카드 캡션 아래까지 곧게 올라간다(글자를 지나지 않게)
    const bottom = Math.max(sb.y + sb.h, fb.y + fb.h) + 10;
    const avail = Math.max(120, f.h - 70 - bottom);
    const FX = [0.18, 0.4, 0.6, 0.8];
    const FY = [0.55, 0.2, 0.6, 0.25];
    rowsEl.forEach((_, i) => {
      const tx = sb.x + sb.w * FX[i];
      const ty = bottom + 60 + (avail - 60) * FY[i];
      const L = unprojectPlane(tx, ty, st, f);
      const half = 40;
      const corners = [
        { x: L.x - half, y: L.y - half },
        { x: L.x + half, y: L.y - half },
        { x: L.x + half, y: L.y + half },
        { x: L.x - half, y: L.y + half },
      ].map((q) => projectPlane(q.x, q.y, st, f));
      blocks[i].setAttribute("points", corners.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" "));
      const top = projectPlane(L.x, L.y - half, st, f);
      links[i].setAttribute("d", `M${top.x.toFixed(1)} ${top.y.toFixed(1)} V${bottom.toFixed(1)}`);
    });
  });
  const segsByRow = rowsEl.map((row) => c.all("statSeg", row));
  rowsEl.forEach((_, i) => {
    const t = 228 + i * 8;
    tl.fromTo(blocks[i], { opacity: 0 }, { opacity: 1, duration: 6 }, t);
    draw(c, links[i], t + 2, t + 10);
    seq(c, segsByRow[i], { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 8, ease: "power2.out" }, t + 6, 1.5);
  });
  fadeOut(c, [...blocks, ...links], 282, 10);
  text(c, "text-5.3", 210, 290);

  // 5.4 카드가 빠지고 건물이 솟는다. 말로 찾고, 경로를 다시 세워 픽업까지
  fadeOut(c, stats, 290, 10, { x: 24 });
  P({ rx: 62 }, 290, 10);
  const bld = c.all("bld");
  bld.forEach((b, i) => {
    const hU = Number(getComputedStyle(b).getPropertyValue("--bh")) || 150;
    const top = b.querySelector<HTMLElement>('[data-k="bTop"]');
    const front = b.querySelector<HTMLElement>('[data-k="bFace"]');
    const side = b.querySelector<HTMLElement>('[data-k="bSide"]');
    const rightSide = b.dataset.side === "right";
    const t = 300 + i * 5;
    if (top) tl.fromTo(top, { z: 0, opacity: 0 }, { z: () => hU * c.frame().u, opacity: 1, duration: 14, ease: "power2.out" }, t);
    if (front) tl.fromTo(front, { rotationX: -90, scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 14, ease: "power2.out" }, t);
    if (side)
      tl.fromTo(
        side,
        { rotationY: rightSide ? -90 : 90, scaleX: 0, transformOrigin: rightSide ? "0% 50%" : "100% 50%" },
        { scaleX: 1, duration: 14, ease: "power2.out" },
        t,
      );
    tl.fromTo(b, { "--lot": 0 }, { "--lot": 1, duration: 10 }, t);
    tl.to(b, { "--lot": 0, duration: 10 }, 392);
    if (top) tl.to(top, { z: 0, opacity: 0, duration: 12, ease: "power2.in" }, 390);
    if (front) tl.to(front, { scaleY: 0, duration: 12, ease: "power2.in" }, 390);
    if (side) tl.to(side, { scaleX: 0, duration: 12, ease: "power2.in" }, 390);
  });
  const bubble = c.k("bubble");
  fadeIn(c, bubble, 330, 12, { y: 8 });
  fadeOut(c, bubble, 390, 8);
  const routeMain = c.k("routeMain");
  tl.to(routeMain, { opacity: 0.3, duration: 7 }, 345);
  tl.to(routeMain, { opacity: 1, duration: 10 }, 392);
  const dash = c.k("replanDash");
  fadeIn(c, dash, 345, 7);
  draw(c, c.k("replan"), 352, 370);
  fadeOut(c, [dash, c.k("replan")], 390, 10);
  const pin = c.k("pin");
  tl.fromTo(pin, { rotationX: 0, opacity: 0 }, { rotationX: -62, opacity: 1, duration: 10, ease: "power2.out" }, 360);
  tl.to(pin, { rotationX: 0, opacity: 0, duration: 10 }, 390);
  text(c, "text-5.4", 300, 390);

  // 5.5 차 밖까지 잇는 앱: 폰 화면 3장, 폰에서 차로 경로, 운전연수 매칭 세 단계
  P({ rx: 52 }, 390, 15);
  const app = c.k("carApp");
  fadeIn(c, app, 400, 15, { y: 16 });
  const scr = c.all("appScr");
  tl.set(scr[0], { clipPath: "inset(0% 0% 0% 0%)" }, 0);
  tl.fromTo(scr[1], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 6, ease: "power2.inOut" }, 430);
  tl.fromTo(scr[2], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 6, ease: "power2.inOut" }, 455);
  const sendPath = c.k<SVGPathElement>("sendPath");
  const sendDot = c.k<SVGCircleElement>("sendDot");
  const map = c.k("appMap");
  c.measure(() => {
    const f = c.frame();
    const mb = boxIn(map, stage);
    const a = { x: mb.x + mb.w * 0.84, y: mb.y + mb.h * 0.3 };
    const car = { x: f.ox + 800 * f.u, y: f.oy + 772 * f.u };
    sendPath.setAttribute("d", `M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${(a.x + 60).toFixed(1)} ${(a.y + 120).toFixed(1)} ${(car.x + 40).toFixed(1)} ${(car.y - 140).toFixed(1)} ${car.x.toFixed(1)} ${car.y.toFixed(1)}`);
    sendPath.setAttribute("pathLength", "1");
  });
  tl.fromTo(sendPath, { opacity: 0, strokeDasharray: 1, strokeDashoffset: 1.002 }, { opacity: 1, duration: 1, autoRound: false }, 430);
  tl.fromTo(sendPath, { strokeDashoffset: 1.002 }, { strokeDashoffset: 0, duration: 16, immediateRender: false, autoRound: false }, 430);
  const dotAt = { t: 0 };
  const moveDot = () => {
    const len = sendPath.getTotalLength();
    if (!len) return;
    const pt = sendPath.getPointAtLength(len * dotAt.t);
    sendDot.setAttribute("cx", pt.x.toFixed(1));
    sendDot.setAttribute("cy", pt.y.toFixed(1));
  };
  tl.fromTo(sendDot, { opacity: 0 }, { opacity: 1, duration: 2 }, 435);
  tl.fromTo(dotAt, { t: 0 }, { t: 1, duration: 15, ease: "power1.inOut", onUpdate: moveDot, onStart: moveDot }, 435);
  tl.to(sendDot, { opacity: 0, duration: 3 }, 450);
  const car = c.k<SVGGElement>("car");
  const pulse = { s: 1 };
  const applyCar = (y = 790) => setT(car, 800, y, ` scale(${pulse.s.toFixed(3)})`);
  tl.fromTo(pulse, { s: 1 }, { s: 1.28, duration: 4, ease: "power2.out", onUpdate: () => applyCar() }, 449);
  tl.to(pulse, { s: 1, duration: 6, ease: "power2.in", onUpdate: () => applyCar() }, 453);
  fadeOut(c, [sendPath], 490, 6);
  const lesson = c.k("lesson");
  fadeIn(c, lesson, 455, 10, { x: 16 });
  c.all("lessonStep").forEach((el, i) => c.at(460 + i * 8, (after) => (el.dataset.on = after ? "true" : "false")));
  text(c, "text-5.5", 400, 490);
  // 통계 카드·차량 앱 폰을 장면 동안 원근으로 살짝 돌린다
  tilt(c, c.k("statsFrame").querySelector(".sf-frame"), 215, 290);
  tilt(c, c.k("carPhone").querySelector(".phone"), 400, 490);

  // 5.6 조감 상승: 폰·카드가 빠지고 평면이 평평해지며 차량 화살표가 측점으로. 도면이 측점에서 열린다
  fadeOut(c, app, 490, 10);
  P({ rx: 0, y: 0, s: 0.8 }, 500, 30, "power3.inOut");
  const cm = { y: 790 };
  tl.fromTo(cm, { y: 790 }, { y: 700, duration: 30, ease: "power2.inOut", onUpdate: () => applyCar(cm.y) }, 500);
  tl.to(car, { opacity: 0, duration: 10 }, 522);
  const fix = c.k<SVGGElement>("fix");
  tl.fromTo(fix, { opacity: 0 }, { opacity: 1, duration: 10 }, 522);
  text(c, "text-5.6", 495, 540, 12, 10);
  circleOpen(c, 530, 560);
}
