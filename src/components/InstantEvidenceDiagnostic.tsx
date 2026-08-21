"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { DiagnosticResultView } from "@/components/diagnostic/DiagnosticResultView";
import {
  getCurrentDiagnosticExperienceUrl,
  useDiagnosticShare,
} from "@/components/diagnostic/useDiagnosticShare";
import { auditPortfolioDraft } from "@/lib/evidence-audit.mjs";
import {
  createEvidenceShareCardSvg,
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
} from "@/lib/evidence-share-card.mjs";
import { createSafeDiagnosticShareModel } from "@/lib/diagnostic-share.mjs";
import { diagnoseExperienceText, MIN_EXPERIENCE_LENGTH } from "@/lib/instant-diagnostic.mjs";

type EvidenceReport = ReturnType<typeof auditPortfolioDraft>;

const SAMPLE_EXPERIENCE = "我负责新作者成长策略，先按活跃阶段拆分样本并分析转化漏斗，再与产品、算法团队共同上线分层触达规则。上线后观察 30 天，新作者关键行为完成率从基线 18% 提升到 24%。我负责问题定义、规则设计和复盘看板，研发与上线结果属于团队；长期留存仍待验证。";

export function InstantEvidenceDiagnostic() {
  const [experience, setExperience] = useState("");
  const [report, setReport] = useState<EvidenceReport | null>(null);
  const [safeSummary, setSafeSummary] = useState("");
  const [message, setMessage] = useState("等待粘贴项目经历");
  const [copyStatus, setCopyStatus] = useState("复制诊断摘要");
  const [downloadStatus, setDownloadStatus] = useState("可下载不含原文的 PNG 分享卡");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    sharedResult,
    shareLinkStatus,
    copyShareLink,
    clearSharedResult,
    resetShareLinkStatus,
  } = useDiagnosticShare();

  const resetLocalResult = useCallback((nextMessage: string) => {
    setReport(null);
    setSafeSummary("");
    setMessage(nextMessage);
    setCopyStatus("复制诊断摘要");
    setDownloadStatus("可下载不含原文的 PNG 分享卡");
    resetShareLinkStatus();
  }, [resetShareLinkStatus]);

  useEffect(() => {
    function loadSharedExample(event: Event) {
      const text = (event as CustomEvent<{ text?: unknown }>).detail?.text;
      if (typeof text !== "string") return;
      setExperience(text);
      resetLocalResult("已载入脱敏示例，点击按钮查看诊断结果。");
    }

    window.addEventListener("portfolio:load-diagnostic-example", loadSharedExample);
    return () => window.removeEventListener("portfolio:load-diagnostic-example", loadSharedExample);
  }, [resetLocalResult]);

  function runDiagnostic() {
    const diagnosis = diagnoseExperienceText(experience);
    if (!("report" in diagnosis) || !diagnosis.report || !diagnosis.safeSummary) {
      resetLocalResult("message" in diagnosis && diagnosis.message ? diagnosis.message : "暂时无法诊断，请补充内容后重试。");
      return;
    }

    clearSharedResult();
    setReport(diagnosis.report);
    setSafeSummary(diagnosis.safeSummary);
    setMessage("已在当前浏览器完成诊断，原文不会上传。");
    setCopyStatus("复制诊断摘要");
    setDownloadStatus("可下载不含原文的 PNG 分享卡");
    resetShareLinkStatus();
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
    const svg = createEvidenceShareCardSvg(report, getCurrentDiagnosticExperienceUrl());
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
    resetLocalResult("已载入脱敏示例，点击按钮查看诊断结果。");
  }

  function tryMyself() {
    clearSharedResult();
    setExperience("");
    resetLocalResult("分享结果已清除，请粘贴你的项目经历。");
    window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      textareaRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      textareaRef.current?.focus({ preventScroll: true });
    });
  }

  const localModel = report ? createSafeDiagnosticShareModel(report) : null;

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
              ref={textareaRef}
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

        {sharedResult ? <DiagnosticResultView model={sharedResult} shared onTryMyself={tryMyself} /> : null}
        {localModel ? (
          <DiagnosticResultView
            model={localModel}
            actions={(
              <>
                <button type="button" onClick={() => void copyShareLink(report)} className="feedback-button bg-[#f3a08a] px-4 py-3 text-sm font-semibold text-[#14110e] transition hover:bg-white" aria-describedby="share-link-feedback">一键复制可转发链接（不含原文）</button>
                <button type="button" onClick={() => void downloadShareCard()} className="feedback-button border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#f3a08a] hover:text-[#f3a08a]" aria-describedby="share-link-feedback">下载安全分享卡</button>
                <button type="button" onClick={() => void copySummary()} className="feedback-button border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#f3a08a] hover:text-[#f3a08a]">{copyStatus}</button>
              </>
            )}
            feedback={<p id="share-link-feedback" role="status" aria-live="polite" className="mt-3 text-xs leading-5 text-[#d8c7b6]">{shareLinkStatus} · {downloadStatus}</p>}
          />
        ) : null}
      </div>
    </section>
  );
}
