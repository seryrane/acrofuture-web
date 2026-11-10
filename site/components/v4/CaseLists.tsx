"use client";

// 사례 절 «사업 사례 103건» 분야별 목록(#508): <details> 가 처음 펼쳐질 때 그 분야 목록을 만들어 넣는다.
// 서버 HTML 에 103건(DOM 약 350개)을 싣지 않아 첫 로드 DOM · 스타일 계산이 줄고, 서버 HTML 과 수화 결과가 같다.
// 링크(#cases-*)로 들어와 scrollToHash 가 펼친 경우도 toggle 이벤트로 같이 처리한다. 이미 펼쳐진 채 붙으면 바로 넣는다.

import { useEffect } from "react";
import type { Case } from "@/lib/cases";

type Props = {
  lists: Record<string, readonly Case[]>;
  labels: Record<string, string>;
  ongoing: string;
  cls: { list: string; who: string; on: string };
};

export function CaseLists({ lists, labels, ongoing, cls }: Props) {
  useEffect(() => {
    const el = (tag: string, className?: string, text?: string) => {
      const e = document.createElement(tag);
      if (className) e.className = className;
      if (text) e.textContent = text;
      return e;
    };
    const fill = (d: HTMLDetailsElement) => {
      if (!d.open || d.querySelector("[data-k='case-list']")) return;
      const field = d.id.replace(/^cases-/, "");
      const ol = el("ol", cls.list);
      ol.dataset.k = "case-list";
      ol.tabIndex = 0; // 칸 안 스크롤을 키보드로도
      ol.setAttribute("aria-label", labels[field] ?? "");
      for (const x of lists[field] ?? []) {
        const li = el("li");
        const t = el("span", undefined, x.t);
        if (x.who) t.append(el("span", cls.who, ` · ${x.who}`));
        if (x.on) t.append(el("span", cls.on, ongoing));
        li.append(el("span", "tnum", String(x.y)), t);
        ol.append(li);
      }
      d.append(ol);
    };
    const all = [...document.querySelectorAll<HTMLDetailsElement>("details[data-k='field-cases']")];
    const on = (e: Event) => fill(e.currentTarget as HTMLDetailsElement);
    for (const d of all) {
      fill(d);
      d.addEventListener("toggle", on);
    }
    return () => all.forEach((d) => d.removeEventListener("toggle", on));
  }, [lists, labels, ongoing, cls]);
  return null;
}
