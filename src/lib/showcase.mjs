import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SHOWCASE_DIMENSIONS,
  SHOWCASE_DISCLOSURES,
  validateShowcaseEntry,
} from "./showcase-entry.mjs";

export { SHOWCASE_DIMENSIONS } from "./showcase-entry.mjs";

const KIND_ORDER = new Map([
  ["community", 0],
  ["maintainer/self-test", 1],
]);
const defaultEntriesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../showcase/entries",
);

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
      SHOWCASE_DISCLOSURES.map((field) => [field, value.disclosure[field]]),
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
      validateShowcaseEntry(value, fileName);
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
