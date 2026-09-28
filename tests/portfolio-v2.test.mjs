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

test("首页维持求职主线并在证据之后加入 Signature Atlas", () => {
  const page = read("src/app/page.tsx");
  assert.match(page, /HeroOverview/u);
  assert.match(page, /FeaturedProjectShowcase/u);
  assert.match(page, /HomeEvidenceSection/u);
  assert.match(page, /SignatureAtlasSection/u);
  assert.match(page, /ClosingCTA/u);
  assert.ok(page.indexOf("SignatureAtlasSection roadmap") > page.indexOf("HomeEvidenceSection home"));
  assert.doesNotMatch(page, /AiWorkflowExperiments|HomeThinkingTeaser|CareerLifeRoadmap/u);
  const data = JSON.parse(read("data/projects.json"));
  assert.equal(data.featuredProjectSlugs.length, 3);
});

test("高级入口由 feature flags 控制且思考星图由首页独立进入", () => {
  const data = JSON.parse(read("data/projects.json"));
  assert.deepEqual(data.features, { profile: false, thinking: false, advancedModels: false });
  const header = read("src/components/Header.tsx");
  assert.match(header, /features\.profile/u);
  assert.match(header, /features\.thinking/u);
  assert.match(header, /用 Agent 制作/u);
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

test("路线图与星图读取真实项目关系并提供键盘浏览", () => {
  const data = JSON.parse(read("data/projects.json"));
  const slugs = new Set(data.projects.map((project) => project.slug));
  assert.deepEqual(data.roadmap.map((stage) => stage.title), ["发现问题", "定义口径", "实验验证", "机制化", "AI 协作"]);
  assert.equal(data.starMap.nodes.filter((node) => node.kind === "capability").length, 6);
  for (const stage of data.roadmap) for (const slug of stage.projectSlugs) assert.ok(slugs.has(slug));
  for (const node of data.starMap.nodes) for (const slug of node.projectSlugs) assert.ok(slugs.has(slug));
  const nodeIds = new Set(data.starMap.nodes.map((node) => node.id));
  for (const edge of data.starMap.edges) {
    assert.ok(nodeIds.has(edge.source));
    assert.ok(nodeIds.has(edge.target));
  }
  assert.match(read("src/components/PersonalRoadmap.tsx"), /ArrowRight|ArrowLeft/u);
  assert.match(read("src/components/ThinkingStarMap.tsx"), /tabIndex=\{0\}/u);
  assert.match(read("src/components/SignatureAtlasSection.tsx"), /StaticPageLink/u);
});

test("Pages basePath 可覆盖 config 与下载页的静态路由", () => {
  assert.match(read("next.config.ts"), /output: "export"/u);
  assert.match(read("next.config.ts"), /basePath/u);
  assert.match(read("src/components/Header.tsx"), /href="\/start\/"/u);
});
