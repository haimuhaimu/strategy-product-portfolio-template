import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BASE_PATH,
  joinSiteUrl,
  withBasePath,
} from "../src/lib/site-paths.mjs";

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
const baiduVerification = process.env.BAIDU_SITE_VERIFICATION?.trim();
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://portfolio.example.com"
).replace(/\/+$/u, "");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function canonicalPattern(pathname) {
  const canonicalUrl = joinSiteUrl(siteUrl, pathname);
  return new RegExp(
    `<link rel="canonical" href="${escapeRegExp(canonicalUrl)}"\\s*/?>`,
  );
}

assert.match(
  home,
  /<title>[^<]*(AI 产品经理|策略产品经理)[^<]*作品集[^<]*<\/title>/,
);
assert.match(home, canonicalPattern("/"));
assert.match(home, /type="application\/ld\+json"/);
assert.match(home, /AI 产品经理/);
assert.match(profile, canonicalPattern("/profile/"));
assert.match(thinking, canonicalPattern("/thinking/"));
assert.match(
  project,
  canonicalPattern("/projects/creator-monetization-health/"),
);
assert.match(
  robots,
  new RegExp(
    `Sitemap: ${escapeRegExp(joinSiteUrl(siteUrl, "/sitemap.xml"))}`,
  ),
);
assert.match(
  sitemap,
  new RegExp(
    escapeRegExp(
      joinSiteUrl(siteUrl, "/projects/search-quality-ai-answer/"),
    ),
  ),
);
assert.doesNotMatch(sitemap, /localhost|vercel\.app/);
assert.match(
  home,
  new RegExp(
    `src="${escapeRegExp(withBasePath("/images/avatar-placeholder.svg"))}"`,
  ),
);

if (BASE_PATH) {
  assert.match(
    home,
    new RegExp(`(?:src|href)="${escapeRegExp(BASE_PATH)}/_next/static/`),
  );
  assert.doesNotMatch(home, /src="\/images\//u);
}

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
