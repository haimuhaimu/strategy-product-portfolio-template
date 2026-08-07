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

function validateProfile(data) {
  assert.ok(["product", "operations"].includes(data.rolePreset));
  assert.ok(Array.isArray(data.profile.interests));
  if (data.features.profile) {
    assert.ok(data.profile.interests.length >= 3);
    assert.ok(data.profile.interests.every((interest) => interest.trim()));
  }
}

function validateAdvancedModels(data) {
  const operatingSystem = data.personalOperatingSystem;
  assert.ok(operatingSystem && typeof operatingSystem === "object");
  for (const field of ["personModel", "rewardFunction", "actionStrategy"]) {
    assert.ok(Array.isArray(operatingSystem[field]));
  }
  assert.ok(Array.isArray(data.influences));
  assert.ok(Array.isArray(data.trainingHistory));

  if (!data.features.advancedModels) return;

  assert.ok(operatingSystem.personModel.length >= 3);
  assert.ok(operatingSystem.rewardFunction.length >= 3);
  assert.ok(operatingSystem.actionStrategy.length >= 3);
  assert.ok(
    operatingSystem.personModel.every(
      (item) => item.dimension?.trim() && item.observation?.trim() && item.implication?.trim(),
    ),
  );
  assert.ok(
    operatingSystem.rewardFunction.every(
      (item) =>
        item.signal?.trim() &&
        ["high", "medium", "low"].includes(item.weight) &&
        item.guardrail?.trim(),
    ),
  );
  assert.ok(
    operatingSystem.actionStrategy.every(
      (item) => item.trigger?.trim() && item.action?.trim() && item.feedback?.trim(),
    ),
  );

  assert.deepEqual(
    new Set(data.influences.map((influence) => influence.status)),
    expectedStatuses,
  );
  assert.ok(
    data.influences.every(
      (influence) =>
        influence.name?.trim() &&
        ["work", "person", "method", "experience"].includes(influence.type) &&
        influence.takeaway?.trim(),
    ),
  );
  assert.ok(data.trainingHistory.length >= 3);
  assert.ok(
    data.trainingHistory.every(
      (stage) =>
        stage.stage?.trim() &&
        stage.period?.trim() &&
        stage.trainingData?.trim() &&
        stage.modelUpdate?.trim(),
    ),
  );
}

test("个人资料功能关闭时允许兴趣数组为空", () => {
  validateProfile(portfolio);
});

test("高级模型功能关闭时允许模型、影响来源与训练史为空", () => {
  validateAdvancedModels(portfolio);
});

test("相应功能开启时仍拒绝不完整的个人资料和高级模型", () => {
  if (!portfolio.features.profile) {
    assert.throws(() =>
      validateProfile({
        ...portfolio,
        features: { ...portfolio.features, profile: true },
      }),
    );
  }
  if (!portfolio.features.advancedModels) {
    assert.throws(() =>
      validateAdvancedModels({
        ...portfolio,
        features: { ...portfolio.features, advancedModels: true },
      }),
    );
  }
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
