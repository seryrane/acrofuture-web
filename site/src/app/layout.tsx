import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { COMPANY } from '@/content/company'
import { approx, CLIENT_COUNT, WORK_COUNT } from '@/content/stats'

import './globals.css'

/**
 * ⚠ 개편 전 사이트는 `description` 이 없고 og 태그가 title 하나뿐이라, 검색 결과에 요약이
 * 안 뜨고 메신저에 링크를 붙이면 회사명만 나왔다. 여기서 한 번에 채운다.
 */

/**
 * 숫자·영문 표제용. 한글은 Pretendard 가 맡는다.
 * ⚠ Pretendard 도 이제 **우리 서버**에서 낸다 — `globals.css` 가 `@import './pretendard.css'` 로
 *   삼키므로 여기에 <link> 가 없는 것이 정상이다(`scripts/build-fonts.mjs` 참고).
 *   예전에는 jsdelivr 를 <head> 에서 불렀고, 그건 렌더를 막는 요청이 남의 서버에 달린 상태였다.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://acrofuture.com'),
  title: {
    default: '아크로퓨처 — 금융·모빌리티·위치 기반 소프트웨어',
    template: '%s · 아크로퓨처',
  },
  description: `${COMPANY.foundedYear}년 설립. 금융 고객채널, 차량 내비게이션의 검색·지도, 통신사 측위 플랫폼을 만들고 운영합니다. ${approx(CLIENT_COUNT)} 고객사와 ${approx(WORK_COUNT)} 사업.`,
  openGraph: {
    type: 'website',
    siteName: '아크로퓨처',
    locale: 'ko_KR',
    title: '아크로퓨처 — 금융·모빌리티·위치 기반 소프트웨어',
    description: `${COMPANY.foundedYear}년부터 금융과 모빌리티, 위치의 문제를 풀어 온 소프트웨어 회사입니다.`,
  },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={jakarta.variable}>
      <body className="min-h-dvh">
        {/* 키보드로 오는 사람이 매번 메뉴를 지나지 않게 — 첫 탭에서만 보인다 */}
        <a
          href="#main"
          className="sr-only rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* 검색엔진에 회사 정보를 구조로 알린다 — 사람이 읽는 문장과 같은 값이다 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: COMPANY.nameKo,
              alternateName: COMPANY.nameEn,
              url: 'https://acrofuture.com',
              foundingDate: '2009-07-20',
              email: COMPANY.email,
              telephone: COMPANY.tel,
              address: {
                '@type': 'PostalAddress',
                streetAddress: COMPANY.address,
                postalCode: COMPANY.zip,
                addressLocality: '서울',
                addressCountry: 'KR',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
