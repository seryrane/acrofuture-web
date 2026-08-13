'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/ui/Logo'
import { COMPANY } from '@/content/company'

/**
 * 머리 — 어느 화면에서나 같은 자리.
 *
 * ⚠ 홈이 한 페이지 스크롤이라 메뉴는 **앵커**다. 그런데 `/works` 같은 다른 페이지에서 누르면
 *   그 페이지 안에 없는 앵커라 아무 일도 안 일어난다 — 그래서 항상 `/#about` 처럼 **경로를 붙여**
 *   둔다. 어디서 눌러도 홈의 그 자리로 간다.
 * ⚠ 스크롤 위치에 따라 지금 보고 있는 구간에 표시를 한다. 한 페이지짜리 사이트에서 이게 없으면
 *   메뉴가 다섯 개나 있는데 어느 것도 켜지지 않아 장식처럼 보인다.
 * ⚠ 업무 포탈 버튼이 오른쪽 끝에 상시 있는 이유: 밖에서 온 사람에게는 "이 회사는 자기 플랫폼을
 *   만들어 쓴다"는 증거가 되고, 임직원에게는 어느 페이지에서나 같은 진입점이 된다.
 *   회사 소개와 업무 도구를 섞지 않는다 — 문일 뿐, 포털 내용을 홈페이지로 끌어오지 않는다.
 */

const MENU = [
  { id: 'about', label: '회사소개' },
  { id: 'business', label: '사업분야' },
  { id: 'showcase', label: '구축 화면' },
  { id: 'solutions', label: '솔루션' },
  { id: 'works', label: '실적' },
  { id: 'contact', label: '연락처' },
]

export function Header() {
  const pathname = usePathname()
  const onHome = pathname === '/'
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 지금 보고 있는 구간 — 홈에서만 잰다
  useEffect(() => {
    if (!onHome) return
    const els = MENU.map((m) => document.getElementById(m.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        // 화면 위쪽에 가장 가까운 구간을 고른다 — 여러 개가 동시에 보일 때의 규칙이 필요하다
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onHome])

  // Esc 로도 닫는다 — 덮은 것은 Esc 로 닫힌다는 약속을 지킨다
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      // vt-header: 쪽을 넘길 때 머리만 제자리에 남는다 (globals.css)
      className={`vt-header sticky top-0 z-40 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${
        stuck ? 'border-b border-white/8 bg-deep/85' : 'border-b border-transparent bg-deep/40'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-6 px-5 pc:px-10">
        <Link href="/" aria-label="아크로퓨처 홈">
          <Logo className="text-[23px] pc:text-[27px]" />
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] font-medium pc:flex">
          {MENU.map((m) => {
            const on = onHome && active === m.id
            return (
              <a
                key={m.id}
                href={`/#${m.id}`}
                aria-current={on ? 'true' : undefined}
                className={`group relative py-1 transition-colors ${on ? 'text-on-deep' : 'text-on-deep-muted hover:text-on-deep'}`}
              >
                {m.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left rounded-full bg-blue-hi transition-transform duration-300 ${
                    on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            )
          })}
          <Link
            href="/works/"
            className={`py-1 transition-colors ${
              pathname.startsWith('/works') ? 'text-on-deep' : 'text-on-deep-muted hover:text-on-deep'
            }`}
          >
            사업사례
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={COMPANY.portalUrl}
            target="_blank"
            rel="noreferrer noopener"
            // ⚠ 포탈은 **보라**다 — 회사 소개(파랑)와 사내 도구를 색으로 가른다
            className="hidden items-center gap-2 rounded-[12px] border border-portal/40 bg-portal/10 px-4 py-2 text-[12.5px] font-semibold text-on-deep transition-colors hover:bg-portal/20 pc:inline-flex"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-portal" />
            업무포탈
          </a>
          <Link
            href="/#contact"
            className="hidden rounded-[12px] bg-blue px-4 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-blue-deep pc:inline-block"
          >
            문의하기
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            // 무엇을 여닫는 단추인지 화면 낭독기에 알린다 — 서랍이 늘 붙어 있게 되면서
            // 짝을 지어 줄 수 있게 됐다(예전엔 열렸을 때만 존재해서 가리킬 대상이 없었다)
            aria-controls="m-nav"
            aria-label="메뉴"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-on-deep pc:hidden"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d={open ? 'M2 2l12 8M14 2L2 10' : 'M0 1.5h16M0 10.5h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* ⚠ **조건부로 붙였다 떼지 않는다.** 떼는 순간 사라지면 닫히는 움직임이 한 프레임도
          안 보인다. 늘 두고 `data-open` 으로 여닫으면 CSS(`.af-drawer`)가 양쪽을 다 그린다 —
          닫힌 동안은 `display: none` 이라 탭 순서에도 안 들어온다. */}
      <nav
        id="m-nav"
        data-open={open ? 'true' : 'false'}
        className="af-drawer border-t border-white/8 bg-deep px-5 pb-6 pt-2 pc:hidden"
      >
        {/* ⚠ 경로 변화를 보고 닫지 않는다 — 그건 부수효과로 상태를 고치는 일이고,
              고른 순간 닫는 것이 사람이 기대하는 동작이다(선택 → 닫힘). */}
        {MENU.map((m) => (
          <a
            key={m.id}
            href={`/#${m.id}`}
            onClick={() => setOpen(false)}
            className="block border-b border-white/8 py-3.5 text-[15px] font-medium text-on-deep-muted"
          >
            {m.label}
          </a>
        ))}
        <Link
          href="/works/"
          onClick={() => setOpen(false)}
          className="block border-b border-white/8 py-3.5 text-[15px] font-medium text-on-deep-muted"
        >
          사업사례
        </Link>
        <div className="mt-5 flex gap-2">
          <a
            href={COMPANY.portalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 rounded-[12px] border border-portal/40 bg-portal/10 py-3 text-center text-[13.5px] font-semibold text-on-deep"
          >
            업무포탈
          </a>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-[12px] bg-blue py-3 text-center text-[13.5px] font-bold text-white"
          >
              문의하기
          </Link>
        </div>
      </nav>
    </header>
  )
}
