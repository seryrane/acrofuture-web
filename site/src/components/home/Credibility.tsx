'use client'

import { useEffect, useRef, useState } from 'react'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { CREDENTIALS } from '@/content/company'
import { imgSize } from '@/content/media-manifest'

/**
 * 특허 · 표창 · 인증 — **실물 증서를 보여 준다.**
 *
 * ⚠ 시안은 이 자리에 아이콘 카드를 놓고 "ISO 27001", "GS 1등급", "중소벤처기업부장관 표창",
 *   "특허 No. 10-1234567" 을 적었다. 넷 다 이 회사에 없는 것이다(자리표시자였다).
 *   실제로 있는 것은 특허 2건 · 표창 2건 · 인증 3건이고, 소개서 p11·p12 에 **증서 원본**이 실려 있다.
 * ⚠ **2026-08-07 부터 특허만 낸다**(사용자 결정). 표창·인증(방송통신위원회 표창·KT 우수협력상·
 *   벤처기업·기업부설연구소·SW사업자)은 `company.ts` 에 그대로 있고 화면에서만 뺐다 —
 *   다시 켜려면 아래 `HONORS` 블록의 주석을 풀면 된다.
 * ⚠ 인증은 "있다고 적는 것"보다 보여 주는 게 힘이 세다. 이건 지어낼 수 없는 종류의 이미지다.
 * ⚠ 증서에는 사업자등록번호·주소가 함께 찍혀 있다. 이미 대외 배포용 소개서에 실린 내용이지만,
 *   목록에서는 작게 두고 **눌렀을 때만** 크게 본다.
 */

type Item = {
  kind: '특허' | '표창' | '인증'
  name: string
  meta: string
  by?: string
  img: string
}

