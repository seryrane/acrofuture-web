'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

import { Rise } from '@/components/Rise'
import { Section, SectionHead } from '@/components/ui/Section'
import { FIELD_META, FIELD_ORDER } from '@/content/fields'
import { imgSize } from '@/content/media-manifest'
import { SHOWCASE, SHOWCASE_SHOT_COUNT, type Shot } from '@/content/showcase'
import type { WorkField } from '@/content/works'

/**
 * 실제 구축 화면 — 분류 탭 → 사례 → 큰 화면.
 *
 * ⚠ **저절로 넘어간다.** 고른 분류 안의 캡처를 순서대로 돌린다(사용자 요청 2026-08-07).
 *   가만히 두면 무엇이 있는지 저절로 보이고, 손대면 그 자리에 선다.
 *   - 마우스를 얹거나 초점이 들어오면 멈춘다 — 읽는 중에 글이 바뀌면 화가 난다.
 *   - 움직임 최소화를 켠 사람에게는 아예 안 돌린다.
 * ⚠⚠ **멈춤은 손이 얹히는 것만으로 부족하다.** 예전에는 멈추는 길이 `onMouseEnter` 뿐이라
 *   **터치 기기에서는 무슨 수를 써도 안 멈췄다.** 휴대폰으로 설명을 읽는 내내 4.5초마다
 *   화면이 바뀐다는 뜻이다. 접근성 기준(WCAG 2.2.2 Pause·Stop·Hide)이 자동으로 움직이는
 *   것에 **멈출 수단을 요구**하는 이유가 이것이다. 그래서 지금은
 *   ① 눈에 보이는 [자동 넘김] 단추 ② 사례·점을 고르면 그 자리에 섬
 *   ③ 남은 시간을 얇은 선으로 미리 알림 — 셋을 함께 둔다.
 *   ⚠ 분류(탭)를 바꾸는 것은 "이 갈래를 훑어보겠다"는 뜻이라 **안 멈춘다.** 사례·점을 고르는
 *   것은 "이 화면을 보겠다"는 뜻이라 멈춘다. 두 동작의 뜻이 달라서 반응도 다르다.
 * ⚠ **그림을 누르면 사례 상세로 간다.** 큰 그림이 눌리지 않으면 사람들은 여기서 막힌다.
 *   상세가 없는 사례(소개서에만 있고 이력에 slug 가 없는 것)는 누를 수 없게 두고, 그 사실을 표시한다.
 * ⚠ **자리를 미리 잡아 두고, 그림은 미리 받아 둔다.** 넘어갈 때마다 lazy 로 받으면 그 사이 판이
 *   납작해졌다가 튀어오른다 — 실제로 흰 막대만 보였다. 높이를 고정하고 다음 그림들을 숨겨서 받아 둔다.
 * ⚠ 틀은 `kind` 가 정한다. 소개서에서 **이미 폰 목업에 담겨 나온 그림**에 폰 틀을 또 씌우면
 *   이중 액자가 되고 좁은 화면에서 넘친다 — 실제로 그렇게 깨졌었다.
 */

const ROLL_MS = 4500

/** 판의 높이 — 넘어갈 때 자리가 흔들리지 않게 못 박는다 */
const BOX = 'min-h-[240px] pc:min-h-[380px]'

/**
 * 움직임 최소화 설정 — **렌더 중에 알아야** 한다(단추 글씨와 진행선이 그 값에 달렸다).
 *
 * ⚠ `useEffect` + `setState` 로 읽으면 첫 프레임에 자동 넘김 단추가 잠깐 보였다 사라진다.
 *   `useSyncExternalStore` 는 서버 스냅숏(false)과 브라우저 스냅숏을 갈라 주어 하이드레이션이
 *   어긋나지 않는다 — `WorksExplorer` 가 주소창 값을 읽을 때 쓴 것과 같은 이유다.
 * ⚠ 설정을 도중에 바꾸는 사람도 있으므로 구독까지 건다(한 번 읽고 마는 게 아니다).
 */
const MOTION_QUERY = '(prefers-reduced-motion: reduce)'
function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
function readMotion() {
  return window.matchMedia(MOTION_QUERY).matches
}
function motionOnServer() {
  return false
}

