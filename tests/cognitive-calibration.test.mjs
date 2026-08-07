import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portfolio = JSON.parse(
  readFileSync(path.join(root, "data/projects.json"), "utf8"),
);

const projectSlugs = new Set(portfolio.projects.map((project) => project.slug));
const expectedStatuses = new Set(["retained", "revised", "pending"]);

test("认知校准日志的关联项目均存在", () => {
  assert.equal(portfolio.calibrationLogs.length, 3);

  for (const log of portfolio.calibrationLogs) {
    assert.ok(
      projectSlugs.has(log.projectSlug),
      `未找到关联项目：${log.projectSlug}`,
    );
  }
});

test("认知校准日志覆盖保留、修正与待验证三种状态", () => {
  const actualStatuses = new Set(
    portfolio.calibrationLogs.map((log) => log.status),
  );

  assert.deepEqual(actualStatuses, expectedStatuses);
});
