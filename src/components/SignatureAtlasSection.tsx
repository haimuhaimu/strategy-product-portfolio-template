import { PersonalRoadmap } from "@/components/PersonalRoadmap";
import { StaticPageLink } from "@/components/StaticPageLink";
import { ThinkingStarMap } from "@/components/ThinkingStarMap";
import type { RoadmapStage, StarMap } from "@/types/project";

export function SignatureAtlasSection({ roadmap, starMap }: { roadmap: RoadmapStage[]; starMap: StarMap }) {
  return (
    <section className="signature-atlas mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16" aria-labelledby="signature-atlas-title" data-motion-section>
      <div className="atlas-register" aria-hidden="true"><span>36°N</span><span>FIELD 02</span><span>116°E</span></div>
      <div className="grid gap-8 border-y border-[#242320]/25 py-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-[#1437d6]">SIGNATURE ATLAS · 个人认知坐标</p>
          <h2 id="signature-atlas-title" className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] text-[#242320] sm:text-5xl">
            判断不是标签，<br />而是一条可追溯的轨迹。
          </h2>
        </div>
        <div className="lg:pb-1">
          <p className="max-w-2xl text-base leading-8 text-[#55534d]">
            从发现问题、定义口径到实验、机制与 AI 协作；每个节点都回到三个真实项目，不把能力词留在空中。
          </p>
          <StaticPageLink href="/thinking/" className="mt-5 inline-flex items-center gap-3 border-b-2 border-[#d84b28] pb-1 font-mono text-sm font-bold text-[#242320] transition hover:gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6]">
            进入完整思考星图 <span aria-hidden="true">↗</span>
          </StaticPageLink>
        </div>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="atlas-preview-card p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div><p className="atlas-kicker">ROUTE / 05 STAGES</p><h3 className="mt-2 text-xl font-semibold">个人路线图</h3></div>
            <span className="atlas-symbol text-[#9a6818]">⌁</span>
          </div>
          <PersonalRoadmap stages={roadmap} compact />
        </article>
        <article className="atlas-preview-card p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div><p className="atlas-kicker">CONSTELLATION / REAL LINKS</p><h3 className="mt-2 text-xl font-semibold">思考星图</h3></div>
            <span className="atlas-symbol text-[#d84b28]">✦</span>
          </div>
          <ThinkingStarMap map={starMap} compact />
        </article>
      </div>
    </section>
  );
}
