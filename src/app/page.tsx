import type { Metadata } from "next";
import React from "react";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ColdStartGrowthSections } from "@/components/ColdStartGrowthSections";
import { EvidenceSnapshot } from "@/components/EvidenceSnapshot";
import { FeaturedProjectShowcase } from "@/components/FeaturedProjectShowcase";
import { HeroOverview } from "@/components/HeroOverview";
import { HomeEvidenceSection } from "@/components/HomeEvidenceSection";
import { InstantEvidenceDiagnostic } from "@/components/InstantEvidenceDiagnostic";
import { SignatureAtlasSection } from "@/components/SignatureAtlasSection";
import { StaticPageLink } from "@/components/StaticPageLink";
import { TemplateHome } from "@/components/templates/TemplateHome";
import { getActiveTemplate, getContact, getFeaturedProjects, getHomeConfig, getPortfolioData, getProfile, getRoadmap, getStarMap } from "@/lib/projects";
import { createPageMetadata, createSiteJsonLd, DEFAULT_KEYWORDS, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "产品经理与运营作品集",
  description: "粘贴一段项目经历，在浏览器本地获得五维证据诊断；再用自己的 Agent 生成产品经理、AI 产品经理或运营作品集。",
  pathname: "/",
  keywords: DEFAULT_KEYWORDS,
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
      <main className="home-page" data-motion-template="atlas">
      <div className="mx-auto max-w-7xl px-4 sm:px-8"><HeroOverview profile={profile} home={home} /></div>
      <InstantEvidenceDiagnostic />
      <ColdStartGrowthSections />
      <FeaturedProjectShowcase projects={featuredProjects} />
      <EvidenceSnapshot projects={featuredProjects} />
      <HomeEvidenceSection home={home} />
      <SignatureAtlasSection roadmap={getRoadmap()} starMap={getStarMap()} />
      <ClosingCTA contact={getContact()} />
      <aside className="border-t border-[#14110e]/15 bg-[#f8f8f3] px-4 py-5 sm:px-8" aria-label="作品集作者入口">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm text-[#6e5743]">
          <p><strong className="text-[#14110e]">用你自己的 Agent，把经历变成可发布的作品集。</strong> 有材料就交给 Agent，已有文件就直接检查。</p>
          <StaticPageLink href="/start/" className="font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">开始制作我的作品集 →</StaticPageLink>
        </div>
      </aside>
      </main>
      ) : (
        <TemplateHome template={activeTemplate} data={getPortfolioData()} projects={featuredProjects} />
      )}
    </>
  );
}
