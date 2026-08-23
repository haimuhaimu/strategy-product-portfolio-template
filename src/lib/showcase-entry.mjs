export const SHOWCASE_DIMENSIONS = [
  "resultEvidence",
  "scopeAndAttribution",
  "methodEvidence",
  "artifactEvidence",
  "contributionBoundary",
];

export const SHOWCASE_DISCLOSURES = [
  "authorized",
  "publiclyAccessible",
  "sensitiveMaterialReviewed",
  "takedownAvailable",
];

export const SHOWCASE_LIMITS = {
  slug: 80,
  publicUrl: 2048,
  roleTags: 8,
  roleTag: 40,
  publicHighlight: 160,
};

const SHOWCASE_FIELDS = [
  "slug",
  "kind",
  "publicUrl",
  "roleTags",
  "publicHighlights",
  "auditSummary",
  "disclosure",
];
const AUDIT_FIELDS = ["strict", "score", "maxScore", "dimensions"];
const KIND_VALUES = new Set(["community", "maintainer/self-test"]);
const INTERNAL_HOST_SUFFIX = /(?:^|\.)(?:localhost|internal|local|corp|intranet)$/iu;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function codePointLength(value) {
  return [...value].length;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/gu, " ") : "";
}

function assertExactFields(value, fields, label) {
  if (!isPlainObject(value)) throw new Error(`${label} 必须是对象`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (actual.length !== expected.length || actual.some((field, index) => field !== expected[index])) {
    throw new Error(`${label} 字段不符合公开 schema`);
  }
}

function assertStringList(value, { label, minItems, maxItems, maxLength }) {
  if (!Array.isArray(value) || value.length < minItems || value.length > maxItems) {
    throw new Error(`${label} 数量不符合公开 schema`);
  }
  if (value.some((item) => typeof item !== "string" || item !== item.trim() || codePointLength(item) < 1 || codePointLength(item) > maxLength)) {
    throw new Error(`${label} 包含无效文本`);
  }
}

function hasExplicitPort(rawUrl) {
  const authority = rawUrl.match(/^https:\/\/([^/?#]+)/iu)?.[1] ?? "";
  const hostPort = authority.slice(authority.lastIndexOf("@") + 1);
  return hostPort.startsWith("[") ? /\]:\d*$/u.test(hostPort) : /:\d*$/u.test(hostPort);
}

function isIpHostname(hostname) {
  const unwrapped = hostname.replace(/^\[|\]$/gu, "");
  if (unwrapped.includes(":")) return true;
  return /^\d{1,3}(?:\.\d{1,3}){3}$/u.test(unwrapped);
}

export function getPublicUrlError(rawUrl) {
  if (typeof rawUrl !== "string") return "publicUrl 必须是字符串";
  if (!rawUrl || rawUrl !== rawUrl.trim() || /[\u0000-\u0020\u007f]/u.test(rawUrl) || codePointLength(rawUrl) > SHOWCASE_LIMITS.publicUrl) {
    return `publicUrl 必须为 1–${SHOWCASE_LIMITS.publicUrl} 个字符、首尾无空格且不含控制字符`;
  }
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return "publicUrl 不是有效 URL";
  }
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/gu, "");
  const labels = hostname.split(".");
  const hasValidPublicHostname = labels.length > 1 && labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(label));
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    rawUrl.includes("?") ||
    rawUrl.includes("#") ||
    hasExplicitPort(rawUrl) ||
    isIpHostname(hostname) ||
    !hasValidPublicHostname ||
    hostname.endsWith(".") ||
    INTERNAL_HOST_SUFFIX.test(hostname)
  ) {
    return "publicUrl 必须是无凭据、参数、片段和端口的公共 HTTPS 地址，且不能使用 IP、localhost 或内网域名";
  }
  return null;
}

export function validateShowcaseEntry(value, fileName = `${value?.slug ?? "entry"}.json`) {
  assertExactFields(value, SHOWCASE_FIELDS, fileName);
  if (
    typeof value.slug !== "string" ||
    codePointLength(value.slug) > SHOWCASE_LIMITS.slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value.slug)
  ) {
    throw new Error(`${fileName} slug 无效`);
  }
  if (fileName !== `${value.slug}.json`) throw new Error(`${fileName} 文件名必须与 slug 一致`);
  if (!KIND_VALUES.has(value.kind)) throw new Error(`${fileName} kind 无效`);
  const urlError = getPublicUrlError(value.publicUrl);
  if (urlError) throw new Error(urlError);
  assertStringList(value.roleTags, {
    label: `${fileName} roleTags`,
    minItems: 1,
    maxItems: SHOWCASE_LIMITS.roleTags,
    maxLength: SHOWCASE_LIMITS.roleTag,
  });
  if (new Set(value.roleTags).size !== value.roleTags.length) throw new Error(`${fileName} roleTags 不得重复`);
  assertStringList(value.publicHighlights, {
    label: `${fileName} publicHighlights`,
    minItems: 3,
    maxItems: 3,
    maxLength: SHOWCASE_LIMITS.publicHighlight,
  });

  assertExactFields(value.auditSummary, AUDIT_FIELDS, `${fileName} auditSummary`);
  const audit = value.auditSummary;
  if (audit.strict !== true || audit.maxScore !== 5 || !Number.isInteger(audit.score) || audit.score < 0 || audit.score > 5) {
    throw new Error(`${fileName} auditSummary 无效`);
  }
  assertExactFields(audit.dimensions, SHOWCASE_DIMENSIONS, `${fileName} auditSummary.dimensions`);
  if (SHOWCASE_DIMENSIONS.some((field) => typeof audit.dimensions[field] !== "boolean")) {
    throw new Error(`${fileName} 审计维度必须为布尔值`);
  }
  if (audit.score !== SHOWCASE_DIMENSIONS.filter((field) => audit.dimensions[field]).length) {
    throw new Error(`${fileName} 审计总分与五维状态不一致`);
  }

  assertExactFields(value.disclosure, SHOWCASE_DISCLOSURES, `${fileName} disclosure`);
  if (SHOWCASE_DISCLOSURES.some((field) => value.disclosure[field] !== "confirmed")) {
    throw new Error(`${fileName} 公开披露确认不完整`);
  }
  return value;
}

