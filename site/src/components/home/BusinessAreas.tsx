'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { formatPeriod, sortByStart } from '@/components/pages/work-utils'
import { FIELD_META } from '@/content/fields'
import { imgSize } from '@/content/media-manifest'
import { SHOWCASE } from '@/content/showcase'
import { SOLUTIONS } from '@/content/solutions'
import { approx, FIELD_COUNT, FIELD_START } from '@/content/stats'
import { WORKS, type WorkField } from '@/content/works'

/**
 * 핵심 사업 영역 — 시안의 카드 네 장을 그대로 쓰되 세 가지를 바꿨다.
 *
 * ⚠ 카드 사진: 시안은 Unsplash 스톡 네 장이었다. 여기서는 **우리가 실제로 만든 화면**을 쓴다.
 *   금융은 iM캐피탈 웹, 모빌리티는 현대오토에버 관리자, 측위는 KT U 안심 알리미 화면이다.
 *   스톡 사진은 어느 회사 사이트에나 있어서 아무 말도 하지 않지만, 실물은 그 자체가 증거다.
 * ⚠ 카드 사진에 **구성도(아키텍처 다이어그램)를 쓰지 않는다** — 16:7 로 잘리면 글자가 뭉개져서
 *   무엇을 그린 그림인지 안 읽힌다. 구성도는 큰 자리(구축 화면 구간·사례 상세)에서만 쓴다.
 *   솔루션 카드만 예외인데, 자체 솔루션은 남의 화면을 못 쓰기 때문이다.
 * ⚠ 카드 문장에 연차를 손으로 적지 않는다. "{시작연도}년부터"는 이력에서 잰 값이다 —
 *   소개서 본문("2017년부터 금융·모빌리티로 확장")은 이력과 어긋나서 쓰지 않는다.
 * ⚠ "이력 및 포트폴리오 보기"를 눌렀을 때 새 페이지로 튀지 않고 **그 자리에서 펼친다.**
 *   무엇이 있는지 먼저 보여 주고, 더 보고 싶을 때 목록으로 보낸다.
 */

type Area = {
  key: WorkField | 'solution'
  no: string
  ko: string
  en: string
  team: string
  desc: string
  chips: string[]
  img: string
  imgAlt: string
  tone: string
}

const AREAS: Area[] = [
  {
    key: 'finance',
    no: '01',
    ko: FIELD_META.finance.ko,
    en: FIELD_META.finance.en,
    team: FIELD_META.finance.team,
    desc: '보험과 캐피탈의 고객채널·내부 시스템을 짓고, 끝나면 떠나는 대신 오래 운영합니다. 대출 신청처럼 한 단계만 막혀도 사람이 떠나는 화면을 주로 다룹니다.',
    chips: ['모바일·인터넷뱅킹', 'UI/UX 리뉴얼', '오토금융', '에이전트 포털'],
    img: '/media/works/im-capital-web-2.webp',
    imgAlt: 'iM캐피탈 대출 상품 웹사이트',
    tone: 'var(--color-tone-finance)',
  },
  {
    key: 'mobility',
    no: '02',
    ko: FIELD_META.mobility.ko,
    en: FIELD_META.mobility.en,
    team: FIELD_META.mobility.team,
    desc: '내비게이션의 검색과 지도, 차량 콘텐츠를 만들고 서비스를 이어서 운영합니다. 테스트 자동화 플랫폼처럼 차량 밖의 서비스 구축도 이 팀이 맡습니다.',
    chips: ['POI Search', '글로벌 CP 관리', 'MAPGPT · 내비3D', '커넥티드카', 'aiworks'],
    img: '/media/works/autoever-cp-admin-1.webp',
    imgAlt: '현대오토에버 글로벌 CP 관리자 대시보드',
    tone: 'var(--color-tone-mobility)',
  },
  {
    key: 'lbs',
    no: '03',
    ko: FIELD_META.lbs.ko,
    en: FIELD_META.lbs.en,
    team: FIELD_META.lbs.team,
    desc: '통신사 플랫폼과 국책과제로 쌓았습니다. 위치를 재는 기술에서 시작해, 그 위치로 무엇을 할지까지 만들고 재난안전통신망처럼 오래 지켜야 하는 시스템을 맡습니다.',
    chips: ['복합측위 AI/ML', 'RTK 정밀측위', '재난안전통신망', 'Smart Zone Cast'],
    img: '/media/works/kt-usafe-1.webp',
    imgAlt: 'KT U 안심 알리미 위치 확인 화면',
    tone: 'var(--color-tone-lbs)',
  },
  {
    key: 'solution',
    no: '04',
    ko: '자체 솔루션',
    en: 'OWN SOLUTIONS',
    team: '',
    // ⚠ "3종"을 손으로 적어 두었다가 솔루션이 넷이 된 뒤에도 3종이라 말했다. 개수는 정본에서 센다.
    desc: `특허 2건과 통신사 플랫폼 이력을 묶어 자체 솔루션 ${SOLUTIONS.length}종으로 냅니다. 위치를 재는 일, 구역에 알리는 일, 배차를 짜는 일, 움직이는 자산을 대장으로 만드는 일입니다.`,
    chips: SOLUTIONS.map((s) => s.name),
    // 회사가 이미 쓰던 솔루션 일러스트 그대로(acrofuture.com/images/service_sol.svg).
    // ⚠ 원본은 **벡터가 아니라 PNG 를 감싼 SVG 껍데기**(205KB)였다 — 확장자만 SVG 다.
    //   `scripts/build-media.mjs` 가 webp 로 구워서 쓴다(크기와 함께).
    img: '/media/brand/service_sol.webp',
    imgAlt: '위치 기반 솔루션 구성 일러스트',
    tone: 'var(--color-tone-etc)',
  },
]

