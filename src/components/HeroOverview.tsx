import Link from "next/link";
import { StaticPageLink } from "@/components/StaticPageLink";
import type { HomeConfig, Profile } from "@/types/project";

type HeroOverviewProps = { profile: Profile; home: HomeConfig };

export function HeroOverview({ profile, home }: HeroOverviewProps) {
  return (
    <section className="atlas-home-hero py-12 sm:py-20" data-motion-hero="atlas">
      <div className="atlas-archive-card rounded-2xl border border-[#14110e]/15 bg-[#fffdf8] px-6 py-10 shadow-[0_18px_50px_rgba(20,17,14,0.08)] sm:px-10 sm:py-14">
        <span className="atlas-archive-scan" aria-hidden="true" />
        <p className="font-mono text-sm font-semibold text-[#c92a20]">{home.introEyebrow}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl [font-family:var(--font-display)] text-4xl font-semibold leading-tight text-[#14110e] sm:text-6xl">
              {home.introTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b3829]">{profile.summary}</p>
          </div>
          <div className="border-l-2 border-[#c92a20] pl-5">
            <p className="text-2xl font-semibold text-[#14110e]">{profile.name}</p>
            <p className="mt-2 text-base text-[#5b4635]">{profile.role}</p>
            {profile.location ? <p className="mt-1 text-sm text-[#80654d]">{profile.location}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#projects" className="rounded-lg bg-[#c92a20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a92119]">查看 3 个代表项目</Link>
              <StaticPageLink href="/config/" className="rounded-lg border border-[#14110e]/25 px-5 py-3 text-sm font-semibold text-[#14110e] transition hover:border-[#c92a20] hover:text-[#c92a20]">配置我的作品集</StaticPageLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
