/**
 * 로고 — **acroFuture 중 `F` 만 연두색, 나머지는 파란색이다** (사용자 확인 2026-08-07).
 *
 * ⚠ **원본 SVG 로고 파일을 쓰지 않는다.** 2026-08-07 에 `acrofuture.com/images/acrofuture.svg`
 *   를 그대로 붙여 봤는데, 태그라인("Mobile Future in Reality")이 함께 들어간 가로로 긴 덩어리라
 *   이 사이트의 머리에 안 어울렸다(사용자 판단). **글자로 짠 지금 형태를 쓴다.**
 * ⚠ 머리와 발에 따로 적지 않는다. 두 곳에 손으로 쓰면 한 곳만 고쳐져서 화면마다 색이 달라진다.
 * ⚠ `F` 를 `<span>` 으로 떼어 놓되 **한 줄로 붙여 쓴다** — 줄바꿈으로 나누면 브라우저가
 *   그 자리에 띄어쓰기를 넣어 "acro F uture" 가 된다.
 */
export function Logo({ className = 'text-[22px]' }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-[-0.04em] text-brand-blue ${className}`}>
      acro<span className="text-brand-leaf">F</span>uture
    </span>
  )
}
