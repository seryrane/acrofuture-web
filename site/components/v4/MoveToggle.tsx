"use client";

// 위치 · 이동 솔루션 카드의 «자세히 보기» 여닫기(#508, 대표 2026-11-10 «샘플 화면이 전부 없어짐. 상세 추가»).
// 카드 · 상세는 서버 HTML 에 모두 있고(상세는 hidden), 이 섬은 버튼 눌림만 받아 hidden · aria-expanded 를 바꾼다.
// - 한 번에 상세 하나만 연다(다른 카드를 누르면 앞의 상세는 닫힌다). 같은 카드를 다시 누르거나 «접기» 를 누르면 닫는다.
// - 큰 화면 예시는 펼쳐 보일 때 MoveScreen 이 그린다.
// - 상세가 화면 밖이면 보이는 곳까지만 옮긴다(모션 감소면 즉시). «접기» 는 초점을 그 카드 버튼으로 돌린다.
// 배치는 CSS 가 맡는다: 1024 이상은 상세가 카드 줄 아래 한 줄 전체, 그 아래 폭은 카드 바로 아래.

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function MoveToggle({ root }: { root: string }) {
  useEffect(() => {
    const box = document.getElementById(root);
    if (!box) return;
    const btns = () => [...box.querySelectorAll<HTMLButtonElement>("button[data-move-open]")];
    const set = (id: string | null, focusBack?: string) => {
      for (const b of btns()) {
        const on = b.dataset.moveOpen === id;
        b.setAttribute("aria-expanded", String(on));
        const panel = document.getElementById(b.getAttribute("aria-controls") ?? "");
        if (panel) panel.hidden = !on;
        b.closest("[data-k='move-item']")?.toggleAttribute("data-open", on);
      }
      box.toggleAttribute("data-any-open", id !== null);
      if (id) {
        const panel = document.getElementById(`move-d-${id}`);
        panel?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
      }
      if (focusBack) box.querySelector<HTMLButtonElement>(`button[data-move-open="${focusBack}"]`)?.focus();
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const open = t?.closest<HTMLButtonElement>("button[data-move-open]");
      if (open && box.contains(open)) {
        set(open.getAttribute("aria-expanded") === "true" ? null : (open.dataset.moveOpen ?? null));
        return;
      }
      const close = t?.closest<HTMLButtonElement>("button[data-move-close]");
      if (close && box.contains(close)) set(null, close.dataset.moveClose);
    };
    box.addEventListener("click", onClick);
    box.setAttribute("data-ready", "");
    return () => box.removeEventListener("click", onClick);
  }, [root]);
  return null;
}
