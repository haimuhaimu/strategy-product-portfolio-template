import portfolioData from "../../data/projects.json";
import type { PortfolioData, Project } from "@/types/project";

const data = portfolioData as PortfolioData;

export function getProfile() {
  return data.profile;
}

export function getProjects(): Project[] {
  return [...data.projects].sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getProjectSlugs() {
  return getProjects().map((project) => ({
    slug: project.slug,
  }));
}

export function getFeaturedMetrics() {
  return [
    { label: "商单收入提升", value: "+X%" },
    { label: "交易内容收入增长", value: "+Z%" },
    { label: "图文 DAU 提升", value: "百万级增量" },
    { label: "经验页频道 DAU", value: "千万级规模" },
    { label: "小游戏 DAU", value: "百万级规模" },
    { label: "可归因游戏流水", value: "数亿级" },
    { label: "问答式搜索覆盖需求", value: "双位数比例" },
  ];
}
