import type { Metadata } from 'next'
import Link from 'next/link'

import { Rise } from '@/components/Rise'
import { Section } from '@/components/ui/Section'
import { COMPANY, FIELDS, PEOPLE, TEAMS } from '@/content/company'
import { AGE_YEARS, FIELD_COUNT } from '@/content/stats'

export const metadata: Metadata = {
  title: '인재영입',
  description: '작은 회사인데 하는 일은 굵습니다 — 아크로퓨처의 사람과 조직, 지원 방법을 소개합니다.',
  alternates: { canonical: '/careers' },
}

/** ⚠ 목적이 분명한 화면이다 — 스크롤 연출을 넣지 않는다. Rise 정도만 쓴다.
 *  ⚠ "16년째" 처럼 손으로 적은 연차를 두지 않는다. 해가 바뀌면 그 문장만 조용히 틀려진다. */
export default function CareersPage() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5 pb-4 pt-16 pc:px-10 pc:pt-24">
        <Rise>
          <p className="font-display text-[12px] font-bold tracking-[0.18em] text-blue-hi">CAREERS</p>
          <h1 className="mt-4 text-[clamp(30px,7vw,44px)] font-extrabold leading-[1.25] tracking-[-0.025em] text-on-deep">
            인재영입
          </h1>
          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.85] text-on-deep-muted">
            {PEOPLE.total}명 중 {PEOPLE.engineers}명이 기술 인력인 작은 회사입니다. 대신 하는 일은
            KT·현대오토에버·iM라이프 같은 곳의 시스템을 {AGE_YEARS}년째 짓고 지키는 굵은 일입니다.
          </p>
        </Rise>
      </div>

      {/* 사람 — 규모는 작지만 숙련도는 얕지 않다는 근거 */}
      <Section tone="deep">
        <Rise>
          <p className="text-[13px] font-semibold text-on-deep-subtle">사람</p>
          <div className="mt-5 grid gap-4 pc:grid-cols-3">
            {[
              { n: `${PEOPLE.total}명`, k: '전체 인원' },
              { n: `${PEOPLE.engineers}명`, k: '기술 인력' },
              { n: `${PEOPLE.seniorRatio}%`, k: '중급 이상 비중' },
            ].map((c) => (
              <div key={c.k} className="rounded-[14px] border border-white/8 bg-white/[0.03] p-6">
                <p className="font-display text-[34px] font-extrabold tabular-nums tracking-[-0.02em] text-on-deep">
                  {c.n}
                </p>
                <p className="mt-1 text-[13.5px] text-on-deep-muted">{c.k}</p>
              </div>
            ))}
          </div>
        </Rise>

        <Rise delay={80} className="mt-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-[14px] border border-white/8 bg-white/[0.03] px-6 py-5 text-[13.5px] text-on-deep-muted">
            {PEOPLE.grades.map((g) => (
              <span key={g.label}>
                {g.label} <span className="font-display font-bold tabular-nums text-on-deep">{g.n}명</span>
              </span>
            ))}
          </div>
        </Rise>
      </Section>

      {/* 조직 — 6개. 기업부설연구소를 포함한다는 사실이 이 회사의 성격을 말해 준다 */}
      <Section tone="raised">
        <Rise>
          <p className="text-[13px] font-semibold text-on-deep-subtle">조직 {TEAMS.length}개</p>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.85] text-on-deep-muted">
            사업팀뿐 아니라 기업부설연구소를 두고 있습니다. 수주한 일을 처리하는 데서 그치지 않고 기술을 직접
            쌓는다는 뜻입니다.
          </p>
          <ul className="mt-6 grid gap-3 pc:grid-cols-2">
            {TEAMS.map((t) => (
              <li
                key={t.key}
                className={`rounded-[14px] border p-5 ${
                  t.key === 'R' ? 'border-blue/40 bg-blue/[0.08]' : 'border-white/8 bg-white/[0.03]'
                }`}
              >
                <p className="text-[15px] font-bold text-on-deep">
                  {t.ko}
                  {t.key === 'R' && (
                    <span className="ml-2 rounded-full bg-blue px-2 py-0.5 align-middle text-[11px] font-semibold text-white">
                      연구소
                    </span>
                  )}
                </p>
                <p className="mt-1 font-display text-[12.5px] text-on-deep-subtle">{t.en}</p>
              </li>
            ))}
          </ul>
        </Rise>
      </Section>

      {/* 하는 일 — 사업 영역 3종을 짧게 다시 짚는다. 자세한 내용은 홈의 사업분야 구간 */}
      <Section tone="deep">
        <Rise>
          <p className="text-[13px] font-semibold text-on-deep-subtle">하는 일</p>
          <ul className="mt-5 grid gap-4 pc:grid-cols-3">
            {FIELDS.map((f) => (
              <li key={f.key} className="rounded-[14px] border border-white/8 bg-white/[0.03] p-6">
                <p className="font-display text-[12px] tabular-nums text-on-deep-subtle">
                  {f.no} · {FIELD_COUNT[f.key]}건
                </p>
                <p className="mt-1.5 text-[15.5px] font-bold text-on-deep">{f.ko}</p>
                <p className="mt-2 text-[13.5px] leading-[1.8] text-on-deep-muted">{f.lede}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/#business"
            className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-blue-hi underline-offset-4 hover:underline"
          >
            사업 영역 자세히 보기
            <span aria-hidden>→</span>
          </Link>
        </Rise>
      </Section>

      {/* 지원 — 공고를 지어내지 않고 사람인으로 안내한다 */}
      <Section tone="raised">
        <Rise>
          <div className="rounded-[14px] border border-white/8 bg-white/[0.03] px-6 py-14 text-center pc:px-16">
            <h2 className="text-[22px] font-extrabold text-on-deep pc:text-[26px]">함께 일할 사람을 찾습니다</h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-[14.5px] leading-[1.8] text-on-deep-muted">
              지금 진행 중인 채용 공고는 사람인에서 확인할 수 있습니다.
            </p>
            <a
              href={COMPANY.recruitUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex h-11 items-center rounded-full bg-blue px-7 text-[14px] font-semibold text-white transition-colors hover:bg-blue-deep"
            >
              사람인에서 채용 공고 보기
            </a>
          </div>
        </Rise>
      </Section>
    </>
  )
}
