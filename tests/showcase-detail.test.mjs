import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  createShowcaseShareCardModel,
  createShowcaseShareCardSvg,
  SHOWCASE_CONTRIBUTION_URL,
  SHOWCASE_REPOSITORY_URL,
} from "../src/lib/showcase-share-card.mjs";
import { getSafeCurrentPageUrl, shareShowcasePage } from "../src/lib/showcase-share.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("Showcase 分享优先调用 Web Share API，且只传递站内详情 URL", async () => {
  const calls = [];
  const clipboardWrites = [];
  const result = await shareShowcasePage({
    currentHref: "https://portfolio.example/showcase/safe-case/?draft=private#notes",
    navigatorObject: {
      share: async (data) => calls.push(data),
      clipboard: { writeText: async (value) => clipboardWrites.push(value) },
    },
  });

  assert.equal(result.method, "share");
  assert.deepEqual(clipboardWrites, []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://portfolio.example/showcase/safe-case/");
  assert.doesNotMatch(JSON.stringify(calls[0]), /private|notes|resume|material/iu);
});

test("Web Share 不支持或失败时复制清理后的当前详情 URL", async () => {
  for (const share of [undefined, async () => { throw new Error("cancelled"); }]) {
    const writes = [];
    const result = await shareShowcasePage({
      currentHref: "https://portfolio.example/base/showcase/case-one/?secret=raw#private",
      navigatorObject: {
        share,
        clipboard: { writeText: async (value) => writes.push(value) },
      },
    });
    assert.equal(result.method, "copy");
    assert.deepEqual(writes, ["https://portfolio.example/base/showcase/case-one/"]);
    assert.doesNotMatch(writes[0], /secret|raw|private/u);
  }
});

