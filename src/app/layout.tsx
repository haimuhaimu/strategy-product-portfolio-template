import type { Metadata } from "next";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Header } from "@/components/Header";
import { PortfolioCompanion } from "@/components/PortfolioCompanion";
import { UnderstandingProgressWidget } from "@/components/UnderstandingProgressWidget";
import { getProfile } from "@/lib/projects";
import {
  createSiteJsonLd,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  getAbsoluteUrl,
  serializeJsonLd,
  SITE_NAME,
} from "@/lib/seo";
import "./globals.css";

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const baiduVerification =
  process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(getAbsoluteUrl("/")),
  title: {
    default: "中文 AI 产品经理与策略产品经理作品集模板",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE_NAME,
    title: "中文 AI 产品经理与策略产品经理作品集模板",
    description: DEFAULT_DESCRIPTION,
    url: getAbsoluteUrl("/"),
  },
  twitter: {
    card: "summary",
    title: "中文 AI 产品经理与策略产品经理作品集模板",
    description: DEFAULT_DESCRIPTION,
  },
  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
  other: baiduVerification
    ? {
        "baidu-site-verification": baiduVerification,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = getProfile();
  const siteJsonLd = createSiteJsonLd();

  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(siteJsonLd),
          }}
        />
        <Header profile={profile} />
        {children}
        <PortfolioCompanion />
        <UnderstandingProgressWidget />
        <BackToTopButton />
      </body>
    </html>
  );
}
