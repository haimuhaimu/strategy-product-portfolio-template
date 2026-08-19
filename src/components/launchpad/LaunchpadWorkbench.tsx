"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import examplePortfolio from "../../../data/projects.json";
import { StaticPageLink } from "@/components/StaticPageLink";
import {
  assessPortfolioData,
  createReleasePack,
  parsePortfolioJson,
  RELEASE_FILE_NAMES,
} from "@/lib/launchpad.mjs";
import {
  exportPmfPilotLog,
  getPmfImportResult,
  getPmfPilotServerStatusSnapshot,
  getPmfPilotStatusSnapshot,
  PMF_PILOT_INTERVIEW_FEEDBACK,
  PMF_PILOT_PLATFORMS,
  recordPmfPilotEvent,
  subscribePmfPilotStatus,
} from "@/lib/pmf-pilot.mjs";
import { isTemplateId } from "@/lib/templates.mjs";
import type { TemplateId } from "@/types/project";

type Assessment = ReturnType<typeof assessPortfolioData>;
type ImportState = { sourceName: string; assessment: Assessment };
type Platform = (typeof PMF_PILOT_PLATFORMS)[number];
type InterviewFeedback = (typeof PMF_PILOT_INTERVIEW_FEEDBACK)[number];

const statusCopy = {
  block: { label: "BLOCK", title: "暂不能发布", tone: "border-[#c92a20] bg-[#fff0ec] text-[#8e211b]" },
  warn: { label: "WARN", title: "可以导出，但建议先补强", tone: "border-[#9a6818] bg-[#fff8df] text-[#6f4a0c]" },
  pass: { label: "PASS", title: "发布护栏已通过", tone: "border-[#26734d] bg-[#eff9f2] text-[#245c40]" },
} as const;

const platformLabels: Record<Platform, string> = {
  github_pages: "GitHub Pages",
  vercel: "Vercel",
  netlify: "Netlify",
  cloudflare_pages: "Cloudflare Pages",
  other_static: "其他静态平台",
};

const interviewLabels: Record<InterviewFeedback, string> = {
  not_received: "尚未获得面试",
  scheduled: "已获得 / 已安排面试",
  positive: "面试反馈积极",
  mixed: "面试反馈混合",
  negative: "面试反馈负向",
  offer: "已获得 Offer",
  withdrawn: "我已撤回流程",
};

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
      <span className={`w-fit rounded px-2 py-1 font-mono text-[11px] font-bold ${styles[state]}`}>{state.toUpperCase()}</span>
      <div><p className="font-semibold text-[#14110e]">{label}</p><p className="mt-1 text-sm leading-6 text-[#6e5743]">{detail}</p></div>
    </li>
  );
}

