"use client";

import { useRef, useState } from "react";

const SKILL_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template/blob/main/skills/portfolio-story-builder/SKILL.md";
const SKILL_DIRECTORY_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template/tree/main/skills/portfolio-story-builder";

export const AGENT_PROMPT = `请作为我的作品集 Agent，先阅读这份公开工作说明：
${SKILL_URL}
如果你更适合读取目录，也可以访问：
${SKILL_DIRECTORY_URL}

然后请按下面的方式帮助我：
1. 盘点我提供的简历、项目文档和零散材料，先确认目标岗位与可公开范围。
2. 每次只问我一个最关键、最容易补足证据的问题；材料足够时直接继续，不要机械追问。
3. 从全部经历中精选三个最能证明岗位能力、复杂推进和差异化的项目，不要只按我最先提到的顺序选择。
4. 只使用我提供或确认的事实；不要编造指标、客户、职责、结果或个人贡献。信息不足时明确写“待补充”。
5. 发布前检查隐私，删除或替换内部链接、个人明细、密钥、项目代号和未经确认可披露的精确业务数据。
6. 生成可供 strategy-product-portfolio-template 使用的 v2 projects.json，并说明仍待我确认的事实和隐私项。
7. 如果你有目标仓库权限，请把文件接入 data/projects.json，运行仓库已有的测试、代码检查、构建和网页检查；全部通过后部署预览，并把文件、检查结果和预览地址交给我。

请先告诉我现在最需要提供的材料；之后始终一次只问一个问题。`;

export function AgentPromptCard() {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [copyStatus, setCopyStatus] = useState("复制提示词");

  async function copyPrompt() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopyStatus("已复制，可以发给你的 Agent");
    } catch {
      promptRef.current?.focus();
      promptRef.current?.select();
      setCopyStatus("自动复制失败，请按 Ctrl/Cmd+C 手动复制");
    }
  }

  return (
    <div className="mt-6 border border-[#14110e]/20 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#14110e]">通用提示词</p>
          <p className="mt-1 text-xs leading-5 text-[#80654d]">复制后连同你的简历、项目文档或材料文件一起发给自己的 Agent。</p>
        </div>
        <button type="button" onClick={() => void copyPrompt()} className="bg-[#14110e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c92a20]">
          {copyStatus}
        </button>
      </div>
      <textarea ref={promptRef} readOnly value={AGENT_PROMPT} rows={16} aria-label="可手动复制的通用提示词" className="mt-4 w-full resize-y border border-[#14110e]/15 bg-[#f8f8f3] p-4 font-mono text-xs leading-6 text-[#4b3829] outline-none focus:border-[#c92a20]" />
      <p className="mt-2 text-xs leading-5 text-[#80654d]">如果浏览器不允许自动复制，点击按钮后使用 Ctrl/Cmd+C；也可以直接选中上方文字手动复制。</p>
    </div>
  );
}
