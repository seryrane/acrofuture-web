import { cta } from "@/lib/facts";

// 워드마크(DESIGN 4.1): acro + F + uture 를 PJS 800 으로 조판, "F" 만 연두. 접근 가능한 이름은 aria-label 로만 준다
// (글자를 조각내도 스크린리더가 "acro F uture"로 끊어 읽지 않게).
type Props = { className?: string; href?: string; label?: string };

export function Wordmark({ className, href = "#top", label = cta.wordmarkLabel }: Props) {
  return (
    <a href={href} className={className ? `wordmark ${className}` : "wordmark"} aria-label={label}>
      <span aria-hidden="true" lang="en">
        acro<span className="wm-f">F</span>uture
      </span>
    </a>
  );
}

/** 링크가 아닌 워드마크(푸터 표제란 값) */
export function WordmarkText({ className }: { className?: string }) {
  return (
    <span className={className ? `wordmark ${className}` : "wordmark"} lang="en">
      acro<span className="wm-f">F</span>uture
    </span>
  );
}
