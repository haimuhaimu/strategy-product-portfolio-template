import type { Metadata } from "next";
import Link from "next/link";
import { BehindTheWork } from "@/components/BehindTheWork";
import { CognitiveCalibrationLog } from "@/components/CognitiveCalibrationLog";
import { MethodologySection } from "@/components/MethodologySection";
import { PersonalOperatingSystem } from "@/components/PersonalOperatingSystem";
import { ThinkingVisualWall } from "@/components/ThinkingVisualWall";
import { ValueOperatingSystem } from "@/components/ValueOperatingSystem";
import { FieldNotesSection } from "@/components/ProfileSections";
import { getCalibrationLogs, getProfile } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "产品思考模板 | AI 工作流、Agent 与推荐搜索",
  description:
    "用于展示 AI 工作流、Agent 产品设计、推荐搜索、内容生态与长期产品判断的思考页面模板。",
  pathname: "/thinking/",
  keywords: [
    "AI 工作流",
    "Agent 产品设计",
    "Agent 产品经理",
    "推荐搜索 AI",
    "AI 产品思考",
  ],
});

export default function ThinkingPage() {
  const profile = getProfile();
  const calibrationLogs = getCalibrationLogs();

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
            Thinking
          </p>
          <h1 className="mt-3 max-w-4xl [font-family:var(--font-display)] text-[2.05rem] font-semibold leading-[1.14] tracking-normal text-[#14110e] sm:text-5xl xl:text-[3.1rem]">
            判断系统、场外观察和长期笔记。
          </h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-[#3a2e24] sm:text-base sm:leading-8">
            首页只放结论。这里可以展示更完整的思考来源：怎么判断价值，怎么避免系统看错，以及个人兴趣如何影响产品判断。
          </p>
        </div>
      </section>

      <ThinkingVisualWall />
      <ValueOperatingSystem />
      <CognitiveCalibrationLog logs={calibrationLogs} />
      <MethodologySection profile={profile} />
      <BehindTheWork />
      <PersonalOperatingSystem />
      <FieldNotesSection profile={profile} />
    </main>
  );
}