/**
 * @param eager 지금 보이는 장인가. ⚠ 레일에는 그 갈래의 판이 **전부** 들어 있다. 지금 장만
 *   즉시 받고 나머지는 `lazy` 로 둔다 — 안 그러면 열두 장이 한꺼번에 내려와서, 전량을 숨겨
 *   받던 예전 방식으로 되돌아가는 셈이 된다(옆으로 벗어난 그림도 브라우저는 lazy 로 미룬다).
 */
function Frame({ shot, eager }: { shot: Shot; eager: boolean }) {
  const loading = eager ? ('eager' as const) : ('lazy' as const)
  if (shot.kind === 'slide') {
    // 소개서 쪽에서 잘라 온 조각 — 제 배경색을 갖고 있어 흰 판에 올리면 겉돈다
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-deep-3 ${BOX}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
        <img
          src={shot.src}
          alt={shot.alt}
          {...imgSize(shot.src)}
          loading={loading}
          decoding="async"
          className="block max-h-[380px] w-auto max-w-full object-contain"
        />
      </div>
    )
  }

  if (shot.kind === 'plain') {
    // 액자 없이 흰 판 위에 그대로. object-contain 이라 어떤 비율이 와도 안 넘친다
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-white p-3 pc:p-5 ${BOX}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
        <img
          src={shot.src}
          alt={shot.alt}
          {...imgSize(shot.src)}
          // ⚠ 지금 보이는 그림이다 — lazy 로 두면 넘어갈 때마다 빈 판이 한 번 보인다
          loading={loading}
          decoding="async"
          className="block max-h-[340px] w-auto max-w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-white/10 bg-[#141b30] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ${BOX}`}
    >
      {/* 브라우저 창 머리 — 이게 있어야 "웹 화면"이라는 게 설명 없이 읽힌다 */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-[11px] text-on-deep-subtle">{shot.alt}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 쓴다 */}
      <img
        src={shot.src}
        alt={shot.alt}
        {...imgSize(shot.src)}
        loading={loading}
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  )
}

