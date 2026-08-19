import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "../src/lib/github-pages.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(projectRoot, "out");

function readExportedFile(relativePath) {
  const filePath = path.join(outDir, relativePath);
  assert.ok(existsSync(filePath), `缺少导出文件：out/${relativePath}`);
  return readFileSync(filePath, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function metaContent(html, attribute, value) {
  const escaped = escapeRegExp(value);
  const patterns = [
    new RegExp(`<meta[^>]*${attribute}="${escaped}"[^>]*content="([^"]+)"[^>]*>`, "iu"),
    new RegExp(`<meta[^>]*content="([^"]+)"[^>]*${attribute}="${escaped}"[^>]*>`, "iu"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function linkHref(html, rel) {
  const escaped = escapeRegExp(rel);
  const patterns = [
    new RegExp(`<link[^>]*rel="${escaped}"[^>]*href="([^"]+)"[^>]*>`, "iu"),
    new RegExp(`<link[^>]*href="([^"]+)"[^>]*rel="${escaped}"[^>]*>`, "iu"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function assertAbsoluteHttpUrl(value, label) {
  assert.ok(value, `${label} 缺失。`);
  const parsed = new URL(value);
  assert.match(parsed.protocol, /^https?:$/u, `${label} 必须是绝对 HTTP(S) URL。`);
  assert.ok(parsed.hostname, `${label} 必须包含主机名。`);
}

function assertLocalImageExists(imageUrl, siteUrl, label) {
  const image = new URL(imageUrl);
  const site = new URL(siteUrl);
  assert.equal(image.origin, site.origin, `${label} 必须使用站点域名。`);
  assert.ok(
    image.pathname.startsWith(site.pathname.replace(/\/+$/u, "")),
    `${label} 必须兼容站点子路径。`,
  );
  const sitePath = site.pathname.replace(/^\/+|\/+$/gu, "");
  let imagePath = image.pathname.replace(/^\/+/, "");
  if (sitePath && imagePath.startsWith(`${sitePath}/`)) {
    imagePath = imagePath.slice(sitePath.length + 1);
  }
  assert.ok(existsSync(path.join(outDir, imagePath)), `${label} 指向不存在的导出资源：${imagePath}`);
}

function parseJsonLd(html, label) {
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)];
  assert.ok(scripts.length > 0, `${label} 缺少 JSON-LD。`);
  return scripts.map((match, index) => {
    assert.doesNotMatch(match[1], /Your Name|你的名字|"author"\s*:/iu, `${label} JSON-LD 含占位身份或虚构 author。`);
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${label} 第 ${index + 1} 段 JSON-LD 无法解析：${error.message}`);
    }
  });
}

function assertImageMarkup(html, label) {
  const images = [...html.matchAll(/<img\b[^>]*>/giu)].map((match) => match[0]);
  for (const image of images) {
    assert.match(image, /\balt="[^"]+"/iu, `${label} 图片必须有非空 alt。`);
    assert.match(image, /\bwidth="\d+"/iu, `${label} 图片必须有 width。`);
    assert.match(image, /\bheight="\d+"/iu, `${label} 图片必须有 height。`);
  }
}

function assertIndexPage({ html, label, expectedCanonical, siteUrl }) {
  const title = html.match(/<title>([^<]+)<\/title>/iu)?.[1];
  const description = metaContent(html, "name", "description");
  const canonical = linkHref(html, "canonical");
  const ogImage = metaContent(html, "property", "og:image");
  const twitterImage = metaContent(html, "name", "twitter:image");

  assert.ok(title?.trim(), `${label} 缺少 title。`);
  assert.ok(description?.trim(), `${label} 缺少唯一 description。`);
  assert.equal(canonical, expectedCanonical, `${label} canonical 错误。`);
  assert.equal(metaContent(html, "property", "og:url"), expectedCanonical, `${label} og:url 错误。`);
  assert.equal(metaContent(html, "property", "og:locale"), "zh_CN", `${label} og:locale 错误。`);
  assert.ok(metaContent(html, "property", "og:site_name"), `${label} 缺少 og:site_name。`);
  assert.ok(metaContent(html, "property", "og:type"), `${label} 缺少 og:type。`);
  assert.equal(metaContent(html, "name", "twitter:card"), "summary_large_image", `${label} Twitter Card 错误。`);
  assert.ok(metaContent(html, "property", "og:title"), `${label} 缺少 og:title。`);
  assert.ok(metaContent(html, "property", "og:description"), `${label} 缺少 og:description。`);
  assert.ok(metaContent(html, "name", "twitter:title"), `${label} 缺少 twitter:title。`);
  assert.ok(metaContent(html, "name", "twitter:description"), `${label} 缺少 twitter:description。`);
  assertAbsoluteHttpUrl(ogImage, `${label} og:image`);
  assertAbsoluteHttpUrl(twitterImage, `${label} twitter:image`);
  assertLocalImageExists(ogImage, siteUrl, `${label} og:image`);
  assertLocalImageExists(twitterImage, siteUrl, `${label} twitter:image`);
  assert.match(metaContent(html, "name", "robots") || "", /index,\s*follow/iu, `${label} 必须 index,follow。`);
  assert.equal((html.match(/<h1\b/giu) || []).length, 1, `${label} 必须且只能有一个 H1。`);
  assertImageMarkup(html, label);

  return { title, description, canonical };
}

const portfolio = JSON.parse(readFileSync(path.join(projectRoot, "data/projects.json"), "utf8"));
const siteUrl = getSiteUrl(process.env);
const pages = [
  { label: "首页", file: "index.html", pathname: "/" },
  { label: "Start", file: "start/index.html", pathname: "/start/" },
  { label: "PMF Pilot", file: "pilot/index.html", pathname: "/pilot/" },
  { label: "Templates", file: "templates/index.html", pathname: "/templates/" },
  { label: "Profile", file: "profile/index.html", pathname: "/profile/" },
  { label: "Thinking", file: "thinking/index.html", pathname: "/thinking/" },
  ...portfolio.featuredProjectSlugs.map((slug) => ({
    label: `项目 ${slug}`,
    file: `projects/${slug}/index.html`,
    pathname: `/projects/${slug}/`,
    project: true,
  })),
];

const checked = pages.map((page) => {
  const html = readExportedFile(page.file);
  const result = assertIndexPage({
    html,
    label: page.label,
    expectedCanonical: `${siteUrl}${page.pathname}`,
    siteUrl,
  });
  if (page.file === "index.html") {
    const jsonLd = parseJsonLd(html, page.label);
    const types = JSON.stringify(jsonLd);
    assert.match(types, /"WebSite"/u);
    assert.match(types, /"SoftwareApplication"/u);
    assert.match(html, /href="[^"]*#projects"/u, "首页项目 CTA 必须是可抓取链接。");
  } else if (page.file === "profile/index.html") {
    assert.match(JSON.stringify(parseJsonLd(html, page.label)), /"ProfilePage"/u);
  } else if (page.project) {
    const projectJson = JSON.stringify(parseJsonLd(html, page.label));
    assert.match(projectJson, /"CreativeWork"|"Article"/u);
    for (const key of ["headline", "description", "url", "inLanguage", "isPartOf"]) {
      assert.match(projectJson, new RegExp(`"${key}"`, "u"), `${page.label} JSON-LD 缺少 ${key}。`);
    }
  }
  return { ...page, ...result };
});

const projectPages = checked.filter((page) => page.project);
assert.equal(new Set(projectPages.map((page) => page.canonical)).size, projectPages.length, "项目 canonical 必须唯一。");
assert.equal(new Set(projectPages.map((page) => page.description)).size, projectPages.length, "项目 description 必须唯一。");
assert.equal(new Set(projectPages.map((page) => page.title)).size, projectPages.length, "项目 title 必须唯一。");

for (const [label, file] of [["Config", "config/index.html"], ["Launchpad", "launchpad/index.html"], ["404", "404.html"]]) {
  const html = readExportedFile(file);
  const robotDirectives = [...html.matchAll(/<meta[^>]*name="robots"[^>]*content="([^"]+)"[^>]*>/giu)]
    .map((match) => match[1])
    .join(",");
  assert.match(robotDirectives, /noindex/iu, `${label} 必须 noindex。`);
  assert.match(robotDirectives, /nofollow/iu, `${label} 必须 nofollow。`);
}

const robots = readExportedFile("robots.txt");
const sitemap = readExportedFile("sitemap.xml");
const sitePath = `${new URL(siteUrl).pathname.replace(/\/+$/, "")}/`;
assert.match(robots, new RegExp(`Allow: ${escapeRegExp(sitePath)}`, "u"));
assert.match(robots, new RegExp(`Disallow: ${escapeRegExp(`${sitePath}config/`)}`, "u"));
assert.match(robots, new RegExp(`Disallow: ${escapeRegExp(`${sitePath}launchpad/`)}`, "u"));
assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots sitemap URL 错误。");
assert.doesNotMatch(robots, /^Host:/mu, "robots 不应输出误导性的 Host。");
assert.doesNotMatch(sitemap, /\/(?:config|launchpad)\//u, "工具页不得进入 sitemap。");
for (const page of checked) assert.ok(sitemap.includes(page.canonical), `sitemap 缺少 ${page.canonical}。`);
assert.doesNotMatch(sitemap, /localhost|vercel\.app/iu);

const home = readExportedFile("index.html");
const baiduVerification = process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION?.trim();
const baiduMeta = metaContent(home, "name", "baidu-site-verification");
if (baiduVerification) assert.equal(baiduMeta, baiduVerification, "Baidu verification token 错误。");
else assert.equal(baiduMeta, null, "未配置时不应输出 Baidu verification token。");

console.log(`SEO 导出检查通过：${checked.length} 个可索引页、Config、404、robots、sitemap 与分享图。`);
