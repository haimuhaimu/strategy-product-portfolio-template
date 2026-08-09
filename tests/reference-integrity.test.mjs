import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { validatePortfolioReferences } from "../src/lib/evidence-audit.mjs";
import auditManifest from "../skills/portfolio-story-builder/audit-manifest.json" with { type: "json" };

const root = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(readFileSync(path.join(root, "data/projects.json"), "utf8"));
const clone = () => structuredClone(source);

test("JS 引用校验对合法现有数据零误报", () => {
  assert.deepEqual(validatePortfolioReferences(clone()), { valid: true, findings: [] });
});

test("JS 引用校验发现 featured、roadmap 与 starMap 断链", () => {
  const data = clone();
  data.featuredProjectSlugs[0] = "missing-featured";
  data.roadmap[0].projectSlugs.push("missing-roadmap");
  data.starMap.nodes[0].projectSlugs.push("missing-star-project");
  data.starMap.edges[0].target = "missing-node";
  const result = validatePortfolioReferences(data);
  assert.equal(result.valid, false);
  assert.deepEqual(new Set(result.findings.map((item) => item.code)), new Set([
    auditManifest.ruleIds.featuredMissing,
    auditManifest.ruleIds.roadmapProjectMissing,
    auditManifest.ruleIds.starMapProjectMissing,
    auditManifest.ruleIds.starMapEdgeMissing,
  ]));
});

test("共享 manifest 提供跨语言规则标识与脱水隐私规则", () => {
  assert.equal(auditManifest.manifestVersion, 1);
  assert.ok(auditManifest.fluffWords.includes("赋能"));
  assert.ok(auditManifest.privacyPatterns.some((rule) => rule.id === "internal_url"));
  assert.ok(auditManifest.ruleIds.roadmapProjectMissing);
});
