import type { Metadata } from "next";
import { ClosingCTA } from "@/components/ClosingCTA";
import { AiWorkflowExperiments } from "@/components/AiWorkflowExperiments";
import { FeaturedProjectShowcase } from "@/components/FeaturedProjectShowcase";
import { HashAnchorSync } from "@/components/HashAnchorSync";
import { HeroOverview } from "@/components/HeroOverview";
import { HomeThinkingTeaser } from "@/components/HomeThinkingTeaser";
import { getProfile, getProjects } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "中文 AI 产品经理与策略产品经理作品集模板",
  description:
    "一套以问题、判断、验证和结果为主线的中文 AI 产品经理与策略产品经理作品集模板。",
  pathname: "/",
  keywords: [
    "中文作品集模板",
    "AI 产品经理作品集",
    "策略产品作品集",
  ],
});

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();

  return (
    <main className="home-page">
      <HashAnchorSync />

      <div className="mx-auto max-w-[1680px] px-4 sm:px-8">
        <HeroOverview profile={profile} />
      </div>

      <FeaturedProjectShowcase projects={projects} />

      <AiWorkflowExperiments />

      <HomeThinkingTeaser profile={profile} />

      <ClosingCTA profile={profile} />
    </main>
  );
}
