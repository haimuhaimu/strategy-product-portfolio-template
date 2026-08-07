import Link from "next/link";
import type { Project } from "@/types/project";
import { CreatorHealthOnePage } from "@/components/CreatorHealthOnePage";
import { FollowingRelationshipOnePage } from "@/components/FollowingRelationshipOnePage";
import { GameContentGrowthOnePage } from "@/components/GameContentGrowthOnePage";
import { ImageTextStrategyOnePage } from "@/components/ImageTextStrategyOnePage";
import { MarketingTrafficOnePage } from "@/components/MarketingTrafficOnePage";
import { MembershipBusinessOnePage } from "@/components/MembershipBusinessOnePage";
import { SearchQualityOnePage } from "@/components/SearchQualityOnePage";
import { GenericProjectDetail } from "@/components/GenericProjectDetail";

type ProjectDetailProps = {
  project: Project;
};

type NarrativeStep = {
  title: string;
  body: string;
};

type ProjectNarrative = {
  openingTitle: string;
  openingParagraphs: string[];
  openingHighlight: string;
  aiTitle: string;
  aiLead: string;
  aiSteps: NarrativeStep[];
  aiClosing: string;
};

const projectNarratives: Record<string, ProjectNarrative> = {
  "creator-monetization-health": {
    openingTitle: "这个项目要解决的，不是作者能不能赚钱。",
    openingParagraphs: [
      "更准确地说，它要回答的是：平台怎么判断一种赚钱方式，值不值得被继续放大。",
      "有些作者收入很高，但内容越来越营销，用户信任也在被消耗；也有些作者短期收入不强，但内容稳定、关系健康，反而更值得长期扶持。",
      "所以我没有只看收入，而是把作者变现拆成内容健康度、变现模式健康度和用户反馈，再用人工标注去校准判断口径。",
      "最后这套标准让推荐、运营和商业化可以围绕同一套作者分层做动作，而不是各自拿一套指标说话。",
    ],
    openingHighlight:
      "这个项目最重要的结果，不是某个收入数字，而是沉淀了一套机制和标准；在过度营销场景下，它已经承接为识别模型和治理动作。",
    aiTitle: "如果今天重做，我会把它做成作者健康度诊断工具。",
    aiLead:
      "前提不是让 AI 替平台拍脑袋，而是先把“健康变现”的标准、反例和边界样本讲清楚。AI 适合放大这套判断，但不适合绕过这套判断。",
    aiSteps: [
      {
        title: "AI 先做初筛",
        body: "把内容样本、变现行为、收入结构和用户反馈放在一起，先识别健康、风险、反感、承接弱等作者状态。",
      },
      {
        title: "人看边界样本",
        body: "高收入但伤体验、低收入但有长期价值，这类 case 不能直接交给模型定性，要继续用人工复核校准口径。",
      },
      {
        title: "沉淀诊断工具",
        body: "面向运营和管理者，输入作者或作者群，输出变现方式、所处阶段、主要问题和下一步经营建议。",
      },
    ],
    aiClosing: "AI 在这里不是替人判断，而是把已经讲清楚的判断标准放大。",
  },
  "marketing-commerce-traffic-system": {
    openingTitle: "这个项目要解决的，不是给商业内容更多流量。",
    openingParagraphs: [
      "当时真正的矛盾是：优质作者商单少、流量少、收入低，但平台也不能简单把商业内容往外推，因为用户体验会受影响。",
      "我当时要回答的是，什么样的作者值得拿到更多商单流量，以及这个判断能不能被实验验证。",
      "所以我把问题拆成作者价值体系、商单场景实验、交易内容场景实验和用户侧护栏，先证明方向成立，再推动机制化落地。",
      "商单收入 +X%、交易内容 VV +Y%、GMV +Z%，证明的是优质作者样本在实验里成立，不代表全量作者收入都发生了同样变化。",
    ],
    openingHighlight:
      "这个项目最后留下来的，不是一次流量倾斜，而是一套从作者价值识别、实验验证到商业内容分发机制的判断链路。",
    aiTitle: "如果今天重做，我会把它做成优质商业内容实验工作流。",
    aiLead:
      "AI 不应该替平台决定多卖流量，而是帮团队更快找到候选作者、生成实验方案、盯住用户体验护栏。",
    aiSteps: [
      {
        title: "AI 找候选作者",
        body: "结合作者内容质量、商单承接、历史表现和用户反馈，先筛出可能适合流量倾斜的优质作者池。",
      },
      {
        title: "人定实验边界",
        body: "商业化收益不能单独决定策略，仍然要由人明确样本、分组、护栏指标和停止条件。",
      },
      {
        title: "沉淀投流工作流",
        body: "把作者筛选、实验分组、指标观察和复盘结论做成可复用流程，支撑后续商单和交易内容策略迭代。",
      },
    ],
    aiClosing: "AI 在这里不是证明商业内容都该放大，而是让“哪些商业内容值得放大”更快被验证。",
  },
  "paid-content-evaluation-typing": {
    openingTitle: "这个项目要解决的，不是普通会员运营。",
    openingParagraphs: [
      "精选会员本质上是一类内容付费模式，用户需要花钱解锁内容，这和普通流量增长不是一回事。",
      "我主要做的是作者挖掘和流量策略：哪些作者有持续供给付费内容的潜力，哪些内容值得先被小流量验证。",
      "这个方向还没有拿到特别硬的规模结果，所以不能包装成已经打穿业务。",
      "更准确地说，它的价值在于把作者筛选、付费潜力判断、投流观察和复盘动作从运营经验里拆出来，开始工具化。",
    ],
    openingHighlight:
      "这个项目现在最重要的不是证明规模成功，而是为作者变现业务沉淀一套内容付费作者挖掘和流量验证方法。",
    aiTitle: "如果今天重做，我会把它做成付费作者挖掘与投流自动化工具。",
    aiLead:
      "内容付费不能只靠运营感觉挑人。AI 可以先扩大候选作者发现，但是否值得付费、能否长期供给，仍然需要人定义标准。",
    aiSteps: [
      {
        title: "AI 扩大作者发现",
        body: "根据内容垂类、粉丝关系、用户需求强度和历史供给稳定性，识别可能适合精选会员的作者。",
      },
      {
        title: "人判断付费成立",
        body: "付费不是把免费内容上锁，要判断用户为什么愿意付钱：确定性、稀缺性、陪伴关系还是专业价值。",
      },
      {
        title: "沉淀投流自动化",
        body: "把小流量验证、投放观察、转化表现和复盘建议串起来，减少运营反复手工筛选和试错。",
      },
    ],
    aiClosing: "AI 在这里不是把探索说成成功，而是让探索过程更快暴露信号和边界。",
  },
  "image-text-recommendation-strategy": {
    openingTitle: "这个项目要解决的，不是给图文补一点流量。",
    openingParagraphs: [
      "作为图文业务早期成员，我当时面对的真实问题是：图文在内容平台里很容易被当成视频的补充体裁。",
      "但单列、双列和 UGC 社区里的图文不是同一个问题：单列看它能不能进入主推荐，双列看它适不适合浏览和比较，社区看它能不能长出稳定供给和关系消费。",
      "所以我没有直接问“图文能不能涨 DAU”，而是拆消费场景、内容供给和推荐目标，先证明图文是不是值得被独立评估和分发。",
      "图文 DAU 百万级增量、频道 DAU 千万级规模、社区 DAU 百万级规模，说明图文不是视频的低配形态，但也不代表所有图文都应该被放大。",
    ],
    openingHighlight:
      "这个项目留下来的，是一套判断新内容形态能不能成立的方法：先拆场景，再看供给，再验证推荐目标。",
    aiTitle: "如果今天重做，我会把它做成图文价值评估与分发诊断工具。",
    aiLead:
      "AI 可以帮助理解图文的信息密度、收藏价值和搜索承接，但不能用一套视频指标直接套图文。",
    aiSteps: [
      {
        title: "AI 理解图文价值",
        body: "识别图文里的步骤、清单、经验、情绪表达和可收藏信息，区分它是适合单列、双列还是社区消费。",
      },
      {
        title: "人定义场景目标",
        body: "单列、双列、UGC 社区的目标不同，仍然要由人确定评价口径和流量目标，避免图文被视频逻辑误判。",
      },
      {
        title: "沉淀分发工作流",
        body: "把图文内容分型、供给识别、推荐目标和冷启策略做成诊断工具，帮助新体裁更快找到合适场景。",
      },
    ],
    aiClosing: "AI 在这里不是替图文找漂亮标签，而是把不同场景里的图文价值识别得更清楚。",
  },
  "following-feed-recommendation": {
    openingTitle: "这个项目要解决的，不是关注按钮有没有被点。",
    openingParagraphs: [
      "这个项目不算性感。它不是新业务，也不是大增长战役，但它解决的是推荐系统里一个很底层的问题。",
      "用户点了关注，只能说明当时建立了一条关系边，不代表这条关系后来一直有消费价值。",
      "我当时的判断是，推荐系统应该放大真关系，而不是把所有关注都当成稳定兴趣。",
      "最后关注关系流量贡献 DAU 正向增量，这个数字不夸张，但它说明关系信号变得更准确，弱关系对用户的打扰减少了。",
    ],
    openingHighlight:
      "这个项目最后留下来的，不是一次关注流优化，而是一套判断“什么关系值得推荐侧继续使用”的口径。",
    aiTitle: "如果今天重做，我会把它做成关系价值诊断工具。",
    aiLead:
      "AI 可以帮助发现关系衰减和弱关系噪声，但不能把一次关注直接解释成长期兴趣。",
    aiSteps: [
      {
        title: "AI 识别关系状态",
        body: "根据互动、观看、停留、回访和负反馈，识别一条关注关系是活跃、衰减、误关注还是弱关系。",
      },
      {
        title: "人定义真关系",
        body: "哪些关系值得继续放大，哪些关系应该降噪，需要结合用户体验和推荐目标来定边界。",
      },
      {
        title: "沉淀关系信号工具",
        body: "把关系强度、衰减节奏和推荐使用方式做成诊断结果，供关注流、推荐和推人策略使用。",
      },
    ],
    aiClosing: "AI 在这里不是替用户决定关系，而是帮助推荐系统少放大无效关系。",
  },
  "game-content-distribution": {
    openingTitle: "这个项目要解决的，不是游戏内容能不能热。",
    openingParagraphs: [
      "游戏内容天然容易有播放，但游戏业务真正要的是激活、留存和可归因流水。",
      "当时更主要的增长链路是内容带发行，而不是纯广告投流；所以关键不是让内容热，而是让一次观看有机会变成一次游戏行动。",
      "我的工作是把游戏发行目标翻译成作者任务、内容供给和推荐策略，再用可归因下载和充值去验证链路。",
      "小游戏 DAU 百万级规模、重度游戏日激活 万级规模、平台内可归因渠道年流水 数亿级，指向的是内容带发行链路的有效性，不是泛泛的曝光增长。",
    ],
    openingHighlight:
      "这个项目留下来的，是一套把游戏发行目标翻译成内容平台动作的增长漏斗。",
    aiTitle: "如果今天重做，我会把它做成游戏内容增长诊断工具。",
    aiLead:
      "AI 可以更快识别爆款内容形态和潜在转化信号，但游戏增长仍然要看内容热度有没有进入激活和付费链路。",
    aiSteps: [
      {
        title: "AI 识别内容打法",
        body: "从超休闲、棋牌、重度游戏等内容里识别题材、玩法展示、情绪点和转化钩子，先找出高潜内容形态。",
      },
      {
        title: "人校准增长目标",
        body: "播放不是最终目标，不同游戏要看激活、留存、充值或回流，人要定义什么内容信号值得被推荐放大。",
      },
      {
        title: "沉淀发行工作流",
        body: "把作者任务、内容分发、点击下载、激活和充值归因串起来，形成内容带游戏发行的诊断看板。",
      },
    ],
    aiClosing: "AI 在这里不是找更热的内容，而是帮助判断什么内容真的能带动游戏行动。",
  },
  "search-quality-ai-answer": {
    openingTitle: "这个项目要解决的，不是搜索结果看起来多丰富。",
    openingParagraphs: [
      "这个项目不是今天意义上的大模型搜索项目。当时没有现在的大模型叙事，也做过 BERT 等模型探索，但收益并不总是靠模型名解决。",
      "真正要回答的问题很朴素：用户搜完以后，到底有没有少走弯路，问题有没有被解决。",
      "所以我把搜索满足拆成 Query 意图、内容供给、排序结果、Top1 命中和问答式结果，让搜索质量从“有结果”变成“有满足”。",
      "问答式结果 Top1 精准命中覆盖双位数比例的搜索需求，这个量级说明有一部分需求适合直接答案，但不代表所有搜索都应该问答化。",
    ],
    openingHighlight:
      "这个项目留下来的，不是一个 AI 概念，而是一套搜索满足度评估、bad case 归因和答案命中判断口径。",
    aiTitle: "如果今天重做，我会把它做成搜索满足度与答案质量评估工具。",
    aiLead:
      "今天可以接到 LLM 评估、RAG 和答案质量判断，但前提仍然是先定义什么叫“搜完被满足”。",
    aiSteps: [
      {
        title: "AI 批量归因 bad case",
        body: "让模型辅助判断问题出在 Query 理解、供给缺口、排序错误、Top1 不准还是答案不可信。",
      },
      {
        title: "人定义满足标准",
        body: "哪些搜索需要直接答案，哪些需要视频结果，哪些需要多结果比较，这个边界不能只靠模型自动决定。",
      },
      {
        title: "沉淀答案评估工具",
        body: "把搜索满足度、Top1 命中、答案可信度和 RAG 证据链做成评估工作流，服务搜索策略迭代。",
      },
    ],
    aiClosing: "AI 在这里不是把搜索包装成问答，而是帮助更稳定地判断用户有没有真的被满足。",
  },
};

