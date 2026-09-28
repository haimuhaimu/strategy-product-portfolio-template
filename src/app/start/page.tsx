import type { Metadata } from "next";
import { AgentPromptCard } from "@/components/start/AgentPromptCard";
import { StaticPageLink } from "@/components/StaticPageLink";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "用自己的 Agent 制作作品集",
  description: "把材料交给自己的 Agent，回答少量关键问题，获得并发布作品集；已有 projects.json 也可以直接在本地检查和下载。",
  pathname: "/start/",
  keywords: ["Agent 作品集", "产品经理作品集怎么做", "运营作品集", "作品集隐私检查"],
});

const steps = [
  { index: "01", title: "把材料交给 Agent", description: "提供简历、项目文档和零散记录。Agent 会先阅读公开工作说明，再盘点全部经历。" },
  { index: "02", title: "回答少量关键问题", description: "每次只回答一个最重要的问题，补足结果口径、个人贡献或公开边界。" },
  { index: "03", title: "获得并发布作品集", description: "Agent 精选三个项目、检查隐私、生成文件；有仓库权限时还可以继续测试和部署。" },
] as const;

export default function StartPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <section className="border-b border-[#14110e]/20 pb-10">
        <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">START WITH YOUR AGENT</p>
        <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold leading-tight text-[#14110e] sm:text-6xl">用你自己的 Agent，把经历变成可发布的作品集。</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#5b4635]">不需要先学数据格式或开发术语。任何能够访问网页、读取仓库并生成文件的个人 Agent 都可以按这条路径协助你；这里不对具体品牌或服务能力作承诺。</p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]" aria-label="两种开始方式">
        <article className="border-2 border-[#c92a20] bg-[#fffaf0] p-6 shadow-[8px_8px_0_rgba(201,42,32,0.14)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-3xl font-semibold text-[#c92a20]">A</span>
            <span className="bg-[#c92a20] px-3 py-1 text-xs font-bold text-white">推荐</span>
          </div>
          <h2 className="mt-7 text-3xl font-semibold text-[#14110e]">用自己的 Agent</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5b4635]">把下面的提示词和你的材料一起交给 Agent。复杂的材料盘点、项目筛选、证据与隐私检查都留在后台完成。</p>
          <AgentPromptCard />
        </article>

        <article className="flex flex-col border border-[#14110e]/20 bg-[#f8f8f3] p-6 shadow-[6px_6px_0_rgba(20,17,14,0.08)] sm:p-8">
          <span className="font-mono text-3xl font-semibold text-[#80654d]">B</span>
          <p className="mt-7 font-mono text-xs font-bold tracking-[0.14em] text-[#80654d]">已有 projects.json</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#14110e]">检查并下载</h2>
          <p className="mt-4 text-sm leading-7 text-[#5b4635]">文件已经准备好时，直接在浏览器本地检查结构、隐私、内容关联和证据完整度，再下载五个发布文件。</p>
          <StaticPageLink href="/launchpad/" className="mt-auto pt-10 font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">检查我的作品集文件 →</StaticPageLink>
        </article>
      </section>

      <section className="mt-14" aria-labelledby="three-steps-title">
        <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#80654d]">THREE SIMPLE STEPS</p>
        <h2 id="three-steps-title" className="mt-3 text-3xl font-semibold text-[#14110e]">三步完成，不把复杂度交给你。</h2>
        <ol className="mt-6 grid gap-px border border-[#14110e]/20 bg-[#14110e]/20 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.index} className="bg-[#fffaf0] p-6">
              <span className="font-mono text-xs font-bold text-[#c92a20]">{step.index}</span>
              <h3 className="mt-3 text-xl font-semibold text-[#14110e]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6e5743]">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
