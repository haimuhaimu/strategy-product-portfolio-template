import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { assessPortfolioData, createReleasePack } from "../src/lib/launchpad.mjs";
import { normalizePortfolioData } from "../src/lib/normalize.mjs";
import {
  applyTemplateSelection,
  getActiveTemplateId,
  matchPortfolioTemplates,
  TEMPLATE_IDS,
  TEMPLATE_REGISTRY,
} from "../src/lib/templates.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const source = JSON.parse(read("data/projects.json"));
const clone = (value = source) => structuredClone(value);

function minimalProject(overrides = {}) {
  return {
    slug: "case-one",
    title: "匿名案例",
    summary: "使用样本访谈和日志验证判断，沉淀公开看板与规则，并说明本人和团队边界。",
    metrics: [{ label: "采用范围", value: "100 名测试用户" }],
    actions: ["使用样本访谈和日志验证判断"],
    results: ["在 30 天观察周期覆盖 100 名测试用户，相比基线明显提升（具体数据已脱敏）"],
    caseStudy: {
      question: "如何解决已确认的问题",
      productMethod: ["使用样本、访谈和日志验证判断"],
      algorithmAndData: [],
      evaluation: ["在 30 天观察周期覆盖 100 名测试用户，相比基线明显提升（具体数据已脱敏）"],
      artifact: ["沉淀公开看板、规则和 SOP"],
    },
    roleContribution: { scope: "本人负责方案", judgment: "本人定义判断", usedBy: "团队使用", boundary: "本人负责方案，团队共同交付" },
    ...overrides,
  };
}

function portfolio(text, options = {}) {
  const projects = [1, 2, 3].map((index) => minimalProject({ slug: `case-${index}`, title: `${text} ${index}`, summary: text }));
  return {
    schemaVersion: 2,
    rolePreset: options.rolePreset || "product",
    profile: { name: "匿名候选人", summary: text },
    featuredProjectSlugs: projects.map((project) => project.slug),
    projects,
    roadmap: options.roadmap || [],
    starMap: options.starMap || { nodes: [], edges: [] },
  };
}

function topId(data) {
  return matchPortfolioTemplates(data)[0].id;
}

test("旧数据默认 atlas，normalize 不升级 v2 且保留未知字段", () => {
  const legacy = clone();
  delete legacy.template;
  legacy.futureRoot = { enabled: true };
  legacy.home.futureHome = "keep";
  legacy.projects[0].futureProject = ["keep"];
  legacy.projects[0].caseStudy.futureCase = 42;

  const normalized = normalizePortfolioData(legacy);
  assert.equal(normalized.schemaVersion, 2);
  assert.equal(getActiveTemplateId(normalized), "atlas");
  assert.equal(normalized.template.active, "atlas");
  assert.deepEqual(normalized.futureRoot, { enabled: true });
  assert.equal(normalized.home.futureHome, "keep");
  assert.deepEqual(normalized.projects[0].futureProject, ["keep"]);
  assert.equal(normalized.projects[0].caseStudy.futureCase, 42);
});

test("模板选择只写回 template.active，不改变其他数据", () => {
  const input = { ...clone(), template: { active: "atlas", futureOption: "keep" }, futureRoot: 7 };
  const selected = applyTemplateSelection(input, "systems");
  assert.equal(selected.template.active, "systems");
  assert.equal(selected.template.futureOption, "keep");
  assert.equal(selected.futureRoot, 7);
  assert.deepEqual({ ...selected, template: input.template }, input);
  assert.notEqual(selected, input);
});

test("四模板按真实信号排序并给出加分理由与缺口", () => {
  const growth = portfolio("增长 指标 转化 留存 漏斗 激活 复购 DAU GMV 渗透 实验 对照 分组 基线 A/B 显著", { rolePreset: "operations" });
  const systems = portfolio("系统 平台 机制 规则 标准 策略 治理 分层 流程 SOP 看板 资产 复用 边界 跨团队");
  const ai = portfolio("AI Agent RAG LLM 大模型 智能体 生成式 自动化 评估 护栏 回滚 降级 人工复核 接管 准确率 召回率 幻觉 bad case");
  const atlas = portfolio("问题定义、访谈验证与个人判断", {
    roadmap: [{ id: "r1", projectSlugs: ["case-1"] }],
    starMap: { nodes: [{ id: "n1", projectSlugs: ["case-1"] }], edges: [] },
  });

  assert.equal(topId(growth), "growth");
  assert.equal(topId(systems), "systems");
  assert.equal(topId(ai), "ai-workflow");
  assert.equal(topId(atlas), "atlas");
  assert.deepEqual(
    matchPortfolioTemplates({ ...growth, template: { active: "ai-workflow" } }),
    matchPortfolioTemplates({ ...growth, template: { active: "atlas" } }),
    "既有模板选择不能反向污染内容匹配分数",
  );

  for (const fixture of [growth, systems, ai, atlas]) {
    const matches = matchPortfolioTemplates(fixture);
    assert.deepEqual(new Set(matches.map((item) => item.id)), new Set(TEMPLATE_IDS));
    assert.ok(matches.every((item) => item.score >= 0 && item.score <= 100));
    assert.ok(matches.every((item) => item.reasons.length > 0 || item.gaps.length > 0));
    assert.ok(matches.every((item, index) => index === 0 || matches[index - 1].score >= item.score));
  }
});

