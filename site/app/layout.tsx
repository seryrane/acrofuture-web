import type { Metadata, Viewport } from "next";
import "@/styles/tokens.css";
import "@/styles/stage.css";
import "@/styles/ui.css";
import "@/styles/motion.css";
import "@/styles/stages.css";
import "./globals.css";
import { company, contact, meta } from "@/lib/facts";

export const metadata: Metadata = {
  metadataBase: new URL(meta.url),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: company.name,
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// 페인트 전에: 테마(기본 deep, 저장값 "light" 만 밝은 테마. 2판 저장값 "dark" 는 지운다), theme-color, 첫 절 바탕(회사, night). 절 이름 data-chapter 는 SurfaceSync 가 세운다.
// 3판의 스테이지 모드 표시(data-scrub)는 4판 정적 흐름에 없다. 무대 연출 2곳을 붙이는 하위 지시가 필요하면 다시 세운다.
const boot = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t==="dark")localStorage.removeItem("theme");if(t==="light"){d.setAttribute("data-theme","light");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#F5F7FB")}}catch(e){}d.setAttribute("data-surface","night")})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  alternateName: company.wordmark,
  url: meta.url,
  foundingDate: company.foundedIso,
  email: contact.email,
  telephone: "+82-2-6925-1234",
  faxNumber: "+82-2-6280-2134",
  address: {
    "@type": "PostalAddress",
    streetAddress: "도곡로2길 14 규원빌딩 3F",
    addressLocality: "강남구",
    addressRegion: "서울",
    postalCode: contact.postal,
    addressCountry: "KR",
  },
  award: "통신사 우수협력상(2025)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#070C1A" />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link
          rel="preload"
          href="/fonts/pretendard-subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/pjs-800-wordmark.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* 표시용 숫자(표제란·대형 숫자)가 늦게 바뀌며 줄이 밀리지 않게(3KB) */}
        <link
          rel="preload"
          href="/fonts/pjs-800-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
