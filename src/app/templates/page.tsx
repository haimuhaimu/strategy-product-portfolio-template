import type { Metadata } from "next";
import { StaticPageLink } from "@/components/StaticPageLink";
import { TEMPLATE_REGISTRY } from "@/lib/templates.mjs";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "作品集模板库：四种真实叙事结构",
  description: "比较 Atlas、Growth、Systems 与 AI Workflow 四种作品集模板的适合人群、叙事重点、结构预览和匹配信号。",
  pathname: "/templates/",
  keywords: ["产品经理作品集模板", "运营作品集模板", "AI 产品作品集", "增长作品集"],
});

const previewTone = {
  atlas: "bg-[#f3f3ed] text-[#1437d6] border-[#242320]/20",
  growth: "bg-[#07170f] text-[#b8ff5a] border-[#b8ff5a]/30",
  systems: "bg-[#e8edf0] text-[#005f73] border-[#142c38]/30",
  "ai-workflow": "bg-[#0c0a1d] text-[#947cff] border-[#947cff]/35",
};

export default function TemplatesPage() {
  return (
    <main className="bg-[#efefe9] text-[#14110e]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
        <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">展示结构库 / v0.6</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div><h1 className="max-w-5xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">展示结构不是换皮，而是决定招聘官先看到哪条证据链。</h1><p className="mt-6 max-w-3xl text-base leading-8 text-[#5b4635]">四种展示结构读取同一份作品集文件，但首页与项目页的信息顺序、区块命名和叙事入口不同。检查工具只按你已经提供的内容给出推荐，不会替你补写事实。</p></div>
          <aside className="border-l-2 border-[#c92a20] bg-[#fffaf0] p-5 text-sm leading-7 text-[#5b4635]"><strong className="block text-[#14110e]">怎么选？</strong>先看目标岗位，再看材料里真实存在的指标、实验、机制、资产、AI 工作流、评估与护栏。分数是解释工具，不是质量评级。</aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8" aria-label="四种作品集模板">
        <div className="grid gap-6 lg:grid-cols-2">
          {TEMPLATE_REGISTRY.map((template, index) => (
            <article key={template.id} id={template.id} className="border border-[#14110e]/20 bg-[#fffdf8] p-5 shadow-[7px_7px_0_rgba(20,17,14,0.08)] sm:p-7">
              <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#80654d]">0{index + 1} / {template.id}</p><h2 className="mt-2 text-3xl font-semibold">{template.name}</h2></div><span className="border border-[#14110e]/15 px-2 py-1 font-mono text-[10px] font-bold">展示结构</span></div>
              <p className="mt-5 text-sm leading-7 text-[#5b4635]"><strong className="text-[#14110e]">适合：</strong>{template.audience}</p>
              <p className="mt-3 border-l-2 border-[#c92a20] pl-4 text-sm font-semibold leading-7">{template.focus}</p>
              <div className={`mt-6 border p-4 ${previewTone[template.id as keyof typeof previewTone]}`}>
                <p className="font-mono text-[10px] font-bold tracking-[0.12em]">页面顺序预览</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">{template.homeStructure.map((item, itemIndex) => <div key={item} className="border border-current/30 bg-white/5 p-3 text-xs font-semibold"><span className="mr-2 font-mono opacity-65">0{itemIndex + 1}</span>{item}</div>)}</div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2"><div><h3 className="font-mono text-xs font-bold text-[#80654d]">项目页顺序</h3><ol className="mt-3 space-y-2 text-sm text-[#5b4635]">{template.projectStructure.map((item, itemIndex) => <li key={item}>{itemIndex + 1}. {item}</li>)}</ol></div><div><h3 className="font-mono text-xs font-bold text-[#80654d]">为什么适合</h3><ul className="mt-3 flex flex-wrap gap-2">{template.matchSignals.map((signal) => <li key={signal} className="bg-[#f4dfbd] px-2 py-1 text-xs text-[#5b4635]">{signal}</li>)}</ul></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#14110e] px-4 py-14 text-[#f8f8f3] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-7"><div><p className="font-mono text-xs font-bold text-[#d3b992]">NEXT / LOCAL CHECK</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">导入自己的作品集文件，查看四种展示结构的推荐理由。</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#d3b992]">选择结果只会写入下载文件中的展示方式；发现隐私或内容关联问题时仍会停止下载。</p></div><StaticPageLink href="/launchpad/" className="bg-[#c92a20] px-6 py-3 font-semibold text-white transition hover:bg-[#e13b30]">检查我的作品集文件 →</StaticPageLink></div>
      </section>
    </main>
  );
}
