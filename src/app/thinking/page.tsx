import type { Metadata } from "next";
import Link from "next/link";
import { BehindTheWork } from "@/components/BehindTheWork";
import { CognitiveCalibrationLog } from "@/components/CognitiveCalibrationLog";
import { MethodologySection } from "@/components/MethodologySection";
import { PersonalModelSystem } from "@/components/PersonalModelSystem";
import { ThinkingVisualWall } from "@/components/ThinkingVisualWall";
import { ValueOperatingSystem } from "@/components/ValueOperatingSystem";
import { FieldNotesSection } from "@/components/ProfileSections";
import {
  getCalibrationLogs,
  getInfluences,
  getPersonalOperatingSystem,
  getProfile,
  getTrainingHistory,
} from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "个人认知模型 | 产品经理与运营作品集模板",
  description:
    "用人物模型、奖励函数、行动策略、影响来源和训练史展示产品经理与运营的个人认知操作系统。",
  pathname: "/thinking/",
  keywords: [
    "个人认知模型",
    "产品经理个人操作系统",
    "运营作品集",
    "认知校准",
    "成长训练史",
  ],
});

export default function ThinkingPage() {
  const profile = getProfile();
  const calibrationLogs = getCalibrationLogs();
  const operatingSystem = getPersonalOperatingSystem();
  const influences = getInfluences();
  const trainingHistory = getTrainingHistory();

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
            个人模型、判断系统和长期训练记录。
          </h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-[#3a2e24] sm:text-base sm:leading-8">
            这里把人物模型、奖励函数、行动策略与影响来源写成当前版本，并用现实反馈持续校准。它既适用于产品判断，也适用于运营决策。
          </p>
        </div>
      </section>

      <ThinkingVisualWall />
      <PersonalModelSystem
        operatingSystem={operatingSystem}
        influences={influences}
        trainingHistory={trainingHistory}
      />
      <ValueOperatingSystem />
      <CognitiveCalibrationLog logs={calibrationLogs} />
      <MethodologySection profile={profile} />
      <BehindTheWork />
      <FieldNotesSection profile={profile} />
    </main>
  );
}
