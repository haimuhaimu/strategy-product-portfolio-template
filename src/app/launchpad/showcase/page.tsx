import type { Metadata } from "next";
import { ShowcaseSubmissionWorkbench } from "@/components/launchpad/ShowcaseSubmissionWorkbench";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: "Showcase 本地投稿助手",
  description: "在浏览器本地整理、校验并下载 Showcase 公开条目，同时生成不含草稿原文的公开 Issue 摘要。",
  pathname: "/launchpad/showcase/",
  keywords: ["Showcase 投稿", "本地 JSON 校验", "作品集公开条目"],
  index: false,
});

export default function ShowcaseSubmissionPage() {
  return <ShowcaseSubmissionWorkbench />;
}
