import Link from 'next/link'

import { Logo } from '@/components/ui/Logo'
import { COMPANY, MAP_LINKS } from '@/content/company'
import { SOLUTIONS } from '@/content/solutions'

/** 발 — 회사 정보는 여기 한 곳에만 적는다(정본은 content/company.ts).
 *  ⚠ 개편 전 사이트의 `Designed & Developed by Themefisher` 표기는 걷어냈다. */
export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-deep-2 text-on-deep-subtle">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 pc:grid-cols-[1.4fr_1fr_1fr_1fr] pc:px-10">
        <div>
          <Logo className="text-[21px]" />
          <p className="mt-4 text-[13px] leading-[1.85]">
            {COMPANY.slogan}
            <br />
            {COMPANY.field}
          </p>
          <p className="mt-5 text-[12.5px] leading-[1.85]">
            {COMPANY.nameKo} · 대표 {COMPANY.ceo}
            <br />
            사업자등록번호 {COMPANY.bizNo}
            <br />({COMPANY.zip}) {COMPANY.address}
          </p>
          <p className="mt-3 flex flex-wrap gap-2">
            {MAP_LINKS.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-white/12 px-2.5 py-1 text-[11.5px] transition-colors hover:border-white/30 hover:text-on-deep"
              >
                {m.label} ↗
              </a>
            ))}
          </p>
        </div>

        <nav className="text-[13px] leading-[2]">
          <p className="mb-3 font-semibold text-on-deep">회사</p>
          <Link href="/#about" className="block hover:text-on-deep">
            회사소개
          </Link>
          <Link href="/#business" className="block hover:text-on-deep">
            사업분야
          </Link>
          <Link href="/#credibility" className="block hover:text-on-deep">
            보유 특허
          </Link>
          <Link href="/careers/" className="block hover:text-on-deep">
            인재영입
          </Link>
        </nav>

        <nav className="text-[13px] leading-[2]">
          <p className="mb-3 font-semibold text-on-deep">실적</p>
          <Link href="/#showcase" className="block hover:text-on-deep">
            실제 구축 화면
          </Link>
          <Link href="/works/" className="block hover:text-on-deep">
            사업사례
          </Link>
          <a
            href={COMPANY.portalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="block font-medium text-portal hover:text-on-deep"
          >
            임직원 업무 포탈 ↗
          </a>
        </nav>

        <div className="text-[13px] leading-[2]">
          <p className="mb-3 font-semibold text-on-deep">솔루션</p>
          {SOLUTIONS.map((s) => (
            <Link key={s.key} href="/#solutions" className="block hover:text-on-deep">
              {s.name}
            </Link>
          ))}
          <p className="mt-4 font-semibold text-on-deep">문의</p>
          <p className="tabular-nums">TEL {COMPANY.tel}</p>
          <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-4 hover:text-on-deep">
            {COMPANY.email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[12px] pc:px-10">
          <span>
            © {new Date().getFullYear()} {COMPANY.nameEn}. All rights reserved.
          </span>
          <span className="tabular-nums">Since {COMPANY.founded}</span>
        </div>
      </div>
    </footer>
  )
}
