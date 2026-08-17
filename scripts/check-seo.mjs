import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "../src/lib/github-pages.mjs";

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

const portfolio = JSON.parse(
  readFileSync(path.join(projectRoot, "data/projects.json"), "utf8"),
);
const featuredProjectSlug = portfolio.featuredProjectSlugs[0];
assert.ok(featuredProjectSlug, "Expected at least one featured project slug.");

const home = readExportedFile("index.html");
const profile = readExportedFile("profile/index.html");
const thinking = readExportedFile("thinking/index.html");
const project = readExportedFile(
  `projects/${featuredProjectSlug}/index.html`,
);
const robots = readExportedFile("robots.txt");
const sitemap = readExportedFile("sitemap.xml");
const baiduVerification =
  process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION?.trim();
const siteUrl = getSiteUrl(process.env);

assert.match(
  home,
  /<title>[^<]*(产品经理|产品运营|运营)[^<]*作品集[^<]*<\/title>/,
);
assert.ok(
  home.includes(`<link rel="canonical" href="${siteUrl}/"`),
  `Home canonical must use ${siteUrl}.`,
);
assert.match(home, /type="application\/ld\+json"/);
assert.match(home, /产品经理与运营/);
assert.match(thinking, /个人认知操作系统/);
assert.ok(
  profile.includes(`<link rel="canonical" href="${siteUrl}/profile/"`),
  "Profile canonical is missing or incorrect.",
);
assert.ok(
  thinking.includes(`<link rel="canonical" href="${siteUrl}/thinking/"`),
  "Thinking canonical is missing or incorrect.",
);
assert.ok(
  project.includes(
    `<link rel="canonical" href="${siteUrl}/projects/${featuredProjectSlug}/"`,
  ),
  "Project canonical is missing or incorrect.",
);
assert.ok(
  robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`),
  "robots.txt sitemap URL is missing or incorrect.",
);
assert.ok(
  sitemap.includes(`${siteUrl}/projects/${featuredProjectSlug}/`),
  "sitemap.xml project URL is missing or incorrect.",
);
assert.doesNotMatch(sitemap, /localhost|vercel\.app/);

const baiduMetaPattern =
  /<meta name="baidu-site-verification" content="[^"]*"\s*\/?>/u;
if (baiduVerification) {
  assert.match(
    home,
    new RegExp(
      `<meta name="baidu-site-verification" content="${escapeRegExp(baiduVerification)}"\\s*/?>`,
      "u",
    ),
  );
} else {
  assert.doesNotMatch(home, baiduMetaPattern);
}

console.log(
  "SEO export check passed: home, profile, thinking, project, robots, sitemap.",
);
