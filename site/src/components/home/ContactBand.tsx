'use client'

import { useState } from 'react'

import { Rise } from '@/components/Rise'
import { Section } from '@/components/ui/Section'
import { COMPANY, MAP_LINKS } from '@/content/company'

/**
 * 문의 — 시안의 폼 모양은 지키되, **받는 곳이 있는 폼**으로 만든다.
 *
 * ⚠ 이 사이트는 정적 내보내기라 서버가 없다. 시안의 폼을 그대로 옮기면 "보내기"를 눌러도
 *   아무 데도 안 간다 — 받는 곳이 없는 폼은 없는 것보다 나쁘다(docs/개편_기획.md 8절).
 *   그래서 입력한 내용을 **메일 본문으로 조립해 메일 앱을 여는** 방식으로 바꿨다.
 *   보내는 행위는 사람이 자기 메일함에서 직접 한다 — 보냈는지 아닌지가 눈에 보인다.
 * ⚠ 개인정보를 우리 서버에 남기지 않는 방식이기도 하다. 정적 사이트에는 지킬 서버가 없으니
 *   애초에 받지 않는 편이 맞다.
 */

const FIELD = 'w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-on-deep placeholder:text-on-deep-subtle focus:border-blue/60 focus:outline-none'

export function ContactBand() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [body, setBody] = useState('')

  const subject = `[홈페이지 문의] ${company || name || '문의'}`
  const text = [
    `이름: ${name}`,
    `회사명: ${company}`,
    `이메일: ${email}`,
    `연락처: ${tel}`,
    '',
    body,
  ].join('\n')
  const href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`

  return (
    <Section id="contact" tone="deep">
      <div className="grid gap-12 pc:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] pc:gap-16">
        <Rise>
          <p className="flex items-center gap-3 font-display text-[12px] font-bold tracking-[0.18em] text-blue-hi">
            <span className="block h-px w-6 bg-blue-hi" />
            CONTACT
          </p>
          <h2 className="mt-5 text-[clamp(28px,6vw,46px)] font-extrabold leading-[1.25] tracking-[-0.02em]">
            어떤 문의든
            <br />
            <span className="text-blue-hi">편하게</span> 남겨 주세요
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.9] text-on-deep-muted">
            프로젝트 상담, 솔루션 도입, 채용까지 — 담당자가 확인 후 연락드리겠습니다.
          </p>

          <dl className="mt-10 space-y-6">
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 pt-0.5 text-[12.5px] text-on-deep-subtle">주소</dt>
              <dd className="text-[15.5px] text-on-deep">
                ({COMPANY.zip}) {COMPANY.address}
                {/* 주소는 읽는 것보다 눌러서 확인하는 게 빠르다 */}
                <span className="mt-2 flex flex-wrap gap-2">
                  {MAP_LINKS.map((m) => (
                    <a
                      key={m.label}
                      href={m.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-on-deep-muted transition-colors hover:border-white/30 hover:text-on-deep"
                    >
                      {m.label}
                      <span aria-hidden>↗</span>
                    </a>
                  ))}
                </span>
              </dd>
            </div>
            {[
              { k: '전화', v: COMPANY.tel, href: `tel:${COMPANY.tel.replace(/-/g, '')}`, sub: `FAX ${COMPANY.fax}` },
              { k: '이메일', v: COMPANY.email, href: `mailto:${COMPANY.email}` },
            ].map((r) => (
              <div key={r.k} className="flex gap-4">
                <dt className="w-14 shrink-0 pt-0.5 text-[12.5px] text-on-deep-subtle">{r.k}</dt>
                <dd className="text-[15.5px] text-on-deep">
                  <a href={r.href} className="underline-offset-4 hover:underline">
                    {r.v}
                  </a>
                  {r.sub && <span className="ml-2 text-[13px] text-on-deep-subtle">{r.sub}</span>}
                </dd>
              </div>
            ))}
          </dl>

          {/* 업무 포탈 — 임직원용 문이다. 회사 소개와 섞지 않고 여기 한 곳에만 둔다 */}
          <a
            href={COMPANY.portalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-10 flex items-center justify-between gap-4 rounded-[14px] border border-portal/35 bg-portal/[0.08] px-5 py-4 transition-colors hover:border-portal/70 hover:bg-portal/15"
          >
            <span>
              <span className="flex items-center gap-2 text-[13.5px] font-semibold text-on-deep">
                <span className="block h-1.5 w-1.5 rounded-full bg-portal" />
                임직원 업무 포탈
              </span>
              <span className="mt-0.5 block text-[12px] text-on-deep-subtle">사내 업무 플랫폼으로 이동</span>
            </span>
            <span aria-hidden className="text-portal">
              ↗
            </span>
          </a>
        </Rise>

        <Rise delay={80}>
          <div className="rounded-[14px] border border-white/8 bg-white/[0.03] p-6 pc:p-8">
            <h3 className="text-[17.5px] font-bold">프로젝트 문의</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-on-deep-subtle">
              내용을 남겨 주시면 메일 앱이 열립니다. 확인 후 보내 주시면 담당자가 연락드리겠습니다.
            </p>

            <div className="mt-6 grid gap-4 pc:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[12px] text-on-deep-muted">이름</span>
                <input className={FIELD} value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] text-on-deep-muted">회사명</span>
                <input
                  className={FIELD}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="(주)회사명"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[12px] text-on-deep-muted">이메일</span>
              <input
                type="email"
                className={FIELD}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[12px] text-on-deep-muted">연락처</span>
              <input
                type="tel"
                className={FIELD}
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="010-0000-0000"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[12px] text-on-deep-muted">문의 내용</span>
              <textarea
                rows={5}
                className={`${FIELD} resize-y`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="필요하신 내용과 일정을 알려 주세요."
              />
            </label>

            <a
              href={href}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[14px] bg-blue px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue-deep"
            >
              메일로 문의하기
              <span aria-hidden>↗</span>
            </a>
          </div>
        </Rise>
      </div>
    </Section>
  )
}
