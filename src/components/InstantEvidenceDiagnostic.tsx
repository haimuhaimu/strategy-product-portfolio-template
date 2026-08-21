"use client";

import React, { useEffect, useState } from "react";
import { StaticPageLink } from "@/components/StaticPageLink";
import { auditPortfolioDraft } from "@/lib/evidence-audit.mjs";
import {
  createEvidenceShareCardSvg,
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
} from "@/lib/evidence-share-card.mjs";
import { diagnoseExperienceText, MIN_EXPERIENCE_LENGTH } from "@/lib/instant-diagnostic.mjs";

type EvidenceReport = ReturnType<typeof auditPortfolioDraft>;

const SAMPLE_EXPERIENCE = "我负责新作者成长策略，先按活跃阶段拆分样本并分析转化漏斗，再与产品、算法团队共同上线分层触达规则。上线后观察 30 天，新作者关键行为完成率从基线 18% 提升到 24%。我负责问题定义、规则设计和复盘看板，研发与上线结果属于团队；长期留存仍待验证。";

const dimensionHints: Record<string, string> = {
  resultEvidence: "有没有可核对的结果、采用或交付事实",
  scopeAndAttribution: "有没有对象、范围、周期、基线或对照",
  methodEvidence: "有没有样本、实验、访谈、漏斗或评估方法",
  artifactEvidence: "有没有规则、原型、SOP、看板等沉淀",
  contributionBoundary: "有没有说清个人动作、团队结果与未验证项",
};

