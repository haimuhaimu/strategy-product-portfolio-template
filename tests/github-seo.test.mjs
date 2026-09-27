import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

const discoveryTerms = [
  "product manager portfolio",
  "AI product manager portfolio",
  "operations portfolio",
  "portfolio template",
];

test("README 首屏覆盖中英文搜索意图和可访问的核心入口", () => {
  const readme = read("README.md");
  const firstScreen = readme.split("## 两种开始方式")[0];

  assert.match(firstScreen, /^# Product Manager Portfolio Template：/mu);
  for (const term of discoveryTerms) {
    assert.ok(firstScreen.toLowerCase().includes(term.toLowerCase()), `README 首屏缺少搜索词：${term}`);
  }
  for (const link of ["在线 Demo", "用 Agent 开始制作", "检查并下载作品集", "比较四种模板"]) {
    assert.ok(firstScreen.includes(link), `README 首屏缺少入口：${link}`);
  }
  assert.match(firstScreen, /证据审计/u);
  assert.match(firstScreen, /隐私检查/u);
});

test("package metadata 与仓库名和 GitHub 发现关键词一致", () => {
  const pkg = JSON.parse(read("package.json"));
  const lock = JSON.parse(read("package-lock.json"));

  assert.equal(pkg.name, "strategy-product-portfolio-template");
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.packages[""].name, pkg.name);
  assert.equal(lock.packages[""].version, pkg.version);
  for (const keyword of [
    "product-manager-portfolio",
    "product-case-study",
    "ai-product-manager",
    "operations-portfolio",
    "portfolio-template",
    "agent-skills",
    "github-pages",
  ]) {
    assert.ok(pkg.keywords.includes(keyword), `package keywords 缺少：${keyword}`);
  }
});

test("站点首页 metadata 承接仓库核心搜索词", () => {
  const seo = read("src/lib/seo.ts");

  for (const term of [...discoveryTerms, "产品经理作品集", "AI 产品经理作品集", "运营作品集"]) {
    assert.ok(seo.toLowerCase().includes(term.toLowerCase()), `站点 metadata 缺少：${term}`);
  }
  assert.match(seo, /Agent 驱动/u);
  assert.match(seo, /隐私检查/u);
});
