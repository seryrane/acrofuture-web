// 2장 LBS·측위: 캔버스 엔진 하나가 2.1~2.7 입자·측정 격자·단말을 그리고, SVG 가 측점·2.3 RTK 원근 장면·층 판·구역을 맡는다.

import { KR } from "../korea-map";
import { LBS, RTK, SEOUL_X, easeInOut, krTransform, rtkCircleD, span } from "../geometry";
import { createSignalEngine } from "../signal/engine";
import { boxIn, chapter, circleOpen, draw, drive, fadeIn, fadeOut, firstText, seq, setT, text, type Env } from "./core";

export function lbs(env: Env) {
  const c = chapter(env, "lbs");
  const { tl } = c;
  const engine = createSignalEngine(c.k<HTMLCanvasElement>("canvas"), c.stage, c.k("giant"), 2400);
  env.cleanups.push(() => engine.destroy());
  c.tick((p) => engine.setTarget(p));

  const F = LBS.fix;
  const PL = LBS.plates;
  const plateY = (i: number) => PL.y0 - i * PL.gap;

  // 2.1 궤도는 흐려지고(위성에서 신호가 흩어짐), 1.3 레이어에서 온 측점은 사라진다
  const orbits = c.k("orbits");
  tl.to(orbits, { opacity: 0.25, duration: 90 }, 0);
  tl.to(orbits, { opacity: 0, duration: 20 }, 150);
  tl.to(c.k("fixStart"), { opacity: 0, duration: 20 }, 0);

  // 측점 이동 사슬: 수렴점(2.2) → 확대 중심(2.3) → 1층 판(2.4) → 4층 판 → 구역 중심(2.5) → 입자로 풀림(2.6) → 가로선 왼쪽 끝(2.7)
  const fix = c.k<SVGGElement>("fix");
  tl.fromTo(fix, { opacity: 0 }, { opacity: 1, duration: 10 }, 160);
  const pos = { x: F.x, y: F.y };
  const put = () => setT(fix, pos.x, pos.y);
  tl.fromTo(pos, { x: F.x, y: F.y }, { x: PL.cx, y: PL.y0, duration: 18, ease: "power2.inOut", onUpdate: put }, 284);
  tl.to(pos, { y: plateY(PL.top), duration: 25, ease: "power2.inOut", onUpdate: put }, 330);
  tl.to(pos, { x: F.x, y: F.y, duration: 15, ease: "power2.inOut", onUpdate: put }, 370);
  tl.to(fix, { opacity: 0, duration: 12 }, 470);

  // 2.3 RTK 원근 장면: 지면이 서고(아래에서 떠오름), 위성·기준국이 나타나고, 보정 신호가 기준국에서 솟아 단말로 내려온다.
  // 신호 조각이 흐르는 동안 지면의 오차 원(원근 타원)이 미터에서 센티미터로 줄어든다
  const ground = c.k("rtkGround");
  const sky = c.k("rtkSky");
  const base = c.k("rtkBase");
  const stem = c.k("rtkStem");
  const err = c.k<SVGPathElement>("rtkErr");
  const signal = c.k<SVGPathElement>("rtkSignal");
  const pk = c.k("rtkPackets");
  const packets = Array.from(pk.querySelectorAll<SVGCircleElement>("circle"));
  tl.fromTo(ground, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 14, ease: "power2.out" }, 186);
  fadeIn(c, stem, 194, 8);
  fadeIn(c, err, 196, 8);
  fadeIn(c, sky, 198, 10);
  draw(c, c.k("rtkRays"), 202, 216);
  tl.fromTo(base, { opacity: 0, scaleY: 0.2, transformOrigin: "50% 100%" }, { opacity: 1, scaleY: 1, duration: 12, ease: "power2.out" }, 200);
  draw(c, signal, 214, 234);
  fadeIn(c, pk, 222, 4);
  fadeOut(c, pk, 268, 6);
  let len = 0;
  c.tick((p) => {
    if (p < 220 || p > 276) return;
    if (!len) len = signal.getTotalLength();
    if (!len) return;
    packets.forEach((dot, i) => {
      const t = (((p - 220) / 16 + i / 3) % 1 + 1) % 1;
      const q = signal.getPointAtLength(len * t);
      dot.setAttribute("cx", q.x.toFixed(1));
      dot.setAttribute("cy", q.y.toFixed(1));
    });
  });
  // 오차 원 반지름: 미터(1.2) → 센티미터(0.07), 지면 원근 그대로 다시 투영
  let lastR = -1;
  const setR = (p: number) => {
    const k = easeInOut(span(p, 238, 266));
    const r = RTK.rMeter + (RTK.rCm - RTK.rMeter) * k;
    const q = Math.round(r * 400) / 400;
    if (q === lastR) return;
    lastR = q;
    err.setAttribute("d", rtkCircleD(q));
  };
  c.tick(setR);
  env.cleanups.push(() => err.setAttribute("d", rtkCircleD(RTK.rMeter)));
  fadeOut(c, [ground, sky, base, stem, err, signal], 272, 12);
  const lblMeter = c.k("lblMeter");
  const lblCm = c.k("lblCm");
  const lblSignal = c.k("lblSignal");
  fadeIn(c, lblMeter, 200, 8);
  fadeOut(c, lblMeter, 244, 10);
  fadeIn(c, lblCm, 256, 10);
  fadeOut(c, lblCm, 278, 8);
  fadeIn(c, lblSignal, 226, 8);
  fadeOut(c, lblSignal, 272, 8);
  fadeIn(c, [c.k("lblSat"), c.k("lblBase")], 206, 8);
  fadeOut(c, [c.k("lblSat"), c.k("lblBase")], 272, 8);

  // 2.4 층 판 5장이 아래에서부터 스태거로 올라오고, 측점이 오르며 치수선이 그려진다
  const plates = c.all("plate");
  seq(c, plates, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 300, 5);
  fadeIn(c, c.k("planeRing"), 330, 8);
  const dim = c.k("dim");
  tl.fromTo(dim, { opacity: 0 }, { opacity: 1, duration: 20 }, 335);
  fadeIn(c, [c.k("lblPlane"), c.k("lblHeight")], 342, 8);
  fadeOut(c, [c.k("planeRing"), dim, c.k("lblPlane"), c.k("lblHeight")], 368, 8);
  tl.to(plates, { opacity: 0, scaleY: 0.2, transformOrigin: "50% 50%", duration: 14, ease: "power2.in" }, 370);

  // 2.5 국내 지도가 나타나 한 지역으로 확대되고(도식), 그 안에 구역 다각형 + 방송 원 3개(단말 입자는 엔진), 중간 수치 사본
  const krMap = c.k("krMap");
  // 지도 묶음의 transform 속성은 확대 함수가 쓰므로 여기서는 opacity 만 다룬다(fadeIn 은 x·y 를 건드린다)
  tl.fromTo(krMap, { opacity: 0 }, { opacity: 1, duration: 12 }, 372);
  drive(c, 388, 410, (t) => krMap.setAttribute("transform", krTransform(t, { x: KR.target.cx, y: KR.target.cy }, KR.w, KR.h)));
  tl.to(c.k("krOthers"), { opacity: 0.45, duration: 12 }, 394);
  tl.fromTo(c.k("krInset"), { opacity: 0 }, { opacity: 1, duration: 8 }, 408);
  fadeOut(c, [krMap, c.k("krInset")], 470, 14);
  // 1024~1279 폭: 확대된 서울 오른쪽 끝이 챕터 레일 구역(오른쪽 88px)에 들어가면 2.5 동안 도판 층(지도·단말 캔버스·구역·측점)을
  // 측점 기준으로 함께 줄이고 왼쪽으로 옮긴다(문구 열은 넘지 않게). 1280 이상은 그대로. transform 만
  const layers = [c.k("lbsArt1"), c.k("canvas"), c.k("lbsArt2")];
  const fade = c.stage.querySelector("#krS-fade");
  const fit = { s: 1, dx: 0, ox: 0, oy: 0 };
  c.measure(() => {
    const f = c.frame();
    const fx = f.ox + LBS.fix.x * f.u;
    const fy = f.oy + LBS.fix.y * f.u;
    const tb = boxIn(c.k("text-2.5"), c.stage);
    const textR = tb.x + tb.w;
    const railL = f.w - 88 - 12;
    const sl = f.ox + SEOUL_X.min * f.u;
    const sr = f.ox + SEOUL_X.max * f.u;
    let sc = 1;
    let dx = 0;
    if (f.w < 1280 && sr > railL) {
      sc = Math.min(1, (railL - (textR + 24)) / (sr - sl));
      dx = railL - (fx + (sr - fx) * sc);
    }
    Object.assign(fit, { s: sc, dx, ox: fx, oy: fy });
    // 지도 왼쪽 흐림(마스크)은 화면 기준 문구 열 오른쪽에 오게 로컬 단위로 되돌려 둔다
    if (fade) {
      const toLocal = (px: number) => (((px - dx - fx) / sc + fx - f.ox) / f.u).toFixed(1);
      fade.setAttribute("x1", sc === 1 && dx === 0 ? "740" : toLocal(textR + 12));
      fade.setAttribute("x2", sc === 1 && dx === 0 ? "850" : toLocal(textR + 110));
    }
  });
  tl.fromTo(
    layers,
    { x: 0, scale: 1 },
    { x: () => fit.dx, scale: () => fit.s, transformOrigin: () => `${fit.ox}px ${fit.oy}px`, duration: 16, ease: "power2.inOut", immediateRender: false },
    384,
  );
  tl.to(layers, { x: 0, scale: 1, duration: 12, ease: "power2.inOut" }, 468);
  draw(c, c.k("poly"), 404, 418);
  fadeIn(c, c.k("polyFill"), 416, 8);
  c.all("zring").forEach((ring, i) => {
    const t = 420 + i * 7;
    tl.fromTo(ring, { scale: 0.6, svgOrigin: `${F.x} ${F.y}` }, { scale: 1.6, duration: 14, ease: "power1.out" }, t);
    tl.fromTo(ring, { opacity: 0 }, { opacity: 0.8, duration: 3 }, t);
    tl.to(ring, { opacity: 0, duration: 11 }, t + 3);
  });
  fadeOut(c, [c.k("poly"), c.k("polyFill")], 470, 14);
  const mid = c.q("mid");
  if (mid) {
    fadeIn(c, mid, 434, 13, { y: 24 });
    fadeOut(c, mid, 470, 10);
  }

  // 2.6 대형 숫자 17(입자가 모인 뒤 DOM 숫자가 겹친다) → 2.7 선으로 풀림
  const giant = c.k("giant");
  tl.fromTo(giant, { opacity: 0 }, { opacity: 1, duration: 30 }, 550);
  tl.to(giant, { opacity: 0, duration: 15 }, 580);
  const fixEnd = c.k<SVGGElement>("fixEnd");
  tl.fromTo(fixEnd, { opacity: 0 }, { opacity: 1, duration: 12 }, 603);
  tl.fromTo(c.k("lineGhost"), { opacity: 0 }, { opacity: 1, duration: 20 }, 600);

  firstText(c, "text-2.1", 90);
  text(c, "text-2.2", 102, 180);
  text(c, "text-2.3", 192, 280);
  text(c, "text-2.4", 292, 370);
  text(c, "text-2.5", 382, 470);
  text(c, "text-2.6", 480, 615, 12, 15);
  circleOpen(c, 620, 660);
}
