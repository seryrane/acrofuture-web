import type { NextConfig } from "next";

// 정적 내보내기: 서버 기능 없이 out/ 폴더만 배포한다.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
