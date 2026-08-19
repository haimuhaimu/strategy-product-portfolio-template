import auditManifest from "../../skills/portfolio-story-builder/audit-manifest.json" with { type: "json" };

const RESULT_PATTERN = new RegExp(auditManifest.patterns.result, "iu");
const PLACEHOLDER_PATTERN = new RegExp(auditManifest.patterns.placeholderMetric, "iu");
const SCOPE_WORDS = auditManifest.scopeWords;
const METHOD_WORDS = auditManifest.methodWords;
const ARTIFACT_WORDS = auditManifest.artifactWords;
const BOUNDARY_WORDS = auditManifest.boundaryWords;
const FLUFF_WORDS = auditManifest.fluffWords;

/** @type {Array<[string, RegExp]>} */
const PRIVACY_RULES = [
  ...auditManifest.privacyPatterns.map((rule) => [rule.label, new RegExp(rule.pattern, "giu")]),
  ["邮箱", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu],
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
  const source = project && typeof project === "object" ? project : {};
  const resultText = textOf([source.result, source.results, source.metrics]);
  const methodText = textOf([source.method, source.actions, source.caseStudy]);
  const artifactText = textOf([source.artifact, source.caseStudy?.artifact]);
  const contributionText = textOf([source.contribution, source.roleContribution]);
  const rubric = {
    resultEvidence: RESULT_PATTERN.test(resultText) && !PLACEHOLDER_PATTERN.test(resultText),
    scopeAndAttribution: SCOPE_WORDS.filter((word) => resultText.includes(word)).length >= 2,
    methodEvidence: includesAny(methodText, METHOD_WORDS),
    artifactEvidence: Boolean(artifactText.trim()) && includesAny(artifactText, ARTIFACT_WORDS),
    contributionBoundary: Boolean(contributionText.trim()) && includesAny(contributionText, BOUNDARY_WORDS),
  };

  return {
    index,
    title: typeof source.title === "string" && source.title.trim() ? source.title.trim() : `代表项目 ${index + 1}`,
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

export function validatePortfolioReferences(data) {
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const projectSlugs = new Set(projects.map((project) => project?.slug).filter(Boolean));
  const findings = [];
  const addMissingProjects = (values, path, code) => {
    if (!Array.isArray(values)) return;
    values.forEach((slug, index) => {
      if (typeof slug === "string" && !projectSlugs.has(slug)) {
        findings.push({ code, path: `${path}[${index}]`, reference: slug });
      }
    });
  };

  addMissingProjects(data?.featuredProjectSlugs, "featuredProjectSlugs", auditManifest.ruleIds.featuredMissing);
  if (Array.isArray(data?.roadmap)) {
    data.roadmap.forEach((stage, index) => addMissingProjects(
      stage?.projectSlugs,
      `roadmap[${index}].projectSlugs`,
      auditManifest.ruleIds.roadmapProjectMissing,
    ));
  }

  const nodes = Array.isArray(data?.starMap?.nodes) ? data.starMap.nodes : [];
  const nodeIds = new Set(nodes.map((node) => node?.id).filter(Boolean));
  nodes.forEach((node, index) => addMissingProjects(
    node?.projectSlugs,
    `starMap.nodes[${index}].projectSlugs`,
    auditManifest.ruleIds.starMapProjectMissing,
  ));
  if (Array.isArray(data?.starMap?.edges)) {
    data.starMap.edges.forEach((edge, index) => {
      for (const endpoint of ["source", "target"]) {
        if (typeof edge?.[endpoint] === "string" && !nodeIds.has(edge[endpoint])) {
          findings.push({
            code: auditManifest.ruleIds.starMapEdgeMissing,
            path: `starMap.edges[${index}].${endpoint}`,
            reference: edge[endpoint],
          });
        }
      }
    });
  }

  return { valid: findings.length === 0, findings };
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