const PATENTS: Item[] = CREDENTIALS.patents.map((p) => ({
  kind: '특허',
  name: p.name,
  meta: `${p.no} · ${p.when}`,
  img: p.img,
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 화면에서만 뺐다(위 주석 참고). 데이터는 살려 둔다
const HONORS: Item[] = [
  ...CREDENTIALS.awards.map((a) => ({
    kind: '표창' as const,
    name: a.name,
    meta: `${a.when} · ${a.detail}`,
    img: a.img,
  })),
  ...CREDENTIALS.certs.map((c) => ({
    kind: '인증' as const,
    name: c.name,
    meta: c.detail,
    by: c.by,
    img: c.img,
  })),
]

const KIND_TONE: Record<Item['kind'], string> = {
  특허: 'var(--color-tone-finance)',
  표창: 'var(--color-tone-etc)',
  인증: 'var(--color-tone-lbs)',
}

/**
 * 증서 크게 보기 — **`<dialog>` 의 모달 모드**를 쓴다.
 *
 * ⚠⚠ 예전에는 `role="dialog"` 를 붙인 그냥 `<div>` 였다. Esc 와 뒤 화면 잠금은 손으로 넣었지만
 *   **포커스를 가두지 못했다** — 열어 놓고 Tab 을 누르면 뒤 화면의 링크로 빠져나갔고, 닫은 뒤에는
 *   포커스가 문서 처음으로 떨어졌다(어디를 눌렀었는지 잃는다). 키보드로 다니는 사람에게는
 *   "덮개가 안 덮인" 상태다.
 * ⚠ `showModal()` 이면 브라우저가 **포커스 가둠 · 닫은 뒤 원래 자리 복귀 · Esc · 최상위 레이어 ·
 *   뒤 내용 inert · `::backdrop`** 을 전부 해 준다. 손으로 짜서 맞히기 어려운 것들이다.
 * ⚠ 그래도 **뒤 화면 스크롤 잠금은 따로** 해야 한다 — 모달 dialog 도 페이지 스크롤은 안 막는다.
 * ⚠ 닫는 길이 여럿(Esc · 배경막 · [닫기])이라 전부 `el.close()` 로 모으고, 부모에게 알리는 것은
 *   **`close` 이벤트 한 곳**에서만 한다. 길마다 onClose 를 부르면 두 번 닫히는 판이 생긴다.
 */
function Lightbox({ item, onClose }: { item: Item; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!el.open) el.showModal()
    el.addEventListener('close', onClose)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      el.removeEventListener('close', onClose)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <dialog
      ref={ref}
      aria-label={item.name}
      // 배경막을 눌러 닫는다 — 눌린 자리가 dialog 자신이면 그건 판 **바깥**이다
      // (안쪽 내용은 아래 <div> 라 target 이 다르다)
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close()
      }}
      className="af-lightbox max-h-[100dvh] max-w-[100vw] bg-transparent p-5 text-on-deep"
    >
      <div className="max-h-full w-full max-w-[560px] overflow-auto">
        {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
        <img
          src={item.img}
          alt={`${item.name} 증서`}
          {...imgSize(item.img)}
          className="h-auto w-full rounded-lg bg-white"
        />
        <div className="mt-4 text-center">
          <p className="text-[15px] font-semibold text-on-deep">{item.name}</p>
          <p className="mt-1 text-[13px] text-on-deep-muted">{item.meta}</p>
          {item.by && <p className="mt-0.5 text-[12.5px] text-on-deep-subtle">{item.by}</p>}
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="mt-5 rounded-full border border-white/20 px-5 py-2 text-[13px] text-on-deep hover:bg-white/10"
          >
            닫기
          </button>
        </div>
      </div>
    </dialog>
  )
}

function CredCard({ item, onOpen, wide = false }: { item: Item; onOpen: () => void; wide?: boolean }) {
  const tone = KIND_TONE[item.kind]
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex w-full gap-5 rounded-[14px] border border-white/8 bg-white/[0.03] p-5 text-left transition-colors hover:border-white/20 ${
        wide ? '' : 'flex-col gap-4'
      }`}
    >
      {/* ⚠ 증서는 잘라내면 무슨 서류인지 알아볼 수 없다 — 통째로 담아서 보여 준다 */}
      <span
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white p-1.5 ${
          wide ? 'w-[92px]' : 'w-full'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
        <img
          src={item.img}
          alt=""
          {...imgSize(item.img)}
          loading="lazy"
          decoding="async"
          aria-hidden
          className={`max-w-full object-contain transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04] ${
            wide ? 'h-[124px]' : 'h-[176px]'
          }`}
        />
      </span>

      <span className="block min-w-0 flex-1">
        <span
          className="inline-block rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ color: tone, background: `color-mix(in oklab, ${tone} 14%, transparent)` }}
        >
          {item.kind}
        </span>
        <span className="mt-2.5 block text-[15.5px] font-semibold leading-[1.5] text-on-deep">{item.name}</span>
        <span className="mt-1.5 block font-display text-[13px] tabular-nums text-on-deep-muted">{item.meta}</span>
        {item.by && <span className="mt-0.5 block text-[12px] text-on-deep-subtle">{item.by}</span>}
        <span className="mt-3 block text-[11.5px] text-on-deep-subtle opacity-0 transition-opacity group-hover:opacity-100">
          증서 보기
        </span>
      </span>
    </button>
  )
}

export function Credibility() {
  const [open, setOpen] = useState<Item | null>(null)

  return (
    <Section id="credibility" tone="raised">
      <SectionHead
        eyebrow="CREDIBILITY"
        title="보유 특허"
        lede="위치 기반 서비스의 핵심 기술을 특허로 확보하고 있습니다. 카드를 누르면 등록증을 확인하실 수 있습니다."
      />

      <Rise className="mt-14">
        <div className="grid gap-4 pc:grid-cols-2">
          {PATENTS.map((p) => (
            <CredCard key={p.meta} item={p} wide onOpen={() => setOpen(p)} />
          ))}
        </div>
      </Rise>

      {/* ⚠ 표창·인증 블록은 사용자 결정으로 화면에서 뺐다(2026-08-07). 데이터는 그대로 있다.
          다시 보이려면 아래 주석을 풀면 된다.
      <Rise className="mt-12" delay={80}>
        <p className="text-[13px] font-bold tracking-[0.06em] text-on-deep-subtle">
          표창 {CREDENTIALS.awards.length}건 · 인증 {CREDENTIALS.certs.length}건
        </p>
        <div className="mt-4 grid gap-4 pc:grid-cols-3 wide:grid-cols-5">
          {HONORS.map((h) => (
            <CredCard key={h.name} item={h} onOpen={() => setOpen(h)} />
          ))}
        </div>
      </Rise>
      */}

      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </Section>
  )
}
