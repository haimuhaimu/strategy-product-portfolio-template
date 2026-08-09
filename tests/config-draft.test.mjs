import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  CONFIG_DRAFT_KEY,
  loadConfigDraft,
  parseConfigDraft,
  portfolioDataToConfigDraft,
  saveConfigDraft,
} from "../src/lib/config-draft.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    values,
  };
}

test("v2 产品数据映射全部关键文本并优先 featured projects", () => {
  const source = readJson("data/projects.json");
  const draft = portfolioDataToConfigDraft(source);
  assert.equal(draft.mode, "product");
  assert.equal(draft.projects[0].title, "搜索满足度评估与问答式搜索探索");
  assert.match(draft.projects[0].method, /把满足度拆成/u);
  assert.match(draft.projects[0].method, /人工评估/u);
  assert.match(draft.projects[0].method, /定义搜索满足度/u);
  assert.match(draft.projects[0].result, /已覆盖的质量环节/u);
  assert.match(draft.projects[0].result, /沉淀内容引入口径/u);
  assert.match(draft.projects[0].artifact, /bad case 归因分类/u);
  assert.match(draft.projects[0].contribution, /关键判断/u);
  assert.match(draft.profile.summary, /核心能力/u);
  assert.match(draft.profile.summary, /人机工作流/u);
});

test("operations preset 映射到运营字段且保留数组后续项", () => {
  const draft = portfolioDataToConfigDraft(readJson("data/presets/operations.json"));
  assert.equal(draft.mode, "operations");
  assert.match(draft.projects[0].goal, /不同来源的新用户/u);
  assert.match(draft.projects[0].actions, /注册—首个关键行为/u);
  assert.match(draft.projects[0].result, /首周运营 SOP/u);
  assert.equal(draft.projects[0].problem, "");
});

test("本地草稿可原样保存恢复，并拒绝旧版本与损坏 JSON", () => {
  const storage = memoryStorage();
  const draft = portfolioDataToConfigDraft(readJson("data/presets/operations.json"));
  assert.deepEqual(saveConfigDraft(storage, draft), { ok: true });
  assert.ok(storage.values.has(CONFIG_DRAFT_KEY));
  assert.deepEqual(loadConfigDraft(storage).draft, draft);
  assert.equal(parseConfigDraft("not-json").reason, "corrupt");
  assert.equal(parseConfigDraft(JSON.stringify({ version: 999, draft })).reason, "version");
});

test("localStorage quota/security 异常不向调用方抛出", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); } };
  assert.equal(loadConfigDraft(blocked).reason, "unavailable");
  assert.equal(saveConfigDraft(blocked, {}).reason, "unavailable");
});
