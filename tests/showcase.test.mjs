import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { isIP } from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { loadShowcaseEntries } from "../src/lib/showcase.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entriesDir = path.join(root, "showcase", "entries");
const schema = JSON.parse(readFileSync(path.join(root, "showcase", "schema.json"), "utf8"));
const entryFiles = readdirSync(entriesDir).filter((name) => name.endsWith(".json")).sort();
const entries = entryFiles.map((name) => ({
  name,
  value: JSON.parse(readFileSync(path.join(entriesDir, name), "utf8")),
}));
const read = (file) => readFileSync(path.join(root, file), "utf8");

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

function makeEntry(slug, kind = "community") {
  return {
    slug,
    kind,
    publicUrl: `https://${slug}.example.com/`,
    roleTags: ["产品经理"],
    publicHighlights: ["公开亮点一", "公开亮点二", "公开亮点三"],
    auditSummary: {
      strict: true,
      score: 4,
      maxScore: 5,
      dimensions: {
        resultEvidence: true,
        scopeAndAttribution: false,
        methodEvidence: true,
        artifactEvidence: true,
        contributionBoundary: true,
      },
    },
    disclosure: {
      authorized: "confirmed",
      publiclyAccessible: "confirmed",
      sensitiveMaterialReviewed: "confirmed",
      takedownAvailable: "confirmed",
    },
  };
}

function withFixtureDir(files, run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "showcase-loader-"));
  try {
    for (const [name, value] of Object.entries(files)) {
      writeFileSync(path.join(directory, name), typeof value === "string" ? value : JSON.stringify(value));
    }
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("Showcase schema 禁止额外字段并声明全部必填字段", () => {
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(new Set(schema.required), allowedRootFields);
  assert.deepEqual(new Set(Object.keys(schema.properties)), allowedRootFields);
  assert.equal(schema.properties.slug.maxLength, 80);
  assert.equal(schema.properties.publicUrl.maxLength, 2048);
  assert.equal(schema.properties.roleTags.maxItems, 8);
  assert.equal(schema.properties.roleTags.items.maxLength, 40);
  assert.equal(schema.properties.publicHighlights.minItems, 3);
  assert.equal(schema.properties.publicHighlights.maxItems, 3);
  assert.equal(schema.properties.publicHighlights.items.maxLength, 160);
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
    assert.equal(value.publicHighlights.length, 3);
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

test("构建期 loader 仅返回公开白名单字段，并稳定排序 community 与 self-test", () => {
  withFixtureDir({
    "z-self.json": makeEntry("z-self", "maintainer/self-test"),
    "b-community.json": makeEntry("b-community"),
    "a-community.json": makeEntry("a-community"),
  }, (directory) => {
    const loaded = loadShowcaseEntries(directory);
    assert.deepEqual(loaded.map(({ slug }) => slug), ["a-community", "b-community", "z-self"]);
    for (const entry of loaded) {
      assert.deepEqual(new Set(Object.keys(entry)), allowedRootFields);
      assert.notEqual(entry, makeEntry(entry.slug));
    }
  });
});

test("构建期 loader 对额外字段、危险 URL 与损坏 JSON 安全失败", () => {
  const withExtra = { ...makeEntry("extra-field"), privateEmail: "do-not-publish@example.com" };
  withFixtureDir({ "extra-field.json": withExtra }, (directory) => {
    assert.throws(() => loadShowcaseEntries(directory), /字段不符合公开 schema/u);
  });
  const unsafe = { ...makeEntry("unsafe-url"), publicUrl: "https://example.com/?token=secret" };
  withFixtureDir({ "unsafe-url.json": unsafe }, (directory) => {
    assert.throws(() => loadShowcaseEntries(directory), /公共 HTTPS 地址/u);
  });
  withFixtureDir({ "broken.json": "{" }, (directory) => {
    assert.throws(() => loadShowcaseEntries(directory), /Showcase 条目加载失败/u);
  });
});

test("Showcase 页面纯静态读取，并保留诚实标记、CTA 与隐私下架契约", () => {
  const page = read("src/app/showcase/page.tsx");
  const loader = read("src/lib/showcase.mjs");
  const issue = read(".github/ISSUE_TEMPLATE/showcase.yml");
  assert.doesNotMatch(`${page}\n${loader}`, /\bfetch\s*\(|<iframe\b/iu);
  assert.match(loader, /readFileSync/u);
  for (const phrase of ["维护者自测", "不是第三方用户案例", "不是第三方客户案例", "GitHub Issue 会公开显示你的 GitHub 账号", "不是匿名渠道", "下架请求"]) {
    assert.match(page, new RegExp(phrase, "u"));
  }
  assert.match(page, /issues\/new\?template=showcase\.yml/u);
  assert.match(page, /rel="noopener noreferrer"/u);
  assert.ok(page.includes("href={`/showcase/${entry.slug}/`}"));
  assert.ok(page.includes("getAbsoluteUrl(`/showcase/${entry.slug}/`)"));
  assert.match(page, /"ItemList"/u);
  assert.match(page, /"BreadcrumbList"/u);
  assert.match(issue, /Issue 和作品站点都是公开内容/u);
  assert.match(issue, /授权撤回/u);
});

test("README、Header 与首页提供 basePath 兼容的 Showcase 和 GitHub 回流入口", () => {
  const readme = read("README.md");
  const header = read("src/components/Header.tsx");
  const home = read("src/app/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const readmeHero = readme.split("## 为什么不是普通 Portfolio Template")[0];
  assert.match(readmeHero, /查看社区案例/u);
  assert.match(readmeHero, /给项目一个 GitHub Star/u);
  assert.match(readmeHero, /查看贡献指南/u);
  assert.match(readmeHero, /提交你的 Showcase/u);
  assert.match(header, /<StaticPageLink href="\/showcase\/"/u);
  assert.match(header, /GitHub Star/u);
  assert.match(header, />贡献<\/a>/u);
  assert.equal([...header.matchAll(/target="_blank"/gu)].length, 2);
  assert.equal([...header.matchAll(/rel="noopener noreferrer"/gu)].length, 2);
  assert.doesNotMatch(header, /GitHub Star[\s\S]{0,200}hidden/u);
  assert.match(home, /<StaticPageLink href="\/showcase\/"/u);
  assert.match(sitemap, /loadShowcaseEntries/u);
  assert.ok(sitemap.includes("`/showcase/${entry.slug}/`"));
});
