"use client";

import { useMemo, useState } from "react";
import { createSafeDiagnosticSummary, DIMENSIONS } from "@/lib/evidence-audit.mjs";
import type { EvidenceAuditReport } from "@/lib/evidence-audit-types";

const dimensionAngles = [-90, -18, 54, 126, 198];

function point(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return `${50 + Math.cos(radians) * radius},${50 + Math.sin(radians) * radius}`;
}

function Radar({ dimensions }: { dimensions: EvidenceAuditReport["dimensionScores"] }) {
  const values = DIMENSIONS.map(([key]) => dimensions[key].value);
  const dataPoints = dimensionAngles.map((angle, index) => point(angle, 36 * values[index])).join(" ");
  const gridPoints = dimensionAngles.map((angle) => point(angle, 36)).join(" ");

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="五维证据覆盖雷达图" className="size-36 shrink-0 overflow-visible">
      <polygon points={gridPoints} fill="none" stroke="#14110e" strokeOpacity="0.18" />
      <polygon points={dimensionAngles.map((angle) => point(angle, 18)).join(" ")} fill="none" stroke="#14110e" strokeOpacity="0.1" />
      {dimensionAngles.map((angle) => <line key={angle} x1="50" y1="50" x2={point(angle, 36).split(",")[0]} y2={point(angle, 36).split(",")[1]} stroke="#14110e" strokeOpacity="0.12" />)}
      <polygon points={dataPoints} fill="#c92a20" fillOpacity="0.2" stroke="#c92a20" strokeWidth="1.8" />
      {dimensionAngles.map((angle, index) => <circle key={angle} cx={point(angle, 36 * values[index]).split(",")[0]} cy={point(angle, 36 * values[index]).split(",")[1]} r="2" fill="#c92a20" />)}
    </svg>
  );
}

export function EvidenceAuditPanel({ report }: { report: EvidenceAuditReport }) {
  const [copyState, setCopyState] = useState("idle");
  const safeSummary = useMemo(() => createSafeDiagnosticSummary(report), [report]);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(safeSummary);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 2400);
  }

  return (
    <section aria-labelledby="audit-title" className="rounded-xl border border-[#14110e]/15 bg-[#fffaf0] p-5 shadow-[0_12px_32px_rgba(20,17,14,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold text-[#c92a20]">LOCAL EVIDENCE AUDIT</p>
          <h2 id="audit-title" className="mt-2 text-xl font-semibold text-[#14110e]">证据审计官</h2>
          <p className="mt-1 text-sm leading-6 text-[#6e5743]">填写即审计，仅在浏览器内存运行，不上传内容。</p>
        </div>
        <button type="button" onClick={copySummary} className="rounded-lg border border-[#14110e]/20 bg-white px-3 py-2 text-sm font-semibold text-[#14110e] transition hover:border-[#c92a20] hover:text-[#c92a20]">
          {copyState === "success" ? "已复制" : copyState === "error" ? "复制失败，请重试" : "复制诊断摘要"}
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div className="relative grid place-items-center">
          <Radar dimensions={report.dimensionScores} />
          <div className="pointer-events-none absolute text-center">
            <strong className="block text-2xl text-[#14110e]">{report.totalScore}</strong>
            <span className="text-[10px] text-[#80654d]">/ 5</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold text-[#14110e]">{report.level}</p>
            <p className="text-xs text-[#80654d]">三项目平均分</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {DIMENSIONS.map(([key, label]) => (
              <div key={key} className="text-xs text-[#5b4635]">
                <div className="flex justify-between gap-2"><span>{label}</span><span>{Math.round(report.dimensionScores[key].value * 100)}%</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#14110e]/10"><div className="h-full rounded-full bg-[#c92a20]" style={{ width: `${report.dimensionScores[key].value * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {report.privacyRisks.length > 0 ? (
        <div role="alert" className="mt-5 rounded-lg border-2 border-[#c92a20] bg-[#fff0ec] p-4">
          <p className="font-semibold text-[#9d2119]">隐私红线 · 导出前必须处理</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-[#6f271f]">
            {report.privacyRisks.map((risk) => <li key={risk.category}>• {risk.message}</li>)}
          </ul>
          <p className="mt-2 text-xs text-[#80654d]">不会展示或复制命中的原始敏感内容。</p>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-[#26734d]/25 bg-[#eff9f2] p-3 text-sm text-[#245c40]">未命中常见敏感模式；发布前仍需人工确认披露权限。</div>
      )}

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-[#14110e]">现在只补最值钱的证据</h3>
        <ol className="mt-2 space-y-2">
          {report.questions.map((question, index) => (
            <li key={question} className="flex gap-3 rounded-lg bg-white p-3 text-sm leading-6 text-[#4b3829]"><span className="font-mono font-semibold text-[#c92a20]">0{index + 1}</span><span>{question}</span></li>
          ))}
        </ol>
      </div>

      {report.fluffFindings.length > 0 ? <p className="mt-4 text-xs leading-5 text-[#80654d]">去水分提示：检测到 {report.fluffFindings.length} 类空泛表达，请补具体对象、动作或证据。</p> : null}
      <p aria-live="polite" className="sr-only">{copyState === "success" ? "诊断摘要复制成功" : copyState === "error" ? "诊断摘要复制失败" : ""}</p>
    </section>
  );
}
