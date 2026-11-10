import { captions, finance } from "@/lib/facts";
import { Sk } from "../ui/parts";
import "./FinanceWindows.css";
import { cls } from "@/lib/cls";

const s = cls("FinanceWindows");

/** 차량 옆모습 선 기호(48×48, DESIGN 8): 로고·브랜드를 닮지 않은 일반 형태 */
export function CarGlyph({ className, k }: { className?: string; k?: string }) {
  return (
    <svg className={className} data-k={k} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 30 V25 L10 23 L16 15 H31 L38 22 L43 24 V30 H39" />
        <path d="M17 30 H31" />
        <path d="M17.5 17 L14 22 H36 L31 17 Z" />
        <circle cx="13" cy="30" r="4" />
        <circle cx="35" cy="30" r="4" />
      </g>
    </svg>
  );
}

const [W1, W2, W3] = finance.windows;

/**
 * 4.5 영업 포털, 오토금융, 디지털브랜치: 창 카드 3장(시간순: 카버스 → 에이전트 포털 → 디지털브랜치).
 * 스테이지에서는 시간 비례 레일의 막대 자리에서 떠오른다(FLIP). 흐름·감소에서는 세로(390) / 3칸(≥768), 브랜치 도식은 다 그려진 상태.
 */
export function FinanceWindows() {
  return (
    <figure className={`st-shot ${s.wrap}`} data-k="windows">
      <div className={s.row} role="img" aria-label={`${finance.windows.map((w) => w.name).join(", ")}. ${captions.client}`}>
        <div className={`card ${s.win}`} data-k="win" data-bar="2023.58" aria-hidden="true">
          <p className={s.head}>
            <span className={s.name}>{W1.name}</span>
            <span className={`${s.meta} tnum`}>{W1.meta}</span>
          </p>
          <div className={s.body}>
            <span className={s.carSlot} data-k="carSlot">
              <CarGlyph className={s.car} k="carGlyph" />
            </span>
            <div className={s.cards}>
              <span>
                <Sk w={70} strong />
                <Sk w={45} />
              </span>
              <span>
                <Sk w={60} strong />
                <Sk w={35} />
              </span>
            </div>
          </div>
        </div>
        <div className={`card ${s.win}`} data-k="win" data-bar="2024.42" aria-hidden="true">
          <p className={s.head}>
            <span className={s.name}>{W2.name}</span>
            <span className={`${s.meta} tnum`}>{W2.meta}</span>
          </p>
          <div className={s.body}>
            <div className={s.filters}>
              <span className={s.filterOn} />
              <span />
              <span />
            </div>
            <div className={s.table}>
              {[0, 1, 2, 3].map((r) => (
                <span key={r}>
                  <Sk w={28} strong={r === 0} />
                  <Sk w={40} />
                  <Sk w={18} />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={`card ${s.win}`} data-k="win" data-bar="2026.25" aria-hidden="true">
          <p className={s.head}>
            <span className={s.name}>{W3.name}</span>
            <span className={`${s.meta} tnum`}>{W3.meta}</span>
          </p>
          <div className={s.body}>
            <svg className={s.nodes} viewBox="0 0 200 120" data-plate="" aria-hidden="true" focusable="false">
              <g fill="none" stroke="var(--fin)" strokeWidth="1.5">
                {[14, 37, 60, 83, 106].map((y) => (
                  <path key={y} data-k="branchLine" d={`M30 ${y} C90 ${y} 110 60 160 60`} pathLength={1} />
                ))}
              </g>
              <g fill="var(--s-bg)" stroke="var(--ink-3)" strokeWidth="1.5">
                {[14, 37, 60, 83, 106].map((y) => (
                  <rect key={y} x="14" y={y - 7} width="16" height="14" rx="4" />
                ))}
              </g>
              <circle cx="168" cy="60" r="12" fill="var(--s-bg)" stroke="var(--fin)" strokeWidth="1.5" />
              <circle cx="168" cy="60" r="4.5" fill="var(--fin)" />
            </svg>
          </div>
        </div>
      </div>
      <figcaption className={`meta ${s.cap}`}>{captions.client}</figcaption>
    </figure>
  );
}
