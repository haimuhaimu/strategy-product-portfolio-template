import type { Metadata } from "next";
import { PilotParticipationPanel } from "@/components/pilot/PilotParticipationPanel";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PMF Pilot：把真实材料安全发布成作品集",
  description: "面向 3–8 年经验、转型 AI 或策略产品与产品运营、材料多但不会筛选证明脱敏的首批静态作品集试点。",
  pathname: "/pilot/",
  keywords: ["AI 产品经理转型", "策略产品作品集", "产品运营作品集", "PMF Pilot"],
});

const steps = [
  ["01", "导入真实材料", "从简历与零散项目材料出发，精选 3 个项目；示例体验不计入本轮真实完成。"],
  ["02", "本地审计与选模板", "在浏览器内检查结构、证据、隐私与引用，再选择最适合内容的叙事模板。"],
  ["03", "生成 Release Pack", "通过隐私与引用护栏后，下载 6 个发布文件；匿名日志始终不包含项目原文。"],
  ["04", "公开上线作品集", "自行部署到静态平台并确认公开。只记录平台枚举，不要求输入或保存 URL。"],
] as const;

export default function PilotPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <section className="grid gap-8 border-b border-[#14110e]/20 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">PMF PILOT / v0.6 / NO CLAIMED RESULTS</p>
          <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold leading-tight text-[#14110e] sm:text-6xl">把“材料很多”推进到一份安全公开的作品集。</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5b4635]">首批聚焦：有 3–8 年经验，正在转型 AI / 策略产品或产品运营，材料不少但不知道如何筛选、证明与脱敏的人。这里不宣称已有试点用户或验证效果。</p>
        </div>
        <aside className="border-l-4 border-[#c92a20] bg-[#fff8df] p-5 text-sm leading-7 text-[#6f4a0c]">
          <strong className="block text-[#14110e]">本轮成功 gate</strong>
          完成真实材料导入、生成 Release Pack，并公开上线作品集。投递与面试是后续强信号，但不要求本轮必达。
        </aside>
      </section>

      <PilotParticipationPanel />

      <section className="mt-14" aria-labelledby="pilot-flow-title">
        <p className="font-mono text-xs font-bold text-[#80654d]">PILOT FLOW</p>
        <h2 id="pilot-flow-title" className="mt-2 text-3xl font-semibold">一轮试点只走四步</h2>
        <ol className="mt-6 grid gap-4 lg:grid-cols-4">
          {steps.map(([index, title, detail]) => (
            <li key={index} className="border border-[#14110e]/20 bg-[#f8f8f3] p-5">
              <span className="font-mono text-sm font-bold text-[#c92a20]">{index}</span>
              <h3 className="mt-8 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6e5743]">{detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 grid gap-px border border-[#14110e]/20 bg-[#14110e]/20 lg:grid-cols-3" aria-label="成功定义与隐私承诺">
        <article className="bg-white p-6">
          <p className="font-mono text-xs font-bold text-[#c92a20]">SUCCESS</p>
          <h2 className="mt-2 text-xl font-semibold">单轮可验证成功</h2>
          <p className="mt-3 text-sm leading-7 text-[#5b4635]">真实材料导入成功 + Release Pack 生成 + 公开上线确认。三项均可由本地枚举事件判断，无需收集作品 URL。</p>
        </article>
        <article className="bg-white p-6">
          <p className="font-mono text-xs font-bold text-[#c92a20]">STRONG SIGNALS</p>
          <h2 className="mt-2 text-xl font-semibold">投递与面试不作硬门槛</h2>
          <p className="mt-3 text-sm leading-7 text-[#5b4635]">是否投递、是否获得面试及反馈枚举可以自愿记录，用于后续判断；不会把招聘周期强行压进本轮。</p>
        </article>
        <article className="bg-white p-6">
          <p className="font-mono text-xs font-bold text-[#c92a20]">PRIVACY</p>
          <h2 className="mt-2 text-xl font-semibold">内容留在你的浏览器</h2>
          <p className="mt-3 text-sm leading-7 text-[#5b4635]">材料只进入当前页面内存；试点日志默认关闭、明确 opt-in、7 天过期、可一键清空。禁止自由文本、URL、公司名、联系方式与项目原文。</p>
        </article>
      </section>

      <section className="mt-14 border-t border-[#14110e]/20 pt-8">
        <h2 className="text-2xl font-semibold">这轮暂不适合谁</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-7 text-[#5b4635] sm:grid-cols-2">
          <li className="border-l-2 border-[#80654d] pl-4">只想自动美化排版、不准备核对事实与证据的人。</li>
          <li className="border-l-2 border-[#80654d] pl-4">希望上传原始简历、内部材料或敏感指标到第三方服务的人。</li>
          <li className="border-l-2 border-[#80654d] pl-4">还没有任何可公开项目材料，且本轮不准备补充的人。</li>
          <li className="border-l-2 border-[#80654d] pl-4">期待保证获得投递、面试或 offer 结果的人。</li>
        </ul>
      </section>
    </main>
  );
}
