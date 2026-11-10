"use client";

// 챕터 레일(≥1024): 오른쪽 가장자리 세로 레일, 챕터 8개(DESIGN 7.10).
// 현재 칸 = 작은 측점(파랑 고리 + 연두 점), 지난 칸 = --ink 채움, 남은 칸 = --ink-3 빈 원. 뒤판을 깔아 도판 위에서도 읽힌다.
// 현재 장은 html[data-chapter] 한 곳에서 읽는다(헤더 내비와 같은 출처, DESIGN D8).

import { useEffect, useState } from "react";
import { chapterNames } from "@/lib/facts";
import styles from "./ChapterRail.module.css";

const IDS = Object.keys(chapterNames) as (keyof typeof chapterNames)[];

function indexOf(chapter: string | undefined): number {
  if (chapter === "contact") return IDS.length - 1;
  const i = IDS.indexOf((chapter ?? "top") as (typeof IDS)[number]);
  return i < 0 ? 0 : i;
}

export function ChapterRail() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const sync = () => setCurrent(indexOf(document.documentElement.dataset.chapter));
    sync();
    window.addEventListener("chapterchange", sync);
    return () => window.removeEventListener("chapterchange", sync);
  }, []);

  return (
    <nav aria-label="챕터" className={styles.rail} data-surface-follow="">
      <ol className={styles.list}>
        {IDS.map((id, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              data-state={i === current ? "current" : i < current ? "passed" : "ahead"}
              aria-current={i === current ? "true" : undefined}
              aria-label={chapterNames[id]}
            >
              <span className={styles.name} aria-hidden="true">
                {chapterNames[id]}
              </span>
              <span className={styles.dot} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
