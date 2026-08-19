import { auditPortfolioDraft } from "./evidence-audit.mjs";

export const TEMPLATE_IDS = ["atlas", "growth", "systems", "ai-workflow"];

export const TEMPLATE_REGISTRY = [
  {
    id: "atlas",
    name: "Atlas / 证据图谱",
    shortName: "Atlas",
    audience: "经历横跨多个项目，需要用判断、证据、路线图与星图建立全局认知的人",
    focus: "项目判断 → 代表案例 → 证据快照 → 能力路线图",
    homeStructure: ["个人判断", "三个代表项目", "证据快照", "能力路线图与星图"],
    projectStructure: ["开场判断", "核心指标与方法资产", "项目展开", "AI 时代重做"],
    matchSignals: ["产品/运营通用", "五维证据完整", "roadmap", "starMap"],
  },
  {
    id: "growth",
    name: "Growth / 增长实验",
    shortName: "Growth",
    audience: "增长产品、增长运营，以及能用指标、实验和复盘说明闭环的人",
    focus: "北极星指标 → 实验账本 → 增长闭环 → 复用资产",
    homeStructure: ["核心指标首屏", "实验与验证", "增长闭环", "代表项目"],
    projectStructure: ["增长目标", "实验设计", "信号与护栏", "结果复盘", "增长资产"],
    matchSignals: ["operations", "指标/转化/留存", "A/B/实验/对照", "增长闭环"],
  },
  {
    id: "systems",
    name: "Systems / 系统机制",
    shortName: "Systems",
    audience: "平台、策略、中后台或复杂协作项目，需要说明系统域、规则与边界的人",
    focus: "系统域 → 运行机制 → 跨团队边界 → 可复用资产",
    homeStructure: ["系统域首屏", "机制与规则", "跨团队边界", "资产与路线图"],
    projectStructure: ["系统边界", "运行机制", "协作契约", "资产沉淀", "系统结果"],
    matchSignals: ["系统/平台/机制", "规则/标准/策略", "资产/SOP/看板", "贡献边界"],
  },
  {
    id: "ai-workflow",
    name: "AI Workflow / 人机工作流",
    shortName: "AI Workflow",
    audience: "AI 产品、Agent、RAG 或自动化项目，需要明确评估、护栏与回滚的人",
    focus: "人机分工 → 工作流 → 评估证据 → 护栏与回滚",
    homeStructure: ["人机工作流首屏", "评估框架", "护栏与人工接管", "代表项目"],
    projectStructure: ["任务与人机边界", "工作流", "评估与证据", "护栏", "回滚与资产"],
    matchSignals: ["AI/Agent/RAG", "评估集/准确率", "护栏/人工复核", "回滚/降级"],
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
