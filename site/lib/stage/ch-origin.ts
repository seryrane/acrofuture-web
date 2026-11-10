// 1장 원점: 1.1 측점 고정(격자 축소) → 1.2 오차 원이 위성 궤도로 → 1.3 심야가 측점에서 열린다(레이어 안 2.1 문구 사본).

import { ORIGIN, easeInOut, lerp, orbitPoint, span } from "../geometry";
import { chapter, circleOpen, setT, text, type Env } from "./core";

const RING_R = [27, 98, 244];
const COS = (deg: number) => Math.cos((deg * Math.PI) / 180);

export function origin(env: Env) {
  const c = chapter(env, "top");
  const { tl } = c;
  const F = ORIGIN.fix;
  // 격자가 원근 바닥으로 눕는다(궤도가 기울어 타원이 되는 1.2 와 같은 공간감). transform 만
  tl.to(c.k("grid"), { scale: 0.92, rotationX: 44, transformPerspective: 1300, transformOrigin: "62% 60%", duration: 120, ease: "power1.inOut" }, 0);

  const orbits = c.all<SVGGElement>("orbit");
  const sats = c.all<SVGRectElement>("sat");
  const lines = c.all<SVGLineElement>("satline");
  const st = { k: 0 };
  const apply = () => {
    const e = easeInOut(st.k);
    orbits.forEach((g, i) => {
      const o = ORIGIN.orbits[i];
      const s = 1 + (o.s - 1) * e;
      const sy = s * COS(ORIGIN.tilt * e);
      g.setAttribute(
        "transform",
        `translate(${F.x} ${F.y}) rotate(${(o.rot * e).toFixed(2)}) scale(${s.toFixed(4)} ${sy.toFixed(4)}) translate(${-F.x} ${-F.y})`,
      );
    });
    const d = span(st.k, 0.27, 1);
    ORIGIN.sats.forEach((sd, i) => {
      const o = ORIGIN.orbits[sd.orbit];
      const s = 1 + (o.s - 1) * e;
      const p = orbitPoint(RING_R[sd.orbit], s, ORIGIN.tilt * e, o.rot * e, sd.a0 + 120 * st.k, F);
      setT(sats[i], p.x, p.y);
      sats[i].style.opacity = String(span(st.k, 0, 0.18));
      const l = lines[i];
      l.setAttribute("x1", p.x.toFixed(1));
      l.setAttribute("y1", p.y.toFixed(1));
      l.setAttribute("x2", lerp(p.x, F.x, d).toFixed(1));
      l.setAttribute("y2", lerp(p.y, F.y, d).toFixed(1));
      l.style.opacity = d > 0 ? "1" : "0";
    });
  };
  tl.fromTo(st, { k: 0 }, { k: 1, duration: 100, onUpdate: apply }, 40);
  // 1.2 문구: 히어로 글이 위로 빠진 뒤 들어오고, 원형 열림이 시작하면 나간다(그 뒤는 레이어 안 2.1 사본이 이어받음)
  text(c, "text-1.2", 72, 165, 12, 15);
  circleOpen(c, 150, 200);
}
