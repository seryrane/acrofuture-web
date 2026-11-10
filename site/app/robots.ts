import type { MetadataRoute } from "next";
import { meta } from "@/lib/facts";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${meta.url}/sitemap.xml` };
}
