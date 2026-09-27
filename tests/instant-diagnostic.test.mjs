import assert from "node:assert/strict";
import test from "node:test";

import {
  createExperienceDraft,
  diagnoseExperienceText,
  MIN_EXPERIENCE_LENGTH,
} from "../src/lib/instant-diagnostic.mjs";

test("短文本不会触发误导性诊断", () => {
  const result = diagnoseExperienceText("负责增长项目");

  assert.equal(result.ok, false);
  assert.match(result.message, new RegExp(String(MIN_EXPERIENCE_LENGTH), "u"));
});

test("单段经历被映射为审计器可读的最小项目", () => {
  const text = "我负责作者增长策略，完成了分层分析与复盘。";
  const draft = createExperienceDraft(text);

  assert.equal(draft.projects.length, 1);
  assert.equal(draft.projects[0].diagnosticText, text);
  assert.equal(Object.values(draft.projects[0]).filter((value) => value === text).length, 1);
});

test("完整经历返回五维结果与不含原文的安全摘要", () => {
  const privateMarker = "private.person@example.com";
  const result = diagnoseExperienceText(
    `我负责新作者增长策略，抽取样本做对照实验，并按漏斗复盘数据。30 天周期内，完成率相比基线明显提升（具体数据已脱敏），交付策略规则、复盘看板和 SOP。我负责规则设计，业务结果属于团队，长期留存尚未验证。联系信息 ${privateMarker}`,
  );

  assert.equal(result.ok, true);
  assert.ok("report" in result);
  assert.equal(result.report.totalScore, 5);
  assert.equal(Object.keys(result.report.dimensionScores).length, 5);
  assert.ok(result.report.privacyRisks.length >= 1);
  assert.equal(result.report.privacyRisks.find((risk) => risk.category === "邮箱")?.count, 1);
  assert.match(result.safeSummary, /不含原始填写内容/u);
  assert.doesNotMatch(result.safeSummary, new RegExp(privateMarker.replace(".", "\\."), "u"));
});