export function LaunchpadWorkbench() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<ImportState | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("atlas");
  const [message, setMessage] = useState("等待导入 projects.json");
  const pilotEnabled = (JSON.parse(useSyncExternalStore(
    subscribePmfPilotStatus,
    getPmfPilotStatusSnapshot,
    getPmfPilotServerStatusSnapshot,
  )) as { enabled: boolean }).enabled;
  const [published, setPublished] = useState(false);
  const [platform, setPlatform] = useState<Platform | "">("");
  const [applied, setApplied] = useState<"" | "yes" | "no">("");
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedback | "">("");
  const [signalMessage, setSignalMessage] = useState("投递与面试是后续强信号，不是本轮成功硬门槛。");
  const fileInput = useRef<HTMLInputElement>(null);

  function inspectJson(source: string, sourceName: string, importKind: "real" | "example") {
    const parsed = parsePortfolioJson(source);
    if (!parsed.ok) {
      setResult(null);
      setMessage(parsed.message ?? "JSON 无法解析，请检查后重试。");
      if (importKind === "real") recordPmfPilotEvent("import_result", { value: getPmfImportResult(importKind, false) });
      return;
    }
    const assessment = assessPortfolioData(parsed.data);
    const importedTemplate = parsed.data.template?.active;
    setSelectedTemplate(isTemplateId(importedTemplate) ? importedTemplate as TemplateId : assessment.templateMatches[0].id as TemplateId);
    setResult({ sourceName, assessment });
    setMessage(`已在本地完成检查 · ${sourceName}`);
    recordPmfPilotEvent("import_result", { value: getPmfImportResult(importKind, true) });
    recordPmfPilotEvent("audit_result", { value: assessment.status });
  }

  async function importFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setResult(null);
      setMessage("请选择 .json 文件；文件不会上传。");
      recordPmfPilotEvent("import_result", { value: "failed" });
      return;
    }
    try {
      const content = await file.text();
      setRaw(content);
      inspectJson(content, file.name, "real");
    } catch {
      setResult(null);
      setMessage("浏览器无法读取该文件，请改用粘贴导入。");
      recordPmfPilotEvent("import_result", { value: "failed" });
    }
  }

  function loadExample() {
    const content = JSON.stringify(examplePortfolio, null, 2);
    setRaw(content);
    inspectJson(content, "仓库脱敏示例", "example");
  }

  function downloadReleaseFile(filename: string) {
    if (!result?.assessment.canGenerateRelease) return;
    recordPmfPilotEvent("release_pack_generated", { value: true, templateId: selectedTemplate });
    const releasePack = createReleasePack(result.assessment, {
      selectedTemplate,
      pmfPilotLog: exportPmfPilotLog(),
    });
    downloadText(filename, releasePack[filename as keyof typeof releasePack]);
  }

  function updatePublished(nextPublished: boolean) {
    setPublished(nextPublished);
    if (!nextPublished) {
      recordPmfPilotEvent("published_confirmed", { value: false });
      setSignalMessage("已记录为尚未公开；不会保存或要求作品集 URL。");
    } else if (platform) {
      recordPmfPilotEvent("published_confirmed", { value: true, platform });
      setSignalMessage("已记录公开平台枚举；没有收集 URL。");
    } else {
      setSignalMessage("请选择公开平台枚举后再完成公开确认；不要输入 URL。");
    }
  }

  function updatePlatform(nextPlatform: Platform | "") {
    setPlatform(nextPlatform);
    if (published && nextPlatform) {
      recordPmfPilotEvent("published_confirmed", { value: true, platform: nextPlatform });
      setSignalMessage("已记录公开平台枚举；没有收集 URL。");
    }
  }

  function updateApplied(value: "" | "yes" | "no") {
    setApplied(value);
    if (value) recordPmfPilotEvent("applied", { value: value === "yes" });
  }

  function updateInterview(value: InterviewFeedback | "") {
    setInterviewFeedback(value);
    if (value) recordPmfPilotEvent("interview_feedback", { value });
  }

  const checks = result ? [
    { label: "Schema-lite", state: result.assessment.schema.valid ? "pass" : "block", detail: result.assessment.schema.valid ? "v2 核心字段、项目数组与 slug 结构通过。" : result.assessment.schema.errors.map((item) => `${item.path}：${item.message}`).join("；") },
    { label: "三项目精选", state: result.assessment.featured.pass ? "pass" : "warn", detail: result.assessment.featured.message },
    { label: "模板态", state: result.assessment.template.detected ? "warn" : "pass", detail: result.assessment.template.detected ? `检测到 ${result.assessment.template.markerCount} 类占位标记，请替换后再发布。` : "未检测到常见模板占位标记。" },
    { label: "证据审计", state: result.assessment.audit.level === "弱证据" ? "warn" : "pass", detail: `平均 ${result.assessment.audit.totalScore}/5（${result.assessment.audit.level}）。${result.assessment.audit.questions[0] || "五维证据覆盖稳定。"}` },
    { label: "隐私扫描", state: result.assessment.audit.privacyRisks.length ? "block" : "pass", detail: result.assessment.audit.privacyRisks.length ? result.assessment.audit.privacyRisks.map((risk) => risk.message).join("；") : "未命中常见邮箱、电话、内部链接、Token 或用户 ID 模式；仍需人工确认披露权限。" },
    { label: "引用校验", state: result.assessment.references.valid ? "pass" : "block", detail: result.assessment.references.valid ? "featured、roadmap 与 starMap 引用均可解析。" : `发现 ${result.assessment.references.findings.length} 处断链：${result.assessment.references.findings.map((item) => item.path).join("、")}` },
  ] as const : [];
  const currentStatus = result ? statusCopy[result.assessment.status as keyof typeof statusCopy] : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">PORTFOLIO LAUNCHPAD / LOCAL ONLY</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-[#14110e] sm:text-6xl">把 projects.json 变成一套可发布的证据包。</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5b4635]">上传或粘贴后，浏览器本地执行结构、引用、隐私和证据检查。没有账号、没有 fetch、没有内容上传。</p>
        </div>
        <aside className="border-l-2 border-[#c92a20] bg-[#fffaf0] p-5 text-sm leading-6 text-[#5b4635]">
          <strong className="block text-[#14110e]">隐私承诺</strong>
          文件只进入当前页面内存；刷新即清空。{pilotEnabled ? "匿名试点日志已启用，但只记录枚举、布尔、计数、模板 ID 与时间戳。" : "匿名试点日志未启用；Release Pack 会包含 disabled 状态说明。"}
        </aside>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-labelledby="import-title">
        <div className="border border-[#14110e]/20 bg-[#f8f8f3] p-5 shadow-[7px_7px_0_rgba(20,17,14,0.08)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div><p className="font-mono text-xs font-bold text-[#80654d]">01 / IMPORT</p><h2 id="import-title" className="mt-2 text-2xl font-semibold">导入本地数据</h2></div>
            <button type="button" onClick={loadExample} className="text-sm font-semibold text-[#80654d] underline decoration-[#80654d]/40 underline-offset-4 hover:text-[#c92a20]">载入脱敏示例</button>
          </div>
          <p className="mt-4 border-l-2 border-[#9a6818] pl-3 text-xs leading-5 text-[#6f4a0c]">示例只用于体验，会记录为 example_loaded，不计入“真实材料导入成功”。</p>
          <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importFile(event.target.files?.[0])} />
          <button type="button" onClick={() => fileInput.current?.click()} className="mt-6 w-full border border-dashed border-[#14110e]/35 bg-white px-5 py-7 text-left transition hover:border-[#c92a20] hover:bg-[#fffaf0]">
            <span className="block font-semibold text-[#14110e]">选择 projects.json</span><span className="mt-1 block text-sm text-[#80654d]">只读取，不上传 · 也可在下方直接粘贴</span>
          </button>
          <label className="mt-5 block text-sm font-semibold text-[#14110e]">粘贴 JSON
            <textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows={12} spellCheck={false} placeholder={'{\n  "schemaVersion": 2,\n  "rolePreset": "product",\n  ...\n}'} className="mt-2 w-full resize-y border border-[#14110e]/20 bg-white p-4 font-mono text-xs font-normal leading-6 outline-none focus:border-[#c92a20]" />
          </label>
          <button type="button" onClick={() => inspectJson(raw, "粘贴内容", "real")} className="mt-4 w-full bg-[#14110e] px-5 py-3.5 font-semibold text-white transition hover:bg-[#c92a20]">运行本地发布检查</button>
          <p role="status" aria-live="polite" className="mt-3 text-sm text-[#80654d]">{message}</p>
        </div>

        <div className="border border-[#14110e]/20 bg-white p-5 sm:p-7">
          <p className="font-mono text-xs font-bold text-[#80654d]">02 / GATE</p>
          {!result || !currentStatus ? (
            <div className="mt-16 text-center"><p className="text-5xl text-[#14110e]/15">◇</p><h2 className="mt-5 text-2xl font-semibold">等待检查</h2><p className="mt-2 text-sm leading-6 text-[#80654d]">先导入 v2 projects.json，才会生成明确的 block / warn / pass 结论。</p></div>
          ) : (
            <>
              <div className={`mt-5 border-l-4 p-5 ${currentStatus.tone}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-bold tracking-widest">{currentStatus.label}</span><span className="text-xs">{result.sourceName}</span></div><h2 className="mt-2 text-2xl font-semibold">{currentStatus.title}</h2></div>
              <ul className="mt-4">{checks.map((check) => <CheckRow key={check.label} {...check} />)}</ul>
              <div className="mt-4 border-2 border-[#14110e] bg-[#f4dfbd] p-5 shadow-[5px_5px_0_#14110e]"><p className="font-mono text-xs font-bold">唯一下一步</p><p className="mt-2 font-semibold leading-7">{result.assessment.nextStep}</p></div>
            </>
          )}
        </div>
      </section>

      <section className="mt-8 border border-[#14110e]/20 bg-[#f8f8f3] p-5 sm:p-8" aria-labelledby="template-match-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-mono text-xs font-bold text-[#80654d]">03 / TEMPLATE MATCH</p><h2 id="template-match-title" className="mt-2 text-3xl font-semibold">按内容信号推荐，不按皮肤推荐。</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-[#6e5743]">手动选择只改变 Release Pack 的 projects.json，不能绕过隐私或引用阻断。</p></div>
          <StaticPageLink href="/templates/" className="text-sm font-semibold text-[#80654d] underline underline-offset-4">查看四种结构说明 →</StaticPageLink>
        </div>
        {!result ? <p className="mt-6 border border-dashed border-[#14110e]/20 bg-white p-5 text-sm text-[#80654d]">导入并通过基础解析后，这里会出现四模板 0–100 排序与解释。</p> : (
          <ol className="mt-6 grid gap-4 lg:grid-cols-2">
            {result.assessment.templateMatches.map((match, index) => (
              <li key={match.id}><button type="button" onClick={() => setSelectedTemplate(match.id as TemplateId)} className={`h-full w-full border p-5 text-left transition ${selectedTemplate === match.id ? "border-[#c92a20] bg-[#fffaf0] shadow-[5px_5px_0_rgba(201,42,32,0.15)]" : "border-[#14110e]/15 bg-white hover:border-[#80654d]"}`} aria-pressed={selectedTemplate === match.id}>
                <div className="flex items-start justify-between gap-4"><div><span className="font-mono text-[10px] font-bold text-[#80654d]">#{index + 1} · {match.id}</span><h3 className="mt-1 text-xl font-semibold">{match.name}</h3></div><strong className="font-mono text-3xl text-[#c92a20]">{match.score}</strong></div>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#4b3829]">{match.focus}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="font-mono text-[10px] font-bold text-[#26734d]">加分理由</p><ul className="mt-2 space-y-1 text-xs leading-5 text-[#5b4635]">{match.reasons.map((reason) => <li key={reason}>+ {reason}</li>)}</ul></div><div><p className="font-mono text-[10px] font-bold text-[#9a6818]">当前缺口</p><ul className="mt-2 space-y-1 text-xs leading-5 text-[#5b4635]">{match.gaps.length ? match.gaps.map((gap) => <li key={gap}>− {gap}</li>) : <li>未识别到关键结构缺口</li>}</ul></div></div>
                <span className="mt-4 block text-xs font-bold text-[#c92a20]">{selectedTemplate === match.id ? "已选择，将写入 template.active" : "选择此模板"}</span>
              </button></li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-8 border border-[#14110e]/20 bg-[#14110e] p-5 text-[#f8f8f3] sm:p-8" aria-labelledby="release-title">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="font-mono text-xs font-bold tracking-[0.16em] text-[#d3b992]">04 / RELEASE PACK</p><h2 id="release-title" className="mt-2 text-3xl font-semibold">六个文件，分别下载。</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#d3b992]">隐私或引用断链会关闭全部下载。第六个 PMF_PILOT_LOG.json 未启用时只写 disabled 状态；启用后也只含安全事件。</p></div>
          <StaticPageLink href="/pilot/" className="text-sm font-semibold text-[#f4dfbd] underline underline-offset-4">管理匿名本地记录</StaticPageLink>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {RELEASE_FILE_NAMES.map((filename, index) => (
            <button key={filename} type="button" disabled={!result?.assessment.canGenerateRelease} onClick={() => downloadReleaseFile(filename)} className="min-h-28 border border-[#f8f8f3]/25 bg-[#f8f8f3]/5 p-4 text-left transition enabled:hover:border-[#f4dfbd] enabled:hover:bg-[#f8f8f3]/10 disabled:cursor-not-allowed disabled:opacity-35">
              <span className="font-mono text-[10px] text-[#d3b992]">0{index + 1}</span><span className="mt-5 block break-all text-sm font-semibold">{filename}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 border border-[#14110e]/20 bg-[#fffaf0] p-5 sm:p-8 lg:grid-cols-[1fr_0.85fr]" aria-labelledby="strong-signals-title">
        <div>
          <p className="font-mono text-xs font-bold text-[#80654d]">05 / PUBLICATION & STRONG SIGNALS</p>
          <h2 id="strong-signals-title" className="mt-2 text-3xl font-semibold">确认上线，不收 URL；后续信号自愿选择。</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">公开平台枚举
              <select value={platform} onChange={(event) => updatePlatform(event.target.value as Platform | "")} className="mt-2 w-full border border-[#14110e]/20 bg-white p-3 font-normal">
                <option value="">请选择，不输入 URL</option>
                {PMF_PILOT_PLATFORMS.map((item) => <option key={item} value={item}>{platformLabels[item]}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 border border-[#14110e]/20 bg-white p-4 text-sm font-semibold"><input type="checkbox" checked={published} onChange={(event) => updatePublished(event.target.checked)} className="size-4 accent-[#c92a20]" />我已公开上线</label>
            <label className="text-sm font-semibold">是否已投递
              <select value={applied} onChange={(event) => updateApplied(event.target.value as "" | "yes" | "no")} className="mt-2 w-full border border-[#14110e]/20 bg-white p-3 font-normal"><option value="">暂不记录</option><option value="yes">是</option><option value="no">否</option></select>
            </label>
            <label className="text-sm font-semibold">面试与反馈枚举
              <select value={interviewFeedback} onChange={(event) => updateInterview(event.target.value as InterviewFeedback | "")} className="mt-2 w-full border border-[#14110e]/20 bg-white p-3 font-normal">
                <option value="">暂不记录</option>
                {PMF_PILOT_INTERVIEW_FEEDBACK.map((item) => <option key={item} value={item}>{interviewLabels[item]}</option>)}
              </select>
            </label>
          </div>
          <p role="status" aria-live="polite" className="mt-4 text-sm leading-6 text-[#6e5743]">{signalMessage}</p>
        </div>
        <aside className="border-l-4 border-[#c92a20] bg-white p-5 text-sm leading-7 text-[#5b4635]">
          <strong className="text-[#14110e]">自愿提交匿名日志</strong>
          <p className="mt-2">可使用独立 GitHub Issue Form 回答最少问题。提交前必须先下载并自行检查 PMF_PILOT_LOG.json；不要追加简历、项目原文、内部链接、公司名、URL、联系方式或敏感指标。</p>
          <a href="https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/new?template=pmf-pilot.yml" target="_blank" rel="noreferrer" className="mt-5 inline-block font-semibold text-[#c92a20] underline underline-offset-4">检查后创建 PMF Pilot Issue ↗</a>
        </aside>
      </section>
    </main>
  );
}
