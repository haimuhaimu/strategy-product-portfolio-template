import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portfolio = JSON.parse(
  readFileSync(path.join(root, "data/projects.json"), "utf8"),
);
const modelComponent = readFileSync(
  path.join(root, "src/components/PersonalModelSystem.tsx"),
  "utf8",
);
const thinkingPage = readFileSync(
  path.join(root, "src/app/thinking/page.tsx"),
  "utf8",
);
const teaser = readFileSync(
  path.join(root, "src/components/HomeThinkingTeaser.tsx"),
  "utf8",
);

const expectedStatuses = new Set(["retained", "revised", "pending", "applied"]);

test("个人模型包含人物、奖励函数与行动策略", () => {
  assert.ok(["product", "operations"].includes(portfolio.rolePreset));
  assert.ok(portfolio.profile.interests.length >= 3);
  assert.ok(portfolio.personalOperatingSystem.personModel.length >= 3);
  assert.ok(portfolio.personalOperatingSystem.rewardFunction.length >= 3);
  assert.ok(portfolio.personalOperatingSystem.actionStrategy.length >= 3);

  for (const reward of portfolio.personalOperatingSystem.rewardFunction) {
    assert.ok(["high", "medium", "low"].includes(reward.weight));
    assert.ok(reward.guardrail);
  }
});

test("影响来源覆盖状态，训练史保持阶段顺序", () => {
  const actualStatuses = new Set(
    portfolio.influences.map((influence) => influence.status),
  );
  assert.deepEqual(actualStatuses, expectedStatuses);
  assert.ok(portfolio.influences.every((influence) => influence.takeaway));
  assert.ok(portfolio.trainingHistory.length >= 3);
  assert.ok(portfolio.trainingHistory.every((stage) => stage.modelUpdate));
});

test("思考页接入数据驱动模型，首页兴趣不再硬编码", () => {
  assert.match(thinkingPage, /<PersonalModelSystem/u);
  assert.match(thinkingPage, /<CognitiveCalibrationLog/u);
  assert.match(modelComponent, /operatingSystem\.personModel\.map/u);
  assert.match(modelComponent, /influences\.map/u);
  assert.match(modelComponent, /trainingHistory\.map/u);
  assert.match(teaser, /profile\.interests\.map/u);
  assert.ok(modelComponent.split("\n").length <= 300);
});
