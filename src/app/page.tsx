import type { Metadata } from "next";
import React from "react";
import { ClosingCTA } from "@/components/ClosingCTA";
import { EvidenceSnapshot } from "@/components/EvidenceSnapshot";
import { FeaturedProjectShowcase } from "@/components/FeaturedProjectShowcase";
import { HeroOverview } from "@/components/HeroOverview";
import { HomeEvidenceSection } from "@/components/HomeEvidenceSection";
import { SignatureAtlasSection } from "@/components/SignatureAtlasSection";
import { getContact, getFeaturedProjects, getHomeConfig, getProfile, getRoadmap, getStarMap } from "@/lib/projects";
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
  const siteJsonLd = createSiteJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
      />
      <main className="home-page">
      <div className="mx-auto max-w-7xl px-4 sm:px-8"><HeroOverview profile={profile} home={home} /></div>
      <FeaturedProjectShowcase projects={featuredProjects} />
      <EvidenceSnapshot projects={featuredProjects} />
      <HomeEvidenceSection home={home} />
      <SignatureAtlasSection roadmap={getRoadmap()} starMap={getStarMap()} />
      <ClosingCTA contact={getContact()} />
      </main>
    </>
  );
}
