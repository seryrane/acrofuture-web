import { SkipLink } from "@/components/SkipLink";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SmoothAnchors } from "@/components/SmoothAnchors";
import { SurfaceSync } from "@/components/SurfaceSync";
import { Company } from "@/components/v4/Company";
import { Business } from "@/components/v4/Business";
import { AiSection } from "@/components/v4/AiSection";
import { Solutions } from "@/components/v4/Solutions";
import { RecordSection } from "@/components/v4/RecordSection";
import { Contact } from "@/components/chapters/Contact";

// 4판 6절 문서 흐름(서버 컴포넌트): 회사 → 사업 → AI 활용 → 솔루션 → 사례 → 문의(V4-PLAN §3 · §11.2).
// 클라이언트 JS 는 헤더 · 테마 · 앵커 · 절 동기화와 A-Flow 탭 · 영상 버튼뿐이다.
// 3판 장면 스테이지(lib/scenes.ts, components/chapters 의 나머지 장, lib/stage)는 이 페이지에서 쓰지 않는다.
// 무대 연출 2곳(히어로 오차 원 · AI 지시 흐름)은 다음 하위 지시가 [data-stage] 자리에 붙인다.
export default function Home() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <div id="top" />
        <Company />
        <Business />
        <AiSection />
        <Solutions />
        <RecordSection />
        <Contact />
      </main>
      <SiteFooter />
      <SmoothAnchors />
      <SurfaceSync />
    </>
  );
}
