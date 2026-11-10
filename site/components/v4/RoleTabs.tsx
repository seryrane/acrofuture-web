"use client";

// A-Flow 역할 탭(WAI-ARIA 탭 패턴, 자동 활성 · 제어형): 좌우(위아래) · Home · End 로 이동, 선택한 탭만 Tab 순서에 든다.
// 선택 상태는 AflowStage 가 갖는다(영상 장과 한 몸). 누름(클릭 · Enter · Space) = «press», 화살표 이동 = «move».
// 네 패널 문구는 서버 HTML 에 모두 들어 있고(검색 · 읽기 도구가 본다), 선택되지 않은 패널만 hidden 이다.

import { useRef, useState, type KeyboardEvent } from "react";
import type { RoleTab } from "@/lib/facts";
import s from "./Solutions.module.css";

type Cols = { now: string; change: string; better: string };

export function RoleTabs({
  roles,
  cols,
  label,
  cur,
  onPick,
}: {
  roles: readonly RoleTab[];
  cols: Cols;
  label: string;
  cur: number;
  onPick: (i: number, how: "press" | "move") => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [touched, setTouched] = useState(false);

  const pick = (i: number, how: "press" | "move") => {
    setTouched(true);
    onPick(i, how);
  };

  const go = (i: number) => {
    const n = (i + roles.length) % roles.length;
    pick(n, "move");
    refs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(cur + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(cur - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(roles.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className={s.roles} data-k="roles" data-fx={touched ? "" : undefined}>
      <div className={s.tabs} role="tablist" aria-label={label} aria-describedby="aflow-roles-hint" onKeyDown={onKey}>
        {roles.map((r, i) => (
          <button
            key={r.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`role-tab-${r.id}`}
            aria-selected={i === cur}
            aria-controls={`role-panel-${r.id}`}
            tabIndex={i === cur ? 0 : -1}
            className={s.tab}
            onClick={() => pick(i, "press")}
          >
            {r.name}
          </button>
        ))}
      </div>
      {roles.map((r, i) => (
        <div
          key={r.id}
          role="tabpanel"
          id={`role-panel-${r.id}`}
          aria-labelledby={`role-tab-${r.id}`}
          hidden={i !== cur}
          className={s.panel}
        >
          <div>
            <small>{cols.now}</small>
            <b>{r.now}</b>
          </div>
          <div>
            <small>{cols.change}</small>
            <b>{r.change}</b>
          </div>
          <div>
            <small>{cols.better}</small>
            <b>{r.better}</b>
          </div>
        </div>
      ))}
    </div>
  );
}