export function normalizeShowcaseDraft(value = {}) {
  const source = isPlainObject(value) ? value : {};
  const audit = isPlainObject(source.auditSummary) ? source.auditSummary : {};
  const dimensions = isPlainObject(audit.dimensions) ? audit.dimensions : {};
  const disclosure = isPlainObject(source.disclosure) ? source.disclosure : {};
  const roleTags = Array.isArray(source.roleTags) ? source.roleTags.map(normalizeText).filter(Boolean) : [];
  const highlights = Array.isArray(source.publicHighlights) ? source.publicHighlights.slice(0, 3).map(normalizeText) : [];

  return {
    slug: normalizeText(source.slug),
    publicUrl: normalizeText(source.publicUrl),
    roleTags: [...new Set(roleTags)],
    publicHighlights: Array.from({ length: 3 }, (_, index) => highlights[index] ?? ""),
    auditSummary: {
      dimensions: Object.fromEntries(SHOWCASE_DIMENSIONS.map((field) => [field, dimensions[field] === true])),
    },
    disclosure: Object.fromEntries(SHOWCASE_DISCLOSURES.map((field) => [field, disclosure[field] === true || disclosure[field] === "confirmed"])),
  };
}

export function parseShowcaseDraftJson(source) {
  if (typeof source !== "string" || !source.trim()) return { ok: false, message: "请粘贴或选择 SHOWCASE_ENTRY.json。" };
  try {
    const parsed = JSON.parse(source);
    if (!isPlainObject(parsed)) return { ok: false, message: "SHOWCASE_ENTRY.json 根级必须是对象。" };
    return { ok: true, draft: normalizeShowcaseDraft(parsed) };
  } catch {
    return { ok: false, message: "JSON 无法解析，请检查格式后重试。" };
  }
}

export function createShowcaseEntry(draftValue) {
  const draft = normalizeShowcaseDraft(draftValue);
  const dimensions = draft.auditSummary.dimensions;
  return {
    slug: draft.slug,
    kind: "community",
    publicUrl: draft.publicUrl,
    roleTags: draft.roleTags,
    publicHighlights: draft.publicHighlights,
    auditSummary: {
      strict: true,
      score: SHOWCASE_DIMENSIONS.filter((field) => dimensions[field]).length,
      maxScore: 5,
      dimensions,
    },
    disclosure: Object.fromEntries(SHOWCASE_DISCLOSURES.map((field) => [field, draft.disclosure[field] ? "confirmed" : "pending"])),
  };
}

export function assessShowcaseDraft(draftValue) {
  const draft = normalizeShowcaseDraft(draftValue);
  const errors = [];
  if (!draft.slug || draft.slug.length > SHOWCASE_LIMITS.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(draft.slug)) {
    errors.push(`slug 只能使用小写字母、数字和单个连字符，最长 ${SHOWCASE_LIMITS.slug} 个字符。`);
  }
  const urlError = getPublicUrlError(draft.publicUrl);
  if (urlError) errors.push(urlError);
  if (draft.roleTags.length < 1 || draft.roleTags.length > SHOWCASE_LIMITS.roleTags) {
    errors.push(`roleTags 需要 1–${SHOWCASE_LIMITS.roleTags} 项。`);
  }
  if (draft.roleTags.some((tag) => codePointLength(tag) > SHOWCASE_LIMITS.roleTag)) {
    errors.push(`每个角色标签最长 ${SHOWCASE_LIMITS.roleTag} 个字符。`);
  }
  if (draft.publicHighlights.length !== 3 || draft.publicHighlights.some((item) => !item || codePointLength(item) > SHOWCASE_LIMITS.publicHighlight)) {
    errors.push(`必须填写恰好 3 条公开亮点，每条 1–${SHOWCASE_LIMITS.publicHighlight} 个字符。`);
  }
  if (SHOWCASE_DISCLOSURES.some((field) => !draft.disclosure[field])) errors.push("四项公开披露必须全部确认。");

  const entry = createShowcaseEntry(draft);
  if (errors.length === 0) {
    try {
      validateShowcaseEntry(entry, `${entry.slug}.json`);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "条目不符合公开 schema。" );
    }
  }
  return { valid: errors.length === 0, errors, draft, entry: errors.length === 0 ? entry : null };
}

export function createShowcaseIssueSummary(entry) {
  validateShowcaseEntry(entry, `${entry.slug}.json`);
  return [
    "## Showcase 公开投稿摘要",
    "",
    `- slug：\`${entry.slug}\``,
    `- 公开地址：${entry.publicUrl}`,
    `- 角色标签：${entry.roleTags.join("、")}`,
    `- 严格审计：${entry.auditSummary.score}/${entry.auditSummary.maxScore}`,
    "",
    "### 3 个公开亮点",
    ...entry.publicHighlights.map((item) => `- ${item}`),
    "",
    "四项披露已确认：公开授权、无需登录访问、敏感材料复核、可申请下架。",
    "",
    "> GitHub Issue 会公开显示提交账号与以上内容，不是真正匿名。",
  ].join("\n");
}
