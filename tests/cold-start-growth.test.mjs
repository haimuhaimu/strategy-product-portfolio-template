import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  createEvidenceShareCardModel,
  createEvidenceShareCardSvg,
  escapeSvgText,
  SHARE_CARD_PRODUCT_NAME,
} from "../src/lib/evidence-share-card.mjs";
import { createDiagnosticExperienceUrl } from "../src/lib/diagnostic-share.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const dynamicExperienceUrl = createDiagnosticExperienceUrl("https://fork.example", "/my-portfolio");

function reportWithPrivateText(marker) {
  return {
    totalScore: 4,
    level: `${marker}伪造等级`,
    dimensionScores: {
      resultEvidence: { label: `${marker}结果`, value: 1 },
      scopeAndAttribution: { label: `${marker}口径`, value: 0 },
      methodEvidence: { label: `${marker}方法`, value: 1 },
      artifactEvidence: { label: `${marker}资产`, value: 1 },
      contributionBoundary: { label: `${marker}边界`, value: 0 },
    },
    projectScores: [{ title: marker }],
    privacyRisks: [{ category: "邮箱", count: 1, message: marker }],
    fluffFindings: [{ word: marker, message: marker }],
    questions: [`${marker}<script>alert(1)</script>`],
  };
}

test("分享卡纯函数只输出安全字段且不泄露诊断原文", () => {
  const marker = "private.person@example.com";
  const report = reportWithPrivateText(marker);
  const before = structuredClone(report);
  const model = createEvidenceShareCardModel(report, dynamicExperienceUrl);
  const svg = createEvidenceShareCardSvg(report, dynamicExperienceUrl);

  assert.deepEqual(report, before);
  assert.doesNotMatch(JSON.stringify(model), new RegExp(marker.replaceAll(".", "\\."), "u"));
  assert.doesNotMatch(svg, new RegExp(marker.replaceAll(".", "\\."), "u"));
  assert.doesNotMatch(svg, /<script>/u);
  assert.equal(model.level, "强证据");
  assert.match(model.priorityQuestion, /回到诊断页/u);
});

test("SVG 文本正确转义 XML 特殊字符", () => {
  assert.equal(
    escapeSvgText(`<tag a="x">Tom & Jerry's</tag>`),
    "&lt;tag a=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/tag&gt;",
  );
});

test("分享卡安全字段完整、五维顺序稳定且体验 URL 动态传入", () => {
  const model = createEvidenceShareCardModel(reportWithPrivateText("secret-marker"), dynamicExperienceUrl);

  assert.equal(model.productName, SHARE_CARD_PRODUCT_NAME);
  assert.equal(model.experienceUrl, "https://fork.example/my-portfolio/#instant-diagnostic");
  assert.equal(model.score, 4);
  assert.equal(model.maxScore, 5);
  assert.equal(model.privacyRiskCount, 1);
  assert.deepEqual(model.dimensions.map(({ label, coverage }) => [label, coverage]), [
    ["结果证据", 100],
    ["口径完整", 0],
    ["方法证据", 100],
    ["资产证据", 100],
    ["贡献边界", 0],
  ]);
  assert.match(model.privacyStatement, /完全本地运行/u);
  assert.match(model.privacyStatement, /不含原文/u);
  assert.match(createEvidenceShareCardSvg(reportWithPrivateText("secret"), dynamicExperienceUrl), /https:\/\/fork\.example\/my-portfolio\/#instant-diagnostic/u);
});

test("分享卡和冷启动交互不使用 fetch 或服务端接口", () => {
  const sources = [
    "src/lib/evidence-share-card.mjs",
    "src/lib/diagnostic-share.mjs",
    "src/components/diagnostic/useDiagnosticShare.ts",
    "src/components/InstantEvidenceDiagnostic.tsx",
    "src/components/ColdStartGrowthSections.tsx",
  ].map(read).join("\n");

  assert.doesNotMatch(sources, /\bfetch\s*\(/u);
  assert.doesNotMatch(sources, /\/api\//u);
  assert.match(sources, /canvas\.toBlob/u);
  assert.match(sources, /createObjectURL/u);
});
