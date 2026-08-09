const RESULT_PATTERN = /(?:\d[\d,.]*\s*(?:%|万|亿|千|人|次|天|周|月|年|个|套|家|元)|上线|发布|采用|落地|交付|通过|稳定|减少|提升|增长|降低|缩短)/iu;
const PLACEHOLDER_PATTERN = /(?:\+?[XYZxyz]\s*%|xx+|待补充|todo|tbd)/iu;
const SCOPE_WORDS = ["周期", "期间", "对照", "基线", "范围", "口径", "归因", "样本", "用户", "团队"];
const METHOD_WORDS = ["实验", "对照", "样本", "漏斗", "访谈", "调研", "日志", "看板", "评估", "测试", "复盘", "数据", "归因"];
const ARTIFACT_WORDS = ["sop", "规则", "原型", "看板", "机制", "标准", "模板", "流程", "文档", "评估集", "策略表"];
const BOUNDARY_WORDS = ["个人", "团队", "协同", "边界", "归因", "负责", "主导", "参与", "不代表"];
const FLUFF_WORDS = ["赋能", "抓手", "闭环", "协同推进", "全面负责", "深度参与", "显著提升", "行业领先", "降本增效"];

/** @type {Array<[string, RegExp]>} */
const PRIVACY_RULES = [
  ["密钥或 Token", /(?:api[_-]?key|access[_-]?token|secret|password|passwd|cookie|authorization)\s*[:=]\s*[^\s,;]{6,}/giu],
  ["私钥", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gu],
  ["内部链接或域名", /(?:https?:\/\/[^\s"']*(?:bytedance\.net|byted\.org|larkoffice\.com|feishu\.cn|localhost|127\.0\.0\.1|\.internal|\.local)[^\s"']*)/giu],
  ["邮箱", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu],
  ["手机号", /(?<!\d)1[3-9]\d{9}(?!\d)/gu],
  ["身份证件号", /(?<!\d)\d{17}[\dXx](?!\d)/gu],
  ["用户或设备 ID", /\b(?:user[_-]?id|uid|device[_-]?id|did|order[_-]?id|ticket[_-]?id)\s*[:=]\s*[A-Z0-9_-]{5,}\b/giu],
];

const DIMENSIONS = [
  ["resultEvidence", "结果证据"],
  ["scopeAndAttribution", "口径完整"],
  ["methodEvidence", "方法证据"],
  ["artifactEvidence", "资产证据"],
  ["contributionBoundary", "贡献边界"],
];

function textOf(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textOf).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(textOf).join(" ");
  return "";
}

function includesAny(text, words) {
  const normalized = text.toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function scoreProject(project, index) {
  const resultText = textOf([project.result, project.results, project.metrics]);
  const methodText = textOf([project.method, project.actions, project.caseStudy]);
  const artifactText = textOf([project.artifact, project.caseStudy?.artifact]);
  const contributionText = textOf([project.contribution, project.roleContribution]);
  const rubric = {
    resultEvidence: RESULT_PATTERN.test(resultText) && !PLACEHOLDER_PATTERN.test(resultText),
    scopeAndAttribution: SCOPE_WORDS.filter((word) => resultText.includes(word)).length >= 2,
    methodEvidence: includesAny(methodText, METHOD_WORDS),
    artifactEvidence: Boolean(artifactText.trim()) && includesAny(artifactText, ARTIFACT_WORDS),
    contributionBoundary: Boolean(contributionText.trim()) && includesAny(contributionText, BOUNDARY_WORDS),
  };

  return {
    index,
    title: typeof project.title === "string" && project.title.trim() ? project.title.trim() : `代表项目 ${index + 1}`,
    score: Object.values(rubric).filter(Boolean).length,
    maxScore: 5,
    rubric,
  };
}

function buildQuestions(projectScores, privacyRisks, fluffFindings) {
  const questions = [];
  if (privacyRisks.length) {
    questions.push("先确认隐私红线：能否删除或脱敏已命中的标识，并确认公开授权？");
  }

  const prompts = {
    resultEvidence: "最能证明效果的一项结果是什么？请给出可查验的数值、采用或交付事实。",
    scopeAndAttribution: "这项结果的对象、范围、时间窗、基线或对照是什么？请至少补两项。",
    methodEvidence: "你用什么具体方法验证判断？例如样本、漏斗、实验、访谈、日志或评估标准。",
    artifactEvidence: "项目沉淀了什么可复用交付物？例如规则、原型、SOP、看板或评估集。",
    contributionBoundary: "哪项判断或动作由你完成，哪些结果属于团队，哪些仍未验证？",
  };

  const missingCount = new Map(DIMENSIONS.map(([key]) => [key, 0]));
  for (const project of projectScores) {
    for (const [key] of DIMENSIONS) {
      if (!project.rubric[key]) missingCount.set(key, missingCount.get(key) + 1);
    }
  }
  for (const [key] of DIMENSIONS) {
    if (questions.length >= 3) break;
    if (missingCount.get(key) > 0) questions.push(prompts[key]);
  }
  if (questions.length < 3 && fluffFindings.length) {
    questions.push("哪些空泛表述可以改成具体对象、动作和证据，而不是只写负责、赋能或闭环？");
  }
  return questions.slice(0, 3);
}

export function auditPortfolioDraft(draft) {
  const projects = Array.isArray(draft?.projects) ? draft.projects : [];
  const projectScores = projects.map(scoreProject);
  const wholeText = textOf(draft);
  const privacyRisks = [];

  for (const [category, pattern] of PRIVACY_RULES) {
    pattern.lastIndex = 0;
    const matches = wholeText.match(pattern) || [];
    if (matches.length) {
      privacyRisks.push({ category, count: matches.length, message: `发现 ${matches.length} 处${category}风险，请删除、脱敏或确认公开授权。` });
    }
  }

  const fluffFindings = FLUFF_WORDS
    .filter((word) => wholeText.toLowerCase().includes(word.toLowerCase()))
    .map((word) => ({ word, message: `“${word}”需要补充具体对象、动作或证据。` }));
  const dimensionScores = Object.fromEntries(DIMENSIONS.map(([key, label]) => [key, {
    label,
    value: projectScores.length ? projectScores.filter((project) => project.rubric[key]).length / projectScores.length : 0,
  }]));
  const totalScore = projectScores.length
    ? Math.round((projectScores.reduce((sum, project) => sum + project.score, 0) / projectScores.length) * 10) / 10
    : 0;

  return {
    totalScore,
    maxScore: 5,
    level: totalScore >= 4 ? "强证据" : totalScore >= 3 ? "可用" : "弱证据",
    dimensionScores,
    projectScores,
    privacyRisks,
    fluffFindings,
    questions: buildQuestions(projectScores, privacyRisks, fluffFindings),
  };
}

export function createSafeDiagnosticSummary(report) {
  const dimensions = Object.values(report.dimensionScores)
    .map((item) => `${item.label} ${Math.round(item.value * 100)}%`)
    .join("；");
  const privacy = report.privacyRisks.length
    ? report.privacyRisks.map((risk) => `${risk.category} ${risk.count} 处`).join("；")
    : "未命中常见敏感模式";
  const questions = report.questions.length
    ? report.questions.map((question, index) => `${index + 1}. ${question}`).join("\n")
    : "暂无高优先级追问";

  return [
    "作品集证据诊断摘要（不含原始填写内容）",
    `平均证据分：${report.totalScore}/5（${report.level}）`,
    `五维覆盖：${dimensions}`,
    `隐私检查：${privacy}`,
    `空泛表达：${report.fluffFindings.length} 类`,
    "优先补证据：",
    questions,
    "说明：自动检查仅覆盖常见模式，最终披露权限仍需本人确认。",
  ].join("\n");
}

export { DIMENSIONS };
