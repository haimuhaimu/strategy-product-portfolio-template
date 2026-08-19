import { portfolioDataToConfigDraft } from "./config-draft.mjs";
import { createPortfolioExport } from "./config-export.mjs";
import { auditPortfolioDraft, createSafeDiagnosticSummary, validatePortfolioReferences } from "./evidence-audit.mjs";
import { normalizePortfolioData } from "./normalize.mjs";
import { sanitizePmfPilotExport } from "./pmf-pilot.mjs";
import { applyTemplateSelection, matchPortfolioTemplates, resolveTemplateId } from "./templates.mjs";

export const RELEASE_FILE_NAMES = [
  "projects.json",
  "audit-report.json",
  "RELEASE_CHECKLIST.md",
  "SHARE_COPY.md",
  "SHOWCASE_ENTRY.json",
  "PMF_PILOT_LOG.json",
];

const TEMPLATE_MARKERS = [
  "你的名字",
  "hello@example.com",
  "请补充",
  "待补充",
  "代表项目 1",
  "代表项目 2",
  "代表项目 3",
];

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validatePortfolioSchemaLite(input) {
  const errors = [];
  if (!isRecord(input)) {
    return { valid: false, errors: [{ path: "$", code: "root_object", message: "根节点必须是 JSON 对象。" }] };
  }
  if (input.schemaVersion !== 2) {
    errors.push({ path: "schemaVersion", code: "schema_version", message: "schemaVersion 必须为 2。" });
  }
  if (!(["product", "operations"].includes(input.rolePreset))) {
    errors.push({ path: "rolePreset", code: "role_preset", message: "rolePreset 只能是 product 或 operations。" });
  }
  if (!isRecord(input.profile)) {
    errors.push({ path: "profile", code: "profile_object", message: "profile 必须是对象。" });
  }
  if (!Array.isArray(input.featuredProjectSlugs)) {
    errors.push({ path: "featuredProjectSlugs", code: "featured_array", message: "featuredProjectSlugs 必须是数组。" });
  }
  if (!Array.isArray(input.projects) || input.projects.length === 0) {
    errors.push({ path: "projects", code: "projects_array", message: "projects 必须是非空数组。" });
  } else {
    const slugs = new Set();
    input.projects.forEach((project, index) => {
      if (!isRecord(project)) {
        errors.push({ path: `projects[${index}]`, code: "project_object", message: "项目必须是对象。" });
        return;
      }
      if (typeof project.slug !== "string" || !project.slug.trim()) {
        errors.push({ path: `projects[${index}].slug`, code: "project_slug", message: "每个项目都需要非空 slug。" });
      } else if (slugs.has(project.slug)) {
        errors.push({ path: `projects[${index}].slug`, code: "duplicate_slug", message: "项目 slug 不能重复。" });
      } else {
        slugs.add(project.slug);
      }
      if (typeof project.title !== "string" || !project.title.trim()) {
        errors.push({ path: `projects[${index}].title`, code: "project_title", message: "每个项目都需要非空标题。" });
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

export function parsePortfolioJson(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    return { ok: false, message: "请先粘贴 JSON，或选择本地 projects.json 文件。" };
  }
  try {
    const data = JSON.parse(raw);
    if (!isRecord(data)) return { ok: false, message: "projects.json 的根节点必须是对象。" };
    return { ok: true, data };
  } catch {
    return { ok: false, message: "JSON 无法解析。请检查逗号、引号和括号后重试。" };
  }
}

function detectTemplateState(input) {
  const serialized = JSON.stringify(input).toLowerCase();
  const markers = TEMPLATE_MARKERS.filter((marker) => serialized.includes(marker.toLowerCase()));
  return { detected: markers.length > 0, markerCount: markers.length };
}

function featuredGuard(input) {
  const count = Array.isArray(input?.featuredProjectSlugs) ? input.featuredProjectSlugs.length : 0;
  if (count === 3) return { pass: true, count, message: "已精选 3 个 featured 项目。" };
  if (count < 3) {
    return { pass: false, count, message: `当前只有 ${count} 个 featured 项目；请从全部经历中补选至 3 个。` };
  }
  return { pass: false, count, message: `当前有 ${count} 个 featured 项目；请按岗位相关性与证据强度精选为 3 个。` };
}

function createNextStep({ schema, audit, references, template, featured }) {
  if (!schema.valid) return `先修复 schema-lite 的 ${schema.errors.length} 个结构问题，再重新导入。`;
  if (audit.privacyRisks.length) return "先删除或脱敏隐私命中项，并确认公开授权，再重新审计。";
  if (!references.valid) return `先修复 ${references.findings.length} 处项目或星图断链，再重新审计。`;
  if (!featured.pass) return featured.message;
  if (template.detected) return "先替换模板占位内容；不要把“待补充”或示例身份带入发布包。";
  if (audit.level === "弱证据") return "先按首条高价值追问补充结果口径、方法或贡献边界。";
  return "检查公开授权后，生成并逐项下载 Release Pack。";
}

export function assessPortfolioData(input) {
  const schema = validatePortfolioSchemaLite(input);
  const normalizedData = normalizePortfolioData(input);
  const configDraft = portfolioDataToConfigDraft(normalizedData);
  const compatibilityExport = createPortfolioExport({
    mode: configDraft.mode,
    ...configDraft.profile,
    projects: configDraft.projects,
  });
  const audit = auditPortfolioDraft(input);
  const templateMatches = matchPortfolioTemplates(normalizedData, audit);
  const references = validatePortfolioReferences(input);
  const template = detectTemplateState(input);
  const featured = featuredGuard(input);
  const blockers = [
    ...(!schema.valid ? [{ code: "schema", message: `发现 ${schema.errors.length} 个结构问题。` }] : []),
    ...(audit.privacyRisks.length ? [{ code: "privacy", message: `发现 ${audit.privacyRisks.length} 类隐私风险。` }] : []),
    ...(!references.valid ? [{ code: "references", message: `发现 ${references.findings.length} 处引用断链。` }] : []),
  ];
  const warnings = [
    ...(!featured.pass ? [{ code: "featured", message: featured.message }] : []),
    ...(template.detected ? [{ code: "template", message: `检测到 ${template.markerCount} 类模板占位内容。` }] : []),
    ...(audit.level === "弱证据" ? [{ code: "evidence", message: "三项目平均证据强度偏弱。" }] : []),
  ];
  const status = blockers.length ? "block" : warnings.length ? "warn" : "pass";

  return {
    status,
    canGenerateRelease: blockers.length === 0,
    schema,
    normalizedData,
    configDraft,
    compatibilityExport,
    audit,
    references,
    template,
    templateMatches,
    featured,
    blockers,
    warnings,
    nextStep: createNextStep({ schema, audit, references, template, featured }),
  };
}

export function createSafeReleaseSummary(assessment) {
  const role = assessment.normalizedData.rolePreset === "operations" ? "运营" : "产品";
  return [
    "作品集发布安全摘要（不含项目原文）",
    `角色方向：${role}`,
    `精选项目：${assessment.featured.count} 个`,
    `平均证据分：${assessment.audit.totalScore}/5（${assessment.audit.level}）`,
    `引用校验：${assessment.references.valid ? "通过" : "阻断"}`,
    `隐私扫描：${assessment.audit.privacyRisks.length ? "阻断" : "未命中常见敏感模式"}`,
    "说明：自动扫描不替代本人对披露权限和事实准确性的最终确认。",
  ].join("\n");
}

function aggregateDimensions(report) {
  return Object.fromEntries(Object.entries(report.dimensionScores).map(([key, value]) => [key, value.value === 1]));
}

function createAuditExport(assessment) {
  return {
    formatVersion: 1,
    status: assessment.status,
    score: assessment.audit.totalScore,
    maxScore: assessment.audit.maxScore,
    level: assessment.audit.level,
    dimensions: assessment.audit.dimensionScores,
    projects: assessment.audit.projectScores.map(({ index, score, maxScore, rubric }) => ({ index, score, maxScore, rubric })),
    privacy: assessment.audit.privacyRisks.map(({ category, count }) => ({ category, count })),
    references: {
      valid: assessment.references.valid,
      findings: assessment.references.findings.map(({ code, path }) => ({ code, path })),
    },
    safeSummary: createSafeDiagnosticSummary(assessment.audit),
  };
}

export function createReleasePack(assessment, options = {}) {
  if (!assessment?.canGenerateRelease) {
    throw new Error("Release Pack 已阻断：请先修复结构、隐私或引用问题。");
  }
  const selectedTemplate = resolveTemplateId(options.selectedTemplate ?? assessment.normalizedData.template?.active);
  const releaseData = applyTemplateSelection(assessment.normalizedData, selectedTemplate);
  const summary = createSafeReleaseSummary(assessment);
  const dimensions = aggregateDimensions(assessment.audit);
  const evidenceScore = Object.values(dimensions).filter(Boolean).length;
  const checklist = [
    "# RELEASE CHECKLIST",
    "",
    `- [${assessment.featured.pass ? "x" : " "}] featuredProjectSlugs 恰好 3 个`,
    `- [${assessment.template.detected ? " " : "x"}] 已替换模板占位内容`,
    `- [${assessment.audit.level === "弱证据" ? " " : "x"}] 证据审计达到“可用”或“强证据”`,
    "- [x] 常见隐私模式未命中",
    "- [x] 项目、路线图与星图引用无断链",
    "- [ ] 已人工确认组织保密规则、事实口径与公开授权",
    "- [ ] 部署后填写公开 URL，并再次运行站点测试与 SEO 检查",
    "",
    "> 自动检查仅提供发布护栏，不代表第三方事实核验或披露授权。",
  ].join("\n");
  const shareCopy = [
    "# SHARE COPY",
    "",
    "我用三个代表项目整理了一份证据驱动作品集，重点呈现问题、关键判断、结果口径与个人/团队贡献边界。",
    "",
    "## 发布前可安全转发的诊断摘要",
    "",
    "```text",
    summary,
    "```",
    "",
    "公开链接：待部署后补充",
  ].join("\n");
  const showcaseEntry = {
    slug: "replace-with-public-slug",
    kind: "community",
    publicUrl: "https://example.com/replace-after-deploy/",
    roleTags: [assessment.normalizedData.rolePreset === "operations" ? "运营" : "产品经理"],
    publicHighlights: [
      `精选 ${assessment.featured.count} 个代表项目。`,
      `本地证据审计为 ${assessment.audit.totalScore}/5（${assessment.audit.level}）。`,
      "发布前已运行常见隐私模式与项目引用检查。",
    ],
    auditSummary: { strict: true, score: evidenceScore, maxScore: 5, dimensions },
    disclosure: {
      authorized: "待本人确认后改为 confirmed",
      publiclyAccessible: "待部署后改为 confirmed",
      sensitiveMaterialReviewed: "待人工复核后改为 confirmed",
      takedownAvailable: "待确认后改为 confirmed",
    },
  };
  const pmfPilotLog = sanitizePmfPilotExport(options.pmfPilotLog);

  return {
    "projects.json": `${JSON.stringify(releaseData, null, 2)}\n`,
    "audit-report.json": `${JSON.stringify(createAuditExport(assessment), null, 2)}\n`,
    "RELEASE_CHECKLIST.md": `${checklist}\n`,
    "SHARE_COPY.md": `${shareCopy}\n`,
    "SHOWCASE_ENTRY.json": `${JSON.stringify(showcaseEntry, null, 2)}\n`,
    "PMF_PILOT_LOG.json": `${JSON.stringify(pmfPilotLog, null, 2)}\n`,
  };
}
