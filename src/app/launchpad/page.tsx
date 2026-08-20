import type { Metadata } from "next";
import { LaunchpadWorkbench } from "@/components/launchpad/LaunchpadWorkbench";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "作品集检查与下载",
  description: "在浏览器本地导入 projects.json，检查文件结构、证据、隐私与内容关联，并下载发布文件。",
  pathname: "/launchpad/",
  keywords: ["作品集发布检查", "projects.json", "证据审计"],
  index: false,
});

export default function LaunchpadPage() {
  return <LaunchpadWorkbench />;
}
