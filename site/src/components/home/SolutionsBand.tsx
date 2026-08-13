import Link from 'next/link'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { CREDENTIALS } from '@/content/company'
import { SOLUTIONS, type Solution } from '@/content/solutions'
import { WORKS } from '@/content/works'

/**
 * 자체 솔루션 — 이름 3종은 그대로 두되(사용자 결정 2026-08-07) **설명은 실물로만** 쓴다.
 *
 * ⚠ AcTrack · Cacago 는 회사 소개서에 없는 이름이다. 그래서 기능을 나열하는 데서 끝내지 않고
 *   그 아래에 **근거(특허 등록번호 · 실제 사업 이력)** 를 같이 놓는다. 솔루션 이름은 우리가 붙인
 *   것이지만 그 밑의 계약은 진짜라, 나란히 놓여야 "만들 줄 안다"가 증명된다.
 * ⚠ 정확도 몇 m, 배터리 몇 % 같은 성능 수치는 적지 않는다 — 잰 자료가 없다.
 */

const TONE: Record<Solution['tone'], string> = {
  blue: 'var(--color-tone-finance)',
  violet: 'var(--color-tone-mobility)',
  cyan: 'var(--color-tone-lbs)',
}

const WORK_BY_SLUG = new Map(WORKS.map((w) => [w.slug, w]))
const PATENT_BY_NO = new Map(CREDENTIALS.patents.map((p) => [p.no, p]))

/**
 * 아이콘 — 공식 SVG 를 **마스크로** 올린다.
 * ⚠ `<img>` 로 넣으면 원본이 먹색이라 검게 나온다. 마스크로 모양만 빌리고 색은 우리가 준다.
 */
function Icon({ src, color }: { src: string; color: string }) {
  return (
    <span
      aria-hidden
      className="block h-9 w-9"
      style={{
        backgroundColor: color,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  )
}

function SolutionRow({ s, i }: { s: Solution; i: number }) {
  const color = TONE[s.tone]
  const flip = i % 2 === 1

  return (
    <Rise delay={i * 70}>
      <div
        className={`grid gap-8 overflow-hidden rounded-[14px] border border-rule bg-paper pc:grid-cols-[240px_minmax(0,1fr)] pc:gap-0 ${
          flip ? 'pc:grid-cols-[minmax(0,1fr)_240px]' : ''
        }`}
      >
        {/* 이름 판 */}
        <div
          className={`flex flex-col items-center justify-center px-8 py-10 text-center ${flip ? 'pc:order-2' : ''}`}
          style={{ background: `color-mix(in oklab, ${color} 9%, #ffffff)` }}
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white"
            style={{ boxShadow: `0 10px 30px -14px ${color}` }}
          >
            <Icon src={s.icon} color={color} />
          </span>
          <p className="mt-5 font-display text-[21px] font-extrabold tracking-[-0.02em] text-ink">{s.name}</p>
          <p className="mt-1.5 text-[13.5px] font-medium" style={{ color }}>
            {s.tagline}
          </p>
        </div>

        {/* 내용 */}
        <div className="px-7 pb-9 pt-1 pc:px-10 pc:py-10">
          <p className="text-[16px] leading-[1.9] text-ink-muted">{s.desc}</p>

          <ul className="mt-6 grid gap-x-8 gap-y-3 pc:grid-cols-2">
            {s.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-[14.5px] text-ink">
                <span aria-hidden className="mt-0.5 shrink-0 font-bold" style={{ color }}>
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* 근거 — 이 구간의 핵심이다 */}
          <div className="mt-7 border-t border-rule pt-5">
            <p className="text-[11.5px] font-bold tracking-[0.12em] text-ink-subtle">적용 사례</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {s.patents?.map((no) => {
                const p = PATENT_BY_NO.get(no as (typeof CREDENTIALS.patents)[number]['no'])
                return (
                  <li
                    key={no}
                    className="rounded-full border px-3 py-1.5 text-[13px] font-medium"
                    style={{ borderColor: `color-mix(in oklab, ${color} 40%, transparent)`, color }}
                    title={p?.name}
                  >
                    특허 {no}
                  </li>
                )
              })}
              {s.works.map((slug) => {
                const w = WORK_BY_SLUG.get(slug)
                if (!w) return null
                return (
                  <li key={slug}>
                    <Link
                      href={`/works/${slug}/`}
                      className="inline-block rounded-full border border-rule bg-mist px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink"
                    >
                      {w.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </Rise>
  )
}

export function SolutionsBand() {
  return (
    <Section id="solutions" tone="light">
      <SectionHead
        tone="light"
        eyebrow="OUR SOLUTIONS"
        title="자체 개발 솔루션"
        lede="특허 기술을 바탕으로 아크로퓨처가 직접 개발하고 운영하는 솔루션 3종입니다."
      />
      <div className="mt-14 space-y-6">
        {SOLUTIONS.map((s, i) => (
          <SolutionRow key={s.key} s={s} i={i} />
        ))}
      </div>
    </Section>
  )
}
