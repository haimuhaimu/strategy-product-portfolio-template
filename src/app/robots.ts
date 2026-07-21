import type { MetadataRoute } from "next";
import { getAbsoluteUrl, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: new URL(SITE_URL).origin,
  };
}