function AreaCard({ area, open, onToggle }: { area: Area; open: boolean; onToggle: () => void }) {
  const isField = area.key !== 'solution'
  const count = isField ? FIELD_COUNT[area.key as WorkField] : 0
  const since = isField ? FIELD_START[area.key as WorkField] : 0

  return (
    <div className="overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.03]">
      <div className="relative aspect-[16/7] overflow-hidden bg-deep-3">
        {area.img ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
            <img
              src={area.img}
              alt={area.imgAlt}
              {...imgSize(area.img)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center opacity-80 transition-transform duration-700 ease-[var(--ease-out-soft)] hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent" />
          </>
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-1.5"
            style={{ background: `radial-gradient(ellipse at 50% 120%, color-mix(in oklab, ${area.tone} 22%, transparent), transparent 70%)` }}
          >
            {SOLUTIONS.map((s) => (
              <p key={s.key} className="font-display text-[clamp(15px,3vw,20px)] font-extrabold tracking-[-0.02em] text-on-deep/85">
                {s.name}
              </p>
            ))}
          </div>
        )}
        <span className="absolute left-4 top-4 font-display text-[12px] font-extrabold" style={{ color: area.tone }}>
          {area.no}
        </span>
      </div>

      <div className="p-6 pc:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[21px] font-bold tracking-[-0.015em]">{area.ko}</h3>
            <p className="mt-1 font-display text-[11.5px] font-bold tracking-[0.12em]" style={{ color: area.tone }}>
              {area.en}
            </p>
            {/* 어느 팀이 하는 일인지 — 조직 소개와 사업 이력이 같은 말을 하게 만든다 */}
            {area.team && <p className="mt-1.5 text-[13px] text-on-deep-subtle">{area.team}</p>}
          </div>
          {isField && (
            <p className="shrink-0 pt-1 text-right text-[13px] text-on-deep-subtle">
              <span className="font-display font-bold tabular-nums text-on-deep">{approx(count)}</span>
              <br />
              {since}년부터
            </p>
          )}
        </div>

        <p className="mt-4 text-[15.5px] leading-[1.85] text-on-deep-muted">{area.desc}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {area.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border px-3 py-1.5 text-[13px] font-medium"
              style={{ borderColor: `color-mix(in oklab, ${area.tone} 35%, transparent)`, color: area.tone }}
            >
              {c}
            </li>
          ))}
        </ul>

        {/* ⚠ 카드 안에서 펼치지 않고 **격자 아래 넓은 판**을 연다(2026-08-14 시안).
            카드 안에서 펼치면 그 카드만 길어져 옆 카드와 높이가 어긋나고, 고객사·기술 스택·
            포트폴리오를 240px 남짓한 폭에 우겨넣게 된다. */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="mt-6 flex items-center gap-2 text-[14px] text-on-deep-muted transition-colors hover:text-on-deep"
        >
          <span aria-hidden className={`inline-block transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            ⌄
          </span>
          {open ? '접기' : '이력 및 포트폴리오 보기'}
        </button>
      </div>
    </div>
  )
}

/**
 * 펼침 상세 — 네 덩어리 전부 **저장소 정본에서 센 값**이다.
 * 주요 고객사 = works 의 client, 기술 스택 = showcase 의 stack, 이력 = works, 포트폴리오 = showcase 의 shots.
 * ⚠ 시안에는 기술 스택이 GPS/WiFi·LBS SDK·Push Server·Java·Spring·Android/iOS 로 적혀 있었지만
 *   그건 근거가 없다. 여기서는 사례에 실제로 적힌 stack 만 모은다 — 없으면 그 줄이 통째로 빠진다.
 */
function AreaDetail({ area, onClose }: { area: Area; onClose: () => void }) {
  const isField = area.key !== 'solution'
  const solutionSlugs = new Set(SOLUTIONS.flatMap((s) => s.works))

  const works = sortByStart(
    isField ? WORKS.filter((w) => w.field === area.key) : WORKS.filter((w) => solutionSlugs.has(w.slug)),
  )
  const cases = isField
    ? SHOWCASE.filter((c) => c.field === area.key)
    : SHOWCASE.filter((c) => c.work && solutionSlugs.has(c.work))

  const clients = [...new Set(works.map((w) => w.client).filter(Boolean))].slice(0, 8)
  const stack = [...new Set(cases.flatMap((c) => c.stack ?? []))]
  /**
   * ⚠ 폰 목업(`plain`)을 16:7 로 자르면 **폰 윗부분만** 남아 무슨 화면인지 안 읽힌다.
   *   가로로 잘려도 괜찮은 브라우저 캡처(`web`)를 먼저 고르고, 없을 때만 나머지를 쓴다.
   */
  const shots = [...cases.flatMap((c) => c.shots.map((s) => ({ ...s, caption: c.short })))]
    .sort((a, b) => Number(b.kind === 'web') - Number(a.kind === 'web'))
    .slice(0, 3)

  return (
    <div className="mt-5 overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.03]">
      <div className="flex items-start justify-between gap-4 border-b border-white/8 px-7 py-6 pc:px-10">
        <div>
          <p className="font-display text-[11.5px] font-bold tracking-[0.12em]" style={{ color: area.tone }}>
            {area.no} · {area.en}
          </p>
          <h4 className="mt-1.5 text-[21px] font-bold tracking-[-0.015em]">{area.ko} — 상세 현황</h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="상세 닫기"
          className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-on-deep-muted transition-colors hover:text-on-deep"
        >
          닫기 ✕
        </button>
      </div>

      <div className="grid gap-9 px-7 py-8 pc:grid-cols-2 pc:px-10 pc:py-9">
        <div>
          {clients.length > 0 && (
            <>
              <p className="font-display text-[11.5px] font-bold tracking-[0.12em] text-on-deep-subtle">주요 고객사</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {clients.map((c) => (
                  <li key={c} className="rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-on-deep-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          {stack.length > 0 && (
            <>
              <p className="mt-7 font-display text-[11.5px] font-bold tracking-[0.12em] text-on-deep-subtle">
                기술 스택
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border px-3 py-1.5 text-[13px]"
                    style={{ borderColor: `color-mix(in oklab, ${area.tone} 32%, transparent)`, color: area.tone }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-7 font-display text-[11.5px] font-bold tracking-[0.12em] text-on-deep-subtle">
            프로젝트 이력
          </p>
          <ul className="mt-3 space-y-2.5">
            {works.slice(0, 8).map((w) => (
              <li key={w.slug} className="flex gap-3 text-[14px]">
                <span className="w-[104px] shrink-0 font-display tabular-nums text-on-deep-subtle">
                  {w.ongoing ? '운영중' : formatPeriod(w)}
                </span>
                <Link href={`/works/${w.slug}/`} className="text-on-deep-muted underline-offset-4 hover:underline">
                  {w.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={isField ? `/works/?field=${area.key}` : '/works/'}
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: area.tone }}
          >
            전체 {works.length}건 보기 <span aria-hidden>→</span>
          </Link>
        </div>

        {shots.length > 0 && (
          <div>
            <p className="font-display text-[11.5px] font-bold tracking-[0.12em] text-on-deep-subtle">포트폴리오</p>
            <ul className="mt-3 space-y-3">
              {shots.map((s) => (
                <li key={s.src} className="relative overflow-hidden rounded-[12px] border border-white/8 bg-deep-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
                  <img
                    src={s.src}
                    alt={s.alt}
                    {...imgSize(s.src)}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/7] w-full object-cover object-top opacity-85"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1020] to-transparent px-4 pb-3 pt-8 text-[13px] font-medium text-on-deep">
                    {s.caption}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export function BusinessAreas() {
  /** 한 번에 하나만 연다 — 넷을 다 펼치면 이 구간만 화면 여섯 개 길이가 된다 */
  const [openKey, setOpenKey] = useState<Area['key'] | null>(null)
  const openArea = AREAS.find((a) => a.key === openKey) ?? null

  return (
    <Section id="business" tone="deep">
      <SectionHead
        eyebrow="BUSINESS AREAS"
        title="핵심 사업 영역"
        lede="금융 · 차량 · 통신 세 축을 각 사업팀이 맡아 구축부터 운영까지 책임집니다. 카드를 펼치면 고객사와 수행 이력, 실제 구축 화면을 보실 수 있습니다."
      />
      <div className="mt-14 grid gap-5 pc:grid-cols-2">
        {AREAS.map((a, i) => (
          <Rise key={a.key} delay={i * 70}>
            <AreaCard
              area={a}
              open={openKey === a.key}
              onToggle={() => setOpenKey((k) => (k === a.key ? null : a.key))}
            />
          </Rise>
        ))}
      </div>

      {openArea && <AreaDetail area={openArea} onClose={() => setOpenKey(null)} />}
    </Section>
  )
}
