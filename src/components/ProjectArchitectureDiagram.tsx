import type { Project } from "@/types/project";

type ArchitectureStage = {
  label: string;
  title: string;
  body: string;
};

type ArchitectureConfig = {
  title: string;
  thesis: string;
  stages: ArchitectureStage[];
  feedback: string;
};

const architectureBySlug: Record<string, ArchitectureConfig> = {
  "creator-monetization-health": {
    title: "作者变现健康度评估架构",
    thesis: "收入只是结果，健康度要同时看内容供给、变现方式和用户反馈。",
    stages: [
      { label: "输入", title: "多源变现行为", body: "品牌合作内容、交易、内容付费、服务、平台激励" },
      { label: "判断", title: "双维健康判断", body: "内容健康度 × 变现模式健康度" },
      { label: "校准", title: "人工标注校准", body: "边界样本、风险样本、口径一致性" },
      { label: "动作", title: "三方共用标准", body: "推荐、运营、商业化按同一套口径动作" },
      { label: "资产", title: "生态价值模型", body: "用于后续价值评估、治理和策略干预" },
    ],
    feedback: "这套模型的收益不是某个收入数字，而是让平台后续判断作者价值时有了统一底稿。",
  },
  "marketing-commerce-traffic-system": {
    title: "高质量商业内容流量实验架构",
    thesis: "不是凭经验给品牌合作内容加流量，而是用实验验证优质作者是否值得被放大。",
    stages: [
      { label: "输入", title: "作者价值体系 2.0", body: "内容质量、商业适配、历史表现、用户反馈" },
      { label: "分层", title: "分层与对照", body: "优质作者池、实验分组、护栏指标" },
      { label: "实验", title: "双场景实验", body: "品牌合作内容与交易内容分别验证收益" },
      { label: "动作", title: "流量机制化", body: "分层倾斜、优质加权、反馈调优" },
      { label: "资产", title: "品牌合作内容流量标准", body: "从一次实验变成可复用的分发机制" },
    ],
    feedback: "实验结果证明的是优质作者池的收入提升，不代表所有作者都获得同等提升。",
  },
  "paid-content-evaluation-typing": {
    title: "内容付费作者经营架构",
    thesis: "内容付费不是卖单篇内容，而是判断哪些作者能持续创造用户愿意付费的价值，并把验证动作做成工作流。",
    stages: [
      { label: "输入", title: "作者与内容池", body: "作者阶段、内容类型、付费信号、粉丝关系" },
      { label: "判断", title: "付费潜力判断", body: "内容稀缺性、复购可能、用户需求强度" },
      { label: "动作", title: "AI 作者挖掘", body: "生成潜力作者候选池，再由运营校准边界" },
      { label: "流量", title: "自动化流量分配", body: "冷启动验证、推荐放大、效果观察、复盘提醒" },
      { label: "资产", title: "经营工作流", body: "帮作者变现，也为平台沉淀付费内容供给" },
    ],
    feedback: "这个项目现阶段不包装成硬增长，而是展示如何把作者变现探索做成可复盘、可迭代的经营工作流。",
  },
  "image-text-recommendation-strategy": {
    title: "图文体裁价值验证架构",
    thesis: "图文不是视频补充，它要在不同场景里被独立验证。",
    stages: [
      { label: "输入", title: "图文内容供给", body: "信息密度、收藏价值、画风、标题、垂类主题" },
      { label: "场景", title: "三类场景拆解", body: "单列主推荐场景、双列发现、UGC 图文社区" },
      { label: "判断", title: "独立价值信号", body: "阅读、停留、滑动、收藏、搜索承接、负反馈" },
      { label: "动作", title: "分发与冷启动策略", body: "单列建模、双列候选、社区首次浏览承接" },
      { label: "验证", title: "规模化验证", body: "主要分发场景、频道与社区的 DAU 分别证明，具体数据已脱敏" },
    ],
    feedback: "这些结果证明图文有独立消费空间，但不代表单列、双列和社区能套同一套策略。",
  },
  "following-feed-recommendation": {
    title: "关注关系价值识别架构",
    thesis: "关注动作只是关系边，推荐真正应该放大的是仍然有效的高价值关系。",
    stages: [
      { label: "输入", title: "关注关系样本", body: "关注、互动、回访、停留、负反馈" },
      { label: "判断", title: "高价值关系定义", body: "真实兴趣、持续消费、稳定互动" },
      { label: "信号", title: "关系信号优化", body: "关系强度、时效、内容匹配、沉默关系" },
      { label: "动作", title: "推荐侧放大", body: "把有效关系转成排序和分发可用信号" },
      { label: "资产", title: "关系推荐口径", body: "让关注流量在推荐中更准确" },
    ],
    feedback: "这个项目不性感，但它把一个简单关注动作，改造成了推荐系统能使用的关系价值判断。",
  },
  "game-content-distribution": {
    title: "内容带游戏发行架构",
    thesis: "内容热不等于游戏增长，关键是把播放转成可归因的游戏行动。",
    stages: [
      { label: "输入", title: "游戏目标", body: "DAU、激活、留存、流水、版本节点" },
      { label: "作者", title: "作者任务", body: "卖点拆解、内容方向、任务激励" },
      { label: "流量", title: "人群分发", body: "高转化内容、适配人群、有效作者" },
      { label: "漏斗", title: "转化链路", body: "点击、下载、激活、留存、充值" },
      { label: "验证", title: "可归因流水", body: "平台内可归因渠道下载并充值的流水复盘" },
    ],
    feedback: "这条链路主要靠内容带发行，不是纯广告流量分配；流水口径也必须能明确归因。",
  },
  "search-quality-ai-answer": {
    title: "搜索满足度评估架构",
    thesis: "搜索不是给一堆结果，而是让用户少走弯路。",
    stages: [
      { label: "输入", title: "用户 Query", body: "事实、教程、视频、事件、可直接回答需求" },
      { label: "判断", title: "需求分型", body: "先判断用户到底想解决什么问题" },
      { label: "供给", title: "供给判断", body: "内容是否足够好、可消费、可信、时效合适" },
      { label: "动作", title: "结果策略", body: "排序调优、Top1 命中、问答式答案承接" },
      { label: "复盘", title: "满足度复盘", body: "人工评估、横向对照、bad case 归因" },
    ],
    feedback: "语义模型收益有限这件事很重要：模型能力之外，供给、评估和 Top1 命中同样决定搜索体验。",
  },
};

