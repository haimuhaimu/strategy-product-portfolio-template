import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/ClosingCTA";
import { CredibilityProof } from "@/components/CredibilityProof";
import {
  AboutSection,
  ActionPrinciplesSection,
  CapabilitiesSection,
  ExperienceSection,
} from "@/components/ProfileSections";
import { getProfile } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "个人介绍模板 | 产品经理与运营经历能力",
  description:
    "展示产品经理、产品运营与策略运营的经历、能力证明、实验判断和跨团队推进方式。",
  pathname: "/profile/",
  keywords: [
    "产品经理个人介绍",
    "产品经理工作经历",
    "AI 策略产品经理",
    "推荐搜索产品经理",
    "内容生态产品经理",
  ],
});

export default function ProfilePage() {
  const profile = getProfile();

  return (
    <main>
      <section className="mx-auto max-w-[1680px] px-4 py-6 sm:px-8 lg:py-8">
        <Link
          href="/"
          className="inline-flex rounded-[6px] border border-[#14110e]/45 bg-[#fff8eb] px-4 py-2 font-mono text-sm font-semibold uppercase text-[#c92a20] shadow-[0_10px_24px_rgba(20,17,14,0.08)] transition hover:-translate-y-0.5 hover:border-[#8b3a28]"
        >
          ← 返回首页
        </Link>
        <div className="mt-5 rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-5 shadow-[0_20px_58px_rgba(20,17,14,0.12)] sm:p-7">
          <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
            Profile
          </p>
          <h1 className="mt-3 max-w-4xl [font-family:var(--font-display)] text-[2.05rem] font-semibold leading-[1.14] tracking-normal text-[#14110e] sm:text-5xl xl:text-[3.1rem]">
            个人介绍、能力证明和经历脉络。
          </h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-[#3a2e24] sm:text-base sm:leading-8">
            这里放更完整的个人背景：我怎么证明自己靠谱，我反复使用的能力是什么，以及这些能力从哪些业务阶段里长出来。
          </p>
        </div>
      </section>

      <AboutSection profile={profile} />
      <CredibilityProof />
      <CapabilitiesSection profile={profile} />
      <ExperienceSection profile={profile} />
      <ActionPrinciplesSection />
      <ClosingCTA profile={profile} />
    </main>
  );
}