test("发布文件使用手动展示选择，其他四文件不变且隐私问题仍会阻止生成", () => {
  const assessment = assessPortfolioData(clone());
  const atlasPack = createReleasePack(assessment, { selectedTemplate: "atlas" });
  const aiPack = createReleasePack(assessment, { selectedTemplate: "ai-workflow" });
  assert.equal(JSON.parse(aiPack["projects.json"]).template.active, "ai-workflow");
  assert.equal(JSON.parse(atlasPack["projects.json"]).template.active, "atlas");
  for (const filename of ["audit-report.json", "RELEASE_CHECKLIST.md", "SHARE_COPY.md", "SHOWCASE_ENTRY.json"]) {
    assert.equal(aiPack[filename], atlasPack[filename], `${filename} 不应受模板选择影响`);
  }

  const unsafe = clone();
  unsafe.projects[0].summary += " private.owner@example.com";
  const blocked = assessPortfolioData(unsafe);
  assert.equal(blocked.canGenerateRelease, false);
  assert.throws(() => createReleasePack(blocked, { selectedTemplate: "growth" }), /发布文件暂不能生成/u);
});

test("四模板详情元数据完整，数组与结构项均非空", () => {
  const requiredStrings = [
    "id", "name", "shortName", "tagline", "audience", "recruiterFirstLook", "focus",
  ];
  const requiredArrays = [
    "suitableFor", "notFor", "narrativeSteps", "homeStructure", "projectStructure",
    "evidenceChecklist", "projectTypes", "commonMisuses", "agentMaterialAdvice",
    "matchSignals", "fieldMappings",
  ];

  assert.deepEqual(TEMPLATE_REGISTRY.map((template) => template.id), TEMPLATE_IDS);
  for (const template of TEMPLATE_REGISTRY) {
    for (const field of requiredStrings) {
      assert.equal(typeof template[field], "string", `${template.id}.${field} 应为字符串`);
      assert.ok(template[field].trim(), `${template.id}.${field} 不得为空`);
    }
    for (const field of requiredArrays) {
      assert.ok(Array.isArray(template[field]), `${template.id}.${field} 应为数组`);
      assert.ok(template[field].length > 0, `${template.id}.${field} 不得为空数组`);
    }
    assert.ok(template.narrativeSteps.every((step) => step.title?.trim() && step.purpose?.trim()));
    assert.ok(template.fieldMappings.every((mapping) => mapping.block?.trim() && mapping.purpose?.trim() && mapping.fields?.length));
    assert.ok(template.seo.title.trim() && template.seo.description.trim() && template.seo.keywords.length);
    assert.ok(Number.isInteger(template.exampleProjectIndex));
    assert.match(template.exampleEvidence, /^(metrics|roleContribution)$/u);
  }
});

test("详情路由覆盖四模板、完整内容、脱敏来源、站内链接与 SEO 数据源", () => {
  const detail = read("src/app/templates/[id]/page.tsx");
  const library = read("src/app/templates/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const seo = read("scripts/check-seo.mjs");

  assert.match(detail, /generateStaticParams/u);
  assert.match(detail, /TEMPLATE_IDS\.map/u);
  assert.match(detail, /dynamicParams = false/u);
  assert.match(detail, /createPageMetadata/u);
  assert.match(detail, /pathname: `\/templates\/\$\{template\.id\}\//u);
  for (const phrase of ["适合人群", "不适合人群", "招聘官第一眼", "页面结构", "发布前证据准备清单", "典型项目类型", "常见误用", "如何让自己的 Agent 帮忙", "字段映射", "脱敏示例片段", "data/projects.json"]) {
    assert.match(detail, new RegExp(phrase.replace(".", "\\."), "u"));
  }
  assert.match(detail, /getFeaturedProjects/u);
  assert.match(detail, /StaticPageLink/u);
  assert.match(library, /href=\{`\/templates\/\$\{template\.id\}\//u);
  assert.match(library, /查看详细说明/u);
  assert.match(sitemap, /TEMPLATE_IDS\.map/u);
  assert.match(sitemap, /getAbsoluteUrl\(`\/templates\/\$\{id\}\//u);
  assert.match(seo, /templates\/\$\{id\}\/index\.html/u);
  assert.match(seo, /模板 canonical 必须唯一/u);
});

test("模板库、首页和项目页包含四模板渲染入口", () => {
  const library = read("src/app/templates/page.tsx");
  const home = read("src/app/page.tsx");
  const detail = read("src/app/projects/[slug]/page.tsx");
  const homeRenderer = read("src/components/templates/TemplateHome.tsx");
  const detailRenderer = read("src/components/templates/TemplateProjectDetail.tsx");
  const layout = read("src/app/layout.tsx");

  assert.match(library, /TEMPLATE_REGISTRY/u);
  assert.match(library, /href="\/launchpad\/"/u);
  assert.match(home, /activeTemplate === "atlas"/u);
  assert.match(home, /TemplateHome/u);
  assert.match(detail, /TemplateProjectDetail/u);
  for (const id of ["growth", "systems", "ai-workflow"]) {
    assert.match(`${homeRenderer}\n${detailRenderer}`, new RegExp(id, "u"));
  }
  assert.match(layout, /data-template=\{activeTemplate\}/u);
});

test("templates SEO、sitemap、Launchpad noindex 与 basePath 静态导出约束保持", () => {
  const templates = read("src/app/templates/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const launchpad = read("src/app/launchpad/page.tsx");
  const config = read("next.config.ts");
  const seo = read("scripts/check-seo.mjs");

  assert.match(templates, /pathname: "\/templates\/"/u);
  assert.doesNotMatch(templates, /index: false/u);
  assert.match(sitemap, /getAbsoluteUrl\("\/templates\/"\)/u);
  assert.doesNotMatch(sitemap, /getAbsoluteUrl\("\/launchpad\/"\)/u);
  assert.match(launchpad, /index: false/u);
  assert.match(config, /output: "export"/u);
  assert.match(config, /basePath/u);
  assert.match(seo, /templates\/index\.html/u);
});