function getArchitecture(project: Project): ArchitectureConfig {
  return architectureBySlug[project.slug] ?? {
    title: `${project.title}策略架构`,
    thesis: project.roleContribution?.judgment ?? project.caseStudy.question,
    stages: [
      { label: "输入", title: "业务输入", body: project.background },
      { label: "判断", title: "核心判断", body: project.caseStudy.productMethod[0] },
      { label: "动作", title: "策略动作", body: project.actions[0] },
      { label: "验证", title: "结果验证", body: project.results[0] },
      { label: "资产", title: "方法资产", body: project.caseStudy.artifact.join(" / ") },
    ],
    feedback: project.caseStudy.evaluation[0] ?? project.summary,
  };
}

export function ProjectArchitectureDiagram({ project }: { project: Project }) {
  const architecture = getArchitecture(project);

  return (
    <section className="mt-5 rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
      <div className="grid gap-4 border-b border-[#14110e]/18 pb-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
            项目架构图
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal text-[#14110e]">
            {architecture.title}
          </h2>
        </div>
        <p className="rounded-[6px] border-l-4 border-[#c92a20] bg-[#fff2d8] px-4 py-3 text-[0.95rem] font-semibold leading-7 text-[#35291f]">
          {architecture.thesis}
        </p>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
        {architecture.stages.map((stage, index) => (
          <div key={stage.title} className="contents">
            <article className="min-h-36 rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-[6px] border border-[#14110e] bg-[#14110e] px-2 py-1 font-mono text-[11px] font-semibold uppercase text-[#fff8eb]">
                  {stage.label}
                </span>
                <span className="font-mono text-xs font-semibold text-[#c92a20]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-6 text-[#14110e]">
                {stage.title}
              </h3>
              <p className="mt-2 text-[0.84rem] leading-6 text-[#4b3829]">
                {stage.body}
              </p>
            </article>
            {index < architecture.stages.length - 1 ? (
              <div className="hidden items-center justify-center font-mono text-xl font-semibold text-[#c92a20] xl:flex">
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[8px] border border-[#14110e] bg-[#14110e] px-4 py-3 text-sm font-semibold leading-6 text-[#fff8eb]">
        <span className="font-mono text-[#e13024]">反馈回路：</span>
        {architecture.feedback}
      </div>
    </section>
  );
}
