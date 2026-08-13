import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FieldArt } from '@/components/FieldArt'
import { FIELDS } from '@/content/company'
import { FIELD_LABEL, FIELD_META } from '@/content/fields'
import { imgSize } from '@/content/media-manifest'
import { SHOWCASE } from '@/content/showcase'
import { WORKS, type Work, type WorkField } from '@/content/works'


/** company.ts 의 FIELDS 는 finance/mobility/lbs 세 축만 정의한다(사업 영역 페이지 기준).
 *  etc 로 분류된 사업(교육·공공·유통 등, 15건)엔 재사용할 lede 가 없어 여기서 한 줄을 따로 둔다 —
 *  다만 새 주장을 지어내지 않고 "세 축 밖"이라는 사실만 말한다. */
const FIELD_LEDE: Record<WorkField, string> = {
  finance: FIELDS.find((f) => f.key === 'finance')!.lede,
  mobility: FIELDS.find((f) => f.key === 'mobility')!.lede,
  lbs: FIELDS.find((f) => f.key === 'lbs')!.lede,
  etc: '세 사업팀의 축 밖에서 고객사의 필요에 맞춰 진행한 사업입니다.',
}

// 사업명 자체에 있는 동사만 뽑는다 — 지어낸 "역할"이 아니라 원문 표기에서 그대로 가져온 것이다
const ROLE_KEYWORDS = ['기획', '구축', '개발', '운영', '유지보수', '고도화', '전개', '관리']

function extractRoles(title: string): string[] {
  return ROLE_KEYWORDS.filter((k) => title.includes(k))
}

function formatYm(ym: string): string {
  const [y, m] = ym.split('-')
  return `${y}년 ${Number(m)}월`
}

function formatPeriod(w: Work): string {
  if (w.ongoing) return `${formatYm(w.from)} ~ 진행중`
  if (!w.to || w.to === w.from) return formatYm(w.from)
  return `${formatYm(w.from)} ~ ${formatYm(w.to)}`
}

