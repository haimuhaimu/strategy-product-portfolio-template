import type { Metadata } from "next";
import { PortfolioConfigurator } from "@/components/config/PortfolioConfigurator";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "配置作品集",
  description: "纯前端配置产品经理或运营作品集，并下载可直接替换的 projects.json。",
  pathname: "/config/",
});

export default function ConfigPage() {
  return <PortfolioConfigurator />;
}
