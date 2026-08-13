'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

/**
 * 등장 — 올라오는 만큼 떠오른다.
 *
 * ⚠ 곡선·시간·범위는 전부 토큰(`globals.css` 의 `.rise`)이 정한다 — 여기서 값을 새로 만들지
 *   않는다. 움직임 최소화 설정에서도 CSS 가 알아서 멈춘다.
 *
 * ⚠⚠ **이 관찰자를 "이제 CSS 가 하니까"라며 지우면 안 된다** (2026-08-11).
 *   요즘 브라우저에서 떠오르는 움직임 자체는 `animation-timeline: view()` 가 맡는다.
 *   그럼에도 여기가 남아 있는 까닭은 둘이다.
 *   ① **미지원 브라우저의 유일한 길** — `.rise` 의 시작 상태가 `opacity: 0` 이라,
 *      켜 주는 쪽이 없으면 글이 영영 안 보인다.
 *   ② **도해가 그려지는 순서의 열쇠** — `.rise[data-in='true'] .af-dia .af-draw` 가
 *      "선 → 이름표 → 결론" 순서를 연다. 그건 스크롤 위치가 아니라 **시간**으로 짜인 연출이라
 *      타임라인으로 옮길 수 없다. 여기를 지우면 도해가 아예 안 그려진다.
 *
 * ⚠ 한 번만 켜고 관찰을 끊는다: 오르내릴 때마다 다시 움직이면 화면이 안 가만히 있는다.
 * ⚠ `delay` 는 미지원 브라우저에서만 뜻이 있다(스크롤에 물리면 순서는 자리가 정한다).
 */
export function Rise({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          el.dataset.in = 'true'
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`rise ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