test("详情路由声明静态参数、未知 slug 404、字段白名单与可访问 CTA", () => {
  const page = read("src/app/showcase/[slug]/page.tsx");
  const shareButton = read("src/components/showcase/ShowcaseShareButton.tsx");
  const loader = read("src/lib/showcase.mjs");
  const combined = `${page}\n${shareButton}\n${loader}`;

  assert.match(page, /export const dynamicParams = false/u);
  assert.match(page, /generateStaticParams/u);
  assert.match(page, /loadShowcaseEntries\(\).*map/u);
  assert.match(page, /notFound\(\)/u);
  assert.doesNotMatch(combined, /\bfetch\s*\(|<iframe\b/iu);
  assert.match(page, /entry\.publicHighlights\.map/u);
  assert.doesNotMatch(page, /publicHighlights\.slice/u);
  const renderedEntryFields = new Set([...page.matchAll(/entry\.([A-Za-z][A-Za-z0-9]*)/gu)].map((match) => match[1]));
  assert.deepEqual(renderedEntryFields, new Set([
    "slug",
    "kind",
    "publicUrl",
    "roleTags",
    "publicHighlights",
    "auditSummary",
    "disclosure",
  ]));
  assert.doesNotMatch(page, /<img\b|entry\.(?:name|company|email|phone|contact|screenshot)/iu);
  assert.match(page, /entry\.disclosure/u);
  assert.match(page, /rel="noopener noreferrer"/u);
  assert.match(page, /href="\/launchpad\/showcase\/"/u);
  assert.match(shareButton, /aria-live="polite"/u);
  assert.match(shareButton, /focus-visible:/u);
  assert.match(page, /"BreadcrumbList"/u);
  assert.match(page, /"CreativeWork"/u);
  assert.match(page, /sameAs: entry\.publicUrl/u);
});


test("Showcase 分享卡只映射公开白名单子集、清理详情 URL 并使用硬编码回流入口", () => {
  const entry = {
    slug: "safe-case",
    kind: "community",
    publicUrl: "https://portfolio.example/",
    roleTags: ["产品经理", "增长策略"],
    publicHighlights: ["公开亮点一", "公开亮点二", "公开亮点三"],
    auditSummary: {
      strict: true,
      score: 4,
      maxScore: 5,
      dimensions: {
        resultEvidence: true,
        scopeAndAttribution: true,
        methodEvidence: true,
        artifactEvidence: false,
        contributionBoundary: true,
      },
    },
    disclosure: {
      authorized: "confirmed",
      publiclyAccessible: "confirmed",
      sensitiveMaterialReviewed: "confirmed",
      takedownAvailable: "confirmed",
    },
    privateEmail: "never-share@example.com",
    screenshot: "https://assets.example.com/private.png",
  };
  const model = createShowcaseShareCardModel(
    entry,
    "https://portfolio.example/base/showcase/safe-case/?draft=private#notes",
  );

  assert.deepEqual(new Set(Object.keys(model)), new Set([
    "slug",
    "kind",
    "roleTags",
    "publicHighlights",
    "auditSummary",
    "detailUrl",
    "repositoryUrl",
    "contributionUrl",
  ]));
  assert.equal(model.detailUrl, "https://portfolio.example/base/showcase/safe-case/");
  assert.equal(model.repositoryUrl, SHOWCASE_REPOSITORY_URL);
  assert.equal(model.contributionUrl, SHOWCASE_CONTRIBUTION_URL);
  assert.doesNotMatch(JSON.stringify(model), /never-share|private\.png|publicUrl|disclosure/iu);
});

test("Showcase 分享卡 SVG 转义公开文本且不引用任何外部资源", () => {
  const entry = {
    slug: "safe-case",
    kind: "community",
    roleTags: ["产品 <经理>"],
    publicHighlights: ["增长 & 复盘", "方法 \"可复用\"", "边界 '清晰'"],
    auditSummary: {
      score: 3,
      maxScore: 5,
      dimensions: {
        resultEvidence: true,
        scopeAndAttribution: false,
        methodEvidence: true,
        artifactEvidence: false,
        contributionBoundary: true,
      },
    },
  };
  const svg = createShowcaseShareCardSvg(entry, "https://portfolio.example/showcase/safe-case/?token=secret#private");

  assert.match(svg, /产品 &lt;经理&gt;/u);
  assert.match(svg, /增长 &amp; 复盘/u);
  assert.match(svg, /方法 &quot;可复用&quot;/u);
  assert.match(svg, /边界 &apos;清晰&apos;/u);
  assert.match(svg, /portfolio\.example\/showcase\/safe-case\//u);
  assert.doesNotMatch(svg, /token|secret|#private|<image\b|<use\b|<foreignObject\b|\bhref=|\bsrc=|url\(|@import/iu);
});

test("当前详情 URL 拒绝危险协议、凭据与错误 slug", () => {
  assert.equal(
    getSafeCurrentPageUrl("http://localhost:3000/showcase/safe-case/?draft=1#notes", "safe-case"),
    "http://localhost:3000/showcase/safe-case/",
  );
  assert.throws(() => getSafeCurrentPageUrl("javascript:alert(1)", "safe-case"), /Invalid Showcase page URL/u);
  assert.throws(() => getSafeCurrentPageUrl("https://user:secret@example.com/showcase/safe-case/", "safe-case"), /Invalid Showcase page URL/u);
  assert.throws(() => getSafeCurrentPageUrl("https://example.com/showcase/other-case/", "safe-case"), /Unexpected Showcase detail URL/u);
});

test("详情页提供纯本地 PNG 下载按钮并复用 SVG 到 Canvas 模式", () => {
  const page = read("src/app/showcase/[slug]/page.tsx");
  const button = read("src/components/showcase/ShowcaseShareButton.tsx");
  const card = read("src/lib/showcase-share-card.mjs");
  const combined = `${button}\n${card}`;

  assert.match(page, /<ShowcaseShareButton entry=\{entry\} \/>/u);
  assert.match(button, /下载 PNG 分享卡/u);
  assert.match(button, /createShowcaseShareCardSvg/u);
  assert.match(button, /new Blob\(\[svg\]/u);
  assert.match(button, /document\.createElement\("canvas"\)/u);
  assert.match(button, /canvas\.toBlob/u);
  assert.match(button, /"image\/png"/u);
  assert.match(button, /aria-live="polite"/u);
  assert.doesNotMatch(combined, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|<img\b|<Image\b/iu);
});
