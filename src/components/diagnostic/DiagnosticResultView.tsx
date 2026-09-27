"use client";

import React from "react";
import { StaticPageLink } from "@/components/StaticPageLink";
import type { SafeDiagnosticShareModel } from "@/components/diagnostic/useDiagnosticShare";

const dimensionMeta: Record<string, { label: string; hint: string }> = {
  resultEvidence: { label: "结果证据", hint: "有没有可核对的结果、采用或交付事实" },
  scopeAndAttribution: { label: "口径完整", hint: "有没有对象、范围、周期、基线或对照" },
  methodEvidence: { label: "方法证据", hint: "有没有样本、实验、访谈、漏斗或评估方法" },
  artifactEvidence: { label: "资产证据", hint: "有没有规则、原型、SOP、看板等沉淀" },
  contributionBoundary: { label: "贡献边界", hint: "有没有说清个人动作、团队结果与未验证项" },
};

type DiagnosticResultViewProps = {
  model: SafeDiagnosticShareModel;
  shared?: boolean;
  actions?: React.ReactNode;
  feedback?: React.ReactNode;
  onTryMyself?: () => void;
};

export function DiagnosticResultView({
  model,
  shared = false,
  actions,
  feedback,
  onTryMyself,
}: DiagnosticResultViewProps) {
  return (
    <div
      id={shared ? "shared-diagnostic-result" : "diagnostic-result"}
      className="mt-8 scroll-mt-4"
      aria-live="polite"
    >
      {shared ? (
        <div className="mb-5 border border-[#f3a08a]/55 bg-[#fffaf0] p-5 text-[#14110e] shadow-[7px_7px_0_rgba(216,75,40,0.32)] sm:p-6">
          <p className="font-mono text-xs font-bold tracking-[0.14em] text-[#c92a20]">SAFE SHARED RESULT</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-4xl">朋友分享的安全诊断结果</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6e5743]">
            这条链接只含结构化分数、五维覆盖、隐私风险数量和白名单追问，不含填写原文；解析完全在浏览器本地完成，不会上传内容。
          </p>
          <button
            type="button"
            onClick={onTryMyself}
            className="mt-5 bg-[#c92a20] px-5 py-3 font-semibold text-white transition hover:bg-[#a92119] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1437d6]"
          >
            我也测一下
          </button>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border border-white/20 bg-white/5 p-5 sm:p-6">
          <p className="font-mono text-xs font-bold tracking-[0.14em] text-[#f3a08a]">EVIDENCE SCORE</p>
          <div className="mt-4 flex items-end gap-3">
            <strong className="font-mono text-6xl text-white">{model.totalScore}</strong>
            <span className="pb-2 text-[#d8c7b6]">/ 5 · {model.level}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#d8c7b6]">分数只表示这段文字是否覆盖关键证据，不代表项目质量或结果真实性。</p>
          {actions ? <div className="mt-5 grid gap-3">{actions}</div> : null}
          {feedback}
        </div>

        <div className="border border-white/20 bg-[#fffaf0] p-5 text-[#14110e] sm:p-6">
          <div className="grid gap-3 sm:grid-cols-5">
            {Object.entries(model.dimensions).map(([key, coverage]) => {
              const passed = coverage > 0;
              const meta = dimensionMeta[key];
              return (
                <div key={key} className={`border p-3 ${passed ? "border-[#26734d]/35 bg-[#eff9f2]" : "border-[#c92a20]/25 bg-[#fff0ec]"}`}>
                  <span className={`font-mono text-[10px] font-bold ${passed ? "text-[#26734d]" : "text-[#c92a20]"}`}>{passed ? "已识别" : "待补充"}</span>
                  <h3 className="mt-2 text-sm font-semibold">{meta.label}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#6e5743]">{meta.hint}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-l-4 border-[#c92a20] bg-[#f4dfbd] p-4">
            <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#8b3a28]">唯一下一步</p>
            <p className="mt-2 font-semibold leading-7">{model.priorityQuestion}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className={model.privacyRiskCount ? "font-semibold text-[#9d2119]" : "text-[#26734d]"}>
              {model.privacyRiskCount ? `发现 ${model.privacyRiskCount} 类常见隐私风险，请先脱敏。` : "未命中常见敏感模式，发布前仍需人工确认。"}
            </p>
            {!shared ? (
              <div className="flex flex-wrap gap-4">
                <StaticPageLink href="/start/" className="font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">让 Agent 完整整理 →</StaticPageLink>
                <StaticPageLink href="/launchpad/" className="font-semibold text-[#80654d] underline decoration-[#80654d]/30 underline-offset-4">检查 projects.json →</StaticPageLink>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
