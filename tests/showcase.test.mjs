import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { isIP } from "node:net";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entriesDir = path.join(root, "showcase", "entries");
const schema = JSON.parse(readFileSync(path.join(root, "showcase", "schema.json"), "utf8"));
const entryFiles = readdirSync(entriesDir).filter((name) => name.endsWith(".json")).sort();
const entries = entryFiles.map((name) => ({
  name,
  value: JSON.parse(readFileSync(path.join(entriesDir, name), "utf8")),
}));

const allowedRootFields = new Set([
  "slug",
  "kind",
  "publicUrl",
  "roleTags",
  "publicHighlights",
  "auditSummary",
  "disclosure",
]);
const dimensionFields = [
  "resultEvidence",
  "scopeAndAttribution",
  "methodEvidence",
  "artifactEvidence",
  "contributionBoundary",
];
const disclosureFields = [
  "authorized",
  "publiclyAccessible",
  "sensitiveMaterialReviewed",
  "takedownAvailable",
];

function assertPublicSafeUrl(rawUrl) {
  const url = new URL(rawUrl);
  assert.equal(url.protocol, "https:");
  assert.equal(url.username, "");
  assert.equal(url.password, "");
  assert.equal(url.search, "");
  assert.equal(url.hash, "");
  assert.equal(url.port, "");
  assert.equal(isIP(url.hostname), 0, "URL 不得使用 IP 地址");
  assert.doesNotMatch(url.hostname, /^(?:localhost|.*\.(?:internal|local|corp|intranet))$/iu);
  assert.ok(url.hostname.includes("."), "URL 必须使用公共域名");
}

test("Showcase schema 禁止额外字段并声明全部必填字段", () => {
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(new Set(schema.required), allowedRootFields);
  assert.deepEqual(new Set(Object.keys(schema.properties)), allowedRootFields);
  assert.equal(schema.properties.auditSummary.additionalProperties, false);
  assert.equal(schema.properties.disclosure.additionalProperties, false);
});

test("Showcase 条目满足字段、类型和审计摘要约束", () => {
  assert.ok(entries.length > 0);

  for (const { name, value } of entries) {
    assert.deepEqual(new Set(Object.keys(value)), allowedRootFields, `${name} 根字段不符合 schema`);
    assert.match(value.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
    assert.equal(name, `${value.slug}.json`);
    assert.ok(["community", "maintainer/self-test"].includes(value.kind));
    assert.ok(Array.isArray(value.roleTags) && value.roleTags.length > 0);
    assert.ok(Array.isArray(value.publicHighlights) && value.publicHighlights.length > 0 && value.publicHighlights.length <= 5);
    assert.equal(value.auditSummary.strict, true);
    assert.equal(value.auditSummary.maxScore, 5);
    assert.ok(Number.isInteger(value.auditSummary.score) && value.auditSummary.score >= 0 && value.auditSummary.score <= 5);
    assert.deepEqual(Object.keys(value.auditSummary.dimensions).sort(), [...dimensionFields].sort());
    assert.ok(dimensionFields.every((field) => typeof value.auditSummary.dimensions[field] === "boolean"));
    assert.equal(value.auditSummary.score, dimensionFields.filter((field) => value.auditSummary.dimensions[field]).length);
  }
});

test("Showcase slug 唯一且 URL 可公开安全访问", () => {
  const slugs = entries.map(({ value }) => value.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const { value } of entries) assertPublicSafeUrl(value.publicUrl);
});

test("Showcase 每项披露确认均明确完成", () => {
  for (const { name, value } of entries) {
    assert.deepEqual(Object.keys(value.disclosure).sort(), [...disclosureFields].sort());
    for (const field of disclosureFields) {
      assert.equal(value.disclosure[field], "confirmed", `${name} 缺少 ${field} 确认`);
    }
  }
});
