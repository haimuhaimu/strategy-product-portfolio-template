import Link from "next/link";
import type { Project } from "@/types/project";

type FeaturedProjectShowcaseProps = {
  projects: Project[];
};

const featuredSlugs = [
  "creator-monetization-health",
  "image-text-recommendation-strategy",
  "search-quality-ai-answer",
];

const cardThemes = [
  {
    accent: "bg-[#c92a20]",
    badge: "border-[#8b3a28]/30 bg-[#f8ead0] text-[#c92a20]",
    metric: "text-[#c92a20]",
    hover: "hover:border-[#c92a20]",
  },
  {
    accent: "bg-[#c92a20]",
    badge: "border-[#8b3a28]/30 bg-[#f8ead0] text-[#c92a20]",
    metric: "text-[#c92a20]",
    hover: "hover:border-[#c92a20]",
  },
  {
    accent: "bg-[#c92a20]",
    badge: "border-[#8b3a28]/30 bg-[#f8ead0] text-[#c92a20]",
    metric: "text-[#c92a20]",
    hover: "hover:border-[#c92a20]",
  },
];

const cardCopy: Record<
  string,
  {
    hypothesis: string;
    split: string;
    artifact: string;
    chips: string[];
  }
> = {
  "creator-monetization-health": {
    hypothesis: "作者变现不是收入越高越好，问题是它能否在不透支用户信任的前提下持续创收。",
    split: "拆成内容健康度、变现模式健康度和五类变现来源，用人工标注校准边界样本。",
    artifact: "推动作者变现从收入排序，变成推荐、运营、商业化都能使用的健康度口径。",
    chips: ["作者价值", "健康变现", "人工标注"],
  },
  "marketing-commerce-traffic-system": {
    hypothesis: "优质商业内容不一定伤害体验，关键是证明给优质作者更多流量是否真的有增量。",
    split: "商单、交易内容分开实验，区分作者收入、用户体验、供给变化和平台商业效率。",
    artifact: "把商单流量从经验扶持，推进到可实验、可分层、可持续迭代的流量策略。",
    chips: ["分组实验", "商单适配", "作者分层"],
  },
  "paid-content-evaluation-typing": {
    hypothesis: "内容付费能否成立，取决于作者、内容和用户需求是否真的匹配。",
    split: "拆作者生命周期、内容稀缺性、付费意愿和流量冷启动，看哪些供给值得被验证。",
    artifact: "在探索期把作者挖掘、流量验证、自动化投流和经营复盘做成工作流。",
    chips: ["内容付费", "作者挖掘", "AI 投流"],
  },
  "image-text-recommendation-strategy": {
    hypothesis: "图文不是视频的补充体裁，它在单列、双列和 UGC 社区里有不同的独立价值。",
    split: "拆消费场景、内容供给和推荐目标，分别验证图文在主端与社区里的增长空间。",
    artifact: "推动图文从“视频补充体裁”，变成可独立评估和分发的内容形态。",
    chips: ["图文体裁", "多场景推荐", "DAU 百万级增量"],
  },
  "following-feed-recommendation": {
    hypothesis: "关注不只是一次社交动作，真正有价值的是后续仍然能带来消费和互动的关系。",
    split: "拆关注后的观看、互动、回访和负反馈，把冷关系和有效关系分开看。",
    artifact: "让关注关系从静态边，变成推荐系统里可校准、可放大的关系信号。",
    chips: ["关系价值", "推荐信号", "DAU 正向增量"],
  },
  "search-quality-ai-answer": {
    hypothesis: "搜索不只是给结果列表，部分需求需要更直接、更可信的答案满足。",
    split: "拆 Query 类型、Top1 命中、答案覆盖和结果可信度，区分适合回答和不适合回答的需求。",
    artifact: "把搜索质量从结果排序，延伸到问答式满足和答案质量评估。",
    chips: ["需求分型", "答案质量", "双位数比例 覆盖"],
  },
  "game-content-distribution": {
    hypothesis: "内容可以成为游戏发行链路，但播放热度不等于下载、激活和充值增长。",
    split: "拆小游戏、重度游戏、内容场景和渠道归因，重点看从内容到下载充值的真实链路。",
    artifact: "推动游戏内容从消费流量，变成能承接发行和转化的内容分发模式。",
    chips: ["内容发行", "归因链路", "转化线索"],
  },
};