function getNarrative(project: Project) {
  return projectNarratives[project.slug];
}

function splitProjectTitle(title: string) {
  const slashIndex = title.indexOf(" / ");
  if (slashIndex > 0) {
    return [title.slice(0, slashIndex + 2).trim(), title.slice(slashIndex + 3).trim()];
  }

  const conjunctionIndex = title.indexOf("与");
  if (title.length > 12 && conjunctionIndex > 3) {
    return [
      title.slice(0, conjunctionIndex + 1).trim(),
      title.slice(conjunctionIndex + 1).trim(),
    ];
  }

  if (title.length > 14) {
    return [title.slice(0, 10).trim(), title.slice(10).trim()];
  }

  return [title];
}

function ProjectOnePage({ project }: { project: Project }) {
  if (project.slug === "creator-monetization-health") return <CreatorHealthOnePage />;
  if (project.slug === "marketing-commerce-traffic-system") return <MarketingTrafficOnePage />;
  if (project.slug === "paid-content-evaluation-typing") return <MembershipBusinessOnePage />;
  if (project.slug === "image-text-recommendation-strategy") return <ImageTextStrategyOnePage />;
  if (project.slug === "following-feed-recommendation") return <FollowingRelationshipOnePage />;
  if (project.slug === "game-content-distribution") return <GameContentGrowthOnePage />;
  if (project.slug === "search-quality-ai-answer") return <SearchQualityOnePage />;
  return null;
}

function MiniTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[6px] border border-[#8b3a28]/25 bg-[#f8ead0] px-3 py-2 text-[0.84rem] font-semibold text-[#5b4635]">
      {children}
    </span>
  );
}

function ProjectOpening({ narrative }: { narrative: ProjectNarrative }) {
  return (
    <section className="mt-5 rounded-[8px] border border-[#14110e] bg-[#14110e] p-4 text-[#fff8eb] shadow-[0_18px_48px_rgba(20,17,14,0.16)] sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[12rem_1fr]">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
            开场判断
          </p>
          <h2 className="mt-3 text-xl font-semibold leading-tight text-[#fff8eb]">
            {narrative.openingTitle}
          </h2>
        </div>

        <div className="space-y-3 text-[0.95rem] leading-7 text-[#f8ead0]">
          {narrative.openingParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="rounded-[6px] border-l-4 border-[#e13024] bg-[#1a1411] px-4 py-3 font-semibold text-[#fff8eb]">
            {narrative.openingHighlight}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProjectAiRedo({ narrative }: { narrative: ProjectNarrative }) {
  return (
    <section className="mt-5 rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
      <div className="grid gap-5 border-b border-[#14110e]/18 pb-5 lg:grid-cols-[12rem_1fr]">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
            AI 时代怎么做
          </p>
          <h2 className="mt-3 text-xl font-semibold leading-tight text-[#14110e]">
            {narrative.aiTitle}
          </h2>
        </div>
        <p className="text-[0.95rem] leading-7 text-[#4b3829]">
          {narrative.aiLead}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {narrative.aiSteps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-[6px] border border-[#14110e] bg-[#14110e] font-mono text-xs font-semibold text-[#fff8eb]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-semibold text-[#14110e]">
                {step.title}
              </h3>
            </div>
            <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">
              {step.body}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-4 rounded-[6px] border-l-4 border-[#c92a20] bg-[#14110e] px-4 py-3 text-[0.95rem] font-semibold leading-7 text-[#fff8eb]">
        {narrative.aiClosing}
      </p>
    </section>
  );
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const narrative = getNarrative(project);
  const judgment =
    project.roleContribution?.judgment ?? project.caseStudy.productMethod[0];
  const titleLines = splitProjectTitle(project.title);

  return (
    <main className="case-file-page mx-auto max-w-[1680px] px-4 py-6 sm:px-8 lg:py-8">
      <Link
        href="/#projects"
        className="inline-flex rounded-[6px] border border-[#14110e]/45 bg-[#fff8eb] px-4 py-2 font-mono text-sm font-semibold uppercase text-[#c92a20] shadow-[0_10px_24px_rgba(20,17,14,0.08)] transition hover:-translate-y-0.5 hover:border-[#8b3a28]"
      >
        ← 返回项目目录
      </Link>

      <section className="mt-5 rounded-[8px] border border-[#14110e] bg-[#fff8eb] p-4 shadow-[0_20px_58px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
          <div className="rounded-[6px] border border-dashed border-[#b75a3a]/45 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[6px] border border-[#c92a20]/35 bg-[#14110e] px-3 py-1 font-mono text-xs font-semibold uppercase text-[#e13024]">
                Case File {String(project.order).padStart(2, "0")}
              </span>
              <MiniTag>{project.domain}</MiniTag>
              <MiniTag>{project.period}</MiniTag>
              <MiniTag>{project.company}</MiniTag>
            </div>

            <h1 className="mt-6 [font-family:var(--font-display)] text-[2.05rem] font-semibold leading-[1.14] tracking-normal text-[#14110e] sm:text-5xl xl:text-[3.1rem]">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-4xl text-[0.98rem] leading-7 text-[#4b3829] sm:text-base sm:leading-8">
              {project.subtitle}
            </p>

            <div className="mt-5 rounded-[6px] border-l-4 border-[#c92a20] bg-[#fff2d8] px-4 py-3">
              <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
                我的判断
              </p>
              <p className="mt-2 text-[0.95rem] font-semibold leading-7 text-[#14110e]">
                {judgment}
              </p>
            </div>

            <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
              {project.keywords.map((keyword) => (
                <MiniTag key={keyword}>{keyword}</MiniTag>
              ))}
            </div>
          </div>

          <aside className="rounded-[8px] border border-[#14110e] bg-[#14110e] p-4 text-[#fff8eb]">
            <div className="mb-3 flex items-center justify-between border-b border-[#c92a20]/45 pb-3">
              <p className="font-mono text-sm font-semibold uppercase text-[#e13024]">
                核心指标
              </p>
              <span className="hidden font-mono text-xs text-[#d3b992] sm:inline">
                适合截图
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {project.metrics.map((metric) => (
                <div
                  key={`${metric.label}-${metric.value}`}
                  className="rounded-[8px] border border-[#8b3a28]/70 bg-[#1a1411] p-4"
                >
                  <div className="font-mono text-2xl font-semibold tracking-normal text-[#e13024]">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-sm leading-5 text-[#d3b992]">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[8px] border border-[#8b3a28]/70 bg-[#1a1411] p-4">
              <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
                方法资产
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.caseStudy.artifact.map((asset) => (
                  <span
                    key={asset}
                    className="rounded-[6px] border border-[#8b3a28]/70 px-2 py-1 text-xs font-semibold text-[#d3b992]"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {narrative ? <ProjectOpening narrative={narrative} /> : null}

      {narrative ? <ProjectOnePage project={project} /> : <GenericProjectDetail project={project} />}

      {narrative ? <ProjectAiRedo narrative={narrative} /> : null}
    </main>
  );
}
