import type { Metadata } from 'next'
import Link from 'next/link'

import { Rise } from '@/components/Rise'
import { WorksExplorer } from '@/components/works/WorksExplorer'
import { imgSize } from '@/content/media-manifest'
import { SHOWCASE } from '@/content/showcase'
import { approx, AGE_YEARS, CLIENT_COUNT } from '@/content/stats'
import { COMPANY } from '@/content/company'
import { WORK_COUNT } from '@/content/works'

export const metadata: Metadata = {
  title: '사업 사례',
  description: `${COMPANY.foundedYear}년부터 지금까지 수행한 사업을 분야와 고객사로 찾아볼 수 있습니다.`,
  alternates: { canonical: '/works' },
}

/** 캡처가 남아 있는 사례 — 목록 위에 먼저 세운다. **본 적 있는 화면**이 목록보다 먼저 걸린다 */
const WITH_SHOTS = SHOWCASE.filter((c) => c.work).slice(0, 9)

/**
 * 사업 사례 목록 — 이 회사의 가장 강한 자산.
 *
 * ⚠ 찾으러 온 사람의 스크롤을 뺏지 않는다(기획서 결정). 등장은 머리글에 한 번만 쓰고,
 *   목록 자체와 필터에는 애니메이션을 넣지 않는다.
 * ⚠ 필터·목록 상태는 WorksExplorer(클라이언트)가 진다 — 이 페이지는 서버 컴포넌트로 남겨
 *   metadata 를 낼 수 있게 한다.
 */
export default function WorksPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 pc:px-10 pc:py-24">
      <Rise as="header" className="max-w-[60ch]">
        <p className="font-display text-[12px] font-bold tracking-[0.18em] text-blue-hi">OUR WORK</p>
        <h1 className="mt-4 text-[clamp(30px,7vw,44px)] font-extrabold tracking-[-0.025em] text-on-deep">
          사업 사례 {approx(WORK_COUNT)}
        </h1>
        <p className="mt-4 text-[15px] leading-[1.85] text-on-deep-muted">
          {COMPANY.foundedYear}년부터 {AGE_YEARS}년 동안 {approx(CLIENT_COUNT)} 고객사와 함께한 사업 전체입니다.
          분야와 고객사로 찾아보실 수 있습니다.
        </p>
      </Rise>

      {/* 화면이 남아 있는 사례 */}
      <section className="mt-14" aria-labelledby="with-shots">
        <h2 id="with-shots" className="font-display text-[12px] font-bold tracking-[0.14em] text-blue-hi">
          SCREENS
        </h2>
        <p className="mt-2 text-[13px] text-on-deep-subtle">주요 프로젝트의 실제 구축 화면입니다.</p>
        <ul className="mt-5 grid gap-5 pc:grid-cols-3">
          {WITH_SHOTS.map((c, i) => (
            <Rise as="li" key={c.key} delay={i * 60}>
              <Link
                href={`/works/${c.work}/`}
                className="group block h-full overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.03] transition-colors hover:border-white/25"
              >
                {/* ⚠ object-cover 로 자르지 않는다 — 폰 목업처럼 세로가 긴 그림은 흰 여백만 남아
                    "이미지가 안 나온다"로 보인다(2026-08-07 실제로 그랬다). 담아서 전부 보여 준다. */}
                <span className="flex aspect-[16/9] items-center justify-center overflow-hidden bg-deep-3 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
                  <img
                    src={c.shots[0].src}
                    alt={c.shots[0].alt}
                    {...imgSize(c.shots[0].src)}
                    loading="lazy"
                    decoding="async"
                    // ⚠ 상세 쪽 첫 그림과 **같은 이름**이라 눌렀을 때 카드가 상세로 자라난다.
                    //   이름은 사업 slug 로 짓는다 — 한 쪽 안에서 겹치지 않는 유일한 값이다
                    //   (같은 이름이 둘이면 그 전환은 통째로 취소된다).
                    style={{ viewTransitionName: `shot-${c.work}` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="block p-5">
                  <span className="block font-display text-[12px] tabular-nums text-on-deep-subtle">{c.period}</span>
                  <span className="mt-1.5 block text-[14.5px] font-semibold leading-snug text-on-deep">{c.title}</span>
                  {c.client && <span className="mt-1 block text-[13px] text-on-deep-muted">{c.client}</span>}
                </span>
              </Link>
            </Rise>
          ))}
        </ul>
      </section>

      <WorksExplorer />
    </div>
  )
}