export function Showcase() {
  const [field, setField] = useState<WorkField>('finance')
  /** 고른 분류 안에서 몇 번째 캡처를 보고 있나 — 사례를 넘나든다 */
  const [step, setStep] = useState(0)
  /** 손이 얹혔다 — 떼면 다시 돈다 */
  const [hovered, setHovered] = useState(false)
  /** 사람이 세웠다 — 다시 누르기 전까지 안 돈다. hovered 와 **뜻이 달라서** 따로 든다 */
  const [stopped, setStopped] = useState(false)
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, motionOnServer)
  const railRef = useRef<HTMLDivElement>(null)

  // 분류 안의 캡처를 한 줄로 편다 — 사례 경계를 넘어 계속 돈다
  const steps = useMemo(
    () =>
      SHOWCASE.filter((c) => c.field === field).flatMap((c) =>
        c.shots.map((s, i) => ({ c, s, i, of: c.shots.length })),
      ),
    [field],
  )

  const cur = steps[Math.min(step, steps.length - 1)]
  const cases = useMemo(() => SHOWCASE.filter((c) => c.field === field), [field])

  // 저절로 넘어간다
  // ⚠ 멈춤을 ref 로 들고 렌더 중에 쓰지 않는다(그건 렌더를 부수효과로 쓰는 일이다).
  //   `rolling` 을 의존성에 넣어 **멈추면 타이머를 아예 없애고, 풀리면 새로 건다.**
  //   덤으로 손을 뗀 순간부터 4.5초를 새로 세게 되어, 떼자마자 화면이 휙 넘어가는 일이 없다.
  const stepsLen = steps.length
  const canRoll = stepsLen > 1 && !reduced
  const rolling = canRoll && !hovered && !stopped

  /**
   * 레일을 그 장으로 굴린다.
   * ⚠ 판 한 장이 레일 폭과 **정확히 같으므로**(af-slide: flex 0 0 100%) 자리는 곱셈으로 나온다.
   *   요소를 찾아 offsetLeft 를 재면 위치 기준(offsetParent)이 무엇이냐에 따라 어긋난다.
   * ⚠ 여기서 `step` 을 직접 고치지 않는다. 굴리면 관찰자가 읽어서 적는다 —
   *   **정본은 스크롤 위치 하나**여야 손으로 민 것과 저절로 넘어간 것이 같은 길을 탄다.
   */
  const goTo = useCallback(
    (i: number) => {
      const rail = railRef.current
      if (!rail) return
      rail.scrollTo({ left: i * rail.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced],
  )

  /** 지금 어느 장이 가운데 있나 — 스크롤 위치를 읽어 `step` 에 적는다 */
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const slides = Array.from(rail.querySelectorAll<HTMLElement>('[data-slide]'))
    if (!slides.length) return
    const io = new IntersectionObserver(
      (entries) => {
        // 두 장이 걸쳐 보이는 순간이 있다 — **더 많이 보이는 쪽**으로 정한다
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (best) setStep(Number((best.target as HTMLElement).dataset.slide))
      },
      { root: rail, threshold: [0.5, 0.75, 0.99] },
    )
    slides.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [field])

  // 분류를 바꾸면 레일을 맨 앞으로. ⚠ 부드럽게가 아니라 **즉시** — 갈래를 옮긴 것이지
  //    한 장 넘긴 게 아니다. 열두 장을 스르륵 지나가면 어지럽다.
  useEffect(() => {
    const rail = railRef.current
    if (rail) rail.scrollLeft = 0
  }, [field])

  // 저절로 넘어간다 — `step` 을 의존성에 두어 **한 장 넘어갈 때마다 시계를 새로 센다.**
  // 손을 얹었다 떼면 그 순간부터 4.5초라, 떼자마자 휙 넘어가는 일이 없다.
  useEffect(() => {
    if (!rolling) return
    const t = setTimeout(() => goTo((step + 1) % stepsLen), ROLL_MS)
    return () => clearTimeout(t)
  }, [rolling, step, stepsLen, goTo])

  /** 분류를 바꾸는 것은 "이 갈래를 훑어보겠다" — 계속 돈다 */
  function pickField(f: WorkField) {
    setField(f)
    setStep(0)
  }

  /** 사례를 고르면 그 사례의 첫 캡처로 간다. ⚠ 고르는 것은 "이걸 보겠다"는 뜻이라 **선다** */
  function pickCase(key: string) {
    const i = steps.findIndex((x) => x.c.key === key)
    if (i >= 0) goTo(i)
    setStopped(true)
  }

  /** 점을 눌러 그 캡처로 간다 — 사례를 고를 때와 같은 뜻이라 같이 선다 */
  function pickShot(at: number) {
    goTo(at)
    setStopped(true)
  }

  if (!cur) return null

  return (
    <Section id="showcase" tone="raised">
      <SectionHead
        eyebrow="PROJECT SHOWCASE"
        title="실제 구축 화면"
        lede={`금융 · 차량 · 통신 현장에서 실제로 구축하고 운영해 온 화면 ${SHOWCASE_SHOT_COUNT}장입니다. 화면을 누르면 사업 내용을 자세히 보실 수 있습니다.`}
      />

      {/* 분류 — 네 갈래 */}
      <Rise className="mt-12 flex flex-wrap justify-center gap-2.5">
        {FIELD_ORDER.map((key) => {
          const meta = FIELD_META[key]
          const n = SHOWCASE.filter((c) => c.field === key).length
          if (!n) return null
          const on = key === field
          return (
            <button
              key={key}
              type="button"
              onClick={() => pickField(key)}
              aria-pressed={on}
              className={`rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition-colors ${
                on
                  ? 'bg-blue text-white shadow-[0_10px_30px_-12px_rgba(68,114,245,0.9)]'
                  : 'border border-white/10 bg-white/[0.04] text-on-deep-muted hover:text-on-deep'
              }`}
            >
              {meta.ko}
              <span className="ml-2 font-display text-[11px] tabular-nums opacity-70">{n}</span>
            </button>
          )
        })}
      </Rise>

      {/* 사례 — 분류 안에서 고른다 */}
      {cases.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {cases.map((c) => {
            const on = c.key === cur.c.key
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => pickCase(c.key)}
                className={`border-b pb-1 text-[14px] transition-colors ${
                  on
                    ? 'border-blue-hi font-semibold text-on-deep'
                    : 'border-transparent text-on-deep-subtle hover:text-on-deep-muted'
                }`}
              >
                {c.short}
              </button>
            )
          })}
        </div>
      )}

      {/* 사례 판 — **가로로 미는 레일**이다.
          ⚠⚠ 예전에는 상태를 갈아 끼우는 방식이라 **손가락으로 미는 동작이 아무것도 안 했다.**
          휴대폰에서 큰 그림을 보면 사람들이 가장 먼저 하는 것이 미는 것인데 반응이 없으니
          "고장 났나" 가 된다. 진짜 스크롤 상자로 바꾸면 밀기·튕기기·관성이 **브라우저 것**이라
          공짜로 생기고, 키보드·화면낭독기도 표준 스크롤 상자로 이해한다.
          ⚠ 지금 어느 장인지는 스크롤 위치가 정본이다 — 관찰자가 읽어 `step` 에 적는다.
          자동 넘김도 `setStep` 이 아니라 **레일을 굴려서** 넘긴다(한 방향으로만 흐르게).
          ⚠ 판 전체(글+그림)가 한 장으로 움직인다. 그림만 밀면 옆의 글이 따로 노는 것처럼 보인다. */}
      <Rise className="mt-10">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
          // 손을 대면 선다 — 미는 것은 "내가 보겠다"는 뜻이다
          onPointerDown={() => setStopped(true)}
        >
          <div ref={railRef} className="af-rail">
            {steps.map((x, i) => {
              const on = i === step
              return (
                <div
                  key={`${x.c.key}-${x.s.src}`}
                  data-slide={i}
                  // ⚠ 지금 장이 아닌 판은 **탭 순서와 낭독기에서 뺀다.** 안 그러면 링크가
                  //   장 수만큼 늘어나 탭이 화면 밖 것들을 지나간다. `inert` 는 그 둘을 한 번에 한다
                  //   (aria-hidden 만 쓰면 초점은 여전히 들어가서 더 나쁘다).
                  inert={!on || undefined}
                  className="af-slide"
                >
                  <div className="grid h-full items-center gap-8 rounded-[14px] border border-white/8 bg-white/[0.02] p-6 pc:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] pc:gap-12 pc:p-10">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        {/* ⚠ 고객사가 비었을 때 "고객사 미기재"를 띄우지 않는다 — 방문자에게는 미완성으로 읽힌다.
                            대신 어느 팀이 한 일인지를 보여 준다. 기간도 없으면 아예 자리를 비운다. */}
                        <span className="rounded-full border border-blue/40 bg-blue/10 px-3 py-1.5 text-[13px] font-semibold text-blue-hi">
                          {x.c.client || FIELD_META[x.c.field].team}
                        </span>
                        {x.c.period && (
                          <span className="font-display text-[13.5px] tabular-nums text-on-deep-subtle">
                            {x.c.period}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-[clamp(21px,4.5vw,30px)] font-extrabold leading-[1.3] tracking-[-0.02em]">
                        {x.c.title}
                      </h3>
                      <p className="mt-4 text-[16px] leading-[1.9] text-on-deep-muted">{x.c.desc}</p>

                      {x.c.stack && (
                        <div className="mt-6">
                          <p className="text-[11.5px] font-bold tracking-[0.12em] text-on-deep-subtle">STACK</p>
                          <ul className="mt-2.5 flex flex-wrap gap-2">
                            {x.c.stack.map((s) => (
                              <li
                                key={s}
                                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-display text-[12.5px] text-on-deep-muted"
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ⚠ 출처(소개서 pNN)는 화면에 쓰지 않는다 — 방문자에게는 아무 뜻이 없는 말이다 */}
                      {x.c.work && (
                        <Link
                          href={`/works/${x.c.work}/`}
                          className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-blue-hi underline-offset-4 hover:underline"
                        >
                          사업 자세히 보기 <span aria-hidden>→</span>
                        </Link>
                      )}
                    </div>

                    {/* 그림 자체가 사례 상세로 가는 문이다 */}
                    {x.c.work ? (
                      <Link
                        href={`/works/${x.c.work}/`}
                        aria-label={`${x.c.title} 사례 상세로 이동`}
                        className="group block transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1"
                      >
                        <Frame shot={x.s} eager={on} />
                      </Link>
                    ) : (
                      <Frame shot={x.s} eager={on} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div>
            {/* 다음 그림을 미리 받아 둔다 — 넘어갈 때 빈 판이 보이지 않게.
                ⚠⚠ 예전에는 **그 분류의 캡처를 전부, 한꺼번에, 우선순위 없이** 받았다
                (`display:none` 인 <img> 를 통째로 늘어놓는 방식). 숨겨도 브라우저는 받으므로
                의도대로 동작하긴 했지만, 그 분류가 열두 장이면 열두 장이 첫 화면 자원과
                대역폭을 다툰다 — 느린 회선에서 정작 지금 보이는 그림이 늦어진다.
                → **다음 두 장만**, `fetchPriority=low` 로. 셋째 장은 그때 가서 받으면 늦지 않다.
                ⚠ React 19 는 `<link rel=preload>` 를 어디에 두든 <head> 로 올리고 같은 주소는
                   합쳐 준다. step 이 바뀌면 이 목록도 바뀌므로 늘 "지금 기준 다음 것"이다. */}
            {steps.length > 1 &&
              [1, 2]
                .map((n) => steps[(step + n) % steps.length])
                .filter((x, i, arr) => x && x.s.src !== cur.s.src && arr.findIndex((y) => y?.s.src === x.s.src) === i)
                .map((x) => (
                  <link key={x.s.src} rel="preload" as="image" href={x.s.src} fetchPriority="low" />
                ))}

            {/* 남은 시간 — 곧 넘어간다는 것을 **미리** 알린다. 예고 없이 바뀌면 오작동으로 읽힌다.
                ⚠ `key={step}` 이 있어야 매 장마다 선이 처음부터 다시 찬다(같은 요소를 재사용하면
                   애니메이션이 이어져서 둘째 장부터 이미 반쯤 차 있다). */}
            {rolling && (
              <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/10" aria-hidden>
                <div
                  key={step}
                  className="af-roll h-full rounded-full bg-blue-hi"
                  style={{ animationDuration: `${ROLL_MS}ms` }}
                />
              </div>
            )}

            {(cur.of > 1 || canRoll) && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                {cur.of > 1 && (
                  <div className="flex items-center gap-2">
                    {cur.c.shots.map((s, i) => (
                      <button
                        key={s.src}
                        type="button"
                        onClick={() => {
                          const at = steps.findIndex((x) => x.c.key === cur.c.key && x.i === i)
                          if (at >= 0) pickShot(at)
                        }}
                        aria-label={`${i + 1}번째 화면 — ${s.alt}`}
                        aria-current={i === cur.i}
                        // ⚠ 점은 눈에 1.5px 이지만 **손가락에는 32px** 이어야 한다.
                        //   보이는 크기와 누를 수 있는 크기를 가른다(안쪽 여백으로 넓힌다).
                        className="group flex h-8 items-center px-1"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all duration-300 ${
                            i === cur.i ? 'w-7 bg-blue' : 'w-1.5 bg-white/20 group-hover:bg-white/40'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* ⚠ 이 단추가 **터치 기기에서 유일하게 멈출 수 있는 길**이다. 항상 보인다 */}
                {canRoll && (
                  <button
                    type="button"
                    onClick={() => setStopped((v) => !v)}
                    aria-pressed={stopped}
                    className="inline-flex min-h-8 items-center gap-2 rounded-full border border-white/12 px-3 text-[12.5px] font-medium text-on-deep-subtle transition-colors hover:border-white/30 hover:text-on-deep"
                  >
                    <span aria-hidden className="font-display text-[10px] leading-none">
                      {stopped ? '▶' : '❚❚'}
                    </span>
                    {stopped ? '자동 넘김 켜기' : '자동 넘김 멈춤'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Rise>
    </Section>
  )
}
