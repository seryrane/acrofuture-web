import type { NextConfig } from 'next'

/**
 * 정적 사이트로 내보낸다 — 서버가 필요 없어 지금 쓰는 호스팅에 그대로 올릴 수 있고 빠르다.
 *
 * ⚠ 정적이라 못 하는 것: 서버에서 폼을 받는 일. 그래서 문의는 폼 대신 전화·이메일이다
 *   (받는 곳이 없는 폼은 없는 것보다 나쁘다 — docs/개편_기획.md 8절).
 * ⚠ `next/image` 의 서버 최적화도 못 쓴다. 지금은 사진 대신 캔버스로 그리므로 해당 없음.
 */
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // 정적 호스팅은 `/works/x` 를 파일로 못 찾는 경우가 있다 — 디렉터리+index.html 로 내보낸다
  trailingSlash: true,

  /**
   * 개발 서버를 **임시 공개 주소로 볼 때만** 필요하다.
   * Next 는 개발 모드에서 낯선 호스트의 요청을 막는데, 막히면 화면은 뜨는데 스타일·스크립트만
   * 조용히 안 와서 "왜 깨져 보이지"가 된다. 터널 호스트를 여기 적어 둔다.
   * ⚠ 개발 전용이다 — 정적 내보내기(`npm run build`)에는 아무 영향이 없다.
   */
  allowedDevOrigins: ['acro.stock-autotrade.com'],
}

export default nextConfig
