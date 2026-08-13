import Link from 'next/link'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { formatPeriod, sortByStart } from '@/components/pages/work-utils'
import { FIELD_LABEL, FIELD_TONE } from '@/content/fields'
import { approx, CLIENT_COUNT, CLIENT_RANK, WORK_COUNT } from '@/content/stats'
import { WORKS, type WorkField } from '@/content/works'

/**
 * 주요 실적 — 고객사와 연혁.
 *
 * ⚠ 고객사 목록을 손으로 적지 않는다. `works.ts` 를 세서 **많이 일한 순**으로 낸다 —
 *   손으로 적으면 새 고객이 늘 때 아무도 이 목록을 안 고치고, 그러면 목록이 조용히 낡는다.
 * ⚠ 옆의 건수가 이 구간의 핵심이다. "KT 와 일했다"보다 "KT 와 36건"이 훨씬 많은 말을 한다.
 */


/** 그 고객사와 한 일이 주로 어느 분야였는지 — 배지 색을 고르는 데만 쓴다 */
function mainField(client: string): WorkField {
  const counts = WORKS.filter((w) => w.client === client).reduce<Record<string, number>>((acc, w) => {
    acc[w.field] = (acc[w.field] ?? 0) + 1
    return acc
  }, {})
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'etc') as WorkField
}

const TOP_CLIENTS = CLIENT_RANK.slice(0, 12)
const RECENT = sortByStart(WORKS).slice(0, 8)

export function WorkBand() {
  return (
    <Section id="works" tone="deep">
      <SectionHead
        eyebrow="OUR WORK"
        title="주요 실적"
        lede={`${approx(CLIENT_COUNT)} 고객사와 ${approx(WORK_COUNT)} 사업을 함께해 왔습니다.`}
      />

      <div className="mt-14 grid gap-12 pc:grid-cols-2 pc:gap-16">
        {/* 고객사 */}
        <Rise>
          <div className="flex items-baseline justify-between">
            <h3 className="text-[16.5px] font-bold">주요 고객사</h3>
            {/* ⚠ "N건" 을 카드마다 적지 않는다 — 한 자릿수가 섞이면 오히려 작아 보인다(사용자 2026-08-07) */}
            <p className="text-[13px] text-on-deep-subtle">오래 함께한 순서입니다</p>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-3 pc:grid-cols-3">
            {TOP_CLIENTS.map(({ client }) => {
              const f = mainField(client)
              return (
                <li
                  key={client}
                  className="rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-5 text-center transition-colors hover:border-white/20"
                >
                  <p className="truncate text-[15px] font-bold" title={client}>
                    {client}
                  </p>
                  <p className="mt-1.5 text-[12.5px]" style={{ color: FIELD_TONE[f] }}>
                    {FIELD_LABEL[f]}
                  </p>
                </li>
              )
            })}
          </ul>
        </Rise>

        {/* 연혁 */}
        <Rise delay={80}>
          <div className="flex items-baseline justify-between">
            <h3 className="text-[16.5px] font-bold">최근 사업</h3>
            <Link href="/works/" className="text-[13.5px] text-blue-hi underline-offset-4 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <ol className="mt-5 space-y-5 border-l border-white/10 pl-6">
            {RECENT.map((w) => (
              <li key={w.slug} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[27px] top-1.5 block h-2 w-2 rounded-full"
                  style={{ background: FIELD_TONE[w.field] }}
                />
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-[12.5px] font-bold tabular-nums text-blue-hi">
                    {formatPeriod(w)}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      color: FIELD_TONE[w.field],
                      background: `color-mix(in oklab, ${FIELD_TONE[w.field]} 14%, transparent)`,
                    }}
                  >
                    {FIELD_LABEL[w.field]}
                  </span>
                  {w.ongoing && (
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-on-deep-muted">진행 중</span>
                  )}
                </div>
                <Link
                  href={`/works/${w.slug}/`}
                  className="mt-1.5 block text-[15.5px] text-on-deep-muted underline-offset-4 hover:text-on-deep hover:underline"
                >
                  {w.title}
                </Link>
              </li>
            ))}
          </ol>
        </Rise>
      </div>
    </Section>
  )
}
