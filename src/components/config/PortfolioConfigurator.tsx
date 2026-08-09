"use client";

import { useMemo, useState } from "react";
import { createPortfolioExport } from "@/lib/config-export.mjs";
import { auditPortfolioDraft } from "@/lib/evidence-audit.mjs";
import { PortfolioCompanion } from "@/components/PortfolioCompanion";
import { ConfigPreview } from "./ConfigPreview";
import { ConfigProjectFields, type DraftProject } from "./ConfigProjectFields";
import { EvidenceAuditPanel } from "./EvidenceAuditPanel";

type Mode = "product" | "operations";
const emptyProject = (): DraftProject => ({ title: "", problem: "", method: "", goal: "", actions: "", result: "", artifact: "", contribution: "" });

export function PortfolioConfigurator() {
  const [mode, setMode] = useState<Mode>("product");
  const [profile, setProfile] = useState({ name: "", role: "", summary: "", email: "" });
  const [projects, setProjects] = useState<DraftProject[]>([emptyProject(), emptyProject(), emptyProject()]);
  const exported = useMemo(() => createPortfolioExport({ mode, ...profile, projects }), [mode, profile, projects]);
  const auditReport = useMemo(() => auditPortfolioDraft({ mode, profile, projects }), [mode, profile, projects]);

  function updateProject(index: number, key: keyof DraftProject, value: string) {
    setProjects((current) => current.map((project, projectIndex) => projectIndex === index ? { ...project, [key]: value } : project));
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

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="grid grid-cols-2 rounded-xl border border-[#14110e]/15 bg-white p-1">
            {(["product", "operations"] as Mode[]).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-lg px-4 py-3 text-sm font-semibold ${mode === item ? "bg-[#14110e] text-white" : "text-[#5b4635]"}`}>
                {item === "product" ? "产品经理" : "运营"}
              </button>
            ))}
          </div>
          <section className="mt-5 rounded-xl border border-[#14110e]/15 bg-white p-5">
            <h2 className="text-lg font-semibold">基本信息</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {([ ["name", "姓名", "你的名字"], ["role", "角色", mode === "product" ? "例如：AI 产品经理" : "例如：增长运营"], ["email", "公开邮箱", "hello@example.com"] ] as const).map(([key, label, placeholder]) => (
                <label key={key} className="text-sm font-semibold">{label}
                  <input value={profile[key]} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-[#14110e]/20 px-3 py-2.5 font-normal outline-none focus:border-[#c92a20]" />
                </label>
              ))}
            </div>
            <label className="mt-4 block text-sm font-semibold">个人简介
              <textarea value={profile.summary} onChange={(event) => setProfile({ ...profile, summary: event.target.value })} rows={3} placeholder={mode === "product" ? "你擅长解决什么产品问题？" : "你擅长经营什么人群、场景或增长链路？"} className="mt-2 w-full rounded-lg border border-[#14110e]/20 px-3 py-2.5 font-normal leading-6 outline-none focus:border-[#c92a20]" />
            </label>
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
