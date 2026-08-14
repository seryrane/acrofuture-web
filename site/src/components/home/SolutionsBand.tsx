'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { CREDENTIALS } from '@/content/company'
import { SOLUTIONS, type Solution } from '@/content/solutions'
import { WORKS } from '@/content/works'

/**
 * 핵심 솔루션 — 2026-08-14 시안대로 **탭 전환형**으로 바꿨다.
 * 카드 세 장을 쌓으면 셋 다 반쯤 읽히는데, 탭으로 하나씩 보여 주면 한 번에 하나를 제대로 읽는다.
 *
 * ⚠ 시안의 **지표 세 칸을 그대로 옮기지 않았다.** "95%+ 실내 측위 정확도 · 60% 배터리 절감 ·
 *   23% 시간 단축 · 38% 오픈율"은 잰 자료가 없다(시안 다른 구간의 스톡 사진·"40% 단축"과 같은
 *   자리표시자다). 대신 칸은 그대로 두고 값만 **셀 수 있는 사실**로 채운다 —
 *   특허 건수 · 적용 사업 건수 · 시작 연도. 전부 아래에서 코드가 센다.
 * ⚠ 시안의 오른쪽은 제품 UI 목업인데, 그 안 숫자(12,847 발송 · 38.4% 오픈율 · ₩8.3M 매출)가
 *   전부 지어낸 값이다. 화면에 **가짜 실적판**을 띄우는 셈이라 목업 대신 **근거 판**을 놓았다.
 *   특허와 실제 사업 이력이 이 구간의 핵심이다 — 솔루션 이름은 우리가 붙였지만 그 밑의 계약은 진짜다.
 * ⚠ 배경은 밝은 구간을 유지한다(사용자 결정). 시안은 통짜로 어둡지만 이 사이트는 구간마다 명암이
 *   번갈아 오고, 여기를 어둡게 하면 앞뒤(Showcase·Work)와 붙어 구간 경계가 사라진다.
 */

const TONE: Record<Solution['tone'], string> = {
  blue: 'var(--color-tone-finance)',
  violet: 'var(--color-tone-mobility)',
  cyan: 'var(--color-tone-lbs)',
}

const WORK_BY_SLUG = new Map(WORKS.map((w) => [w.slug, w]))
const PATENT_BY_NO = new Map(CREDENTIALS.patents.map((p) => [p.no, p]))

/** 이 솔루션을 받치는 사업들 — 없는 slug 는 조용히 빠진다(정본이 줄어도 화면이 안 깨지게) */
function worksOf(s: Solution) {
  return s.works.map((slug) => WORK_BY_SLUG.get(slug)).filter((w) => w !== undefined)
}

/**
 * 지표 세 칸 — **잰 수치가 아니라 센 수치**다.
 * ⚠ 손으로 적지 않는다. 이력이 늘거나 특허가 붙으면 여기 값이 따라 움직여야 한다.
 */
function metricsOf(s: Solution) {
  const ws = worksOf(s)
  const since = ws.length ? Math.min(...ws.map((w) => w.year)) : 0
  const running = ws.filter((w) => w.ongoing).length

  return [
    s.patents?.length
      ? { v: `${s.patents.length}건`, l: '등록 특허' }
      : { v: '자사', l: '직접 개발 · 운영' },
    { v: `${ws.length}건`, l: running ? `적용 사업 · ${running}건 운영중` : '적용 사업' },
    { v: since ? `${since}년` : '—', l: '첫 적용' },
  ]
}

