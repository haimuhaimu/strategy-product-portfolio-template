import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const sitePath = `${new URL(SITE_URL).pathname.replace(/\/+$/, "")}/`;

  return {
    rules: {
      userAgent: "*",
      allow: sitePath,
      disallow: [`${sitePath}config/`, `${sitePath}launchpad/`],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
