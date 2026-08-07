import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const sitePath = `${new URL(SITE_URL).pathname.replace(/\/+$/, "")}/`;

  return {
    rules: {
      userAgent: "*",
      allow: sitePath,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
