import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function readExportedFile(relativePath) {
  const filePath = path.join(projectRoot, "out", relativePath);
  assert.ok(
    existsSync(filePath),
    `Missing exported SEO file: out/${relativePath}`,
  );
  return readFileSync(filePath, "utf8");
}

const home = readExportedFile("index.html");
const profile = readExportedFile("profile/index.html");
const thinking = readExportedFile("thinking/index.html");
const project = readExportedFile(
  "projects/creator-monetization-health/index.html",
);
const robots = readExportedFile("robots.txt");
const sitemap = readExportedFile("sitemap.xml");
const baiduVerification =
  process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION?.trim();

assert.match(
  home,
  /<title>[^<]*(AI 产品经理|策略产品经理)[^<]*作品集[^<]*<\/title>/,
);
assert.match(
  home,
  /<link rel="canonical" href="https:\/\/portfolio\.example\.com\/"\/?>/,
);
assert.match(home, /type="application\/ld\+json"/);
assert.match(home, /AI 产品经理/);
assert.match(
  profile,
  /<link rel="canonical" href="https:\/\/portfolio\.example\.com\/profile\/"\/?>/,
);
assert.match(
  thinking,
  /<link rel="canonical" href="https:\/\/portfolio\.example\.com\/thinking\/"\/?>/,
);
assert.match(
  project,
  /<link rel="canonical" href="https:\/\/portfolio\.example\.com\/projects\/creator-monetization-health\/"\/?>/,
);
assert.match(
  robots,
  /Sitemap: https:\/\/portfolio\.example\.com\/sitemap\.xml/,
);
assert.match(
  sitemap,
  /https:\/\/portfolio\.example\.com\/projects\/search-quality-ai-answer\//,
);
assert.doesNotMatch(sitemap, /localhost|vercel\.app/);

if (baiduVerification) {
  assert.match(
    home,
    new RegExp(
      `<meta name="baidu-site-verification" content="${baiduVerification}"\\s*/?>`,
    ),
  );
}

console.log(
  "SEO export check passed: home, profile, thinking, project, robots, sitemap.",
);
