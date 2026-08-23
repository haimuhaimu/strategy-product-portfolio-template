"use client";

import { useMemo, useRef, useState } from "react";
import { StaticPageLink } from "@/components/StaticPageLink";
import { ShowcaseEntryFields, type ShowcaseDraft } from "@/components/launchpad/ShowcaseEntryFields";
import {
  assessShowcaseDraft,
  createShowcaseIssueSummary,
  normalizeShowcaseDraft,
  parseShowcaseDraftJson,
} from "@/lib/showcase-entry.mjs";

const ISSUE_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/new?template=showcase.yml";
const EMPTY_DRAFT = normalizeShowcaseDraft({}) as ShowcaseDraft;
const actionClass = "inline-flex min-h-11 items-center justify-center px-5 py-3 text-sm font-semibold transition motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6]";

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ShowcaseSubmissionWorkbench() {
  const [draft, setDraft] = useState<ShowcaseDraft>(EMPTY_DRAFT);
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("可直接空白填写，也可导入 Launchpad 生成的草稿。");
  const [actionMessage, setActionMessage] = useState("尚未生成文件或复制摘要。");
  const fileInput = useRef<HTMLInputElement>(null);
  const assessment = useMemo(() => assessShowcaseDraft(draft), [draft]);
  const issueSummary = useMemo(
    () => assessment.valid && assessment.entry ? createShowcaseIssueSummary(assessment.entry) : "请先修复全部校验问题并完成四项披露确认。",
    [assessment],
  );

  function importSource(raw: string, sourceName: string) {
    const result = parseShowcaseDraftJson(raw);
    if (!result.ok) {
      setMessage(result.message ?? "草稿无法解析。");
      return;
    }
    setDraft(result.draft as ShowcaseDraft);
    setMessage(`已在浏览器本地导入并规范化：${sourceName}`);
    setActionMessage("草稿已更新，请检查公开字段与披露确认。");
  }

  async function importFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setMessage("请选择 .json 文件；文件只在浏览器内读取。");
      return;
    }
    try {
      const content = await file.text();
      setSource(content);
      importSource(content, file.name);
    } catch {
      setMessage("浏览器无法读取该文件，请改用粘贴导入。");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function downloadEntry() {
    const entry = assessment.entry;
    if (!assessment.valid || !entry) return;
    try {
      downloadJson(`${entry.slug}.json`, entry);
      setActionMessage(`已下载 ${entry.slug}.json；请放入 showcase/entries/${entry.slug}.json。`);
    } catch {
      setActionMessage("下载失败，请重试或检查浏览器下载权限。");
    }
  }

  async function copyIssueSummary() {
    if (!assessment.valid) return;
    try {
      await navigator.clipboard.writeText(issueSummary);
      setActionMessage("已复制公开 Issue 摘要；它只含最终公开白名单字段，不含导入草稿原文。");
    } catch {
      setActionMessage("自动复制失败，请手动选中摘要文本复制。");
    }
  }

  return (
    <main className="bg-[#efefe9] text-[#14110e]">
      <section className="border-b border-[#14110e]/15 bg-[#fffaf0] px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="面包屑" className="flex items-center gap-2 font-mono text-xs font-bold text-[#80654d]">
            <StaticPageLink href="/launchpad/" className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6]">Launchpad</StaticPageLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Showcase 投稿助手</span>
          </nav>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">LOCAL SHOWCASE HELPER / v0.9.3</p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">只整理准备公开的内容。</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#5b4635]">上传或粘贴 Launchpad 生成的 SHOWCASE_ENTRY.json，也可以空白开始。解析、校验、摘要和文件生成都只在当前浏览器完成；刷新页面即可清空。</p>
            </div>
            <aside className="border-l-2 border-[#c92a20] bg-white/60 p-5 text-sm leading-7 text-[#5b4635]">
              <strong className="block text-[#8e211b]">GitHub Issue 不是真正匿名</strong>
              Issue 会公开显示你的 GitHub 账号和提交内容。不接受公开身份时请勿提交；本工具也不会代你发布。
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14" aria-labelledby="draft-import-title">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <div className="border border-[#14110e]/20 bg-white p-5 shadow-[6px_6px_0_rgba(20,17,14,0.08)] sm:p-6">
              <p className="font-mono text-xs font-bold text-[#80654d]">01 / IMPORT OR START BLANK</p>
              <h2 id="draft-import-title" className="mt-2 text-2xl font-semibold">导入草稿</h2>
              <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importFile(event.target.files?.[0])} />
              <button type="button" onClick={() => fileInput.current?.click()} className={`${actionClass} mt-5 w-full border border-dashed border-[#14110e]/40 bg-[#fffaf0] hover:border-[#c92a20]`}>选择 SHOWCASE_ENTRY.json</button>
              <label className="mt-5 block text-sm font-semibold">
                或粘贴草稿
                <textarea value={source} onChange={(event) => setSource(event.target.value)} rows={9} spellCheck={false} placeholder={'{\n  "slug": "replace-with-public-slug",\n  ...\n}'} className="mt-2 w-full resize-y border border-[#14110e]/20 bg-[#f8f8f3] p-3 font-mono text-xs font-normal leading-6 outline-none focus-visible:border-[#1437d6] focus-visible:ring-2 focus-visible:ring-[#1437d6]/25" />
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={() => importSource(source, "粘贴内容")} className={`${actionClass} bg-[#14110e] text-white hover:bg-[#c92a20]`}>解析并规范化</button>
                <button type="button" onClick={() => { setDraft(EMPTY_DRAFT); setSource(""); setMessage("已清空，可从空白开始。"); }} className={`${actionClass} border border-[#14110e]/25 bg-white hover:border-[#c92a20]`}>清空</button>
              </div>
              <p role="status" aria-live="polite" className="mt-4 text-sm leading-6 text-[#80654d]">{message}</p>
            </div>

            <aside className="border border-[#c92a20]/35 bg-[#fff0ec] p-5">
              <h2 className="text-lg font-semibold text-[#8e211b]">本工具明确不收集</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5b302b]">
                <li>— 邮箱、电话、原始简历或聊天记录</li>
                <li>— 用户明细、内部链接、密钥或带签名的地址</li>
                <li>— 未经授权的精确业务数据</li>
              </ul>
            </aside>
          </div>

          <div className="border border-[#14110e]/20 bg-white p-5 sm:p-7">
            <p className="font-mono text-xs font-bold text-[#80654d]">02 / PUBLIC FIELDS</p>
            <h2 className="mt-2 text-2xl font-semibold">只填写将进入公开条目的字段</h2>
            <p className="mt-2 text-sm leading-6 text-[#6e5743]">导入会丢弃 schema 之外的字段，并压缩首尾与连续空白；最终仍需你逐项确认。</p>
            <div className="mt-7"><ShowcaseEntryFields draft={draft} onChange={setDraft} /></div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#14110e]/15 bg-[#14110e] px-4 py-12 text-[#f8f8f3] sm:px-8" aria-labelledby="showcase-output-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="font-mono text-xs font-bold text-[#d3b992]">03 / VALIDATE & OUTPUT</p>
              <h2 id="showcase-output-title" className="mt-2 text-3xl font-semibold">合规后才开放下载与复制</h2>
              {assessment.valid && assessment.entry ? (
                <p className="mt-5 border-l-4 border-[#5cce8b] bg-white/10 p-4 text-sm leading-6">全部字段与四项披露已通过。目标路径：<code className="break-all">showcase/entries/{assessment.entry.slug}.json</code></p>
              ) : (
                <div role="status" aria-live="polite" className="mt-5 border-l-4 border-[#f0a096] bg-white/10 p-4">
                  <p className="font-semibold">仍有 {assessment.errors.length} 项需要处理：</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[#f4d8d4]">{assessment.errors.map((error: string) => <li key={error}>— {error}</li>)}</ul>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={!assessment.valid} onClick={downloadEntry} className={`${actionClass} bg-[#c92a20] text-white enabled:hover:bg-[#e13b30] disabled:cursor-not-allowed disabled:opacity-40`}>下载最终条目</button>
                <button type="button" disabled={!assessment.valid} onClick={() => void copyIssueSummary()} className={`${actionClass} border border-white/35 bg-white/5 enabled:hover:border-[#f4dfbd] disabled:cursor-not-allowed disabled:opacity-40`}>复制公开 Issue 摘要</button>
              </div>
              <p role="status" aria-live="polite" className="mt-4 text-sm leading-6 text-[#d3b992]">{actionMessage}</p>
              <a href={ISSUE_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-semibold text-[#f4dfbd] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4dfbd]">确认摘要后打开公开 Issue ↗</a>
            </div>
            <label className="block text-sm font-semibold text-[#f4dfbd]">
              公开 Issue 摘要预览
              <textarea readOnly value={issueSummary} rows={16} className="mt-2 w-full resize-y border border-white/20 bg-black/20 p-4 font-mono text-xs font-normal leading-6 text-[#f8f8f3] outline-none focus-visible:border-[#f4dfbd] focus-visible:ring-2 focus-visible:ring-[#f4dfbd]/30" />
              <span className="mt-2 block font-normal leading-6 text-[#d3b992]">摘要只使用最终公开条目的白名单字段，不读取或回显粘贴草稿中的其他内容。</span>
            </label>
          </div>
        </div>
      </section>
    </main>
  );
}
