import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createPortfolioExport } from "../src/lib/config-export.mjs";
import { normalizePortfolioData } from "../src/lib/normalize.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function draft(mode) {
  return {
    mode, name: "示例用户", role: "", summary: "简介", email: "hello@example.com",
    projects: [1, 2, 3].map((index) => ({
      title: `案例 ${index}`, problem: `问题 ${index}`, method: `方法 ${index}`,
      goal: `目标人群 ${index}`, actions: `运营动作 ${index}`, result: `结果 ${index}`,
    })),
  };
}

test("默认首页只装配四个求职核心区块且严格读取三个代表项目", () => {
  const page = read("src/app/page.tsx");
  assert.match(page, /HeroOverview/u);
  assert.match(page, /FeaturedProjectShowcase/u);
  assert.match(page, /HomeEvidenceSection/u);
  assert.match(page, /ClosingCTA/u);
  assert.doesNotMatch(page, /AiWorkflowExperiments|HomeThinkingTeaser|CareerLifeRoadmap/u);
  const data = JSON.parse(read("data/projects.json"));
  assert.equal(data.featuredProjectSlugs.length, 3);
});

test("高级入口和组件由默认关闭的 feature flags 控制", () => {
  const data = JSON.parse(read("data/projects.json"));
  assert.deepEqual(data.features, { profile: false, thinking: false, advancedModels: false });
  const header = read("src/components/Header.tsx");
  assert.match(header, /features\.profile/u);
  assert.match(header, /features\.thinking/u);
  assert.match(header, /配置作品集/u);
  assert.match(read("src/app/layout.tsx"), /features\.advancedModels/u);
});

test("config 是纯前端静态页面并提供本地 JSON 下载", () => {
  assert.match(read("src/components/config/PortfolioConfigurator.tsx"), /^"use client";/u);
  assert.match(read("src/components/config/PortfolioConfigurator.tsx"), /Blob|projects\.json/u);
  assert.doesNotMatch(read("src/components/config/PortfolioConfigurator.tsx"), /fetch\(|XMLHttpRequest|axios/u);
  assert.match(read("src/app/config/page.tsx"), /PortfolioConfigurator/u);
});

test("product 与 operations 使用不同字段并导出完整通用详情数据", () => {
  const product = createPortfolioExport(draft("product"));
  const operations = createPortfolioExport(draft("operations"));
  assert.equal(product.projects.length, 3);
  assert.equal(operations.projects.length, 3);
  assert.equal(product.projects[0].caseStudy.question, "问题 1");
  assert.equal(operations.projects[0].caseStudy.question, "目标人群 1");
  assert.deepEqual(product.projects[0].actions, ["方法 1"]);
  assert.deepEqual(operations.projects[0].actions, ["运营动作 1"]);
  for (const project of operations.projects) {
    for (const key of ["slug", "title", "summary", "background", "caseStudy", "actions", "results", "metrics"]) assert.ok(key in project);
  }
  assert.equal(operations.features.advancedModels, false);
});

test("未知专用 slug 使用数据驱动的通用详情组件", () => {
  const detail = read("src/components/ProjectDetail.tsx");
  assert.match(detail, /narrative \? <ProjectOnePage project=\{project\} \/> : <GenericProjectDetail project=\{project\} \/>/u);
  const generic = read("src/components/GenericProjectDetail.tsx");
  assert.match(generic, /project\.caseStudy\.question/u);
  assert.match(generic, /project\.background/u);
  assert.match(generic, /project\.results/u);
});

test("旧 v1 数据经 normalize 补齐 v2 且不报错", () => {
  const normalized = normalizePortfolioData({
    profile: { name: "旧用户", email: "old@example.com" },
    projects: [{ slug: "legacy", title: "旧项目", summary: "旧摘要", actions: ["动作"], results: ["结果"] }],
  });
  assert.equal(normalized.schemaVersion, 2);
  assert.equal(normalized.profile.name, "旧用户");
  assert.deepEqual(normalized.featuredProjectSlugs, ["legacy"]);
  assert.equal(normalized.projects[0].caseStudy.question, "旧摘要");
  assert.equal(normalized.features.thinking, false);
});

test("Pages basePath 可覆盖 config 与下载页的静态路由", () => {
  assert.match(read("next.config.ts"), /output: "export"/u);
  assert.match(read("next.config.ts"), /basePath/u);
  assert.match(read("src/components/Header.tsx"), /href="\/config\/"/u);
});
