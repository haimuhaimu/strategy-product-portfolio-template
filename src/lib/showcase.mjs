import { readdirSync, readFileSync } from "node:fs";
import { isIP } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
export const SHOWCASE_DIMENSIONS = [
  "resultEvidence",
  "scopeAndAttribution",
  "methodEvidence",
  "artifactEvidence",
  "contributionBoundary",
];
const DISCLOSURE_FIELDS = [
  "authorized",
  "publiclyAccessible",
  "sensitiveMaterialReviewed",
  "takedownAvailable",
];
const KIND_ORDER = new Map([
  ["community", 0],
  ["maintainer/self-test", 1],
]);
const defaultEntriesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../showcase/entries",
);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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
  if (value.some((item) => typeof item !== "string" || item.trim().length < 1 || item.length > maxLength)) {
    throw new Error(`${label} 包含无效文本`);
  }
}

function assertPublicUrl(rawUrl) {
  if (typeof rawUrl !== "string") throw new Error("publicUrl 必须是字符串");
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("publicUrl 不是有效 URL");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.port ||
    isIP(url.hostname) !== 0 ||
    !url.hostname.includes(".") ||
    /^(?:localhost|.*\.(?:internal|local|corp|intranet))$/iu.test(url.hostname)
  ) {
    throw new Error("publicUrl 必须是无凭据、参数和片段的公共 HTTPS 地址");
  }
}

function validateEntry(value, fileName) {
  assertExactFields(value, SHOWCASE_FIELDS, fileName);
  if (typeof value.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value.slug)) {
    throw new Error(`${fileName} slug 无效`);
  }
  if (fileName !== `${value.slug}.json`) throw new Error(`${fileName} 文件名必须与 slug 一致`);
  if (!KIND_ORDER.has(value.kind)) throw new Error(`${fileName} kind 无效`);
  assertPublicUrl(value.publicUrl);
  assertStringList(value.roleTags, { label: `${fileName} roleTags`, minItems: 1, maxItems: Number.MAX_SAFE_INTEGER, maxLength: 40 });
  if (new Set(value.roleTags).size !== value.roleTags.length) throw new Error(`${fileName} roleTags 不得重复`);
  assertStringList(value.publicHighlights, { label: `${fileName} publicHighlights`, minItems: 3, maxItems: 3, maxLength: 160 });

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

  assertExactFields(value.disclosure, DISCLOSURE_FIELDS, `${fileName} disclosure`);
  if (DISCLOSURE_FIELDS.some((field) => value.disclosure[field] !== "confirmed")) {
    throw new Error(`${fileName} 公开披露确认不完整`);
  }
}

function toPublicEntry(value) {
  return {
    slug: value.slug,
    kind: value.kind,
    publicUrl: value.publicUrl,
    roleTags: [...value.roleTags],
    publicHighlights: [...value.publicHighlights],
    auditSummary: {
      strict: value.auditSummary.strict,
      score: value.auditSummary.score,
      maxScore: value.auditSummary.maxScore,
      dimensions: Object.fromEntries(
        SHOWCASE_DIMENSIONS.map((field) => [field, value.auditSummary.dimensions[field]]),
      ),
    },
    disclosure: Object.fromEntries(
      DISCLOSURE_FIELDS.map((field) => [field, value.disclosure[field]]),
    ),
  };
}

export function loadShowcaseEntries(entriesDir = defaultEntriesDir) {
  const files = readdirSync(entriesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
  const slugs = new Set();
  const entries = files.map((fileName) => {
    let value;
    try {
      value = JSON.parse(readFileSync(path.join(entriesDir, fileName), "utf8"));
      validateEntry(value, fileName);
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      throw new Error(`Showcase 条目加载失败（${fileName}）：${message}`);
    }
    if (slugs.has(value.slug)) throw new Error(`Showcase slug 重复：${value.slug}`);
    slugs.add(value.slug);
    return toPublicEntry(value);
  });

  return entries.sort((left, right) => {
    const kindDifference = KIND_ORDER.get(left.kind) - KIND_ORDER.get(right.kind);
    if (kindDifference !== 0) return kindDifference;
    return left.slug < right.slug ? -1 : left.slug > right.slug ? 1 : 0;
  });
}
