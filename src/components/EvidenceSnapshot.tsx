import React from "react";
import { auditPortfolioDraft, DIMENSIONS } from "@/lib/evidence-audit.mjs";
import type { EvidenceAuditReport, EvidenceDimensionKey } from "@/lib/evidence-audit-types";
import type { Project } from "@/types/project";

const dimensionHints: Record<EvidenceDimensionKey, string> = {
  resultEvidence: "是否有数值、采用或交付事实",
  scopeAndAttribution: "是否说明对象、周期、基线或归因",
  methodEvidence: "是否呈现验证判断的具体方法",
  artifactEvidence: "是否留下可复用的交付资产",
  contributionBoundary: "是否区分个人动作与团队结果",
};

function coverageLabel(value: number, projectCount: number) {
  const covered = Math.round(value * projectCount);
  return covered === projectCount ? `${covered}/${projectCount} 已覆盖` : `${covered}/${projectCount} · 待补证据`;
}

function DimensionCoverage({
  report,
  projectCount,
}: {
  report: EvidenceAuditReport;
  projectCount: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {DIMENSIONS.map(([key, label]) => {
        const dimension = report.dimensionScores[key];
        const percentage = Math.round(dimension.value * 100);
        return (
          <div key={key} className="rounded-lg border border-[#14110e]/10 bg-white/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#14110e]">{label}</h3>
              <span className={`font-mono text-xs font-semibold ${percentage === 100 ? "text-[#26734d]" : "text-[#c92a20]"}`}>
                {percentage}%
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#14110e]/10">
              <div
                className="h-full rounded-full bg-[#c92a20] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-semibold text-[#5b4635]">{coverageLabel(dimension.value, projectCount)}</p>
            <p className="mt-1 text-[11px] leading-5 text-[#80654d]">{dimensionHints[key as EvidenceDimensionKey]}</p>
          </div>
        );
      })}
    </div>
  );
}

function CoreJudgments({ projects }: { projects: Project[] }) {
  const judgments = projects
    .map((project) => ({ title: project.title, judgment: project.roleContribution?.judgment?.trim() }))
    .filter((item): item is { title: string; judgment: string } => Boolean(item.judgment))
    .slice(0, 3);

  return (
    <div className="mt-6 border-t border-[#14110e]/15 pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#14110e]">三个核心判断</h3>
        <span className="text-xs text-[#80654d]">来自项目中的个人判断字段</span>
      </div>
      {judgments.length ? (
        <ol className="mt-3 grid gap-3 lg:grid-cols-3">
          {judgments.map((item, index) => (
            <li key={item.title} className="flex gap-3 rounded-lg bg-[#14110e] p-4 text-[#fffdf8]">
              <span className="font-mono text-xs font-semibold text-[#ef8a6f]">0{index + 1}</span>
              <div>
                <p className="text-xs text-[#d8cbbf]">{item.title}</p>
                <p className="mt-2 text-sm leading-6">{item.judgment}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 rounded-lg border border-dashed border-[#c92a20]/40 bg-white p-4 text-sm text-[#7a3028]">
          待补证据：项目尚未填写可公开的关键判断。
        </p>
      )}
    </div>
  );
}

export function EvidenceSnapshot({ projects }: { projects: Project[] }) {
  const selectedProjects = projects.slice(0, 3);
  const report = auditPortfolioDraft({ projects: selectedProjects }) as EvidenceAuditReport;

  return (
    <section aria-labelledby="evidence-snapshot-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="rounded-xl border border-[#14110e]/15 bg-[#fffaf0] p-5 shadow-[0_12px_32px_rgba(20,17,14,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold text-[#c92a20]">EVIDENCE SNAPSHOT · 30 秒快览</p>
            <h2 id="evidence-snapshot-title" className="mt-2 text-2xl font-semibold text-[#14110e] sm:text-3xl">三项目的结构证据覆盖</h2>
            <p className="mt-3 text-sm leading-6 text-[#5b4635]">这是结构完整度自检，不是第三方事实核验。百分比只表示项目文本是否覆盖五类证据，不代表事实真伪或候选人能力评分。</p>
          </div>
          <a href="https://github.com/haimuhaimu/strategy-product-portfolio-template" target="_blank" rel="noreferrer" className="text-xs text-[#80654d] underline decoration-[#80654d]/40 underline-offset-4 hover:text-[#c92a20]">查看模板来源 ↗</a>
        </div>
        <div className="mt-6">
          <DimensionCoverage report={report} projectCount={selectedProjects.length || 1} />
        </div>
        <CoreJudgments projects={selectedProjects} />
        {report.questions.length ? <p className="mt-4 text-xs leading-5 text-[#80654d]">仍需补强：{report.questions.join("；")}</p> : null}
      </div>
    </section>
  );
}
