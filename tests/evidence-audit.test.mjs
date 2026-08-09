import assert from "node:assert/strict";
import test from "node:test";

import { auditPortfolioDraft, createSafeDiagnosticSummary } from "../src/lib/evidence-audit.mjs";

const strongProject = {
  title: "召回策略",
  result: "30 天周期内，沉默用户回访率从基线 8% 提升到 12%，团队看板可查验。",
  method: "抽取样本做对照实验，并按漏斗复盘数据。",
  artifact: "交付策略规则、复盘看板和可复用 SOP。",
  contribution: "我负责分层判断与规则设计；上线和业务结果属于团队，长期留存尚未验证。",
};

test("强案例五维证据全部得分", () => {
  const report = auditPortfolioDraft({ projects: [strongProject] });

  assert.equal(report.totalScore, 5);
  assert.equal(report.level, "强证据");
  assert.deepEqual(Object.values(report.projectScores[0].rubric), [true, true, true, true, true]);
});

test("弱案例给出不超过三条的高价值追问", () => {
  const report = auditPortfolioDraft({ projects: [{ title: "增长项目", result: "显著提升，形成闭环" }] });

  assert.equal(report.totalScore, 1);
  assert.equal(report.level, "弱证据");
  assert.ok(report.questions.length >= 1 && report.questions.length <= 3);
  assert.match(report.questions[0], /对象|范围|时间窗/u);
  assert.equal(report.fluffFindings.length, 2);
});

test("命中内部链接、邮箱、电话、密钥和用户 ID 风险", () => {
  const report = auditPortfolioDraft({
    profile: { email: "private.person@example.com", phone: ["138", "0013", "8000"].join("") },
    projects: [{
      title: "敏感项目",
      result: "详情 https://docs.bytedance.net/a，user_id=abcdef12，access_token=abcdef123456",
    }],
  });
  const categories = report.privacyRisks.map((risk) => risk.category);

  assert.ok(categories.includes("内部链接或域名"));
  assert.ok(categories.includes("邮箱"));
  assert.ok(categories.includes("手机号"));
  assert.ok(categories.includes("密钥或 Token"));
  assert.ok(categories.includes("用户或设备 ID"));
});

test("诊断摘要只包含计数与建议，不包含原始敏感内容", () => {
  const secretEmail = "private.person@example.com";
  const secretToken = "access_token=abcdef123456";
  const report = auditPortfolioDraft({ projects: [{ result: `${secretEmail} ${secretToken}` }] });
  const summary = createSafeDiagnosticSummary(report);

  assert.match(summary, /不含原始填写内容/u);
  assert.match(summary, /隐私检查/u);
  assert.doesNotMatch(summary, new RegExp(secretEmail.replace(".", "\\."), "u"));
  assert.doesNotMatch(summary, /abcdef123456/u);
});
