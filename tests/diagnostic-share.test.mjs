import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  createDiagnosticExperienceUrl,
  createDiagnosticShareHash,
  createDiagnosticShareUrl,
  createSafeDiagnosticShareModel,
  decodeDiagnosticSharePayload,
  decodeUtf8Base64Url,
  DIAGNOSTIC_SHARE_HASH_PREFIX,
  encodeDiagnosticSharePayload,
  encodeUtf8Base64Url,
  MAX_DIAGNOSTIC_SHARE_PAYLOAD_LENGTH,
  parseDiagnosticShareHash,
} from "../src/lib/diagnostic-share.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function safeReport(privateMarker = "内部原文-客户甲") {
  return {
    totalScore: 3,
    level: "伪造等级",
    dimensionScores: {
      resultEvidence: { label: `${privateMarker}结果`, value: 1 },
      scopeAndAttribution: { label: `${privateMarker}口径`, value: 1 },
      methodEvidence: { label: `${privateMarker}方法`, value: 1 },
      artifactEvidence: { label: `${privateMarker}资产`, value: 0 },
      contributionBoundary: { label: `${privateMarker}边界`, value: 0 },
    },
    projectScores: [{ title: privateMarker, diagnosticText: privateMarker }],
    privacyRisks: [{ category: "项目代号", message: privateMarker }],
    fluffFindings: [{ word: privateMarker, message: privateMarker }],
    questions: ["项目沉淀了什么可复用交付物？例如规则、原型、SOP、看板或评估集。", privateMarker],
  };
}

test("UTF-8 Base64URL 支持 Unicode 往返且不产生标准 Base64 符号", () => {
  const source = "产品经理 🧭 · 证据诊断";
  const encoded = encodeUtf8Base64Url(source);

  assert.doesNotMatch(encoded, /[+/=]/u);
  assert.equal(decodeUtf8Base64Url(encoded), source);
});

test("安全模型使用严格字段白名单且分享载荷不泄露原文", () => {
  const marker = "private.person@example.com-客户甲";
  const model = createSafeDiagnosticShareModel(safeReport(marker));
  const payload = encodeDiagnosticSharePayload(model);
  const decoded = parseDiagnosticShareHash(createDiagnosticShareHash(model));

  assert.deepEqual(Object.keys(model), [
    "version",
    "totalScore",
    "level",
    "dimensions",
    "privacyRiskCount",
    "priorityQuestion",
  ]);
  assert.deepEqual(Object.keys(model.dimensions), [
    "resultEvidence",
    "scopeAndAttribution",
    "methodEvidence",
    "artifactEvidence",
    "contributionBoundary",
  ]);
  assert.deepEqual(decoded, model);
  assert.doesNotMatch(payload, new RegExp(marker.replaceAll(".", "\\."), "u"));
  assert.doesNotMatch(JSON.stringify(model), /projectScores|privacyRisks|fluffFindings|diagnosticText/u);
});

test("非法、被篡改、带额外字段与超长载荷均安全拒绝", () => {
  const model = createSafeDiagnosticShareModel(safeReport());
  const payload = encodeDiagnosticSharePayload(model);
  const lastCharacter = payload.at(-1);
  const tampered = `${payload.slice(0, -1)}${lastCharacter === "A" ? "B" : "A"}`;
  const hash = createDiagnosticShareHash(model);
  const tamperedHash = `${hash.slice(0, -1)}${hash.endsWith("0") ? "1" : "0"}`;
  const extraFieldPayload = encodeUtf8Base64Url(JSON.stringify({ ...model, originalText: "不应出现" }));
  const inconsistentPayload = encodeUtf8Base64Url(JSON.stringify({ ...model, totalScore: 4 }));

  assert.equal(decodeDiagnosticSharePayload("not+base64"), null);
  assert.equal(decodeDiagnosticSharePayload(tampered), null);
  assert.equal(parseDiagnosticShareHash(tamperedHash), null);
  assert.equal(decodeDiagnosticSharePayload(extraFieldPayload), null);
  assert.equal(decodeDiagnosticSharePayload(inconsistentPayload), null);
  assert.equal(decodeDiagnosticSharePayload("a".repeat(MAX_DIAGNOSTIC_SHARE_PAYLOAD_LENGTH + 1)), null);
  assert.equal(parseDiagnosticShareHash("#other=value"), null);
});

test("分享链接只通过 Fragment 传值，并兼容 origin、basePath 与静态首页", () => {
  const model = createSafeDiagnosticShareModel(safeReport());
  const experienceUrl = createDiagnosticExperienceUrl("https://example.github.io", "/forked-portfolio");
  const shareUrl = createDiagnosticShareUrl(experienceUrl, model);
  const parsedUrl = new URL(shareUrl);

  assert.equal(experienceUrl, "https://example.github.io/forked-portfolio/#instant-diagnostic");
  assert.equal(parsedUrl.pathname, "/forked-portfolio/");
  assert.equal(parsedUrl.search, "");
  assert.ok(parsedUrl.hash.startsWith(DIAGNOSTIC_SHARE_HASH_PREFIX));
  assert.deepEqual(parseDiagnosticShareHash(parsedUrl.hash), model);
});

test("安全分享实现不使用 query、fetch 或 API，接收视图保留无障碍与减弱动效", () => {
  const sources = [
    "src/lib/diagnostic-share.mjs",
    "src/components/diagnostic/useDiagnosticShare.ts",
    "src/components/diagnostic/DiagnosticResultView.tsx",
  ].map(read).join("\n");

  assert.doesNotMatch(sources, /URLSearchParams|\bfetch\s*\(|\/api\//u);
  assert.match(sources, /window\.location\.hash/u);
  assert.match(sources, /aria-live/u);
  assert.match(sources, /prefers-reduced-motion/u);
  assert.match(sources, /我也测一下/u);
});
