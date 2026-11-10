"use client";

// A-Flow 카드의 주인공: 영상 + 역할 탭 한 섬(대표 2026-11-10 «동영상 영역 확대», #507).
// 역할 탭 = 영상의 역할 장 바로 가기(aflow-landing FilmCuts 와 같은 방식: 시각으로 옮기고 재생).
// - 탭을 누르면(클릭 · Enter · Space) 그 역할 장 시각으로 옮겨 재생한다. 사용자가 고른 동작이므로 영상 파일을 이때 받는다.
// - 화살표 · Home · End 로 탭만 옮길 때는 영상을 새로 받지 않는다: 아직 재생 전이면 재생 단추가 «그 장부터 재생» 으로 바뀌고,
//   이미 재생을 시작했으면 그 장으로 옮긴다(재생 · 정지 상태는 그대로).
// - 영상이 흘러 다음 역할 장에 들어가면 선택 탭이 따라온다(초점은 옮기지 않는다).
// 처음 그릴 때는 포스터만(preload="none" · 자동 재생 없음).

import { useEffect, useRef, useState } from "react";
import type { RoleTab } from "@/lib/facts";
import { AflowVideo } from "./AflowVideo";
import { RoleTabs } from "./RoleTabs";
import s from "./Solutions.module.css";

type Cols = { now: string; change: string; better: string };

export function AflowStage({ roles, cols, label, hint }: { roles: readonly RoleTab[]; cols: Cols; label: string; hint: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [cur, setCur] = useState(0);
  const [started, setStarted] = useState(false);
  // 재생 전에 키보드로 고른 장(재생 단추가 그 장부터 시작한다). null 이면 영상 처음부터.
  const [from, setFrom] = useState<number | null>(null);

  // 영상 시각 → 역할 장(첫 역할 장 앞의 제목 · 문제 장면은 첫 역할로 본다)
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => {
      let i = 0;
      roles.forEach((r, k) => {
        if (v.currentTime >= r.at) i = k;
      });
      setCur((p) => (p === i ? p : i));
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("seeked", onTime);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("seeked", onTime);
    };
  }, [roles]);

  const playAt = (at: number | null) => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    const go = () => {
      if (at !== null) v.currentTime = at;
      // 재생이 막히면(정책 · 오류) 컨트롤이 이미 보이므로 사용자가 직접 누를 수 있다
      void v.play().catch(() => {});
    };
    // preload="none" 이라 길이를 알기 전이면 metadata 를 받은 뒤 옮긴다
    if (at === null || v.readyState >= 1) go();
    else {
      v.addEventListener("loadedmetadata", go, { once: true });
      v.load();
    }
  };

  const pick = (i: number, how: "press" | "move") => {
    setCur(i);
    const at = roles[i].at;
    if (how === "press") playAt(at);
    else if (started) {
      const v = ref.current;
      if (v && v.readyState >= 1) v.currentTime = at;
    } else setFrom(i);
  };

  return (
    <div className={s.stage} data-k="aflow-stage">
      <AflowVideo vref={ref} started={started} onPlay={() => playAt(from === null ? null : roles[from].at)} fromName={from === null ? null : roles[from].name} />
      <div className={s.side}>
        <p className={s.sideLabel} id="aflow-roles-hint">
          {hint}
        </p>
        <RoleTabs roles={roles} cols={cols} label={label} cur={cur} onPick={pick} />
      </div>
    </div>
  );
}
