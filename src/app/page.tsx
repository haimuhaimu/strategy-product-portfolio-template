import type { Metadata } from "next";
import React from "react";
import { ClosingCTA } from "@/components/ClosingCTA";
import { EvidenceSnapshot } from "@/components/EvidenceSnapshot";
import { FeaturedProjectShowcase } from "@/components/FeaturedProjectShowcase";
import { HeroOverview } from "@/components/HeroOverview";
import { HomeEvidenceSection } from "@/components/HomeEvidenceSection";
import { SignatureAtlasSection } from "@/components/SignatureAtlasSection";
import { StaticPageLink } from "@/components/StaticPageLink";
import { TemplateHome } from "@/components/templates/TemplateHome";
import { getActiveTemplate, getContact, getFeaturedProjects, getHomeConfig, getPortfolioData, getProfile, getRoadmap, getStarMap } from "@/lib/projects";
import { createPageMetadata, createSiteJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "产品经理与运营作品集",
  description: "用三个代表项目和证据审计展示产品经理、运营与 AI 策略实践，明确事实、个人贡献和协作边界。",
  pathname: "/",
  keywords: ["产品经理作品集", "运营作品集", "证据驱动作品集"],
});

export default function Home() {
  const profile = getProfile();
  const home = getHomeConfig();
  const featuredProjects = getFeaturedProjects();
  const activeTemplate = getActiveTemplate();
  const siteJsonLd = createSiteJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
      />
      {activeTemplate === "atlas" ? (
      <main className="home-page">
      <div className="mx-auto max-w-7xl px-4 sm:px-8"><HeroOverview profile={profile} home={home} /></div>
      <FeaturedProjectShowcase projects={featuredProjects} />
      <EvidenceSnapshot projects={featuredProjects} />
      <HomeEvidenceSection home={home} />
      <SignatureAtlasSection roadmap={getRoadmap()} starMap={getStarMap()} />
      <ClosingCTA contact={getContact()} />
      <aside className="border-t border-[#14110e]/15 bg-[#f8f8f3] px-4 py-5 sm:px-8" aria-label="作品集作者入口">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm text-[#6e5743]">
          <p><strong className="text-[#14110e]">你也在整理作品集？</strong> 从材料、JSON 或示例中任选一条路径开始。</p>
          <div className="flex flex-wrap gap-4">
            <StaticPageLink href="/pilot/" className="font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">查看 v0.6 PMF Pilot</StaticPageLink>
            <StaticPageLink href="/start/" className="font-semibold text-[#80654d] underline decoration-[#80654d]/30 underline-offset-4 hover:text-[#c92a20]">进入作者工作台 →</StaticPageLink>
          </div>
        </div>
      </aside>
      </main>
      ) : (
        <TemplateHome template={activeTemplate} data={getPortfolioData()} projects={featuredProjects} />
      )}
    </>
  );
}
