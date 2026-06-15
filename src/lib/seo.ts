import type { Metadata } from "next";
import type { Project } from "@/types/project";
import portfolioData from "../../data/projects.json";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  configuredSiteUrl || "https://portfolio.example.com"
).replace(/\/+$/, "");
export const PERSON_NAME = portfolioData.profile.name;
export const PERSON_ALTERNATE_NAME = "Your Name";
export const SITE_NAME = `${PERSON_NAME}的作品集`;

export const DEFAULT_DESCRIPTION =
  "中文 AI 产品经理与策略产品经理作品集模板，展示 AI 工作流、推荐搜索、内容生态、作者变现和增长项目的案例表达方式。";

export const DEFAULT_KEYWORDS = [
  PERSON_NAME,
  "个人作品集",
  "产品经理作品集模板",
  "AI 产品经理",
  "AI 产品经理作品集",
  "AI 策略产品经理",
  "Agent 产品经理",
  "AI 工作流",
  "策略产品经理",
  "推荐搜索",
  "内容生态",
];

export function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, SITE_URL).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  pathname,
  keywords = [],
  type = "website",
}: PageMetadataOptions): Metadata {
  return {
    title: { absolute: title },
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      type,
      locale: "zh_CN",
      siteName: SITE_NAME,
      title,
      description,
      url: pathname,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function getProjectSeoKeywords(project: Project) {
  const keywords = [
    ...project.keywords,
    PERSON_NAME,
    SITE_NAME,
    "策略产品经理",
  ];
  const projectText = JSON.stringify(project);

  if (/AI|Agent|自动化|模型/i.test(projectText)) {
    keywords.push("AI 产品经理", "AI 工作流", "Agent 产品");
  }

  if (/问答|答案|语义模型|搜索满足/i.test(projectText)) {
    keywords.push("AI 搜索产品", "推荐搜索 AI");
  }

  return [...new Set(keywords)];
}

export function createSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON_NAME,
        alternateName: PERSON_ALTERNATE_NAME,
        url: `${SITE_URL}/`,
        jobTitle: ["AI 产品经理", "策略产品经理"],
        description: DEFAULT_DESCRIPTION,
        knowsAbout: [
          "AI 工作流",
          "Agent 产品",
          "推荐与搜索",
          "内容生态",
          "作者变现",
          "游戏内容增长",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: [
          "Strategy Product Portfolio",
          "AI Product Manager Portfolio",
          "策略产品经理作品集模板",
        ],
        url: `${SITE_URL}/`,
        inLanguage: "zh-CN",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
    ],
  };
}

export function createProjectJsonLd(project: Project) {
  const url = getAbsoluteUrl(`/projects/${project.slug}/`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: "zh-CN",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PERSON_NAME,
      alternateName: PERSON_ALTERNATE_NAME,
      url: `${SITE_URL}/`,
    },
    keywords: getProjectSeoKeywords(project),
    about: [project.domain, ...project.keywords],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
