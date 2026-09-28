"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import productExample from "../../../data/projects.json";
import operationsExample from "../../../data/presets/operations.json";
import { createPortfolioExport } from "@/lib/config-export.mjs";
import {
  createEmptyConfigDraft,
  loadConfigDraft,
  portfolioDataToConfigDraft,
  removeConfigDraft,
  saveConfigDraft,
} from "@/lib/config-draft.mjs";
import { auditPortfolioDraft } from "@/lib/evidence-audit.mjs";
import { TEMPLATE_REGISTRY } from "@/lib/templates.mjs";
import type { TemplateId } from "@/types/project";
import { PortfolioCompanion } from "@/components/PortfolioCompanion";
import { StaticPageLink } from "@/components/StaticPageLink";
import { ConfigPreview } from "./ConfigPreview";
import { ConfigProjectFields, type DraftProject } from "./ConfigProjectFields";
import { EvidenceAuditPanel } from "./EvidenceAuditPanel";

type Mode = "product" | "operations";
type Profile = { name: string; role: string; summary: string; email: string };
type ConfigDraft = { mode: Mode; template: TemplateId; profile: Profile; projects: DraftProject[] };

const initialDraft = createEmptyConfigDraft() as ConfigDraft;

export function PortfolioConfigurator() {
  const [mode, setMode] = useState<Mode>(initialDraft.mode);
  const [template, setTemplate] = useState<TemplateId>(initialDraft.template);
  const [profile, setProfile] = useState<Profile>(initialDraft.profile);
  const [projects, setProjects] = useState<DraftProject[]>(initialDraft.projects);
  const [storageStatus, setStorageStatus] = useState("正在检查本地草稿…");
  const [clearArmed, setClearArmed] = useState(false);
  const hydrated = useRef(false);
  const clearTimer = useRef<number | null>(null);
  const exported = useMemo(() => createPortfolioExport({ mode, template, ...profile, projects }), [mode, template, profile, projects]);
  const auditReport = useMemo(() => auditPortfolioDraft({ mode, profile, projects }), [mode, profile, projects]);

  function applyDraft(draft: ConfigDraft) {
    setMode(draft.mode);
    setTemplate(draft.template);
    setProfile(draft.profile);
    setProjects(draft.projects);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const restored = loadConfigDraft(window.localStorage);
      if (restored.ok) {
        applyDraft(restored.draft as ConfigDraft);
        setStorageStatus("已恢复本地草稿 · 仅保存在此浏览器");
      } else if (restored.reason && ["corrupt", "version", "shape"].includes(restored.reason)) {
        removeConfigDraft(window.localStorage);
        setStorageStatus("旧草稿无法恢复，已安全忽略 · 仅保存在此浏览器");
      } else if (restored.reason === "unavailable") {
        setStorageStatus("浏览器阻止本地保存，本页内容不会上传");
      } else {
        setStorageStatus("自动保存草稿 · 仅保存在此浏览器");
      }
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const timer = window.setTimeout(() => {
      const result = saveConfigDraft(window.localStorage, { mode, template, profile, projects });
      setStorageStatus(result.ok ? "草稿已自动保存 · 仅保存在此浏览器" : "浏览器阻止本地保存，本页内容不会上传");
    }, 250);
    return () => window.clearTimeout(timer);
  }, [mode, template, profile, projects]);

  useEffect(() => () => {
    if (clearTimer.current) window.clearTimeout(clearTimer.current);
  }, []);

  function updateProject(index: number, key: keyof DraftProject, value: string) {
    setProjects((current) => current.map((project, projectIndex) => projectIndex === index ? { ...project, [key]: value } : project));
  }

  function loadExample(source: unknown) {
    applyDraft(portfolioDataToConfigDraft(source) as ConfigDraft);
    setClearArmed(false);
    setStorageStatus("示例已载入，修改会自动保存 · 仅保存在此浏览器");
  }

  function requestClear() {
    if (!clearArmed) {
      setClearArmed(true);
      setStorageStatus("再次点击“确认清空全部内容”才会删除本地草稿");
      clearTimer.current = window.setTimeout(() => setClearArmed(false), 6000);
      return;
    }
    if (clearTimer.current) window.clearTimeout(clearTimer.current);
    removeConfigDraft(window.localStorage);
    applyDraft(createEmptyConfigDraft() as ConfigDraft);
    setClearArmed(false);
    setStorageStatus("已清空；新输入仍将仅保存在此浏览器");
  }

  function download() {
    const blob = new Blob([`${JSON.stringify(exported, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "projects.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="max-w-3xl">
        <p className="font-mono text-sm font-semibold text-[#c92a20]">LOCAL CONFIGURATOR</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#14110e] sm:text-5xl">10 分钟看到自己的页面</h1>
        <p className="mt-4 leading-7 text-[#5b4635]">内容只在当前浏览器中处理，不上传。填完后下载 JSON，直接替换 <code>data/projects.json</code>。</p>
      </div>

      <section aria-label="快速开始" className="mt-7 rounded-xl border border-[#14110e]/15 bg-[#fffaf0] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => loadExample(productExample)} className="rounded-lg border border-[#14110e]/20 bg-white px-3 py-2 text-sm font-semibold hover:border-[#c92a20]">载入产品经理示例</button>
          <button type="button" onClick={() => loadExample(operationsExample)} className="rounded-lg border border-[#14110e]/20 bg-white px-3 py-2 text-sm font-semibold hover:border-[#c92a20]">载入运营示例</button>
          <button type="button" onClick={requestClear} className={`rounded-lg px-3 py-2 text-sm font-semibold ${clearArmed ? "bg-[#c92a20] text-white" : "text-[#80654d] hover:bg-white"}`}>{clearArmed ? "确认清空全部内容" : "清空重来"}</button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-xs leading-5 text-[#80654d] sm:mt-0 sm:max-w-56 sm:text-right">{storageStatus}</p>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="grid grid-cols-2 rounded-xl border border-[#14110e]/15 bg-white p-1">
            {(["product", "operations"] as Mode[]).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-lg px-4 py-3 text-sm font-semibold ${mode === item ? "bg-[#14110e] text-white" : "text-[#5b4635]"}`}>
                {item === "product" ? "产品经理" : "运营"}
              </button>
            ))}
          </div>
          <section className="mt-5 rounded-xl border border-[#14110e]/15 bg-[#fffaf0] p-5">
            <div className="flex items-end justify-between gap-4">
              <div><p className="font-mono text-xs font-bold text-[#80654d]">TEMPLATE</p><h2 className="mt-1 text-lg font-semibold">选择叙事结构</h2></div>
              <StaticPageLink href="/templates/" className="text-xs font-semibold text-[#80654d] underline underline-offset-4">查看模板库</StaticPageLink>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {TEMPLATE_REGISTRY.map((item) => (
                <button key={item.id} type="button" onClick={() => setTemplate(item.id as TemplateId)} className={`rounded-lg border p-3 text-left ${template === item.id ? "border-[#c92a20] bg-white" : "border-[#14110e]/15 bg-[#f8f8f3]"}`}>
                  <span className="block text-sm font-semibold">{item.shortName}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#80654d]">{item.focus}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="mt-5 rounded-xl border border-[#14110e]/15 bg-white p-5">
            <h2 className="text-lg font-semibold">基本信息</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {([["name", "姓名", "你的名字"], ["role", "角色", mode === "product" ? "例如：AI 产品经理" : "例如：增长运营"], ["email", "公开邮箱", "hello@example.com"]] as const).map(([key, label, placeholder]) => (
                <label key={key} className="text-sm font-semibold">{label}<input value={profile[key]} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-[#14110e]/20 px-3 py-2.5 font-normal outline-none focus:border-[#c92a20]" /></label>
              ))}
            </div>
            <label className="mt-4 block text-sm font-semibold">个人简介<textarea value={profile.summary} onChange={(event) => setProfile({ ...profile, summary: event.target.value })} rows={3} placeholder={mode === "product" ? "你擅长解决什么产品问题？" : "你擅长经营什么人群、场景或增长链路？"} className="mt-2 w-full rounded-lg border border-[#14110e]/20 px-3 py-2.5 font-normal leading-6 outline-none focus:border-[#c92a20]" /></label>
          </section>
          <div className="mt-5"><ConfigProjectFields mode={mode} projects={projects} onChange={updateProject} /></div>
          <div className="mt-6"><EvidenceAuditPanel report={auditReport} /></div>
          <button type="button" onClick={download} className="mt-6 w-full rounded-xl bg-[#c92a20] px-6 py-4 font-semibold text-white transition hover:bg-[#a92119]">下载 projects.json</button>
          <p className="mt-3 text-center text-xs text-[#80654d]">下载文件包含通用详情页所需字段，且高级模型默认关闭。</p>
        </div>
        <ConfigPreview name={profile.name} role={profile.role} summary={profile.summary} mode={mode} projects={projects} />
      </div>
      <PortfolioCompanion suggestions={auditReport.questions} alwaysVisible />
    </main>
  );
}
