"use client";

import { useMemo, useRef, useState } from "react";
import examplePortfolio from "../../../data/projects.json";
import {
  assessPortfolioData,
  createReleasePack,
  parsePortfolioJson,
  RELEASE_FILE_NAMES,
} from "@/lib/launchpad.mjs";
import { StaticPageLink } from "@/components/StaticPageLink";
import { isTemplateId } from "@/lib/templates.mjs";
import type { TemplateId } from "@/types/project";

type Assessment = ReturnType<typeof assessPortfolioData>;
type ImportState = {
  sourceName: string;
  assessment: Assessment;
};

const statusCopy = {
  block: { label: "需要处理", title: "修复问题后再下载", tone: "border-[#c92a20] bg-[#fff0ec] text-[#8e211b]" },
  warn: { label: "可以继续", title: "可以下载，建议先补强", tone: "border-[#9a6818] bg-[#fff8df] text-[#6f4a0c]" },
  pass: { label: "检查通过", title: "可以下载发布文件", tone: "border-[#26734d] bg-[#eff9f2] text-[#245c40]" },
} as const;

const checkStateLabels = {
  block: "需要处理",
  warn: "可以继续",
  pass: "检查通过",
} as const;

function downloadText(filename: string, content: string) {
  const type = filename.endsWith(".json") ? "application/json" : "text/markdown";
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function CheckRow({ label, state, detail }: { label: string; state: "block" | "warn" | "pass"; detail: string }) {
  const styles = {
    block: "bg-[#fff0ec] text-[#9d2119]",
    warn: "bg-[#fff8df] text-[#7a5310]",
    pass: "bg-[#eff9f2] text-[#245c40]",
  };
  return (
    <li className="grid gap-2 border-t border-[#14110e]/10 py-4 sm:grid-cols-[8rem_1fr] sm:items-start">
      <span className={`w-fit rounded px-2 py-1 text-[11px] font-bold ${styles[state]}`}>{checkStateLabels[state]}</span>
      <div><p className="font-semibold text-[#14110e]">{label}</p><p className="mt-1 text-sm leading-6 text-[#6e5743]">{detail}</p></div>
    </li>
  );
}

export function LaunchpadWorkbench() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<ImportState | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("atlas");
  const [message, setMessage] = useState("等待导入 projects.json");
  const [downloadStatus, setDownloadStatus] = useState("尚未开始下载");
  const fileInput = useRef<HTMLInputElement>(null);
  const releasePack = useMemo(() => {
    if (!result?.assessment.canGenerateRelease) return null;
    return createReleasePack(result.assessment, { selectedTemplate });
  }, [result, selectedTemplate]);

  function inspectJson(source: string, sourceName: string) {
    const parsed = parsePortfolioJson(source);
    if (!parsed.ok) {
      setResult(null);
      setMessage(parsed.message ?? "JSON 无法解析，请检查后重试。");
      return;
    }
    const assessment = assessPortfolioData(parsed.data);
    const importedTemplate = parsed.data.template?.active;
    setSelectedTemplate(isTemplateId(importedTemplate) ? importedTemplate as TemplateId : assessment.templateMatches[0].id as TemplateId);
    setResult({ sourceName, assessment });
    setMessage(`已在本地完成检查 · ${sourceName}`);
  }

  async function importFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setResult(null);
      setMessage("请选择 .json 文件；文件不会上传。");
      return;
    }
    try {
      const content = await file.text();
      setRaw(content);
      inspectJson(content, file.name);
    } catch {
      setResult(null);
      setMessage("浏览器无法读取该文件，请改用粘贴导入。");
    }
  }

  function loadExample() {
    const content = JSON.stringify(examplePortfolio, null, 2);
    setRaw(content);
    inspectJson(content, "仓库脱敏示例");
  }

  const checks = result ? [
    {
      label: "文件结构",
      state: result.assessment.schema.valid ? "pass" : "block",
      detail: result.assessment.schema.valid ? "版本、基本资料、项目清单与项目标识均可正常读取。" : result.assessment.schema.errors.map((item) => `${item.path}：${item.message}`).join("；"),
    },
    {
      label: "三项目精选",
      state: result.assessment.featured.pass ? "pass" : "warn",
      detail: result.assessment.featured.message,
    },
    {
      label: "占位内容",
      state: result.assessment.template.detected ? "warn" : "pass",
      detail: result.assessment.template.detected ? `检测到 ${result.assessment.template.markerCount} 类占位标记，请替换后再发布。` : "未检测到常见模板占位标记。",
    },
    {
      label: "证据完整度",
      state: result.assessment.audit.level === "弱证据" ? "warn" : "pass",
      detail: `平均 ${result.assessment.audit.totalScore}/5（${result.assessment.audit.level}）。${result.assessment.audit.questions[0] || "五维证据覆盖稳定。"}`,
    },
    {
      label: "隐私检查",
      state: result.assessment.audit.privacyRisks.length ? "block" : "pass",
      detail: result.assessment.audit.privacyRisks.length
        ? result.assessment.audit.privacyRisks.map((risk) => risk.message).join("；")
        : "未命中常见邮箱、电话、内部链接、Token 或用户 ID 模式；仍需人工确认披露权限。",
    },
    {
      label: "内容关联",
      state: result.assessment.references.valid ? "pass" : "block",
      detail: result.assessment.references.valid
        ? "精选项目、成长路线与能力图谱中的内容均能找到对应项目。"
        : `发现 ${result.assessment.references.findings.length} 处内容无法关联：${result.assessment.references.findings.map((item) => item.path).join("、")}`,
    },
  ] as const : [];
  const currentStatus = result ? statusCopy[result.assessment.status as keyof typeof statusCopy] : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">LOCAL PORTFOLIO CHECK</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-[#14110e] sm:text-6xl">作品集检查与下载</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5b4635]">上传或粘贴文件后，浏览器会在本地检查文件结构、内容关联、隐私和证据完整度。无需账号，内容不会上传。</p>
        </div>
        <aside className="border-l-2 border-[#c92a20] bg-[#fffaf0] p-5 text-sm leading-6 text-[#5b4635]">
          <strong className="block text-[#14110e]">隐私承诺</strong>
          文件只进入当前页面内存；刷新即清空。下载的分享文案只含计数、状态和建议，不复制项目原文或命中的敏感值。
        </aside>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-labelledby="import-title">
        <div className="border border-[#14110e]/20 bg-[#f8f8f3] p-5 shadow-[7px_7px_0_rgba(20,17,14,0.08)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div><p className="font-mono text-xs font-bold text-[#80654d]">01 / IMPORT</p><h2 id="import-title" className="mt-2 text-2xl font-semibold">导入本地数据</h2></div>
            <button type="button" onClick={loadExample} className="text-sm font-semibold text-[#80654d] underline decoration-[#80654d]/40 underline-offset-4 hover:text-[#c92a20]">载入脱敏示例</button>
          </div>
          <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importFile(event.target.files?.[0])} />
          <button type="button" onClick={() => fileInput.current?.click()} className="mt-6 w-full border border-dashed border-[#14110e]/35 bg-white px-5 py-7 text-left transition hover:border-[#c92a20] hover:bg-[#fffaf0]">
            <span className="block font-semibold text-[#14110e]">选择 projects.json</span>
            <span className="mt-1 block text-sm text-[#80654d]">只读取，不上传 · 也可在下方直接粘贴</span>
          </button>
          <label className="mt-5 block text-sm font-semibold text-[#14110e]">粘贴 JSON
            <textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows={12} spellCheck={false} placeholder={'{\n  "schemaVersion": 2,\n  "rolePreset": "product",\n  ...\n}'} className="mt-2 w-full resize-y border border-[#14110e]/20 bg-white p-4 font-mono text-xs font-normal leading-6 outline-none focus:border-[#c92a20]" />
          </label>
          <button type="button" onClick={() => inspectJson(raw, "粘贴内容")} className="mt-4 w-full bg-[#14110e] px-5 py-3.5 font-semibold text-white transition hover:bg-[#c92a20]">运行本地发布检查</button>
          <p role="status" aria-live="polite" className="mt-3 text-sm text-[#80654d]">{message}</p>
        </div>

        <div className="border border-[#14110e]/20 bg-white p-5 sm:p-7">
          <p className="font-mono text-xs font-bold text-[#80654d]">02 / CHECK RESULTS</p>
          {!result || !currentStatus ? (
            <div className="mt-16 text-center"><p className="text-5xl text-[#14110e]/15">◇</p><h2 className="mt-5 text-2xl font-semibold">等待检查</h2><p className="mt-2 text-sm leading-6 text-[#80654d]">先导入 projects.json，页面会告诉你“需要处理”“可以继续”或“检查通过”。</p></div>
          ) : (
            <>
              <div className={`mt-5 border-l-4 p-5 ${currentStatus.tone}`}>
                <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-bold tracking-widest">{currentStatus.label}</span><span className="text-xs">{result.sourceName}</span></div>
                <h2 className="mt-2 text-2xl font-semibold">{currentStatus.title}</h2>
              </div>
              <ul className="mt-4">{checks.map((check) => <CheckRow key={check.label} {...check} />)}</ul>
              <div className="mt-4 border-2 border-[#14110e] bg-[#f4dfbd] p-5 shadow-[5px_5px_0_#14110e]">
                <p className="font-mono text-xs font-bold">唯一下一步</p>
                <p className="mt-2 font-semibold leading-7">{result.assessment.nextStep}</p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mt-8 border border-[#14110e]/20 bg-[#f8f8f3] p-5 sm:p-8" aria-labelledby="template-match-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-mono text-xs font-bold text-[#80654d]">03 / DISPLAY MATCH</p><h2 id="template-match-title" className="mt-2 text-3xl font-semibold">按真实内容推荐展示结构。</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-[#6e5743]">推荐只依据你文件中的角色、内容词汇、证据完整度和项目关系。手动选择只改变最终展示方式，不能绕过隐私或内容关联问题。</p></div>
          <StaticPageLink href="/templates/" className="text-sm font-semibold text-[#80654d] underline underline-offset-4">查看四种结构说明 →</StaticPageLink>
        </div>
        {!result ? <p className="mt-6 border border-dashed border-[#14110e]/20 bg-white p-5 text-sm text-[#80654d]">导入并成功读取文件后，这里会出现四种展示结构的排序和推荐理由。</p> : (
          <ol className="mt-6 grid gap-4 lg:grid-cols-2">
            {result.assessment.templateMatches.map((match, index) => (
              <li key={match.id}>
                <button type="button" onClick={() => setSelectedTemplate(match.id as TemplateId)} className={`h-full w-full border p-5 text-left transition ${selectedTemplate === match.id ? "border-[#c92a20] bg-[#fffaf0] shadow-[5px_5px_0_rgba(201,42,32,0.15)]" : "border-[#14110e]/15 bg-white hover:border-[#80654d]"}`} aria-pressed={selectedTemplate === match.id}>
                  <div className="flex items-start justify-between gap-4"><div><span className="font-mono text-[10px] font-bold text-[#80654d]">#{index + 1} · {match.id}</span><h3 className="mt-1 text-xl font-semibold">{match.name}</h3></div><strong className="font-mono text-3xl text-[#c92a20]">{match.score}</strong></div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#4b3829]">{match.focus}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="font-mono text-[10px] font-bold text-[#26734d]">加分理由</p><ul className="mt-2 space-y-1 text-xs leading-5 text-[#5b4635]">{match.reasons.map((reason) => <li key={reason}>+ {reason}</li>)}</ul></div><div><p className="font-mono text-[10px] font-bold text-[#9a6818]">当前缺口</p><ul className="mt-2 space-y-1 text-xs leading-5 text-[#5b4635]">{match.gaps.length ? match.gaps.map((gap) => <li key={gap}>− {gap}</li>) : <li>未识别到关键结构缺口</li>}</ul></div></div>
                  <span className="mt-4 block text-xs font-bold text-[#c92a20]">{selectedTemplate === match.id ? "已选择，下载时会使用这个展示结构" : "选择此展示结构"}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-8 border border-[#14110e]/20 bg-[#14110e] p-5 text-[#f8f8f3] sm:p-8" aria-labelledby="release-title">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="font-mono text-xs font-bold tracking-[0.16em] text-[#d3b992]">04 / DOWNLOAD</p><h2 id="release-title" className="mt-2 text-3xl font-semibold">五个发布文件，分别下载。</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#d3b992]">发现隐私或内容关联问题时会关闭全部下载。项目数量、占位内容或弱证据会保留提醒，避免把“能下载”误当成“可以投递”。</p></div>
          <StaticPageLink href="/start/" className="text-sm font-semibold text-[#f4dfbd] underline underline-offset-4">还没有 projects.json？返回起步页</StaticPageLink>
        </div>
        <p id="download-feedback" role="status" aria-live="polite" className="mt-4 text-sm text-[#d3b992]">{downloadStatus}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {RELEASE_FILE_NAMES.map((filename, index) => {
            const releaseFilename = filename as keyof NonNullable<typeof releasePack>;
            return (
            <button key={filename} type="button" disabled={!releasePack} onClick={() => {
              if (!releasePack) return;
              try {
                downloadText(filename, releasePack[releaseFilename]);
                setDownloadStatus(`已开始下载 ${filename}`);
              } catch {
                setDownloadStatus(`${filename} 下载失败，请重试`);
              }
            }} className="feedback-button min-h-28 border border-[#f8f8f3]/25 bg-[#f8f8f3]/5 p-4 text-left transition enabled:hover:border-[#f4dfbd] enabled:hover:bg-[#f8f8f3]/10 disabled:cursor-not-allowed disabled:opacity-35" aria-describedby="download-feedback">
              <span className="font-mono text-[10px] text-[#d3b992]">0{index + 1}</span><span className="mt-5 block break-all text-sm font-semibold">{filename}</span>
            </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