/** 문자열을 숫자 씨앗으로 접는다 — 같은 사업은 새로고침해도, 배포를 다시 해도 늘 같은 배경 그림이 나온다 */
function seedFromSlug(slug: string): number {
  let s = 0
  for (const ch of slug) s = (s + ch.charCodeAt(0)) % 9973
  return s || 1
}

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = WORKS.find((w) => w.slug === slug)
  if (!work) return { title: '사업 사례' }

  const description = work.client
    ? `${work.client} · ${FIELD_LABEL[work.field]} · ${formatPeriod(work)}`
    : `${FIELD_LABEL[work.field]} · ${formatPeriod(work)}`

  return {
    title: work.title,
    description,
    alternates: { canonical: `/works/${work.slug}` },
    openGraph: { title: work.title, description },
  }
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = WORKS.find((w) => w.slug === slug)
  if (!work) notFound()

  const roles = extractRoles(work.title)

  // 이 사업의 실제 화면 — 회사 소개서 포트폴리오에 캡처가 남아 있는 건만 있다
  const shots = SHOWCASE.find((c) => c.work === work.slug)

  // ② 같은 고객사의 다른 사업 — 고객사가 빈 값이면 비교할 게 없어 비운다
  const sameClient = work.client ? WORKS.filter((w) => w.client === work.client && w.slug !== work.slug) : []

  // ③ 같은 분야의 최근 사업 3건
  const sameField = WORKS.filter((w) => w.field === work.field && w.slug !== work.slug)
    .sort((a, b) => b.year - a.year || b.from.localeCompare(a.from))
    .slice(0, 3)

  return (
    <div>
      <section className="relative overflow-hidden bg-deep py-20 pc:py-28">
        <FieldArt seed={seedFromSlug(work.slug)} />
        <div className="relative mx-auto max-w-[1280px] px-5 pc:px-10">
          <p className="text-[13px] font-medium text-on-deep-subtle">
            {FIELD_LABEL[work.field]}
            {work.client ? ` · ${work.client}` : ''}
          </p>
          <h1 className="mt-3 max-w-[26ch] text-[28px] font-extrabold leading-[1.28] tracking-[-0.02em] text-on-deep pc:text-[42px]">
            {work.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-12 pc:px-10 pc:py-16">
        {/* 메타 4칸 */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-b border-white/10 pb-12 pc:grid-cols-4">
          <div>
            <dt className="text-[12px] font-semibold text-on-deep-subtle">고객사</dt>
            <dd className="mt-1.5 text-[15px] text-on-deep">{work.client}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-on-deep-subtle">기간</dt>
            <dd className="mt-1.5 text-[15px] tabular-nums text-on-deep">{formatPeriod(work)}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-on-deep-subtle">분야</dt>
            <dd className="mt-1.5 text-[15px] text-on-deep">{FIELD_LABEL[work.field]}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-on-deep-subtle">역할</dt>
            <dd className="mt-1.5 text-[15px] text-on-deep">{roles.length ? roles.join(' · ') : '—'}</dd>
          </div>
        </dl>

        {/* ① 사업 설명 — **이 사업만의 설명이 있으면 그걸 먼저 쓴다.**
            ⚠ 예전에는 분야 일반 설명만 띄워서, 정작 사업 소개가 상세에 안 나왔다
              (2026-08-07 사용자 지적 — AI 고객센터 문구가 홈에만 있고 상세엔 없었다).
            분야 설명은 그 아래에 한 단계 작게 붙인다. */}
        <div className="max-w-[62ch] py-12">
          {shots?.desc && <p className="text-[17px] leading-[1.85] text-on-deep">{shots.desc}</p>}
          <p className={`text-[15px] leading-[1.8] text-on-deep-muted ${shots?.desc ? 'mt-5' : 'text-[16px]'}`}>
            이 사업은 <strong className="font-semibold text-on-deep">{FIELD_LABEL[work.field]}</strong> 분야입니다
            {/* 어느 팀이 맡는 일인지까지 밝힌다 — 분류가 곧 조직이라는 것이 이 회사의 구조다 */}
            {FIELD_META[work.field].team ? ` (${FIELD_META[work.field].team})` : ''}. {FIELD_LEDE[work.field]}
          </p>
        </div>

        {/* 실제 화면 — 있는 사업에만 나온다. 없는 사업에 자리표시자를 두지 않는다 */}
        {shots && (
          <section className="border-t border-white/10 py-12">
            <h2 className="text-[19px] font-bold text-on-deep">실제 구축 화면</h2>
            {/* ⚠ 출처(소개서 pNN)를 화면에 쓰지 않는다 — 방문자에게는 뜻이 없는 말이다 */}
            <p className="mt-2 text-[13px] text-on-deep-subtle">
              구축·운영한 화면 {shots.shots.length}장입니다.
            </p>
            {shots.stack && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {shots.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-display text-[11.5px] text-on-deep-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-6 grid gap-5 pc:grid-cols-2">
              {shots.shots.map((s, si) => (
                <li
                  key={s.src}
                  // ⚠ **가로로 넓은 것만** 한 줄을 다 쓴다(사용자 요청 2026-08-07).
                  //   휴대폰 화면(세로)까지 늘리면 750px 짜리를 1000px 로 키우게 되어 흐려진다 —
                  //   넓게 보여 주자는 뜻은 "잘 읽히게"였지 "무조건 크게"가 아니다.
                  className={`overflow-hidden rounded-[14px] border border-white/10 ${
                    s.kind === 'slide' ? 'bg-deep-3 pc:col-span-2' : 'bg-white'
                  }`}
                >
                  {/* ⚠ object-contain + max-h — 소개서 캡처는 비율이 제각각이라(720x1280 부터
                      2745x1713 까지) 폭에 맞추면 세로가 화면을 넘어간다 */}
                  <div className="flex items-center justify-center p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
                    <img
                      src={s.src}
                      alt={s.alt}
                      {...imgSize(s.src)}
                      loading="lazy"
                      decoding="async"
                      // ⚠ 원본보다 크게 늘리지 않는다 — 확대하면 글자가 뭉갠다
                      className="block max-h-[720px] w-auto max-w-full object-contain"
                      style={{
                        maxWidth: 'min(100%, 1000px)',
                        // ⚠ **첫 장에만** 준다 — 목록의 카드 그림과 같은 이름이라 눌렀을 때
                        //   그 그림이 그대로 커지며 들어온다. 한 쪽에 같은 이름이 둘 있으면
                        //   브라우저가 어느 쪽인지 몰라 전환을 통째로 취소한다.
                        viewTransitionName: si === 0 ? `shot-${work.slug}` : undefined,
                      }}
                    />
                  </div>
                  <p
                    className={`border-t px-4 py-3 text-[12px] ${
                      s.kind === 'slide' ? 'border-white/10 text-on-deep-muted' : 'border-rule text-ink-muted'
                    }`}
                  >
                    {s.alt}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sameClient.length > 0 && (
          <section className="border-t border-white/10 py-12">
            <h2 className="text-[19px] font-bold text-on-deep">{work.client}의 다른 사업</h2>
            <ul className="mt-6 divide-y divide-white/6">
              {sameClient.map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`/works/${w.slug}/`}
                    className="flex items-center justify-between gap-4 py-3.5 text-[14.5px] text-on-deep-muted transition-colors hover:text-on-deep"
                  >
                    <span>{w.title}</span>
                    <span className="shrink-0 tabular-nums text-on-deep-subtle">{w.year}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sameField.length > 0 && (
          <section className="border-t border-white/10 py-12">
            <h2 className="text-[19px] font-bold text-on-deep">{FIELD_LABEL[work.field]} 분야의 최근 사업</h2>
            <ul className="mt-6 grid gap-4 pc:grid-cols-3">
              {sameField.map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`/works/${w.slug}/`}
                    className="block h-full rounded-xl border border-white/10 p-5 transition-colors hover:border-white/30 hover:bg-white/5"
                  >
                    <p className="text-[12.5px] tabular-nums text-on-deep-subtle">
                      {w.year}
                      {w.client ? ` · ${w.client}` : ''}
                    </p>
                    <p className="mt-2 text-[14.5px] font-medium leading-snug text-on-deep">{w.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="border-t border-white/10 pt-12">
          <Link
            href="/works/"
            className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-medium text-on-deep-muted hover:text-on-deep"
          >
            ← 사업 사례 목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
