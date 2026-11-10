import type { Metadata } from "next";
import s from "@/components/v4/Section.module.css";

// 없는 주소(정적 내보내기 out/404.html, GitHub Pages 도 없는 주소에 이 파일을 낸다).
// 3판까지 공개 사이트에 있던 옛 주소를 4판의 해당 절로 안내한다(V4-PLAN §11.9, 2026-11-10):
//   /works/ · /works/<사업>/ → 홈 «사업» 절(#business), /careers/ → «문의» 절(#contact).
// 옛 사업 상세 쪽은 고객사 이름을 담고 있어 다시 만들지 않는다(D2). 이 쪽 글에도 옛 주소 이름을 쓰지 않는다.
// 헤더 메뉴(#절 앵커)는 이 쪽에서 홈으로 가지 않으므로 넣지 않는다. 스크립트를 끈 브라우저는 아래 링크로 직접 간다. 검색 색인에서는 빠지게 noindex.
export const metadata: Metadata = {
  title: "아크로퓨처 | 찾는 쪽이 없습니다",
  robots: { index: false, follow: true },
};

const MOVE = `(function(){var p=location.pathname;var t=/^\\/works(\\/|$)/.test(p)?"/#business":/^\\/careers(\\/|$)/.test(p)?"/#contact":null;if(t)location.replace(t);})();`;

export default function NotFound() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: MOVE }} />
      <main id="main" tabIndex={-1}>
        <section className={`${s.sec} night`} data-surface-of="night" aria-labelledby="nf-title">
          <div className="container">
            <p className={s.label}>404</p>
            <h1 id="nf-title">찾는 쪽이 없습니다</h1>
            <p className={s.lede}>
              홈페이지를 새로 정리하면서 사업 사례는 홈의 «사업» 절로, 채용 문의는 «문의» 절로 옮겼습니다.
            </p>
            <p style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px", marginTop: 24 }}>
              <a href="/#business" className="btn-primary">
                사업 보기
              </a>{" "}
              <a href="/#contact">문의하기</a>{" "}
              <a href="/">홈으로</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