export function InstantEvidenceDiagnostic() {
  const [experience, setExperience] = useState("");
  const [report, setReport] = useState<EvidenceReport | null>(null);
  const [safeSummary, setSafeSummary] = useState("");
  const [message, setMessage] = useState("等待粘贴项目经历");
  const [copyStatus, setCopyStatus] = useState("复制诊断摘要");
  const [downloadStatus, setDownloadStatus] = useState("可下载不含原文的 PNG 分享卡");

  useEffect(() => {
    function loadSharedExample(event: Event) {
      const text = (event as CustomEvent<{ text?: unknown }>).detail?.text;
      if (typeof text !== "string") return;
      setExperience(text);
      setReport(null);
      setSafeSummary("");
      setMessage("已载入脱敏示例，点击按钮查看诊断结果。");
      setDownloadStatus("可下载不含原文的 PNG 分享卡");
    }

    window.addEventListener("portfolio:load-diagnostic-example", loadSharedExample);
    return () => window.removeEventListener("portfolio:load-diagnostic-example", loadSharedExample);
  }, []);

  function runDiagnostic() {
    const diagnosis = diagnoseExperienceText(experience);
    if (!("report" in diagnosis) || !diagnosis.report || !diagnosis.safeSummary) {
      setReport(null);
      setSafeSummary("");
      setMessage("message" in diagnosis && diagnosis.message ? diagnosis.message : "暂时无法诊断，请补充内容后重试。");
      return;
    }

    setReport(diagnosis.report);
    setSafeSummary(diagnosis.safeSummary);
    setMessage("已在当前浏览器完成诊断，原文不会上传。");
    setCopyStatus("复制诊断摘要");
    setDownloadStatus("可下载不含原文的 PNG 分享卡");
  }

  async function copySummary() {
    if (!safeSummary) return;
    try {
      await navigator.clipboard.writeText(safeSummary);
      setCopyStatus("已复制，不含原文");
    } catch {
      setCopyStatus("复制失败，请手动记录结果");
    }
  }

  async function downloadShareCard() {
    if (!report) return;
    setDownloadStatus("正在本地生成 PNG…");

    const svg = createEvidenceShareCardSvg(report);
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    try {
      const image = new Image();
      image.decoding = "async";
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("SVG image failed to load"));
        image.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = SHARE_CARD_WIDTH;
      canvas.height = SHARE_CARD_HEIGHT;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, 0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG conversion failed")), "image/png");
      });
      const downloadUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "portfolio-evidence-check.png";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      setDownloadStatus("分享卡已下载，不含原文");
    } catch {
      setDownloadStatus("生成失败，请换用支持 Canvas 的现代浏览器");
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  function loadExample() {
    setExperience(SAMPLE_EXPERIENCE);
    setReport(null);
    setSafeSummary("");
    setMessage("已载入脱敏示例，点击按钮查看诊断结果。");
    setDownloadStatus("可下载不含原文的 PNG 分享卡");
  }

  return (
    <section id="instant-diagnostic" className="border-y border-[#14110e]/15 bg-[#14110e] px-4 py-12 text-[#fffaf0] sm:px-8 sm:py-16" aria-labelledby="instant-diagnostic-title">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#f3a08a]">TRY IT BEFORE YOU STAR IT</p>
            <h2 id="instant-diagnostic-title" className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-5xl">粘贴一段经历，先看看证据够不够。</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#d8c7b6] sm:text-base">不用准备简历，不用先理解模板。工具会检查结果、口径、方法、资产与贡献边界，并只给你最优先的问题。</p>
            <div className="mt-6 grid gap-2 text-sm text-[#d8c7b6]">
              <p><strong className="text-white">本地运行：</strong>内容只进入当前页面内存，刷新即清空。</p>
              <p><strong className="text-white">诚实边界：</strong>这是结构诊断，不是事实核验，也不会替你编造结果。</p>
            </div>
          </div>

          <div className="border border-white/20 bg-[#fffaf0] p-5 text-[#14110e] shadow-[9px_9px_0_rgba(216,75,40,0.42)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="experience-diagnostic-input" className="font-semibold">我的项目经历</label>
              <button type="button" onClick={loadExample} className="text-sm font-semibold text-[#80654d] underline decoration-[#80654d]/40 underline-offset-4 hover:text-[#c92a20]">先看脱敏示例</button>
            </div>
            <textarea
              id="experience-diagnostic-input"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              rows={7}
              placeholder="例如：我负责什么问题，做了哪些判断和动作，结果如何，观察了多久，哪些由我完成……"
              className="mt-3 w-full resize-y border border-[#14110e]/25 bg-white p-4 text-sm leading-7 outline-none transition placeholder:text-[#8a8177] focus:border-[#c92a20] focus:ring-2 focus:ring-[#c92a20]/20"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#80654d]">
              <span>{experience.trim().length} 字 · 至少 {MIN_EXPERIENCE_LENGTH} 字</span>
              <span>不会上传或保存原文</span>
            </div>
            <button type="button" onClick={runDiagnostic} className="mt-4 w-full bg-[#c92a20] px-5 py-3.5 font-semibold text-white transition hover:bg-[#a92119] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1437d6]">立即诊断证据</button>
            <p role="status" aria-live="polite" className="mt-3 text-sm text-[#80654d]">{message}</p>
          </div>
        </div>

        {report ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]" aria-live="polite">
            <div className="border border-white/20 bg-white/5 p-5 sm:p-6">
              <p className="font-mono text-xs font-bold tracking-[0.14em] text-[#f3a08a]">EVIDENCE SCORE</p>
              <div className="mt-4 flex items-end gap-3">
                <strong className="font-mono text-6xl text-white">{report.totalScore}</strong>
                <span className="pb-2 text-[#d8c7b6]">/ 5 · {report.level}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#d8c7b6]">分数只表示这段文字是否覆盖关键证据，不代表项目质量或结果真实性。</p>
              <div className="mt-5 grid gap-3">
                <button type="button" onClick={() => void downloadShareCard()} className="feedback-button bg-[#f3a08a] px-4 py-3 text-sm font-semibold text-[#14110e] transition hover:bg-white" aria-describedby="share-card-feedback">下载安全分享卡</button>
                <button type="button" onClick={() => void copySummary()} className="feedback-button border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#f3a08a] hover:text-[#f3a08a]">{copyStatus}</button>
              </div>
              <p id="share-card-feedback" role="status" aria-live="polite" className="mt-3 text-xs leading-5 text-[#d8c7b6]">{downloadStatus}</p>
            </div>

            <div className="border border-white/20 bg-[#fffaf0] p-5 text-[#14110e] sm:p-6">
              <div className="grid gap-3 sm:grid-cols-5">
                {Object.entries(report.dimensionScores).map(([key, dimension]) => {
                  const passed = dimension.value > 0;
                  return (
                    <div key={key} className={`border p-3 ${passed ? "border-[#26734d]/35 bg-[#eff9f2]" : "border-[#c92a20]/25 bg-[#fff0ec]"}`}>
                      <span className={`font-mono text-[10px] font-bold ${passed ? "text-[#26734d]" : "text-[#c92a20]"}`}>{passed ? "已识别" : "待补充"}</span>
                      <h3 className="mt-2 text-sm font-semibold">{dimension.label}</h3>
                      <p className="mt-2 text-xs leading-5 text-[#6e5743]">{dimensionHints[key]}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-l-4 border-[#c92a20] bg-[#f4dfbd] p-4">
                <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#8b3a28]">唯一下一步</p>
                <p className="mt-2 font-semibold leading-7">{report.questions[0] ?? "五维证据已覆盖，下一步确认公开边界并放入完整作品集。"}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className={report.privacyRisks.length ? "font-semibold text-[#9d2119]" : "text-[#26734d]"}>
                  {report.privacyRisks.length ? `发现 ${report.privacyRisks.length} 类常见隐私风险，请先脱敏。` : "未命中常见敏感模式，发布前仍需人工确认。"}
                </p>
                <div className="flex flex-wrap gap-4">
                  <StaticPageLink href="/start/" className="font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">让 Agent 完整整理 →</StaticPageLink>
                  <StaticPageLink href="/launchpad/" className="font-semibold text-[#80654d] underline decoration-[#80654d]/30 underline-offset-4">检查 projects.json →</StaticPageLink>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
