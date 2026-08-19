import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  assessPortfolioData,
  createReleasePack,
  createSafeReleaseSummary,
  RELEASE_FILE_NAMES,
} from "../src/lib/launchpad.mjs";

const root = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(readFileSync(path.join(root, "data/projects.json"), "utf8"));
const clone = () => structuredClone(source);

function weakPortfolio() {
  return {
    schemaVersion: 2,
    rolePreset: "product",
    profile: { name: "匿名候选人" },
    featuredProjectSlugs: ["one", "two", "three"],
    projects: ["one", "two", "three"].map((slug, index) => ({
      slug,
      title: `项目 ${index + 1}`,
      results: ["有所提升"],
    })),
  };
}

test("Launchpad 输出 block / warn / pass，并给出唯一下一步", () => {
  const passing = assessPortfolioData(clone());
  assert.equal(passing.status, "pass");
  assert.match(passing.nextStep, /Release Pack/u);

  const warning = assessPortfolioData(weakPortfolio());
  assert.equal(warning.status, "warn");
  assert.equal(warning.audit.level, "弱证据");
  assert.match(warning.nextStep, /高价值追问/u);

  const invalid = clone();
  invalid.schemaVersion = 1;
  const blocked = assessPortfolioData(invalid);
  assert.equal(blocked.status, "block");
  assert.match(blocked.nextStep, /schema-lite/u);
});

test("非三个 featured 项目与模板态均显示可操作警告", () => {
  const data = weakPortfolio();
  data.featuredProjectSlugs = ["one", "two"];
  data.profile.name = "你的名字";
  const assessment = assessPortfolioData(data);

  assert.equal(assessment.status, "warn");
  assert.equal(assessment.featured.count, 2);
  assert.equal(assessment.template.detected, true);
  assert.ok(assessment.warnings.some((item) => item.code === "featured"));
  assert.ok(assessment.warnings.some((item) => item.code === "template"));
});

test("隐私命中阻断 Release Pack 且安全摘要不含敏感原文", () => {
  const data = clone();
  const secret = "private.owner@example.com";
  data.projects[0].summary = `${data.projects[0].summary} ${secret}`;
  const assessment = assessPortfolioData(data);

  assert.equal(assessment.status, "block");
  assert.equal(assessment.canGenerateRelease, false);
  assert.ok(assessment.audit.privacyRisks.length > 0);
  assert.throws(() => createReleasePack(assessment), /Release Pack 已阻断/u);
  assert.doesNotMatch(createSafeReleaseSummary(assessment), /private\.owner/u);
});

test("引用断链阻断 Release Pack", () => {
  const data = clone();
  data.featuredProjectSlugs[0] = "missing-project";
  const assessment = assessPortfolioData(data);

  assert.equal(assessment.status, "block");
  assert.equal(assessment.references.valid, false);
  assert.equal(assessment.canGenerateRelease, false);
  assert.throws(() => createReleasePack(assessment), /Release Pack 已阻断/u);
});

test("Release Pack 文件齐全，分享文件不复制项目原文", () => {
  const data = clone();
  const uniqueProjectPhrase = "仅用于测试的项目叙事原文-7f9c";
  data.projects[0].summary = uniqueProjectPhrase;
  const assessment = assessPortfolioData(data);
  const releasePack = createReleasePack(assessment);

  assert.deepEqual(Object.keys(releasePack), RELEASE_FILE_NAMES);
  for (const filename of RELEASE_FILE_NAMES) {
    assert.equal(typeof releasePack[filename], "string");
    assert.ok(releasePack[filename].length > 20, `${filename} 不应为空`);
  }
  assert.match(releasePack["SHARE_COPY.md"], /不含项目原文/u);
  assert.doesNotMatch(releasePack["SHARE_COPY.md"], new RegExp(uniqueProjectPhrase, "u"));
  assert.doesNotMatch(releasePack["SHOWCASE_ENTRY.json"], new RegExp(uniqueProjectPhrase, "u"));
  const pilotLog = JSON.parse(releasePack["PMF_PILOT_LOG.json"]);
  assert.equal(pilotLog.status, "disabled");
  assert.deepEqual(pilotLog.events, []);
});

test("Release Pack 第六文件只保留安全枚举，非法自由文本降级为 disabled", () => {
  const assessment = assessPortfolioData(clone());
  const timestamp = "2026-08-19T00:00:00.000Z";
  const expiresAt = "2026-08-26T00:00:00.000Z";
  const safePack = createReleasePack(assessment, {
    pmfPilotLog: {
      status: "enabled",
      enabled: true,
      startedAt: timestamp,
      expiresAt,
      events: [
        { event: "import_result", value: "real_success", timestamp },
        { event: "release_pack_generated", value: true, templateId: "atlas", timestamp },
      ],
    },
  });
  const safeLog = JSON.parse(safePack["PMF_PILOT_LOG.json"]);
  assert.equal(safeLog.status, "enabled");
  assert.equal(safeLog.eventCount, 2);
  assert.doesNotMatch(safePack["PMF_PILOT_LOG.json"], /projects|summary|publicUrl/u);

  const secret = "https://internal.example.com/resume";
  const unsafePack = createReleasePack(assessment, {
    pmfPilotLog: {
      status: "enabled",
      enabled: true,
      startedAt: timestamp,
      expiresAt,
      events: [{ event: "applied", value: true, note: secret, timestamp }],
    },
  });
  assert.equal(JSON.parse(unsafePack["PMF_PILOT_LOG.json"]).status, "disabled");
  assert.doesNotMatch(unsafePack["PMF_PILOT_LOG.json"], /internal\.example/u);
});

test("start / launchpad 页面入口与 SEO 源码约束存在", () => {
  const read = (file) => readFileSync(path.join(root, file), "utf8");
  const start = read("src/app/start/page.tsx");
  const launchpad = read("src/app/launchpad/page.tsx");
  const pilot = read("src/app/pilot/page.tsx");
  const header = read("src/components/Header.tsx");
  const home = read("src/app/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const robots = read("src/app/robots.ts");
  const workbench = read("src/components/launchpad/LaunchpadWorkbench.tsx");

  assert.match(start, /Skill-first|Portfolio Story Builder/u);
  assert.match(start, /\/launchpad\//u);
  assert.match(start, /\/config\//u);
  assert.match(launchpad, /index: false/u);
  assert.doesNotMatch(pilot, /index: false/u);
  assert.match(pilot, /pathname: "\/pilot\/"/u);
  assert.match(header, /href="\/start\/"/u);
  assert.match(home, /进入作者工作台/u);
  assert.match(sitemap, /getAbsoluteUrl\("\/start\/"\)/u);
  assert.match(sitemap, /getAbsoluteUrl\("\/pilot\/"\)/u);
  assert.doesNotMatch(sitemap, /getAbsoluteUrl\("\/launchpad\/"\)/u);
  assert.match(robots, /launchpad\//u);
  assert.doesNotMatch(workbench, /\bfetch\s*\(/u);
});
