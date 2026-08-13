import { Rise } from '@/components/Rise'
import { Section } from '@/components/ui/Section'
import { COMPANY, PEOPLE, TEAMS } from '@/content/company'
import { approx, ENGINEER_RATIO, WORK_COUNT, AGE_YEARS } from '@/content/stats'

/**
 * 회사 소개 구간 — 시안은 여기에 **오피스 스톡 사진**을 넣었지만 그 사진은 이 회사 건물이 아니다.
 *
 * ⚠ 없는 사진을 스톡으로 때우지 않는다. 대신 왼쪽에 **사람 구성**을 그린다 —
 *   "개발자 비율 96%"라고 적는 것보다 등급별 인원이 보이는 편이 같은 말을 더 세게 한다.
 *   (회사 소개서 p3·p4 가 원문이다. 사진이 생기면 그때 바꾼다.)
 */

const MAX_GRADE = Math.max(...PEOPLE.grades.map((g) => g.n))

export function AboutBand() {
  return (
    <Section id="about" tone="light">
      <div className="grid items-center gap-12 pc:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] pc:gap-16">
        {/* ── 왼쪽: 사람 구성 ─────────────────────────────────────────── */}
        <Rise className="relative">
          <div className="rounded-[14px] border border-rule bg-paper p-7 pc:p-9">
            <p className="font-display text-[11.5px] font-bold tracking-[0.16em] text-blue-deep">OUR TEAM</p>
            <p className="mt-3 text-[16px] font-semibold text-ink">
              {PEOPLE.total}명 중 {PEOPLE.engineers}명이 개발자입니다
            </p>
            <p className="mt-1 text-[14px] text-ink-subtle">
              약 {ENGINEER_RATIO}% · 특급·고급이 {PEOPLE.grades[0].n + PEOPLE.grades[1].n}명
            </p>

            <ul className="mt-7 space-y-3.5">
              {PEOPLE.grades.map((g, i) => (
                <li key={g.label} className="flex items-center gap-4">
                  <span className="w-9 shrink-0 text-[13px] font-medium text-ink-muted">{g.label}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-rule">
                    <span
                      className="block h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-soft)]"
                      style={{
                        width: `${(g.n / MAX_GRADE) * 100}%`,
                        background: i < 2 ? 'var(--color-blue)' : 'color-mix(in oklab, var(--color-blue) 40%, #cbd5e1)',
                      }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right font-display text-[13px] font-bold tabular-nums text-ink">
                    {g.n}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-rule pt-6">
              <p className="text-[12.5px] font-semibold text-ink-muted">조직 {TEAMS.length}개</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {TEAMS.map((t) => (
                  <li
                    key={t.key}
                    className="rounded-full border border-rule bg-mist px-3 py-1.5 text-[13.5px] text-ink-muted"
                  >
                    {t.ko}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KT 배지 — 시안의 자리를 그대로 쓰되 근거가 있는 문구로 바꾼다 */}
          <div className="absolute -bottom-5 right-4 rounded-[14px] bg-blue px-5 py-3.5 text-center text-white shadow-[0_16px_40px_-12px_rgba(68,114,245,0.7)]">
            {/* ⚠ "KT 36건" 처럼 딱 떨어지는 수를 세어 보이지 않는다(사용자 요청 2026-08-07) */}
            <p className="font-display text-[16px] font-extrabold leading-none">KT 우수협력상</p>
            <p className="mt-1.5 text-[11.5px] font-medium text-white/85">2025 · AI/IT 분야</p>
          </div>
        </Rise>

        {/* ── 오른쪽: 문장과 사실 ─────────────────────────────────────── */}
        <Rise delay={80}>
          <p className="flex items-center gap-3 font-display text-[12px] font-bold tracking-[0.18em] text-blue-deep">
            <span className="block h-px w-6 bg-blue-deep" />
            ABOUT ACROFUTURE
          </p>
          <h2 className="mt-5 text-[clamp(28px,6vw,46px)] font-extrabold leading-[1.25] tracking-[-0.02em] text-ink">
            {AGE_YEARS}년의 기록,
            <br />
            <span className="text-blue">지금도</span> 이어지고 있습니다
          </h2>

          <p className="mt-6 text-[16.5px] leading-[1.9] text-ink-muted">
            {COMPANY.founded} 설립. 위치 기반 서비스로 출발해 금융 고객채널과 차량 콘텐츠 플랫폼으로 넓혔습니다.
            지금까지 {approx(WORK_COUNT)} 사업을 수행했고, 그중 상당수는 지금도 저희가 운영하고 있습니다.
          </p>
          <p className="mt-4 text-[16.5px] leading-[1.9] text-ink-muted">
            끝나면 떠나는 대신 오래 지키는 쪽을 택해 왔습니다. 만든 사람이 지키면 문제가 생겼을 때 원인까지 가는 길이
            짧습니다 — 재난안전통신망은 3년을 지어 7년째 운영 중입니다.
          </p>

          <dl className="mt-9 space-y-3.5 text-[15px]">
            {[
              ['대표이사', COMPANY.ceo],
              ['주소', `(${COMPANY.zip}) ${COMPANY.address}`],
              ['연락처', `${COMPANY.tel} · ${COMPANY.email}`],
              ['사업자등록번호', COMPANY.bizNo],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <dt className="w-[92px] shrink-0 text-ink-subtle">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </Section>
  )
}
