'use client'

import { useEffect, useRef, useState } from 'react'

import { COMPANY } from '@/content/company'
import { approx, CLIENT_COUNT, ENGINEER_RATIO, WORK_COUNT, AGE_YEARS } from '@/content/stats'

/**
 * 첫 화면 — 시안의 형태를 그대로 따르되, **숫자는 전부 데이터에서 센 값**이다.
 *
 * ⚠ 시안의 "15년 · 완료 프로젝트 · 전문 인력 · 개발자 비율"은 자리표시자였다(0 에서 안 올라감).
 *   여기 네 칸은 `content/stats.ts` 가 세는 값이라 이력이 늘면 저절로 따라온다.
 * ⚠ 세 번째 줄("최고의 미래")을 흐리게 두는 것은 시안의 연출이다 — 문장이 아직 끝나지 않았다는
 *   신호라서, 아래로 내려가면 답이 있다는 뜻이 된다. 색만 바꾼 게 아니라 역할이 있는 처리다.
 */

/** 숫자가 올라간다 — 화면에 들어왔을 때 한 번만. ⚠ 스크롤할 때마다 다시 세면 산만하다 */
function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        // ⚠ 움직임 최소화 판단을 **효과 본문이 아니라 여기서** 한다. 효과 본문에서 setState 를
        //   부르면 마운트 직후 렌더가 한 번 더 돈다(react-hooks/set-state-in-effect).
        //   관찰 콜백은 바깥 시스템이 부르는 자리라 여기서 값을 놓는 것이 맞다.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setN(to)
          return
        }
        const t0 = performance.now()
        const dur = 1100
        const tick = (t: number) => {
          // ⚠ 아래를 0 으로도 막는다. requestAnimationFrame 이 주는 시각은 **그 프레임이 시작된 때**라
          //   바로 앞에서 잰 t0 보다 앞설 수 있다. 그러면 p 가 음수가 되고 "103+" 가 "-3+" 로 보인다
          //   (2026-08-07 실제로 화면에 떴다).
          const p = Math.min(1, Math.max(0, (t - t0) / dur))
          // 끝에서 부드럽게 멈춘다 — 선형이면 딱 끊겨서 오작동처럼 보인다
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

// ⚠ 건수는 딱 떨어지는 수보다 `+` 가 낫다(사용자 요청 2026-08-07).
//   "104건"은 세어 본 사람처럼 들리고 "104+"는 계속 쌓이는 중으로 읽힌다.
const STATS = [
  { value: AGE_YEARS, suffix: '년', label: '업력', note: `${COMPANY.foundedYear}년 설립` },
  { value: WORK_COUNT, suffix: '+', label: '사업 이력', note: '2009년 이후 누적' },
  { value: CLIENT_COUNT, suffix: '+', label: '고객사', note: '함께한 기업' },
  { value: ENGINEER_RATIO, suffix: '%', label: '개발 인력 비율', note: '기술 인력 중심' },
]

export function Hero() {
  return (
    <section className="af-grid relative overflow-hidden bg-deep px-5 pb-24 pt-28 pc:px-10 pc:pb-28 pc:pt-36">
      {/* 위쪽에서 번지는 푸른 빛 — 이미지가 아니라 그라디언트 하나다 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-30%] h-[70vh] w-[110vw] -translate-x-1/2 rounded-[50%] opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(68,114,245,0.22), transparent 65%)' }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 font-display text-[11.5px] font-bold tracking-[0.14em] text-on-deep-muted">
          <span className="block h-1.5 w-1.5 rounded-full bg-blue-hi" />
          SINCE {COMPANY.foundedYear} · {COMPANY.slogan}
        </p>

        <h1 className="mx-auto mt-8 max-w-[15ch] text-[clamp(34px,8.5vw,76px)] font-extrabold leading-[1.18] tracking-[-0.025em]">
          위치를 재는 기술에서
          <br />
          <span className="text-blue-hi">금융과 모빌리티</span>까지
          <br />
          {/* ⚠ 흐린 줄 — 아래에 답이 있다는 신호다. 장식이 아니다.
              ⚠⚠ 그래도 **뜻을 지닌 글자**다. `/22` 는 대비가 2.2:1 까지 떨어져서 연출이 아니라
              그냥 안 보이는 상태였다(2026-08-11 실측). `/40` 이면 "아직 안 끝났다"는 신호는
              그대로 남으면서 읽히기 시작한다 — 흐리게 두는 것과 안 보이게 두는 것은 다르다. */}
          <span className="text-white/40">{AGE_YEARS}년째 이어서</span>
        </h1>

        <p className="mx-auto mt-8 max-w-[640px] text-[16px] leading-[1.9] text-on-deep-muted pc:text-[18px]">
          {COMPANY.foundedYear}년 위치 기반 서비스로 출발해 금융 IT 와 모빌리티 플랫폼으로 넓혔습니다.{' '}
          {/* ⚠ 줄바꿈을 좁은 화면에서 지울 때는 **띄어쓰기를 따로 넣어야 한다** — br 만 지우면
              두 문장이 "넓혔습니다.지금까지" 로 붙는다 */}
          <br className="hidden pc:block" />
          지금까지 {approx(CLIENT_COUNT)} 고객사와 {approx(WORK_COUNT)} 사업을 함께했고, 만든 것을 오래 지킵니다.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#business"
            className="inline-flex items-center gap-2 rounded-[14px] bg-blue px-8 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-blue-deep"
          >
            사업분야 보기
            <span aria-hidden>↗</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-[14px] border border-white/10 bg-white/5 px-8 py-3.5 text-[16px] font-medium text-on-deep transition-colors hover:bg-white/10"
          >
            문의하기
          </a>
        </div>

        <dl className="mx-auto mt-16 grid max-w-[880px] grid-cols-2 gap-3 pc:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-6">
              <dd className="font-display text-[clamp(26px,6vw,34px)] font-extrabold leading-none tracking-[-0.02em]">
                <Count to={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2.5 text-[14px] font-medium text-on-deep-muted">{s.label}</dt>
              <p className="mt-1 text-[12.5px] text-on-deep-subtle">{s.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
