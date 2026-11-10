import type { MetadataRoute } from "next";
import { company, meta } from "@/lib/facts";

// 홈 화면 추가·탭 아이콘용 매니페스트. 아이콘은 scripts/make-icons.py 가 만든다.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: meta.title,
    short_name: company.wordmark,
    description: meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#070C1A",
    theme_color: "#070C1A",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
