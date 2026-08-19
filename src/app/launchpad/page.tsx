import type { Metadata } from "next";
import { LaunchpadWorkbench } from "@/components/launchpad/LaunchpadWorkbench";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "本地作品集发布工作台",
  description: "在浏览器本地导入 projects.json，完成结构、证据、隐私与引用检查，并生成 Release Pack。",
  pathname: "/launchpad/",
  keywords: ["作品集发布检查", "projects.json", "证据审计"],
  index: false,
});

export default function LaunchpadPage() {
  return <LaunchpadWorkbench />;
}
