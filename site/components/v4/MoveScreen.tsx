"use client";

// 위치 · 이동 카드의 화면 예시(3판 SolutionScreens, #508)를 화면 근처에서만 그린다.
// 서버 HTML · RSC 데이터에 화면 예시 SVG(카드 4장 DOM 약 260개 · HTML 16KB, RSC 에 한 번 더)를 싣지 않으려고 지연 청크로 받는다.
// 자리 크기는 CSS 가 고정(카드 칸 높이 · 상세 칸)하므로 그려질 때 밀림 0. 숨은 상세(hidden)는 펼쳐 보일 때 그린다.

import { useEffect, useRef, useState, type ComponentType } from "react";

type Id = "actrack" | "cacago" | "zonecast" | "rental";

const load = () =>
  import("../screens/SolutionScreens").then((m) => ({ actrack: m.AcTrackScreen, cacago: m.CacagoScreen, zonecast: m.ZoneCastScreen, rental: m.RentalScreen }));

export function MoveScreen({ id, className, k }: { id: Id; className?: string; k: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Screen, setScreen] = useState<ComponentType | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || Screen) return;
    let live = true;
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        io.disconnect();
        load().then((m) => live && setScreen(() => m[id]));
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => {
      live = false;
      io.disconnect();
    };
  }, [id, Screen]);
  return (
    <div ref={ref} className={className} data-k={k} data-ready={Screen ? "" : undefined}>
      {Screen ? <Screen /> : null}
    </div>
  );
}
