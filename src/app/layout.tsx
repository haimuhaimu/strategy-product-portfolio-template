import type { Metadata } from "next";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Header } from "@/components/Header";
import { MotionRevealObserver } from "@/components/MotionRevealObserver";
import { PortfolioCompanion } from "@/components/PortfolioCompanion";
import { UnderstandingProgressWidget } from "@/components/UnderstandingProgressWidget";
import { getActiveTemplate, getFeatureFlags, getProfile } from "@/lib/projects";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  getAbsoluteUrl,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_URL,
  SHARE_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";
import "./motion.css";

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const baiduVerification =
  process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: getAbsoluteUrl("/"),
    images: [
      {
        url: SHARE_IMAGE_URL,
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: "证据驱动作品集首页：三个项目及其可核验结果摘要",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [SHARE_IMAGE_URL],
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
  const features = getFeatureFlags();
  const activeTemplate = getActiveTemplate();

  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" data-template={activeTemplate}>
      <body>
        <MotionRevealObserver />
        <div className="reading-progress" aria-hidden="true" />
        <Header profile={profile} features={features} />
        {children}
        {features.advancedModels ? <PortfolioCompanion /> : null}
        {features.advancedModels ? <UnderstandingProgressWidget /> : null}
        <BackToTopButton />
      </body>
    </html>
  );
}
