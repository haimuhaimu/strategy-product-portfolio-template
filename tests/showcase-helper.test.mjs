import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadShowcaseEntries } from "../src/lib/showcase.mjs";
import {
  SHOWCASE_LIMITS,
  assessShowcaseDraft,
  createShowcaseIssueSummary,
  normalizeShowcaseDraft,
  parseShowcaseDraftJson,
} from "../src/lib/showcase-entry.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function validDraft(overrides = {}) {
  return normalizeShowcaseDraft({
    slug: "community-product-case",
    publicUrl: "https://portfolio.example.com/work/",
    roleTags: ["产品经理", "AI 产品"],
    publicHighlights: ["明确问题与约束", "展示关键取舍", "标注个人与团队边界"],
    auditSummary: {
      dimensions: {
        resultEvidence: true,
        scopeAndAttribution: true,
        methodEvidence: true,
        artifactEvidence: false,
        contributionBoundary: true,
      },
    },
    disclosure: {
      authorized: true,
      publiclyAccessible: true,
      sensitiveMaterialReviewed: true,
      takedownAvailable: true,
    },
    ...overrides,
  });
}

test("Launchpad 草稿解析时只保留公开字段并规范化文本", () => {
  const rawResume = "PRIVATE_RESUME_DO_NOT_COPY";
  const parsed = parseShowcaseDraftJson(JSON.stringify({
    ...validDraft(),
    slug: "  community-product-case  ",
    roleTags: [" 产品经理 ", "产品经理", " AI   产品 "],
    publicHighlights: [" 亮点一 ", "亮点   二", "亮点三"],
    rawResume,
    email: "private@example.com",
  }));

  assert.equal(parsed.ok, true);
  assert.equal(parsed.draft.slug, "community-product-case");
  assert.deepEqual(parsed.draft.roleTags, ["产品经理", "AI 产品"]);
  assert.deepEqual(parsed.draft.publicHighlights, ["亮点一", "亮点 二", "亮点三"]);
  assert.equal("rawResume" in parsed.draft, false);
  assert.equal("email" in parsed.draft, false);
  assert.equal(parseShowcaseDraftJson("{").ok, false);
});

test("严格拒绝危险 URL、非法 slug 与超过 schema 的字段长度", () => {
  const unsafeUrls = [
    "http://example.com/",
    "https://user:pass@example.com/",
    "https://example.com/?token=secret",
    "https://example.com/#draft",
    "https://example.com:443/",
    "https://127.0.0.1/",
    "https://[::1]/",
    "https://localhost/",
    "https://portfolio.internal/",
    "https://exa\nmple.com/",
    "https://singlelabel/",
  ];
  for (const publicUrl of unsafeUrls) {
    assert.equal(assessShowcaseDraft(validDraft({ publicUrl })).valid, false, publicUrl);
  }
  assert.equal(assessShowcaseDraft(validDraft({ slug: "Invalid_Slug" })).valid, false);
  assert.equal(assessShowcaseDraft(validDraft({ slug: `a${"b".repeat(SHOWCASE_LIMITS.slug)}` })).valid, false);
  assert.equal(assessShowcaseDraft(validDraft({ roleTags: ["x".repeat(SHOWCASE_LIMITS.roleTag + 1)] })).valid, false);
  assert.equal(assessShowcaseDraft(validDraft({ publicHighlights: ["a", "b", "x".repeat(SHOWCASE_LIMITS.publicHighlight + 1)] })).valid, false);
});

test("四项披露是最终下载数据的硬门槛", () => {
  const incomplete = validDraft({ disclosure: { authorized: true } });
  const blocked = assessShowcaseDraft(incomplete);
  assert.equal(blocked.valid, false);
  assert.match(blocked.errors.join("\n"), /四项公开披露必须全部确认/u);

  const accepted = assessShowcaseDraft(validDraft());
  assert.equal(accepted.valid, true);
  assert.deepEqual(new Set(Object.values(accepted.entry.disclosure)), new Set(["confirmed"]));
});

test("投稿助手生成的最终 entry 可被现有 Showcase Loader 直接读取", () => {
  const assessment = assessShowcaseDraft(validDraft());
  assert.equal(assessment.valid, true);
  const directory = mkdtempSync(path.join(os.tmpdir(), "showcase-helper-"));
  try {
    const filename = `${assessment.entry.slug}.json`;
    writeFileSync(path.join(directory, filename), JSON.stringify(assessment.entry));
    assert.deepEqual(loadShowcaseEntries(directory), [assessment.entry]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("公开 Issue 摘要仅使用最终白名单，不泄露导入草稿原文", () => {
  const secret = "UNSUBMITTED_PRIVATE_RESUME_2026";
  const parsed = parseShowcaseDraftJson(JSON.stringify({ ...validDraft(), rawResume: secret, internalNotes: secret }));
  const assessment = assessShowcaseDraft(parsed.draft);
  const summary = createShowcaseIssueSummary(assessment.entry);

  assert.doesNotMatch(summary, new RegExp(secret, "u"));
  assert.match(summary, /community-product-case/u);
  assert.match(summary, /GitHub Issue 会公开显示提交账号/u);
  assert.doesNotMatch(summary, /rawResume|internalNotes/u);
});

test("投稿页保持纯本地、静态导出、basePath、noindex 与入口契约", () => {
  const page = read("src/app/launchpad/showcase/page.tsx");
  const workbench = read("src/components/launchpad/ShowcaseSubmissionWorkbench.tsx");
  const fields = read("src/components/launchpad/ShowcaseEntryFields.tsx");
  const helper = read("src/lib/showcase-entry.mjs");
  const showcase = read("src/app/showcase/page.tsx");
  const launchpad = read("src/components/launchpad/LaunchpadWorkbench.tsx");
  const readme = read("README.md");
  const sitemap = read("src/app/sitemap.ts");
  const robots = read("src/app/robots.ts");
  const config = read("next.config.ts");
  const combined = `${page}\n${workbench}\n${fields}\n${helper}`;

  assert.doesNotMatch(combined, /\bfetch\s*\(|api\.github\.com|<iframe\b/iu);
  assert.match(page, /dynamic = "force-static"/u);
  assert.match(page, /pathname: "\/launchpad\/showcase\/"/u);
  assert.match(page, /index: false/u);
  assert.match(config, /output: "export"/u);
  assert.match(config, /basePath/u);
  assert.doesNotMatch(sitemap, /launchpad\/showcase/u);
  assert.match(robots, /launchpad\//u);
  assert.match(workbench, /StaticPageLink/u);
  assert.match(workbench, /aria-live="polite"/u);
  assert.match(workbench, /focus-visible:/u);
  assert.match(workbench, /motion-reduce:/u);
  assert.match(showcase, /href="\/launchpad\/showcase\/"/u);
  assert.match(launchpad, /href="\/launchpad\/showcase\/"/u);
  assert.match(readme, /launchpad\/showcase\//u);
});