/** 아이콘 — 공식 SVG 를 마스크로 올린다(원본이 먹색이라 img 로 넣으면 검게 나온다) */
function Icon({ src, color, size = 'h-7 w-7' }: { src: string; color: string; size?: string }) {
  return (
    <span
      aria-hidden
      className={`block ${size}`}
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

export function SolutionsBand() {
  const [active, setActive] = useState(0)
  const s = SOLUTIONS[active]
  const color = TONE[s.tone]
  const ws = worksOf(s)

  return (
    <Section id="solutions" tone="light">
      <SectionHead
        tone="light"
        eyebrow="PROPRIETARY SOLUTIONS"
        title="특허 기술이 만든 핵심 솔루션"
        lede="외주 개발에서 그치지 않고 아크로퓨처가 직접 설계해 운영하는 솔루션입니다. 각 솔루션 아래에는 그것을 받치는 특허와 실제 사업을 함께 놓았습니다."
      />

      {/* 탭 — 이름과 한 줄 설명을 같이 둔다. 이름만으로는 무엇인지 모른다 */}
      <Rise delay={70}>
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {SOLUTIONS.map((sol, i) => {
            const on = i === active
            const c = TONE[sol.tone]
            return (
              <button
                key={sol.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className="flex min-w-[168px] flex-col items-center gap-1 rounded-[14px] border px-6 py-3.5 transition-colors duration-300"
                style={{
                  borderColor: on ? `color-mix(in oklab, ${c} 45%, transparent)` : 'var(--color-rule)',
                  background: on ? `color-mix(in oklab, ${c} 8%, #ffffff)` : 'transparent',
                }}
              >
                <span
                  className="font-display text-[16px] font-extrabold tracking-[-0.02em]"
                  style={{ color: on ? c : 'var(--color-ink)' }}
                >
                  {sol.name}
                </span>
                <span className="text-[12.5px] text-ink-subtle">{sol.tagline}</span>
              </button>
            )
          })}
        </div>
      </Rise>

      {/* 본 패널 */}
      <Rise delay={140}>
        <div
          className="mt-8 overflow-hidden rounded-[14px] border bg-paper"
          style={{ borderColor: `color-mix(in oklab, ${color} 26%, var(--color-rule))` }}
        >
          <div className="grid pc:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            {/* 왼쪽 — 무엇을 하는 물건인가 */}
            <div className="px-7 py-9 pc:px-10 pc:py-11">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white"
                  style={{ boxShadow: `0 10px 30px -14px ${color}` }}
                >
                  <Icon src={s.icon} color={color} />
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-[12px] font-semibold"
                  style={{ borderColor: `color-mix(in oklab, ${color} 40%, transparent)`, color }}
                >
                  {s.patents?.length ? '특허 기술' : '자체 개발'}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold tracking-[-0.025em] text-ink">
                {s.name}
              </h3>
              <p className="mt-1.5 text-[14.5px] font-medium" style={{ color }}>
                {s.tagline}
              </p>

              <p className="mt-5 text-[16px] leading-[1.9] text-ink-muted">{s.desc}</p>

              <ul className="mt-7 grid gap-2.5 pc:grid-cols-2">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-[13.5px] leading-[1.45] text-ink"
                    style={{
                      borderColor: `color-mix(in oklab, ${color} 18%, transparent)`,
                      background: `color-mix(in oklab, ${color} 4%, #ffffff)`,
                    }}
                  >
                    <span aria-hidden className="shrink-0 font-bold" style={{ color }}>
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* 지표 — 잰 값이 아니라 센 값이다 */}
              <div className="mt-8 grid grid-cols-3 gap-2.5">
                {metricsOf(s).map((m) => (
                  <div
                    key={m.l}
                    className="rounded-[12px] border px-3 py-4 text-center"
                    style={{
                      borderColor: `color-mix(in oklab, ${color} 22%, transparent)`,
                      background: `color-mix(in oklab, ${color} 5%, #ffffff)`,
                    }}
                  >
                    <p className="font-display text-[22px] font-extrabold tabular-nums leading-none" style={{ color }}>
                      {m.v}
                    </p>
                    <p className="mt-2 text-[11.5px] leading-[1.4] text-ink-subtle">{m.l}</p>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-[0.88]"
                style={{ background: color }}
              >
                도입 문의하기 <span aria-hidden>→</span>
              </a>
            </div>

            {/* 오른쪽 — 근거. 시안의 목업 자리다(가짜 실적판 대신 진짜 계약을 놓는다) */}
            <div
              className="border-t border-rule px-7 py-9 pc:border-l pc:border-t-0 pc:px-9 pc:py-11"
              style={{ background: `color-mix(in oklab, ${color} 4%, var(--color-mist))` }}
            >
              <p className="font-display text-[11.5px] font-bold tracking-[0.12em] text-ink-subtle">
                무엇으로 뒷받침되는가
              </p>

              {s.patents?.length ? (
                <ul className="mt-4 space-y-2">
                  {s.patents.map((no) => {
                    const p = PATENT_BY_NO.get(no as (typeof CREDENTIALS.patents)[number]['no'])
                    return (
                      <li
                        key={no}
                        className="rounded-[10px] border bg-white px-3.5 py-3"
                        style={{ borderColor: `color-mix(in oklab, ${color} 30%, transparent)` }}
                      >
                        <p className="text-[11.5px] font-bold tracking-[0.1em]" style={{ color }}>
                          등록 특허
                        </p>
                        <p className="mt-1 text-[14px] leading-[1.5] text-ink">{p?.name ?? no}</p>
                        <p className="mt-1 font-display text-[12.5px] tabular-nums text-ink-subtle">{no}</p>
                      </li>
                    )
                  })}
                </ul>
              ) : null}

              <p className="mt-6 font-display text-[11.5px] font-bold tracking-[0.12em] text-ink-subtle">적용 사업</p>
              <ul className="mt-3 space-y-2.5">
                {ws.map((w) => (
                  <li key={w.slug} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: w.ongoing ? color : 'var(--color-ink-subtle)' }}
                    />
                    <span className="min-w-0">
                      <Link
                        href={`/works/${w.slug}/`}
                        className="text-[14px] leading-[1.5] text-ink underline-offset-4 hover:underline"
                      >
                        {w.title}
                      </Link>
                      {/* ⚠ 고객사가 빈 사업이 있다(자사 상품). 빈 값에 구분점을 붙이면 점이 홀로 남는다 */}
                      <span className="mt-0.5 block font-display text-[12px] tabular-nums text-ink-subtle">
                        {[w.client, w.ongoing ? '운영중' : ''].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 아래 띠 — 지금 몇 번째를 보고 있는지 */}
          <div
            className="flex items-center gap-5 border-t px-7 py-4 pc:px-10"
            style={{ borderColor: 'var(--color-rule)', background: `color-mix(in oklab, ${color} 3%, #ffffff)` }}
          >
            <span className="font-display text-[11px] font-bold tracking-[0.1em] text-ink-subtle">솔루션 선택</span>
            <div className="flex gap-1.5">
              {SOLUTIONS.map((sol, i) => (
                <button
                  key={sol.key}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={sol.name}
                  className="h-2 rounded-full transition-[width,background-color] duration-300"
                  style={{
                    width: i === active ? 28 : 8,
                    background: i === active ? TONE[sol.tone] : 'var(--color-rule)',
                  }}
                />
              ))}
            </div>
            <span className="ml-auto font-display text-[12px] font-semibold tabular-nums" style={{ color }}>
              {active + 1} / {SOLUTIONS.length} — {s.name}
            </span>
          </div>
        </div>
      </Rise>
    </Section>
  )
}
