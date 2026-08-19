import type { Metadata } from "next";
import { StaticPageLink } from "@/components/StaticPageLink";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "开始制作证据驱动作品集",
  description: "按现有材料选择 Skill-first、Launchpad 或示例配置器；全部路径都围绕三项目精选、证据审计与隐私护栏。",
  pathname: "/start/",
  keywords: ["产品经理作品集怎么做", "运营作品集", "三项目精选", "作品集隐私检查"],
});

const paths = [
  {
    index: "A",
    eyebrow: "只有简历 / 零散材料",
    title: "先用 Skill 把材料变成证据",
    description: "先盘点全部经历、判断产品或运营主叙事，一次只补一个高价值证据，再从全部经历精选 3 个项目。",
    outcome: "得到 v2 projects.json + 审计报告",
    href: "https://github.com/haimuhaimu/strategy-product-portfolio-template/tree/main/skills/portfolio-story-builder",
    action: "打开 Portfolio Story Builder",
    external: true,
  },
  {
    index: "B",
    eyebrow: "已有 projects.json",
    title: "进入 Launchpad 做发布检查",
    description: "本地运行 schema-lite、normalize、引用校验、隐私扫描与证据审计；通过护栏后下载完整 Release Pack。",
    outcome: "得到 5 个可交付发布文件",
    href: "/launchpad/",
    action: "导入 projects.json",
    external: false,
  },
  {
    index: "C",
    eyebrow: "想先体验",
    title: "从脱敏示例和配置器开始",
    description: "不准备材料也可以先看成品结构，切换产品 / 运营叙事，理解三项目与五维证据如何工作。",
    outcome: "10 分钟理解模板与审计逻辑",
    href: "/config/",
    action: "打开示例配置器",
    external: false,
  },
] as const;

export default function StartPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <section className="grid gap-8 border-b border-[#14110e]/20 pb-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">START / CHOOSE YOUR EVIDENCE PATH</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-[#14110e] sm:text-6xl">你现在有什么，就从哪条路径开始。</h1>
        </div>
        <p className="text-base leading-8 text-[#5b4635]">这不是把简历换个排版。先决定哪 3 个项目最值得被看见，再说明你做了什么判断、证据在哪里、哪些结果属于团队。</p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3" aria-label="三条起步路径">
        {paths.map((path) => (
          <article key={path.index} className="group flex min-h-[26rem] flex-col border border-[#14110e]/20 bg-[#f8f8f3] p-6 shadow-[6px_6px_0_rgba(20,17,14,0.08)] transition hover:-translate-y-1 hover:shadow-[9px_9px_0_rgba(20,17,14,0.11)]">
            <div className="flex items-center justify-between"><span className="font-mono text-3xl font-semibold text-[#c92a20]">{path.index}</span><span className="font-mono text-[10px] font-bold tracking-widest text-[#80654d]">{path.eyebrow}</span></div>
            <h2 className="mt-10 text-2xl font-semibold leading-tight text-[#14110e]">{path.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#5b4635]">{path.description}</p>
            <p className="mt-5 border-l-2 border-[#d84b28] pl-3 text-sm font-semibold text-[#4b3829]">{path.outcome}</p>
            {path.external ? (
              <a href={path.href} target="_blank" rel="noreferrer" className="mt-auto pt-10 font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">{path.action} ↗</a>
            ) : (
              <StaticPageLink href={path.href} className="mt-auto pt-10 font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">{path.action} →</StaticPageLink>
            )}
          </article>
        ))}
      </section>

      <section className="mt-12 grid gap-px border border-[#14110e]/20 bg-[#14110e]/20 sm:grid-cols-3" aria-label="共同护栏">
        <div className="bg-[#fffaf0] p-6"><p className="font-mono text-xs font-bold text-[#c92a20]">LOCAL</p><h2 className="mt-2 text-lg font-semibold">本地优先</h2><p className="mt-2 text-sm leading-6 text-[#6e5743]">配置器与 Launchpad 不发送你的输入；刷新页面即可清空 Launchpad 内存。</p></div>
        <div className="bg-[#fffaf0] p-6"><p className="font-mono text-xs font-bold text-[#c92a20]">THREE</p><h2 className="mt-2 text-lg font-semibold">只精选 3 个</h2><p className="mt-2 text-sm leading-6 text-[#6e5743]">一个证明核心岗位能力，一个证明复杂推进，一个证明差异化潜力。</p></div>
        <div className="bg-[#fffaf0] p-6"><p className="font-mono text-xs font-bold text-[#c92a20]">SAFE</p><h2 className="mt-2 text-lg font-semibold">发布前再检查</h2><p className="mt-2 text-sm leading-6 text-[#6e5743]">自动扫描隐私与断链；最终事实口径、组织规则和公开授权仍由本人确认。</p></div>
      </section>
    </main>
  );
}
