import assert from "node:assert/strict";
import test from "node:test";

import {
  createPmfPilotLogger,
  getPmfImportResult,
  PMF_PILOT_EVENTS,
  PMF_PILOT_TTL_MS,
  validatePmfPilotEvent,
} from "../src/lib/pmf-pilot.mjs";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("PMF Pilot 只接受声明过的事件和枚举载荷", () => {
  assert.deepEqual(PMF_PILOT_EVENTS, [
    "persona_confirmed",
    "path_selected",
    "import_result",
    "audit_result",
    "release_pack_generated",
    "published_confirmed",
    "applied",
    "interview_feedback",
  ]);
  assert.equal(validatePmfPilotEvent("persona_confirmed", { value: true, count: 3 }), true);
  assert.equal(validatePmfPilotEvent("published_confirmed", { value: true, platform: "github_pages" }), true);
  assert.throws(() => validatePmfPilotEvent("unknown", { value: true }), /未知/u);
  assert.throws(() => validatePmfPilotEvent("path_selected", { value: "custom" }), /路径枚举/u);
  assert.throws(() => validatePmfPilotEvent("published_confirmed", { value: true, platform: "my-host" }), /平台枚举/u);
});

test("自由文本、URL、邮箱、电话和额外字段全部拒绝", () => {
  const unsafeValues = [
    "这是一段项目原文",
    "https://internal.example.com/project",
    "owner@example.com",
    ["138", "0013", "8000"].join(""),
  ];
  for (const value of unsafeValues) {
    assert.throws(() => validatePmfPilotEvent("path_selected", { value }), /路径枚举/u);
    assert.throws(() => validatePmfPilotEvent("applied", { value: true, note: value }), /未允许字段/u);
  }
  assert.throws(() => validatePmfPilotEvent("published_confirmed", { value: true, platform: "github_pages", url: "https://example.com" }), /未允许字段/u);
  assert.throws(() => validatePmfPilotEvent("persona_confirmed", { value: true, count: 3, company: "示例公司" }), /未允许字段/u);
});

test("日志默认关闭，明确 opt-in 后记录，支持 clear / disable / export", () => {
  const storage = createMemoryStorage();
  let current = Date.parse("2026-08-19T00:00:00.000Z");
  const logger = createPmfPilotLogger({ storage, now: () => current });

  assert.deepEqual(logger.status(), { enabled: false, expiresAt: null, eventCount: 0 });
  assert.equal(logger.record("applied", { value: true }), false);
  assert.equal(logger.export().status, "disabled");

  const enabled = logger.enable();
  assert.equal(enabled.enabled, true);
  assert.equal(Date.parse(enabled.expiresAt) - current, PMF_PILOT_TTL_MS);
  assert.equal(logger.record("path_selected", { value: "launchpad" }), true);
  assert.equal(logger.export().eventCount, 1);
  assert.equal(logger.export().events[0].value, "launchpad");

  assert.equal(logger.clear().enabled, true);
  assert.equal(logger.export().eventCount, 0);
  assert.deepEqual(logger.disable(), { enabled: false, expiresAt: null, eventCount: 0 });
  assert.equal(logger.export().status, "disabled");
});

test("7 天 TTL 到期后自动清除，非法持久化内容按关闭处理", () => {
  const storage = createMemoryStorage();
  let current = Date.parse("2026-08-19T00:00:00.000Z");
  const logger = createPmfPilotLogger({ storage, now: () => current });
  logger.enable();
  logger.record("applied", { value: false });

  current += PMF_PILOT_TTL_MS + 1;
  assert.deepEqual(logger.status(), { enabled: false, expiresAt: null, eventCount: 0 });
  assert.equal(logger.export().status, "disabled");

  storage.setItem("pmf-pilot-v1", JSON.stringify({ formatVersion: 1, enabled: true, freeText: "不应保留" }));
  assert.deepEqual(logger.status(), { enabled: false, expiresAt: null, eventCount: 0 });
});

test("localStorage 被禁用或写入失败时保持关闭且不抛错", () => {
  const blockedStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  };
  const logger = createPmfPilotLogger({ storage: blockedStorage });
  assert.deepEqual(logger.enable(), { enabled: false, expiresAt: null, eventCount: 0 });
  assert.equal(logger.record("applied", { value: true }), false);
  assert.equal(logger.export().status, "disabled");
  assert.deepEqual(logger.disable(), { enabled: false, expiresAt: null, eventCount: 0 });
});

test("仓库示例与真实导入使用不同枚举，示例不能算真实完成", () => {
  assert.equal(getPmfImportResult("example", true), "example_loaded");
  assert.equal(getPmfImportResult("real", true), "real_success");
  assert.equal(getPmfImportResult("real", false), "failed");
  assert.throws(() => getPmfImportResult("unknown", true), /导入来源枚举/u);
});