export function FeaturedProjectShowcase({ projects }: FeaturedProjectShowcaseProps) {
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const featuredProjects = featuredSlugs
    .map((slug) => projectBySlug.get(slug))
    .filter((project): project is Project => Boolean(project));
  const archiveProjects = projects.filter(
    (project) => !featuredSlugs.includes(project.slug),
  );

  return (
    <section id="projects" className="mx-auto max-w-[1680px] scroll-mt-24 px-4 py-5 sm:scroll-mt-28 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-3 shadow-[0_20px_58px_rgba(20,17,14,0.12)] sm:p-4">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#14110e]/18 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-[6px] border border-[#c92a20]/35 bg-[#14110e] font-mono text-xs font-semibold text-[#e13024]">
              Case
            </span>
            <h2 className="font-mono text-base font-semibold uppercase tracking-normal text-[#14110e] sm:text-lg">
              我做过的真实业务判断
            </h2>
          </div>
          <Link
            href="/#project-archive"
            className="font-mono text-sm font-semibold uppercase text-[#c92a20] transition hover:text-[#14110e]"
          >
            全部项目 →
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCaseCard
              key={project.slug}
              project={project}
              meta={cardCopy[project.slug]}
              theme={cardThemes[index % cardThemes.length]}
            />
          ))}
        </div>

        {archiveProjects.length > 0 ? (
          <div
            id="project-archive"
            className="mt-4 scroll-mt-24 border-t border-[#14110e]/18 pt-4 sm:scroll-mt-28"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-mono text-xs font-semibold uppercase text-[#14110e] sm:text-sm">
                其他项目索引
              </h3>
              <p className="hidden text-sm text-[#80654d] sm:block">
                不平均铺项目，先看每个方向解决了什么真实问题。
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {archiveProjects.map((project) => (
                <ArchiveProjectLink key={project.slug} project={project} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCaseCard({
  project,
  meta,
  theme,
}: {
  project: Project;
  meta: {
    hypothesis: string;
    split: string;
    artifact: string;
    chips: string[];
  };
  theme: (typeof cardThemes)[number];
}) {
  const primaryMetric = project.metrics[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative flex min-h-[21.5rem] flex-col justify-between overflow-hidden rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4 shadow-[0_14px_34px_rgba(20,17,14,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(20,17,14,0.13)] ${theme.hover}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${theme.accent}`} />
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              代表项目
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-6 text-[#14110e] sm:text-xl sm:leading-7">
              {project.title}
            </h3>
          </div>
          <div className={`grid size-9 shrink-0 place-items-center rounded-[6px] border font-mono text-xs font-semibold ${theme.badge}`}>
            {String(project.order).padStart(2, "0")}
          </div>
        </div>

        <div className="mt-4 space-y-2.5 text-[0.86rem] leading-[1.62] text-[#35291f]">
          <Line label="真实问题" text={meta.hypothesis} />
          <Line label="拆解方式" text={meta.split} />
          <Line label="留下能力" text={meta.artifact} />
        </div>
      </div>

      <div>
        {primaryMetric ? (
          <div className="mt-4 border-t border-[#8b3a28]/18 pt-3">
            <p className={`font-mono text-lg font-semibold ${theme.metric}`}>
              {primaryMetric.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#80654d]">
              {primaryMetric.label}
            </p>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meta.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-[6px] border border-[#8b3a28]/16 bg-[#f8ead0] px-2 py-1 text-[0.72rem] font-semibold text-[#5b4635]"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="mt-3 font-mono text-sm font-semibold uppercase text-[#c92a20] transition group-hover:translate-x-1">
          看详情 →
        </p>
      </div>
    </Link>
  );
}

function Line({ label, text }: { label: string; text: string }) {
  return (
    <p>
      <span className="mr-2 rounded-[4px] border border-[#8b3a28]/16 bg-[#fff8eb] px-1.5 py-0.5 text-[0.72rem] font-semibold text-[#c92a20]">
        {label}：
      </span>
      {text}
    </p>
  );
}

function ArchiveProjectLink({ project }: { project: Project }) {
  const meta = cardCopy[project.slug];
  const primaryMetric = project.metrics[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex min-h-[8.5rem] flex-col justify-between rounded-[6px] border border-[#8b3a28]/16 bg-[#fffdf8] px-3.5 py-3 transition hover:-translate-y-0.5 hover:border-[#c92a20]/60 hover:bg-[#fff2d8]"
    >
      <span>
        <span className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
          {String(project.order).padStart(2, "0")} / 项目索引
        </span>
        <span className="mt-2 block text-[0.96rem] font-semibold leading-6 text-[#14110e]">
          {project.title}
        </span>
        <span className="mt-2 block text-[0.84rem] leading-5 text-[#4b3829]">
          {meta?.hypothesis ?? project.summary}
        </span>
      </span>
      <span className="mt-3 flex items-center justify-between gap-3 border-t border-[#8b3a28]/18 pt-3">
        <span className="text-xs font-semibold text-[#80654d]">
          {primaryMetric ? `${primaryMetric.value} ${primaryMetric.label}` : project.domain}
        </span>
        <span className="shrink-0 font-mono text-xs font-semibold text-[#c92a20]">
          详情 →
        </span>
      </span>
    </Link>
  );
}
