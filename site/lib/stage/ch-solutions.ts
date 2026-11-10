// 6장 솔루션: 6.1 타일 4개 → 6.2 AcTrack 타일이 화면 예시 프레임으로 커진다(FLIP) → 솔루션마다 화면 안 연출(단말 이동,
// 목록 줄, KPI 정수 트윈, 막대) → 6.6 비교표(특허 태그 연결선, 이어지는 곳) → 표의 행 선이 한 줄로 접혀 7.1 트래버스로.

import { PROCESS, SCR, clamp01, cumulative, easeInOut, pointAt, span } from "../geometry";
import { boxIn, chapter, draw, fadeIn, fadeOut, firstText, seq, setT, text, type Env, tilt } from "./core";

const SVGNS = "http://www.w3.org/2000/svg";
const IDS = ["actrack", "cacago", "zonecast", "rental"] as const;
const A = [80, 190, 290, 410];
const B = [190, 290, 410, 520];

export function solutions(env: Env) {
  const c = chapter(env, "solutions");
  const { tl, stage } = c;

  // ── 측정 ──
  const tiles = c.all("tile");
  const tilesWrap = c.k("tiles");
  const solFix = c.k("solFix");
  const shots = IDS.map((id) => c.k(`shot-${id}`));
  const frames = IDS.map((id) => c.k(`frame-${id}`));
  const table = c.k("solTable");
  const rows = c.all("solRow");
  const over = c.k<SVGSVGElement>("solOver");
  const patG = c.k<SVGGElement>("patLines");
  const linkG = c.k<SVGGElement>("linkLines");
  const tags = c.all("patTag");
  const geo = {
    fixStart: { x: 0, y: 0 },
    tileOrigin: { x: 0, y: 0 },
    tileCenter: { x: 0, y: 0 },
    glyph: { x: 0, y: 0 },
    flip: { x: 0, y: 0, s: 1 },
    shrink: { x: 0, y: 0, s: 1 },
    rowBottoms: [] as number[],
    tableL: 0,
    tableR: 0,
    foldY: 0,
  };
  const pat = tags.map(() => {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("pathLength", "1");
    p.style.opacity = "0";
    patG.appendChild(p);
    return p;
  });
  const linkPaths = [0, 1].map(() => {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("pathLength", "1");
    p.style.opacity = "0";
    linkG.appendChild(p);
    return p;
  });
  const foldLines = [0, 1, 2, 3].map(() => {
    const l = document.createElementNS(SVGNS, "line");
    l.setAttribute("stroke", "var(--ink-3)");
    l.setAttribute("stroke-width", "1");
    l.style.opacity = "0";
    over.appendChild(l);
    return l;
  });
  env.cleanups.push(() => {
    patG.replaceChildren();
    linkG.replaceChildren();
    foldLines.forEach((l) => l.remove());
  });

  c.measure(() => {
    const f = c.frame();
    over.setAttribute("viewBox", `0 0 ${f.w.toFixed(0)} ${f.h.toFixed(0)}`);
    geo.fixStart = { x: f.ox + 800 * f.u, y: f.oy + 700 * f.u };
    const tw = boxIn(tilesWrap, stage);
    geo.tileOrigin = { x: tw.x, y: tw.y };
    const t0 = boxIn(tiles[0], stage);
    const t3 = boxIn(tiles[3], stage);
    geo.tileCenter = { x: (t0.x + t3.x + t3.w) / 2, y: (t0.y + t3.y + t3.h) / 2 };
    const gl = c.all("tileGlyph")[0];
    const gb = boxIn(gl, stage);
    geo.glyph = { x: gb.x + gb.w * 0.7, y: gb.y + gb.h * 0.3 };
    // 6.2 FLIP: AcTrack 타일 상자 → 프레임 상자
    const fb = boxIn(frames[0], stage);
    const s = t0.w / fb.w;
    geo.flip = { x: t0.x + t0.w / 2 - (fb.x + fb.w / 2), y: t0.y + t0.h / 2 - (fb.y + fb.h / 2), s };
    // 6.6 FLIP: Rental 프레임 → Rental 행 썸네일
    const rThumb = rows[3]?.querySelector<HTMLElement>("th span > span");
    const rb = boxIn(frames[3], stage);
    if (rThumb) {
      const tb = boxIn(rThumb, stage);
      geo.shrink = { x: tb.x + tb.w / 2 - (rb.x + rb.w / 2), y: tb.y + tb.h / 2 - (rb.y + rb.h / 2), s: tb.w / rb.w };
    }
    // 특허 태그 → 근거 칸 연결선
    tags.forEach((tag, i) => {
      const row = rows.find((r) => r.dataset.id === tag.dataset.row);
      const cell = row?.querySelector<HTMLElement>('[data-k="evCell"]');
      if (!cell) return;
      const a = boxIn(tag, stage);
      const b = boxIn(cell, stage);
      const x0 = a.x + a.w / 2;
      const y0 = a.y + a.h;
      const x1 = b.x + 10;
      const y1 = b.y + b.h / 2;
      const xv = x1 - 16 - i * 8; // 두 선이 같은 세로줄에 겹치지 않게
      pat[i].setAttribute("d", `M${x0.toFixed(1)} ${y0.toFixed(1)} V${(y0 + 14 + i * 8).toFixed(1)} H${xv.toFixed(1)} V${y1.toFixed(1)} H${x1.toFixed(1)}`);
    });
    // AcTrack 행의 이어지는 곳 → Cacago 행, Smart Rental 행(글자 끝 오른쪽 괄호선, 챕터 레일 자리까지 가지 않게)
    const lc = rows[0]?.querySelector<HTMLElement>('[data-k="linkCell"]');
    const textEnd = (cell: HTMLElement) => {
      const b = boxIn(cell, stage);
      const r = document.createRange();
      r.selectNodeContents(cell);
      const w = r.getBoundingClientRect().width;
      return { x: b.x + (parseFloat(getComputedStyle(cell).paddingLeft) || 0) + w, y: b.y + b.h / 2 };
    };
    if (lc) {
      const a = textEnd(lc);
      const ends = [1, 3].map((ri) => {
        const cell = rows[ri]?.querySelector<HTMLElement>('[data-k="linkCell"]');
        return cell ? textEnd(cell) : null;
      });
      const xr = Math.max(a.x, ...ends.map((e) => (e ? e.x : 0))) + 16;
      ends.forEach((b, j) => {
        if (!b) return;
        linkPaths[j].setAttribute("d", `M${(a.x + 6).toFixed(1)} ${a.y.toFixed(1)} H${(xr + j * 10).toFixed(1)} V${b.y.toFixed(1)} H${(b.x + 6).toFixed(1)}`);
      });
    }
    // 표 행 선(접힘용 사본)
    const tbx = boxIn(table, stage);
    geo.tableL = tbx.x;
    geo.tableR = tbx.x + tbx.w;
    geo.foldY = f.oy + PROCESS.foldY * f.u;
    rows.forEach((r, i) => {
      const b = boxIn(r, stage);
      const y = b.y + b.h;
      geo.rowBottoms[i] = y;
      const l = foldLines[i];
      l.setAttribute("x1", geo.tableL.toFixed(1));
      l.setAttribute("x2", geo.tableR.toFixed(1));
      l.setAttribute("y1", y.toFixed(1));
      l.setAttribute("y2", y.toFixed(1));
    });
  });

  // ── 6.1 솔루션 4종 한눈에 ──
  firstText(c, "text-6.1", 80);
  fadeIn(c, tilesWrap, 2, 6);
  seq(c, tiles, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 12, ease: "power2.out" }, 8, 6);
  const fx = { t: 0, g: 0 };
  // solFix 는 타일 상자 안 절대 위치라, 스테이지 좌표에서 상자 원점을 뺀다
  const placeFix = () => {
    const a = geo.fixStart;
    const m = geo.tileCenter;
    const g = geo.glyph;
    const e1 = easeInOut(fx.t);
    const e2 = easeInOut(fx.g);
    const x = a.x + (m.x - a.x) * e1 + (g.x - m.x) * e2 - geo.tileOrigin.x;
    const y = a.y + (m.y - a.y) * e1 + (g.y - m.y) * e2 - geo.tileOrigin.y;
    solFix.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  tl.fromTo(fx, { t: 0 }, { t: 1, duration: 22, onUpdate: placeFix, onStart: placeFix }, 6);
  tl.fromTo(fx, { g: 0 }, { g: 1, duration: 20, onUpdate: placeFix, immediateRender: false }, 50);
  tl.fromTo(solFix, { opacity: 1 }, { opacity: 0, duration: 8 }, 86);
  env.cleanups.push(() => (solFix.style.transform = ""));

  // ── 6.2~6.5 이름 교대, 문구, 화면 교대 ──
  const legend = c.k("legend");
  const legendItems = c.all("legendItem");
  fadeIn(c, legend, 92, 8);
  fadeOut(c, legend, 515, 8);
  c.tick((p) => {
    const idx = p < 190 ? 0 : p < 290 ? 1 : p < 410 ? 2 : 3;
    legendItems.forEach((el, i) => {
      const v = i === idx ? "true" : "false";
      if (el.dataset.on !== v) el.dataset.on = v;
    });
  });
  IDS.forEach((_, i) => {
    const t = c.k(["text-6.2", "text-6.3", "text-6.4", "text-6.5"][i]);
    const name = t.querySelector<HTMLElement>('[data-k="solName"]');
    const rest = Array.from(t.children).filter((el) => el !== name);
    tl.set(t, { opacity: 1 }, A[i]);
    if (name) {
      tl.fromTo(name, { clipPath: "inset(100% 0% 0% 0%)", yPercent: 0 }, { clipPath: "inset(0% 0% 0% 0%)", duration: 12, ease: "power2.out" }, A[i]);
      if (i < 3) tl.to(name, { clipPath: "inset(0% 0% 100% 0%)", yPercent: -12, duration: 10, ease: "power1.in" }, B[i] - 2);
      else tl.to(name, { opacity: 0, duration: 10 }, 520);
    }
    seq(c, rest, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, A[i] + (i === 0 ? 20 : 12), 1.5);
    tl.to(rest, { opacity: 0, y: -8, duration: 8, ease: "power1.in" }, B[i] - 8);
    tl.set(t, { opacity: 0 }, B[i] + 10);
  });

  // 화면 교대: 새 화면이 위에서 들어오고(앞 화면은 그대로), 들어온 뒤 앞 화면을 숨긴다
  tl.fromTo(shots[0], { opacity: 0 }, { opacity: 1, duration: 4 }, 80);
  tl.fromTo(
    frames[0],
    { x: () => geo.flip.x, y: () => geo.flip.y, scale: () => geo.flip.s, transformOrigin: "50% 50%" },
    { x: 0, y: 0, scale: 1, duration: 20, ease: "power3.inOut" },
    80,
  );
  tl.to(tiles, { opacity: 0, duration: 10 }, 80);
  fadeOut(c, tilesWrap, 92, 8);
  for (let i = 1; i < 4; i++) {
    tl.fromTo(shots[i], { opacity: 0 }, { opacity: 1, duration: 12, ease: "power1.inOut" }, A[i]);
    tl.set(shots[i - 1], { opacity: 0 }, A[i] + 13);
  }

  // ── AcTrack: 단말이 궤적을 따라 움직이고, 진입 감지·존 이탈 알림 ──
  const devs = c.all<SVGGElement>("actDev");
  const trails = SCR.act.trails.map((pts) => ({ pts, r: cumulative(pts).ratios }));
  c.tick((p) => {
    const t = span(p, 100, 175);
    devs.forEach((d, i) => {
      const tr = trails[i];
      const q = pointAt(tr.pts, easeInOut(clamp01(t * (i === 2 ? 1.1 : 1))), tr.r);
      setT(d, q.x, q.y);
    });
  });
  env.cleanups.push(() => devs.forEach((d, i) => { const e = SCR.act.trails[i].at(-1)!; setT(d, e.x, e.y); }));
  tl.fromTo(c.all("actTrail"), { opacity: 0 }, { opacity: 1, duration: 10 }, 100);
  const actRows = c.all("actRow");
  fadeIn(c, actRows[0], 125, 6, { y: 6 });
  fadeIn(c, actRows[1], 150, 6, { y: 6 });
  c.count(c.q("kpiOut"), 1, 2, 149, 152);
  c.count(c.q("kpiMove"), 16, 18, 148, 156);

  // ── Cacago: 경로가 그려지고 차량 3대가 달린다. 상태가 바뀌고 오늘의 지표·주간 배차량이 찬다 ──
  draw(c, c.k("cacRoute"), 205, 240);
  const cars = c.all<SVGGElement>("cacCar");
  const route = SCR.cac.stops;
  const rr = cumulative(route).ratios;
  c.tick((p) => {
    const t = span(p, 215, 270);
    const pos = [0.26 + 0.74 * t, 0.2 + 0.45 * t, 0.08 + 0.22 * t];
    cars.forEach((car, i) => {
      const q = pointAt(route, clamp01(pos[i]), rr);
      setT(car, q.x, q.y);
    });
  });
  env.cleanups.push(() => cars.forEach((car, i) => {
    const q = pointAt(route, [1, 0.65, 0.3][i], rr);
    setT(car, q.x, q.y);
  }));
  const cac2 = c.k("cac2");
  const cac3 = c.k("cac3");
  c.at(230, (after) => (after ? cac2.removeAttribute("data-i") : cac2.setAttribute("data-i", "0")));
  c.at(250, (after) => (after ? cac3.removeAttribute("data-i") : cac3.setAttribute("data-i", "0")));
  c.count(c.q("cacK1"), 0, 12, 215, 265);
  c.count(c.q("cacK2"), 0, 9, 220, 265);
  c.count(c.q("cacK3"), 0, 1, 250, 252);
  seq(c, c.all("cacBar"), { scaleY: 0 }, { scaleY: 1, duration: 8, ease: "power2.out" }, 240, 2.5);

  // ── Smart Zone Cast: 구역 그리기 → 송출 → 리포트 ──
  const zSteps = c.all("zStep");
  c.tick((p) => {
    const stage3 = p < 335 ? 0 : p < 370 ? 1 : 2;
    zSteps.forEach((el, i) => {
      const v = i === stage3 ? "now" : i < stage3 ? "true" : "false";
      if (el.dataset.on !== v) el.dataset.on = v;
    });
  });
  env.cleanups.push(() => zSteps.forEach((el) => el.removeAttribute("data-on")));
  tl.fromTo(c.k("zVerts"), { opacity: 0 }, { opacity: 1, duration: 8 }, 305);
  draw(c, c.k("zEdge"), 310, 332);
  fadeIn(c, c.k("zFill"), 330, 6);
  const zState = c.k("zState");
  c.at(342, (after) => zState.setAttribute("data-i", after ? "1" : "0"));
  c.at(352, (after) => (after ? zState.removeAttribute("data-i") : zState.setAttribute("data-i", "1")));
  const zc = SCR.zone.c;
  c.all("zRing").forEach((ring, i) => {
    const r0 = ring.getAttribute("r") ?? "46";
    ring.setAttribute("r", "46");
    env.cleanups.push(() => ring.setAttribute("r", r0));
    const t = 352 + i * 6;
    tl.fromTo(ring, { scale: 0.6, opacity: 0, svgOrigin: `${zc.x} ${zc.y}` }, { scale: 1.6, duration: 12, ease: "power1.out" }, t);
    tl.fromTo(ring, { opacity: 0 }, { opacity: 0.8, duration: 2 }, t);
    tl.to(ring, { opacity: 0, duration: 10 }, t + 2);
  });
  tl.fromTo(c.k("zOn"), { opacity: 0 }, { opacity: 1, duration: 10 }, 356);
  tl.fromTo(c.k("zOff"), { opacity: 1 }, { opacity: 0, duration: 10 }, 356);
  c.count(c.q("zSent"), 0, 3120, 372, 392, (n) => n.toLocaleString("en-US"));
  c.count(c.q("zOpen"), 0, 41, 374, 394, (n) => `${n}%`);
  tl.fromTo(c.k("zBars"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 22, ease: "power2.out" }, 374);

  // ── Smart Rental: 대장 줄이 들어오고, 게이지·가동률이 차고, R-03 이 회수 완료로 ──
  seq(c, c.all("rentRow"), { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 6, ease: "power2.out" }, 425, 4);
  tl.fromTo(c.k("rentGauge"), { scaleX: 0 }, { scaleX: 1, duration: 30, ease: "power2.out" }, 445);
  seq(c, c.all("rentBar"), { scaleY: 0 }, { scaleY: 1, duration: 10, ease: "power2.out" }, 460, 4);
  const r3 = c.k("r3");
  c.at(470, (after) => (after ? r3.removeAttribute("data-i") : r3.setAttribute("data-i", "0")));
  tl.fromTo(c.k("rentFix"), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 6, ease: "power2.out" }, 470);

  // 화면 예시 판을 장면 동안 살짝 돌린다(원근). Rental 은 표 썸네일로 줄기 전에 정면으로
  const inner = frames.map((f) => f.querySelector(".sf-frame"));
  tilt(c, inner[0], 92, 190);
  tilt(c, inner[1], 196, 290);
  tilt(c, inner[2], 296, 410);
  tilt(c, inner[3], 416, 520, -6, 0);

  // ── 6.6 4종을 한 표로 ──
  tl.to(frames[3], { x: () => geo.shrink.x, y: () => geo.shrink.y, scale: () => geo.shrink.s, duration: 25, ease: "power3.inOut" }, 520);
  tl.to(shots[3], { opacity: 0, duration: 5 }, 541);
  fadeIn(c, table, 522, 10);
  seq(c, rows, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 526, 4);
  seq(c, tags, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 544, 4);
  pat.forEach((p, i) => draw(c, p, 550 + i * 4, 562 + i * 4));
  linkPaths.forEach((p, i) => draw(c, p, 566 + i * 4, 580 + i * 4));
  text(c, "text-6.6", 530, 612, 12, 12);

  // 형태 이어받기: 표 글자·썸네일·태그·선이 빠지고, 행 선 네 줄이 한 줄로 접혀 7.1 트래버스의 시작 선이 된다
  tl.to([rows, tags, table.querySelector("caption"), table.querySelector("thead")].flat().filter(Boolean) as Element[], { opacity: 0, duration: 12 }, 600);
  tl.to([...pat, ...linkPaths], { opacity: 0, duration: 8 }, 600);
  tl.set(foldLines, { opacity: 1 }, 600);
  foldLines.forEach((l, i) => {
    tl.fromTo(l, { y: 0 }, { y: () => geo.foldY - (geo.rowBottoms[i] ?? geo.foldY), duration: 18, ease: "power2.inOut" }, 601);
  });
}
