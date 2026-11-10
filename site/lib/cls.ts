// 전역 CSS(접두사 + 이름) 클래스 도우미. CSS 모듈은 서버 컴포넌트에서 써도 클래스 맵이 첫 로드 JS 에 실리므로(4.1 예산),
// 4.1 사업 영역이 재사용하는 부품은 전역 CSS 로 두고 이 도우미로 이름만 만든다. 서버에서만 쓴다.
export function cls(prefix: string): Record<string, string> {
  return new Proxy({} as Record<string, string>, {
    get: (_t, k) => (typeof k === "string" ? `${prefix}_${k}` : undefined),
  });
}
