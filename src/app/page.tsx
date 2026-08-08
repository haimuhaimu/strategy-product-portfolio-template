import type { Metadata } from "next";
import { ClosingCTA } from "@/components/ClosingCTA";
import { FeaturedProjectShowcase } from "@/components/FeaturedProjectShowcase";
import { HeroOverview } from "@/components/HeroOverview";
import { HomeEvidenceSection } from "@/components/HomeEvidenceSection";
import { SignatureAtlasSection } from "@/components/SignatureAtlasSection";
import { getContact, getFeaturedProjects, getHomeConfig, getProfile, getRoadmap, getStarMap } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "产品经理与运营作品集",
  description: "用三个代表项目和结果证据，清晰展示产品经理或运营的工作能力。",
  pathname: "/",
  keywords: ["中文作品集模板", "产品经理作品集", "运营作品集"],
});

export default function Home() {
  const profile = getProfile();
  const home = getHomeConfig();
  return (
    <main className="home-page">
      <div className="mx-auto max-w-7xl px-4 sm:px-8"><HeroOverview profile={profile} home={home} /></div>
      <FeaturedProjectShowcase projects={getFeaturedProjects()} />
      <HomeEvidenceSection home={home} />
      <SignatureAtlasSection roadmap={getRoadmap()} starMap={getStarMap()} />
      <ClosingCTA contact={getContact()} />
    </main>
  );
}
