import type { Metadata } from "next";
import { PersonalRoadmap } from "@/components/PersonalRoadmap";
import { StaticPageLink } from "@/components/StaticPageLink";
import { ThinkingStarMap } from "@/components/ThinkingStarMap";
import { getRoadmap, getStarMap } from "@/lib/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "证据驱动的产品思考路线图",
  description: "把用户价值、评估、实验、机制与 AI 协作连接到三个项目证据，呈现策略产品经理的能力演进。",
  pathname: "/thinking/",
  keywords: ["策略产品经理", "证据驱动作品集"],
});

export default function ThinkingPage() {
  const roadmap = getRoadmap();
  const starMap = getStarMap();

  return (
    <main className="thinking-atlas-page">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-7 sm:px-8 sm:pb-16">
        <StaticPageLink href="/" className="atlas-back-link">← INDEX.HTML / 返回首页</StaticPageLink>
        <div className="atlas-hero mt-6">
          <div className="atlas-register" aria-hidden="true"><span>ARCHIVE 02</span><span>COGNITIVE CARTOGRAPHY</span><span>LIVE TRACE</span></div>
          <div className="grid gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="atlas-kicker text-[#1437d6]">FUTURE ARCHAEOLOGY / 思考不是宣言，是遗迹之间的关系</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-[#242320] sm:text-7xl">个人路线图<br />与思考星图</h1>
            </div>
            <p className="border-l-2 border-[#d84b28] pl-5 text-sm leading-7 text-[#55534d]">
              它把个人认知操作系统还原为可查证的关系，而不是一条虚构的职业时间线：只记录三个项目中已经出现的发现问题、定义口径、实验验证、机制化与 AI 协作。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-16" aria-labelledby="roadmap-title">
        <div className="atlas-section-heading"><p>PLATE A / EVOLUTION TRACE</p><h2 id="roadmap-title">个人路线图</h2><span>用方向键浏览节点</span></div>
        <div className="mt-8"><PersonalRoadmap stages={roadmap} /></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-16" aria-labelledby="star-map-title">
        <div className="atlas-section-heading"><p>PLATE B / RELATIONSHIP FIELD</p><h2 id="star-map-title">思考星图</h2><span>聚焦节点以查看真实连接</span></div>
        <div className="mt-8"><ThinkingStarMap map={starMap} /></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="border-t border-[#242320]/20 pt-6 font-mono text-xs leading-6 text-[#6b685f]">
          读取说明：蓝色为能力节点，朱砂橙为项目节点；连线只表示作品集中可追溯的方法关系，不表示未经确认的因果或业绩归因。
        </div>
      </section>
    </main>
  );
}
