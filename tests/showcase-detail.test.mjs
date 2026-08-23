import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { shareShowcasePage } from "../src/lib/showcase-share.mjs";

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
