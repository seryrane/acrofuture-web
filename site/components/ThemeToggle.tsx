"use client";

// 테마 토글(3판, DESIGN 2.1): 기본은 deep. 라벨은 행동("밝은 화면으로" / "어두운 화면으로"), aria-pressed 는 쓰지 않는다.
// 라벨·아이콘은 CSS 토큰으로 전환해 하이드레이션 차이가 없다. 밝은 테마만 localStorage("theme")="light" 로 저장한다.

import { useCallback } from "react";
import { cta } from "@/lib/facts";
import { Icon } from "./Icon";
import styles from "./ThemeToggle.module.css";

const THEME_COLOR = { deep: "#070C1A", light: "#F5F7FB" } as const;

type Props = { withText?: boolean; className?: string };

export function ThemeToggle({ withText = false, className }: Props) {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const toLight = root.getAttribute("data-theme") !== "light";
    if (toLight) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", toLight ? THEME_COLOR.light : THEME_COLOR.deep);
    try {
      if (toLight) localStorage.setItem("theme", "light");
      else localStorage.removeItem("theme");
    } catch {
      // 저장이 막힌 환경에서는 이번 방문에만 적용
    }
    window.dispatchEvent(new Event("themechange"));
  }, []);

  const labelClass = withText ? styles.label : "sr-only";

  return (
    <button
      type="button"
      className={[styles.toggle, withText ? styles.withText : "", className ?? ""].join(" ")}
      onClick={toggle}
    >
      <span className={styles.whenDeep}>
        <Icon name="sun" />
      </span>
      <span className={styles.whenLight}>
        <Icon name="moon" />
      </span>
      <span className={`${labelClass} ${styles.whenDeepText}`}>{cta.toLight}</span>
      <span className={`${labelClass} ${styles.whenLightText}`}>{cta.toDeep}</span>
    </button>
  );
}
