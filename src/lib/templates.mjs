import { auditPortfolioDraft } from "./evidence-audit.mjs";

export const TEMPLATE_IDS = ["atlas", "growth", "systems", "ai-workflow"];

export const TEMPLATE_REGISTRY = [
  {
    id: "atlas",
    name: "Atlas / 证据图谱",
    shortName: "Atlas",
    tagline: "当经历横跨多个项目时，用一条判断主线把案例、证据和能力演进串起来。",
    audience: "经历横跨多个项目，需要用判断、证据、路线图与星图建立全局认知的人",
    suitableFor: [
      "做过不同类型项目，但能说清自己反复使用了哪些判断方法的人",
      "目标岗位看重问题定义、产品判断、跨团队推进或综合能力的人",
      "已经有三个代表项目，并且每个项目都能拿出结果、方法或交付物的人",
    ],
    notFor: [
      "只有一段单点项目，还没有形成跨项目主线的人",
      "希望靠长篇自我介绍代替项目证据的人",
      "项目之间没有共同能力，只是按时间顺序堆经历的人",
    ],
    recruiterFirstLook: "先看你怎么定义问题，再用三个项目核对这种判断是否反复成立，最后才看能力图谱和下一步方向。",
    focus: "项目判断 → 代表案例 → 证据快照 → 能力路线图",
    narrativeSteps: [
      { title: "先给一句判断", purpose: "让招聘官十秒内知道你解决哪类问题，而不是先猜你的岗位边界。" },
      { title: "用三个项目交叉验证", purpose: "证明这条判断不是自我评价，而是在不同场景里真实做过。" },
      { title: "把证据摊开", purpose: "让结果、方法、个人贡献和团队边界可以快速核对。" },
      { title: "再讲能力演进", purpose: "说明你如何从一次项目沉淀出可复用方法，而不是画一张好看的能力图。" },
    ],
    homeStructure: ["个人判断", "三个代表项目", "证据快照", "能力路线图与星图"],
    projectStructure: ["开场判断", "核心指标与方法资产", "项目展开", "AI 时代重做"],
    evidenceChecklist: [
      "一句能被三个项目共同支持的定位，不要写成性格标签",
      "恰好三个 featured 项目，并说明每个项目为什么被选中",
      "每个项目至少一条现有结果或采用事实，同时写清口径与边界",
      "本人判断、本人负责范围、团队共同完成部分分别写明",
      "roadmap 和 starMap 的每个节点都能回指现有项目 slug",
    ],
    projectTypes: [
      "从问题定义走到机制落地的综合产品项目",
      "跨业务、跨阶段但共享同一判断方法的项目组合",
      "策略、平台、运营项目混合，但个人贡献边界清楚的作品集",
    ],
    commonMisuses: [
      "把 Atlas 做成个人百科，首屏信息很多却看不到三个项目",
      "先画能力星图，再勉强给项目贴标签，导致图谱没有证据回链",
      "每个项目都讲不同能力，没有一条能被招聘官复述的主线",
      "把今天的重做设想混进历史结果，让事实和推演失去边界",
    ],
    agentMaterialAdvice: [
      "让 Agent 先列出全部经历中的重复判断，再用已有证据最多的一条做主线。",
      "让 Agent 为每个候选项目分别摘出结果、方法、交付物和贡献边界，缺什么就只追问一项。",
      "让 Agent 检查 roadmap、starMap 和 featuredProjectSlugs 是否都能回指现有项目，不要凭空补节点。",
      "让 Agent 做一次三十秒测试：只看标题、摘要和首条证据，能否复述你做了什么、为什么可信。",
    ],
    matchSignals: ["三个项目能力互补", "判断主线可复述", "五维证据较完整", "roadmap / starMap 有真实回链"],
    fieldMappings: [
      { block: "首屏个人判断", fields: ["profile.headline", "profile.summary", "home.introTitle"], purpose: "交代目标方向与贯穿项目的判断主线。" },
      { block: "三个代表项目", fields: ["featuredProjectSlugs", "projects[].title", "projects[].summary", "projects[].valueAnchor"], purpose: "用案例快速证明主线。" },
      { block: "证据快照", fields: ["projects[].metrics", "projects[].results", "projects[].caseStudy.evaluation"], purpose: "把采用事实、结果口径和结论边界放在一起。" },
      { block: "角色与边界", fields: ["projects[].roleContribution"], purpose: "区分本人判断、负责范围、使用者和团队成果。" },
      { block: "能力演进", fields: ["roadmap", "starMap"], purpose: "把能力节点回链到真实项目。" },
    ],
    exampleProjectIndex: 0,
    exampleEvidence: "roleContribution",
    seo: {
      title: "Atlas 证据图谱作品集模板：适合谁、怎么准备材料",
      description: "Atlas 作品集模板详细说明：适合跨项目经历，按个人判断、三个案例、证据快照和能力路线图组织，并附证据清单、误区与字段映射。",
      keywords: ["Atlas 作品集模板", "产品经理作品集结构", "证据驱动作品集"],
    },
  },
  {
    id: "growth",
    name: "Growth / 增长实验",
    shortName: "Growth",
    tagline: "把增长讲成可复盘的验证过程，而不是只摆一排上涨数字。",
    audience: "增长产品、增长运营，以及能用指标、实验和复盘说明闭环的人",
    suitableFor: [
      "材料里有明确目标指标、基线、观察周期或对照信息的人",
      "做过获客、激活、转化、留存、复购或供给增长闭环的人",
      "能说明实验怎么设计、何时停止、结果如何进入后续动作的人",
    ],
    notFor: [
      "只有最终增长数字，却说不清口径、基线和个人动作的人",
      "项目主要价值是平台建设或治理机制，增长只是伴随结果的人",
      "把相关性直接写成个人因果、没有护栏或失败样本的人",
    ],
    recruiterFirstLook: "先核对目标指标和口径，再看你设计了什么验证、如何排除自然波动，最后看结论有没有沉淀成下一轮动作。",
    focus: "北极星指标 → 实验账本 → 增长闭环 → 复用资产",
    narrativeSteps: [
      { title: "先把增长问题说窄", purpose: "明确人群、环节和指标，避免用大盘目标替代项目问题。" },
      { title: "交代基线与验证", purpose: "让招聘官知道结果从哪里起算、用什么方式判断策略有效。" },
      { title: "同时展示信号与护栏", purpose: "证明你没有只看一个好看的主指标。" },
      { title: "把结论接回闭环", purpose: "说明继续、停止、扩量或迭代的依据，以及留下了什么资产。" },
    ],
    homeStructure: ["核心指标首屏", "实验与验证", "增长闭环", "代表项目"],
    projectStructure: ["增长目标", "实验设计", "信号与护栏", "结果复盘", "增长资产"],
    evidenceChecklist: [
      "目标人群、漏斗环节和指标定义，三者不要只写一个",
      "基线或对照来源，以及策略前后的观察周期",
      "分组方式、样本限制、干扰因素和停止条件",
      "主指标之外的体验、质量、成本或风险护栏",
      "成功、无效或失败结果分别触发了什么下一步",
      "个人设计与团队交付的边界，以及最终沉淀的看板、规则或实验模板",
    ],
    projectTypes: [
      "拉新、激活、转化、留存或复购实验",
      "内容供给、作者经营、用户分层与触达策略",
      "渠道组合、活动机制、商业化转化或漏斗优化",
    ],
    commonMisuses: [
      "只写提升百分比，不写分母、时间窗、基线和是否可公开",
      "把上线前后变化都归因给自己，忽略活动、季节和渠道结构变化",
      "只展示成功实验，删掉无效方案和停止条件，反而显得不可复盘",
      "把 GMV、DAU 等大盘数字放在首屏，但个人动作只影响其中很小一段",
    ],
    agentMaterialAdvice: [
      "让 Agent 把每个数字改写成“指标定义 + 基线/对照 + 时间窗 + 证据载体”，缺项就标待补充。",
      "让 Agent 从复盘、看板摘要和实验记录里找出无效方案、护栏和停止条件，不要只找上涨结果。",
      "让 Agent 画出最短漏斗，并把你的动作只挂到确实影响的环节。",
      "让 Agent 挑一个招聘官最可能质疑的归因，写清外部变量和团队贡献。",
    ],
    matchSignals: ["指标口径完整", "有基线或对照", "有实验与护栏", "结论进入后续增长闭环"],
    fieldMappings: [
      { block: "核心指标首屏", fields: ["home.evidenceMetrics", "projects[].metrics"], purpose: "先给指标名称、值和必要口径。" },
      { block: "增长目标", fields: ["projects[].summary", "projects[].background", "projects[].valueAnchor"], purpose: "明确人群、问题和目标环节。" },
      { block: "实验与信号", fields: ["projects[].caseStudy.algorithmAndData", "projects[].caseStudy.evaluation"], purpose: "说明验证方式、信号和结论边界。" },
      { block: "动作与复盘", fields: ["projects[].actions", "projects[].results"], purpose: "连接动作、结果与下一步，而不是只报数字。" },
      { block: "增长资产与贡献", fields: ["projects[].caseStudy.artifact", "projects[].roleContribution"], purpose: "展示可复用资产和个人边界。" },
    ],
    exampleProjectIndex: 1,
    exampleEvidence: "metrics",
    seo: {
      title: "Growth 增长实验作品集模板：指标、实验与复盘怎么写",
      description: "Growth 作品集模板详细说明：适合有指标、基线、实验和护栏材料的增长产品与运营，附发布前证据清单、常见误用和字段映射。",
      keywords: ["增长作品集模板", "增长产品经理作品集", "运营实验复盘"],
    },
  },
  {
    id: "systems",
    name: "Systems / 系统机制",
    shortName: "Systems",
    tagline: "把复杂项目讲成一套能运行的规则、边界和协作机制。",
    audience: "平台、策略、中后台或复杂协作项目，需要说明系统域、规则与边界的人",
    suitableFor: [
      "做平台、中后台、策略、治理、风控或多角色协作项目的人",
      "结果不只是一项业务数字，更体现在规则被采用、流程跑通或资产复用的人",
      "能说明系统边界、输入输出、异常处理和跨团队契约的人",
    ],
    notFor: [
      "主要是一次活动或单点页面优化，几乎没有机制沉淀的人",
      "只有宏大架构图，拿不出规则、流程、采用范围或实际交付物的人",
      "把团队平台建设全部写成个人成果，协作边界说不清的人",
    ],
    recruiterFirstLook: "先判断你解决的是哪一段系统问题，再看规则如何运转、谁在使用、异常怎么处理，最后核对你负责的边界和沉淀资产。",
    focus: "系统域 → 运行机制 → 跨团队边界 → 可复用资产",
    narrativeSteps: [
      { title: "先画清系统边界", purpose: "说明服务谁、接收什么输入、输出什么结果，以及明确不解决什么。" },
      { title: "再拆运行机制", purpose: "把规则、状态、反馈和异常处理讲清，避免只展示静态架构。" },
      { title: "交代协作契约", purpose: "让招聘官看懂产品、算法、数据、运营等角色怎样接力，以及你的负责范围。" },
      { title: "用采用与资产收口", purpose: "证明机制实际被使用，并留下规则、SOP、看板或平台能力。" },
    ],
    homeStructure: ["系统域首屏", "机制与规则", "跨团队边界", "资产与路线图"],
    projectStructure: ["系统边界", "运行机制", "协作契约", "资产沉淀", "系统结果"],
    evidenceChecklist: [
      "目标使用者、系统边界、上游输入和下游动作",
      "核心规则、状态流转、反馈闭环与异常分支",
      "上线前后的流程差异或被替代的人工工作",
      "采用团队、覆盖范围或实际使用事实；没有精确数字就不要补",
      "本人负责的机制设计与其他团队负责的研发、算法或运营执行",
      "可公开的规则文档、SOP、看板、原型或评估框架摘要",
    ],
    projectTypes: [
      "平台、中后台、权限、流程或策略系统",
      "内容治理、质量评估、风控与分层机制",
      "跨产品、算法、数据、运营共同运行的业务基础设施",
    ],
    commonMisuses: [
      "用一张复杂架构图代替问题、规则和使用证据",
      "只写“推动多团队协作”，却不写接口、决策权和交付边界",
      "把一次人工流程包装成平台能力，没有说明是否持续运行",
      "只讲效率提升，不写哪些异常仍需人工处理或哪些场景不覆盖",
    ],
    agentMaterialAdvice: [
      "让 Agent 先把项目整理成“输入—规则—输出—反馈—异常”五格，缺口一眼就能看见。",
      "让 Agent 从 PRD、流程图、SOP 和复盘里提取同一条机制，合并重复说法，不要编新规则。",
      "让 Agent 为每个协作角色写一行“他负责什么 / 我负责什么 / 共同决策什么”。",
      "让 Agent 优先找采用事实和可复用资产；没有精确效果时，用已确认的使用范围替代虚构提升。",
    ],
    matchSignals: ["系统边界清楚", "规则与异常可解释", "有采用或复用事实", "跨团队贡献边界明确"],
    fieldMappings: [
      { block: "系统域首屏", fields: ["projects[].domain", "projects[].summary", "projects[].background"], purpose: "交代系统服务对象、问题域与约束。" },
      { block: "机制与规则", fields: ["projects[].caseStudy.productMethod", "projects[].caseStudy.algorithmAndData"], purpose: "说明规则如何运行及数据怎样参与。" },
      { block: "协作契约", fields: ["projects[].roleContribution"], purpose: "说明个人范围、关键判断、使用者和团队边界。" },
      { block: "资产沉淀", fields: ["projects[].caseStudy.artifact", "projects[].actions"], purpose: "列出真实交付物和机制化动作。" },
      { block: "系统结果", fields: ["projects[].metrics", "projects[].results", "roadmap"], purpose: "展示采用、覆盖、结果边界和后续演进。" },
    ],
    exampleProjectIndex: 1,
    exampleEvidence: "roleContribution",
    seo: {
      title: "Systems 系统机制作品集模板：平台与复杂项目怎么讲",
      description: "Systems 作品集模板详细说明：适合平台、策略、中后台和治理项目，按系统边界、运行机制、协作契约与资产组织证据。",
      keywords: ["平台产品经理作品集", "系统机制作品集模板", "策略产品项目复盘"],
    },
  },
  {
    id: "ai-workflow",
    name: "AI Workflow / 人机工作流",
    shortName: "AI Workflow",
    tagline: "不靠“用了 AI”抢眼，而是讲清任务、人机分工、评估、护栏和回滚。",
    audience: "AI 产品、Agent、RAG 或自动化项目，需要明确评估、护栏与回滚的人",
    suitableFor: [
      "做过 AI 产品、Agent、RAG、内容理解或自动化工作流的人",
      "能拿出任务定义、评估样本、人工复核、异常处理或实际采用事实的人",
      "愿意把已发生实践和今天的重做设想明确分开的人",
    ],
    notFor: [
      "只有概念原型或提示词截图，没有真实任务、评估或使用边界的人",
      "只是调用模型 API，却说不清为什么要由 AI 承接这一步的人",
      "把历史规则项目改名为 AI 项目，或把未来方案写成已经上线的人",
    ],
    recruiterFirstLook: "先看任务为什么值得交给 AI，再看人机怎么接力、用什么样本评估、出错时谁接管，最后才看模型或技术名词。",
    focus: "人机分工 → 工作流 → 评估证据 → 护栏与回滚",
    narrativeSteps: [
      { title: "从任务而不是模型开场", purpose: "说明原流程的成本、瓶颈和 AI 适用边界。" },
      { title: "画出人机接力", purpose: "交代输入、模型动作、工具调用、人工判断和最终输出。" },
      { title: "展示评估证据", purpose: "让离线样本、线上反馈、质量标准和 bad case 能被核对。" },
      { title: "补上护栏与回滚", purpose: "说明低置信、敏感或异常场景如何降级、复核和追责。" },
      { title: "区分已发生与重做", purpose: "保住事实可信度，同时展示你对下一版产品化的判断。" },
    ],
    homeStructure: ["人机工作流首屏", "评估框架", "护栏与人工接管", "代表项目"],
    projectStructure: ["任务与人机边界", "工作流", "评估与证据", "护栏", "回滚与资产"],
    evidenceChecklist: [
      "原任务、原流程和为什么适合或不适合交给 AI",
      "输入、模型或 Agent 动作、工具、人工节点和输出的完整链路",
      "评估集来源、样本边界、质量维度和 bad case 分类",
      "低置信、敏感内容、错误输出的人工复核与降级方式",
      "版本、反馈、回滚或停止使用的触发条件",
      "已上线、已试用、仅原型、今天重做四种状态不要混写",
    ],
    projectTypes: [
      "Agent 任务编排、RAG 问答与知识工作流",
      "内容理解、审核、标注、推荐或策略自动化",
      "客服、销售、运营、数据分析等人机协作工具",
    ],
    commonMisuses: [
      "首屏堆模型名和技术名词，却没有用户任务和采用证据",
      "只报准确率，不写评估集来源、样本边界和错误代价",
      "把人工复核藏起来，假装工作流已经全自动",
      "没有回滚和异常处理，却用“生产可用”描述原型",
      "把今天可以用大模型重做的设想写成历史项目结果",
    ],
    agentMaterialAdvice: [
      "让 Agent 从真实流程材料中画出每一步，并标注“人决定 / AI 生成 / 工具执行 / 人复核”，不要补不存在的节点。",
      "让 Agent 把评估材料整理成“样本来源—质量维度—通过标准—bad case—处置动作”。",
      "让 Agent 单独追问一次失败路径：什么时候拒答、降级、回滚或转人工；不知道就写待补充。",
      "让 Agent 给每句话标记“已经发生 / 有证据的采用 / 今天重做”，删除无法确认的上线和效果表述。",
    ],
    matchSignals: ["任务边界明确", "人机工作流完整", "有评估与 bad case", "有护栏、人工接管或回滚"],
    fieldMappings: [
      { block: "任务与人机边界", fields: ["projects[].background", "projects[].summary", "projects[].roleContribution.judgment"], purpose: "说明任务价值、原流程和 AI 适用边界。" },
      { block: "人机工作流", fields: ["projects[].caseStudy.productMethod", "projects[].actions"], purpose: "串起 AI、工具和人工节点。" },
      { block: "评估与证据", fields: ["projects[].caseStudy.algorithmAndData", "projects[].caseStudy.evaluation", "projects[].metrics"], purpose: "展示样本、质量标准、结果和限制。" },
      { block: "护栏与人工接管", fields: ["projects[].roleContribution.boundary", "projects[].results"], purpose: "明确错误代价、人工责任和披露边界。" },
      { block: "回滚与资产", fields: ["projects[].caseStudy.artifact", "roadmap"], purpose: "记录可复用资产与下一版治理方向。" },
    ],
    exampleProjectIndex: 2,
    exampleEvidence: "metrics",
    seo: {
      title: "AI Workflow 人机工作流作品集模板：评估、护栏与回滚",
      description: "AI Workflow 作品集模板详细说明：从任务和人机分工出发，展示评估证据、人工接管、护栏与回滚，并附材料清单和字段映射。",
      keywords: ["AI 产品经理作品集", "Agent 项目作品集", "人机工作流模板"],
    },
  },
];

