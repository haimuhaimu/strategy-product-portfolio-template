import type { Metadata } from "next";
import type { Project } from "@/types/project";
import portfolioData from "../../data/projects.json";
import { getSiteUrl } from "./github-pages.mjs";

export const SITE_URL = getSiteUrl(process.env);
export const SITE_NAME = "证据驱动的产品与运营作品集";
export const DEFAULT_TITLE = "产品经理与运营作品集开源模板";
export const DEFAULT_DESCRIPTION =
  "开源静态作品集系统，用三个项目组织产品经理与运营经历，并通过证据审计区分事实、个人贡献与待补充信息。";
export const SHARE_IMAGE_PATH = "/images/og-share.png";
export const SHARE_IMAGE_WIDTH = 1376;
export const SHARE_IMAGE_HEIGHT = 768;

export const DEFAULT_KEYWORDS = [
  "产品经理作品集",
  "运营作品集",
  "证据驱动作品集",
  "作品集证据审计",
];

const anonymousProfileNames = new Set([
  "",
  "your name",
  "姓名",
  "你的名字",
  "ai 产品经理候选人",
]);

export function hasPublicIdentity(name = portfolioData.profile.name) {
  return !anonymousProfileNames.has(name.trim().toLowerCase());
}

export function getAbsoluteUrl(pathname = "/") {
  const normalizedPathname = `/${pathname.replace(/^\/+/, "")}`;
  return `${SITE_URL}${normalizedPathname}`;
}

export const SHARE_IMAGE_URL = getAbsoluteUrl(SHARE_IMAGE_PATH);

const shareImage = {
  url: SHARE_IMAGE_URL,
  width: SHARE_IMAGE_WIDTH,
  height: SHARE_IMAGE_HEIGHT,
  alt: "证据驱动作品集首页：三个项目及其可核验结果摘要",
};

type PageMetadataOptions = {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  type?: "website" | "article";
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  pathname,
  keywords = [],
  type = "website",
  index = true,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = getAbsoluteUrl(pathname);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl,
    },
    robots: {
      index,
      follow: index,
    },
    openGraph: {
      type,
      locale: "zh_CN",
      siteName: SITE_NAME,
      title,
      description,
      url: absoluteUrl,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE_URL],
    },
  };
}

export function getProjectSeoKeywords(project: Project) {
  const projectText = JSON.stringify(project);
  const keywords = ["证据驱动作品集"];

  if (/AI|Agent|自动化|模型|问答|RAG|LLM/i.test(projectText)) {
    keywords.push("AI 产品经理");
  }
  if (/策略|评估|流量|搜索|分发/i.test(projectText)) {
    keywords.push("策略产品经理");
  }
  if (/运营|作者|内容|商单|会员/i.test(projectText)) {
    keywords.push("运营作品集");
  } else {
    keywords.push("产品经理作品集");
  }

  return [...new Set(keywords)];
}

export function createSiteJsonLd() {
  const websiteId = getAbsoluteUrl("/#website");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: getAbsoluteUrl("/"),
        description: DEFAULT_DESCRIPTION,
        inLanguage: "zh-CN",
      },
      {
        "@type": "SoftwareApplication",
        "@id": getAbsoluteUrl("/#software"),
        name: "证据驱动作品集静态站点系统",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: getAbsoluteUrl("/"),
        description:
          "用于生成产品经理或运营作品集的开源静态站点系统，支持项目叙事、证据审计、Agent Skill 与 GitHub Pages 发布。",
        inLanguage: "zh-CN",
        isPartOf: { "@id": websiteId },
      },
    ],
  };
}

export function createProfileJsonLd() {
  const url = getAbsoluteUrl("/profile/");

  if (!hasPublicIdentity()) {
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: "作品集能力与经历说明",
      description:
        "以脱敏方式展示产品与运营能力、工作经历、判断方法和协作边界。",
      url,
      inLanguage: "zh-CN",
      isPartOf: {
        "@type": "WebSite",
        "@id": getAbsoluteUrl("/#website"),
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${portfolioData.profile.name}的作品集介绍`,
    url,
    inLanguage: "zh-CN",
    mainEntity: {
      "@type": "Person",
      name: portfolioData.profile.name,
      description: portfolioData.profile.summary,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": getAbsoluteUrl("/#website"),
    },
  };
}

export function createProjectJsonLd(project: Project) {
  const url = getAbsoluteUrl(`/projects/${project.slug}/`);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: project.title,
    description: project.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: "zh-CN",
    isPartOf: {
      "@type": "WebSite",
      "@id": getAbsoluteUrl("/#website"),
      url: getAbsoluteUrl("/"),
      name: SITE_NAME,
    },
    keywords: getProjectSeoKeywords(project),
    about: [project.domain, ...project.keywords],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
