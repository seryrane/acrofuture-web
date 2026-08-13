import type { ReactNode } from 'react'

import { Rise } from '@/components/Rise'

/**
 * 구간 — 시안의 리듬을 한 곳에 가둔다.
 *
 * ⚠ 구간마다 여백을 손으로 적지 않는다. 시안에서 잰 값은 **상하 128px / 좌우 40px** 하나뿐이고,
 *   한 군데만 다르면 스크롤할 때 그 자리에서 박자가 어긋난다.
 * ⚠ 바탕은 `deep`(기본) → `raised`(한 단 올린 어두움) → `light`(밝은 구간) 셋뿐이다.
 *   색을 더 만들면 "여긴 왜 다른 색이지"라는 질문이 생기고, 그 질문에 답이 없다.
 */
export type SectionTone = 'deep' | 'raised' | 'light'

const TONE_BG: Record<SectionTone, string> = {
  deep: 'bg-deep text-on-deep',
  raised: 'bg-deep-2 text-on-deep',
  light: 'bg-mist text-ink',
}

export function Section({
  id,
  tone = 'deep',
  className = '',
  children,
}: {
  id?: string
  tone?: SectionTone
  className?: string
  children: ReactNode
}) {
  return (
    // cv-section: 화면 밖이면 안 그린다(globals.css). 히어로는 Section 을 안 쓰므로
    // 첫 화면은 영향을 안 받는다 — 가장 중요한 자리를 건너뛰기 판단에 맡기지 않는다.
    <section id={id} className={`cv-section relative px-5 py-20 pc:px-10 pc:py-32 ${TONE_BG[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </section>
  )
}

/**
 * 구간 머리 — 얇은 선 + 영문 이름표 → 큰 한글 제목 → 한 줄 설명.
 * ⚠ 이 세 줄의 순서와 간격이 시안의 격을 만든다. 페이지마다 다르게 쓰지 않는다.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = 'center',
  tone = 'deep',
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  align?: 'center' | 'left'
  tone?: SectionTone
}) {
  const light = tone === 'light'
  return (
    <Rise className={align === 'center' ? 'text-center' : ''}>
      <p
        className={`flex items-center gap-3 font-display text-[12px] font-bold tracking-[0.18em] ${
          align === 'center' ? 'justify-center' : ''
        } ${light ? 'text-blue-deep' : 'text-blue-hi'}`}
      >
        <span className={`block h-px w-6 ${light ? 'bg-blue-deep' : 'bg-blue-hi'}`} />
        {eyebrow}
      </p>
      <h2
        className={`mt-5 text-[clamp(28px,6vw,46px)] font-extrabold leading-[1.25] tracking-[-0.02em] ${
          light ? 'text-ink' : 'text-on-deep'
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-4 text-[16.5px] leading-[1.85] ${align === 'center' ? 'mx-auto max-w-[700px]' : 'max-w-[700px]'} ${
            light ? 'text-ink-muted' : 'text-on-deep-muted'
          }`}
        >
          {lede}
        </p>
      )}
    </Rise>
  )
}

/** 카드 — 어두운 구간 위의 기본 판. 모서리 14px 은 시안에서 잰 값이다 */
export function Card({
  className = '',
  children,
  tone = 'deep',
}: {
  className?: string
  children: ReactNode
  tone?: SectionTone
}) {
  return (
    <div
      className={`rounded-[14px] border ${
        tone === 'light' ? 'border-rule bg-paper' : 'border-white/8 bg-white/[0.03]'
      } ${className}`}
    >
      {children}
    </div>
  )
}
