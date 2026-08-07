import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portfolio = JSON.parse(
  readFileSync(path.join(root, "data/projects.json"), "utf8"),
);

const expectedStatuses = new Set(["retained", "revised", "pending"]);

function validateCalibrationLogs(data) {
  assert.ok(Array.isArray(data.calibrationLogs));

  if (!data.features.thinking) return;

  const projectSlugs = new Set(data.projects.map((project) => project.slug));
  assert.equal(data.calibrationLogs.length, 3);

  for (const log of data.calibrationLogs) {
    assert.ok(
      projectSlugs.has(log.projectSlug),
      `未找到关联项目：${log.projectSlug}`,
    );
    for (const field of ["prior", "feedback", "currentVersion"]) {
      assert.ok(log[field]?.trim(), `校准日志缺少 ${field}`);
    }
    assert.ok(expectedStatuses.has(log.status), `未知校准状态：${log.status}`);
  }

  assert.deepEqual(
    new Set(data.calibrationLogs.map((log) => log.status)),
    expectedStatuses,
  );
}

test("思考功能关闭时允许校准日志为空", () => {
  validateCalibrationLogs(portfolio);
});

test("思考功能开启时严格验证三种状态、关联项目与完整内容", () => {
  const enabledPortfolio = {
    ...portfolio,
    features: { ...portfolio.features, thinking: true },
  };

  if (portfolio.features.thinking) {
    validateCalibrationLogs(enabledPortfolio);
  } else {
    assert.throws(() => validateCalibrationLogs(enabledPortfolio));
  }
});
