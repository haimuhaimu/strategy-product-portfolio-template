import type { Metadata } from "next";
import { PortfolioConfigurator } from "@/components/config/PortfolioConfigurator";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "本地配置作品集",
  description: "在浏览器本地配置作品集数据并执行证据审计；该工具页面不进入搜索引擎索引。",
  pathname: "/config/",
  keywords: ["作品集证据审计", "Agent Skill"],
  index: false,
});

export default function ConfigPage() {
  return <PortfolioConfigurator />;
}
