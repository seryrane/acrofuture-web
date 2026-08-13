'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { formatPeriod, sortByStart } from '@/components/pages/work-utils'
import { FIELD_META } from '@/content/fields'
import { imgSize } from '@/content/media-manifest'
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
    desc: '특허 2건과 통신사 플랫폼 이력을 묶어 자체 솔루션 3종으로 냅니다. 위치를 재는 일, 구역에 알리는 일, 움직이는 자산을 대장으로 만드는 일입니다.',
    chips: SOLUTIONS.map((s) => s.name),
    // 회사가 이미 쓰던 솔루션 일러스트 그대로(acrofuture.com/images/service_sol.svg).
    // ⚠ 원본은 **벡터가 아니라 PNG 를 감싼 SVG 껍데기**(205KB)였다 — 확장자만 SVG 다.
    //   `scripts/build-media.mjs` 가 webp 로 구워서 쓴다(크기와 함께).
    img: '/media/brand/service_sol.webp',
    imgAlt: '위치 기반 솔루션 구성 일러스트',
    tone: 'var(--color-tone-etc)',
  },
]

function AreaCard({ area }: { area: Area }) {
  const [open, setOpen] = useState(false)
  const isField = area.key !== 'solution'
  const recent = isField ? sortByStart(WORKS.filter((w) => w.field === area.key)).slice(0, 6) : []
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

        {isField ? (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-6 flex items-center gap-2 text-[14px] text-on-deep-muted transition-colors hover:text-on-deep"
            >
              <span
                aria-hidden
                className={`inline-block transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              >
                ⌄
              </span>
              수행 사업 보기
            </button>

            {open && (
              <div className="mt-4 border-t border-white/8 pt-4">
                <ul className="space-y-2.5">
                  {recent.map((w) => (
                    <li key={w.slug} className="flex gap-3 text-[14px]">
                      <span className="w-[104px] shrink-0 font-display tabular-nums text-on-deep-subtle">
                        {formatPeriod(w)}
                      </span>
                      <Link href={`/works/${w.slug}/`} className="text-on-deep-muted underline-offset-4 hover:underline">
                        {w.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/works/?field=${area.key}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: area.tone }}
                >
                  전체 보기 <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <a
            href="#solutions"
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: area.tone }}
          >
            솔루션 3종 보기 <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </div>
  )
}

export function BusinessAreas() {
  return (
    <Section id="business" tone="deep">
      <SectionHead
        eyebrow="BUSINESS AREAS"
        title="핵심 사업 영역"
        lede="금융 · 차량 · 통신 세 축을 각 사업팀이 맡아 구축부터 운영까지 책임집니다. 카드를 펼치면 수행한 사업 이력을 보실 수 있습니다."
      />
      <div className="mt-14 grid gap-5 pc:grid-cols-2">
        {AREAS.map((a, i) => (
          <Rise key={a.key} delay={i * 70}>
            <AreaCard area={a} />
          </Rise>
        ))}
      </div>
    </Section>
  )
}
