// 3판 공통 부품(DESIGN 7): 장면 문구 블록, 사업 기록, 근거 칸, 화면 예시 프레임, 폰 도식, 상태 칩, 표제란, DOM 측점.
// 스테이지·흐름 모드가 같은 DOM 을 쓴다(DESIGN D10). 연출 모듈은 data-k 로 요소를 찾는다.

import type { CSSProperties, ReactNode } from "react";
import { captions, firstAppliedLabel, solutions as sol, titleBlock, type Rec, type Solution } from "@/lib/facts";

type Status = "done" | "move" | "wait" | "warn" | "draft" | "off";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** 사업 기록(DESIGN 7.7): 연도 + 사이트 표기 그대로의 사업 제목 */
export function FieldBook({ recs, className }: { recs: readonly Rec[]; className?: string }) {
  return (
    <div className={cx("fieldbook", className)}>
      <p className="fieldbook-head">{captions.fieldBook}</p>
      <ol>
        {recs.map((r, i) => (
          <li key={i}>
            <span className="fieldbook-y">{r.y}</span>
            {r.t}
          </li>
        ))}
      </ol>
    </div>
  );
}

type TextProps = {
  /** 연출 키(data-k). 사본에는 붙지 않는다 */
  k: string;
  /** 챕터 첫 장면: 스테이지에서 +0 에 이미 보인다(원형 열림 레이어 사본과 같은 자리) */
  first?: boolean;
  /** 원형 열림 레이어 안 장식 사본(aria-hidden, id 없음) */
  copy?: boolean;
  as?: "h2" | "h3";
  id?: string;
  title?: ReactNode;
  titleClass?: string;
  meta?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  recs?: readonly Rec[];
  /** 스테이지 모드에서만 보이는 도판 캡션(흐름 모드는 도판 figcaption) */
  stageCaption?: string;
  className?: string;
  style?: CSSProperties;
};

/** 장면 문구 블록: 제목 + meta + 본문 + (목록·칩) + 사업 기록. 스테이지에서는 왼쪽 1~5열 전체 높이, 사업 기록은 아래에 붙는다 */
export function SceneText({ k, first, copy, as = "h3", id, title, titleClass, meta, body, children, recs, stageCaption, className, style }: TextProps) {
  const H = as;
  return (
    <div
      className={cx("st-text", first && "st-first", copy && "st-copy", className)}
      data-k={copy ? undefined : k}
      aria-hidden={copy ? "true" : undefined}
      style={style}
    >
      {title ? (
        <H id={copy ? undefined : id} className={titleClass ?? (as === "h2" ? "h2" : "h3s")}>
          {title}
        </H>
      ) : null}
      {meta ? <p className="meta tnum">{meta}</p> : null}
      {body ? <p className="st-body">{body}</p> : null}
      {children}
      {stageCaption ? <p className="meta st-stageonly st-cap">{stageCaption}</p> : null}
      {recs && recs.length ? <FieldBook recs={recs} /> : null}
    </div>
  );
}

/** 칩 줄(기술·기능) */
export function Chips({ items, title, className }: { items: readonly string[]; title?: string; className?: string }) {
  return (
    <div className={cx("chiprow", className)}>
      {title ? <p className="meta chiprow-title">{title}</p> : null}
      <ul className="chips">
        {items.map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 근거 칸(DESIGN 7.4): ① 등록 특허 또는 자사 직접 개발·운영 ② 적용 사업 ③ 첫 적용(확정된 값만, null 이면 칸을 숨김) */
export function Evidence({ s, k }: { s: Solution; k?: string }) {
  const first = firstAppliedLabel(s.firstApplied);
  const n = first ? 3 : 2;
  return (
    <dl className="evidence" data-k={k} style={{ "--ev-n": n } as CSSProperties}>
      <div className="ev-cell">
        <dt>{s.patent ? sol.evidence.patent : sol.evidence.ownLabel}</dt>
        <dd>{s.patent ?? sol.evidence.own}</dd>
      </div>
      <div className="ev-cell">
        <dt>{sol.evidence.projects}</dt>
        <dd>{s.projects}건</dd>
      </div>
      {first ? (
        <div className="ev-cell">
          <dt>{sol.evidence.first}</dt>
          <dd>{first}</dd>
        </div>
      ) : null}
    </dl>
  );
}

/** 상태 칩(화면 안): 색 + 글자 */
export function StatusChip({ s, children, k }: { s: Status; children: ReactNode; k?: string }) {
  return (
    <span className="sc" data-s={s} data-k={k}>
      {children}
    </span>
  );
}

/** 스켈레톤 막대(화면 안) */
export function Sk({ w, strong, h, style }: { w: string | number; strong?: boolean; h?: number; style?: CSSProperties }) {
  return <span className={cx("sk", strong && "strong")} style={{ width: typeof w === "number" ? `${w}%` : w, height: h, ...style }} />;
}

type FrameProps = {
  /** 머리줄 이름(예: "AcTrack 실시간 추적 현황") */
  title: string;
  /** 접근 가능한 이름 앞부분(예: "AcTrack") */
  name: string;
  children: ReactNode;
  k?: string;
  className?: string;
  caption?: string;
  headExtra?: ReactNode;
  style?: CSSProperties;
};

/** 화면 예시 프레임(DESIGN 7.5): role=img + aria-label, 안쪽 aria-hidden, 아래 캡션 */
export function ScreenFrame({ title, name, children, k, className, caption = captions.screen, headExtra, style }: FrameProps) {
  return (
    <figure className={cx("sf", className)} data-k={k} style={style}>
      <div className="sf-frame screen" role="img" aria-label={`${name} ${caption}`}>
        <div className="sf-head" aria-hidden="true">
          <span className="sf-title">{title}</span>
          {headExtra}
          <StatusChip s="wait">{captions.screenChip}</StatusChip>
        </div>
        <div className="sf-body" aria-hidden="true">
          {children}
        </div>
      </div>
      <figcaption className="meta sf-cap">{caption}</figcaption>
    </figure>
  );
}

/** 폰 도식(DESIGN 7.6): 스켈레톤 화면, 캡션 필수 */
export function PhoneFrame({ label, caption, children, k, className }: { label: string; caption: string; children: ReactNode; k?: string; className?: string }) {
  return (
    <figure className={cx("phone-fig", className)} data-k={k}>
      <div className="phone screen" role="img" aria-label={`${label}. ${caption}`}>
        <span className="phone-speaker" aria-hidden="true" />
        <div className="phone-screen" aria-hidden="true">
          {children}
        </div>
      </div>
      <figcaption className="meta phone-cap">{caption}</figcaption>
    </figure>
  );
}

/** DOM 측점(파랑 고리 + 연두 중심점) */
export function FixDot({ k, small, className, style }: { k?: string; small?: boolean; className?: string; style?: CSSProperties }) {
  return <span className={cx("fixdot", small && "sm", className)} data-k={k} aria-hidden="true" style={style} />;
}

/** 1.1 표제란: 사업 영역 바로 가기 4칸 */
export function TitleBlock({ className }: { className?: string }) {
  return (
    <nav aria-label={titleBlock.label} className={className}>
      <ul className="titleblock">
        {titleBlock.cells.map((c) => (
          <li key={c.href}>
            <a href={c.href} style={{ "--sq": `var(--${c.field})` } as CSSProperties}>
              <span className="tb-name">{c.name}</span>
              <span className="tb-meta">{c.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