const TEMPLATE_BY_ID = new Map(TEMPLATE_REGISTRY.map((template) => [template.id, template]));
const GROWTH_WORDS = ["增长", "指标", "转化", "留存", "漏斗", "激活", "复购", "DAU", "GMV", "渗透", "实验", "对照", "A/B", "ab test"];
const EXPERIMENT_WORDS = ["实验", "对照", "分组", "基线", "A/B", "ab test", "显著"];
const SYSTEM_WORDS = ["系统", "平台", "机制", "规则", "标准", "策略", "治理", "分层", "流程", "SOP", "看板", "资产", "复用", "边界", "跨团队"];
const ASSET_WORDS = ["规则", "标准", "SOP", "看板", "评估集", "原型", "机制", "工作流", "资产"];
const AI_WORDS = ["AI", "Agent", "RAG", "LLM", "大模型", "模型", "智能体", "生成式", "自动化"];
const AI_GUARDRAIL_WORDS = ["评估", "护栏", "回滚", "降级", "人工复核", "接管", "准确率", "召回率", "幻觉", "bad case"];

function textOf(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textOf).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(textOf).join(" ");
  return "";
}

function matchedWords(text, words) {
  const normalized = text.toLowerCase();
  return words.filter((word) => normalized.includes(word.toLowerCase()));
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function metricCount(data) {
  return (Array.isArray(data?.projects) ? data.projects : []).reduce(
    (count, project) => count + (Array.isArray(project?.metrics) ? project.metrics.length : 0),
    0,
  );
}

function hasRoadmap(data) {
  return Array.isArray(data?.roadmap) && data.roadmap.length > 0;
}

function hasStarMap(data) {
  return Array.isArray(data?.starMap?.nodes) && data.starMap.nodes.length > 0;
}

function evidenceCount(audit) {
  return Object.values(audit.dimensionScores).filter((dimension) => dimension.value >= 0.67).length;
}

function explanation(id, context) {
  const { data, audit, growthMatches, experimentMatches, systemMatches, assetMatches, aiMatches, guardrailMatches, metrics } = context;
  const reasons = [];
  const gaps = [];
  let score = 0;

  if (id === "atlas") {
    score = 28 + evidenceCount(audit) * 7;
    reasons.push(`五维证据已有 ${evidenceCount(audit)}/5 项达到多数项目覆盖`);
    if (hasRoadmap(data)) { score += 12; reasons.push("已提供路线图，可呈现能力演进"); } else gaps.push("缺少 roadmap，能力演进路径较弱");
    if (hasStarMap(data)) { score += 12; reasons.push("已提供星图，可连接能力与项目"); } else gaps.push("缺少 starMap，项目关系仍是线性列表");
    if (data?.rolePreset === "product") { score += 5; reasons.push("product 预设适合以判断和机制组织案例"); }
  }

  if (id === "growth") {
    score = 8 + Math.min(metrics, 5) * 6 + Math.min(growthMatches.length, 8) * 5 + Math.min(experimentMatches.length, 4) * 6;
    if (data?.rolePreset === "operations") { score += 15; reasons.push("operations 预设与经营、转化叙事相符"); }
    if (metrics) reasons.push(`检测到 ${metrics} 条指标记录，可支撑指标首屏`); else gaps.push("缺少 metrics，无法形成可信的指标首屏");
    if (growthMatches.length) reasons.push(`增长信号：${growthMatches.slice(0, 5).join("、")}`); else gaps.push("未检测到增长、转化、留存或漏斗信号");
    if (experimentMatches.length) reasons.push(`实验信号：${experimentMatches.slice(0, 4).join("、")}`); else gaps.push("缺少实验、分组、对照或基线信息");
  }

  if (id === "systems") {
    score = 10 + Math.min(systemMatches.length, 9) * 6 + Math.min(assetMatches.length, 5) * 5;
    if (data?.rolePreset === "product") { score += 7; reasons.push("product 预设适合说明系统取舍与机制设计"); }
    if (systemMatches.length) reasons.push(`系统机制信号：${systemMatches.slice(0, 6).join("、")}`); else gaps.push("未检测到系统、机制、规则或平台信号");
    if (assetMatches.length) reasons.push(`可复用资产信号：${assetMatches.slice(0, 5).join("、")}`); else gaps.push("缺少规则、SOP、看板或评估集等资产证据");
    if (audit.dimensionScores.contributionBoundary.value >= 0.67) { score += 8; reasons.push("多数项目已说明个人与团队贡献边界"); } else gaps.push("跨团队与个人贡献边界仍需补强");
    if (hasRoadmap(data)) score += 5;
    if (hasStarMap(data)) score += 5;
  }

  if (id === "ai-workflow") {
    score = 6 + Math.min(aiMatches.length, 8) * 7 + Math.min(guardrailMatches.length, 7) * 6;
    if (aiMatches.length) reasons.push(`AI 工作流信号：${aiMatches.slice(0, 6).join("、")}`); else gaps.push("未检测到 AI、Agent、RAG、LLM 或自动化信号");
    if (guardrailMatches.length) reasons.push(`评估/护栏信号：${guardrailMatches.slice(0, 6).join("、")}`); else gaps.push("缺少评估、护栏、人工接管或回滚信号");
    if (audit.dimensionScores.methodEvidence.value >= 0.67) { score += 7; reasons.push("多数项目有方法证据，可展开评估工作流"); } else gaps.push("方法与评估证据覆盖不足");
    if (audit.dimensionScores.contributionBoundary.value >= 0.67) score += 5;
  }

  return { score: clampScore(score), reasons, gaps };
}

export function isTemplateId(value) {
  return TEMPLATE_IDS.includes(value);
}

export function resolveTemplateId(value) {
  return isTemplateId(value) ? value : "atlas";
}

export function getActiveTemplateId(data) {
  return resolveTemplateId(data?.template?.active);
}

export function getTemplateDefinition(id) {
  return TEMPLATE_BY_ID.get(resolveTemplateId(id));
}

export function applyTemplateSelection(input, selectedTemplate) {
  const data = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const existingTemplate = data.template && typeof data.template === "object" && !Array.isArray(data.template)
    ? data.template
    : {};
  return {
    ...data,
    template: { ...existingTemplate, active: resolveTemplateId(selectedTemplate) },
  };
}

export function matchPortfolioTemplates(data, providedAudit) {
  const audit = providedAudit ?? auditPortfolioDraft(data);
  const text = textOf({ ...data, template: undefined });
  const context = {
    data,
    audit,
    growthMatches: matchedWords(text, GROWTH_WORDS),
    experimentMatches: matchedWords(text, EXPERIMENT_WORDS),
    systemMatches: matchedWords(text, SYSTEM_WORDS),
    assetMatches: matchedWords(text, ASSET_WORDS),
    aiMatches: matchedWords(text, AI_WORDS),
    guardrailMatches: matchedWords(text, AI_GUARDRAIL_WORDS),
    metrics: metricCount(data),
  };

  return TEMPLATE_REGISTRY.map((template) => ({
    ...template,
    ...explanation(template.id, context),
  })).sort((left, right) => right.score - left.score || TEMPLATE_IDS.indexOf(left.id) - TEMPLATE_IDS.indexOf(right.id));
}
