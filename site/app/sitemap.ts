import type { MetadataRoute } from "next";
import { meta } from "@/lib/facts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${meta.url}/`, changeFrequency: "monthly", priority: 1 }];
}
