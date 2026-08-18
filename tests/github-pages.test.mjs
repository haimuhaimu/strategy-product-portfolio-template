import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  getGithubPagesBasePath,
  getSiteUrl,
  getStaticPageHref,
  normalizeBasePath,
  withBasePath,
} from "../src/lib/github-pages.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const repository = process.env.GITHUB_REPOSITORY || "octocat/portfolio";
const fakeBaiduVerification = "test-only-baidu-verification-token";
const buildEnvironment = {
  ...process.env,
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: repository,
  NEXT_PUBLIC_BAIDU_SITE_VERIFICATION: fakeBaiduVerification,
};
const expectedBasePath = getGithubPagesBasePath(buildEnvironment);
const expectedSiteUrl = getSiteUrl(buildEnvironment);

function readProjectFile(relativePath) {
  return readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

test("computes repository and user-site paths with explicit overrides", () => {
  assert.equal(normalizeBasePath("portfolio/"), "/portfolio");
  assert.equal(
    getGithubPagesBasePath({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "octocat/portfolio",
    }),
    "/portfolio",
  );
  assert.equal(
    getGithubPagesBasePath({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "OctoCat/octocat.github.io",
    }),
    "",
  );
  assert.equal(
    getGithubPagesBasePath({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "octocat/portfolio",
      NEXT_PUBLIC_BASE_PATH: "/preview",
    }),
    "/preview",
  );
  assert.equal(
    getGithubPagesBasePath({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "octocat/portfolio",
      NEXT_PUBLIC_BASE_PATH: "false",
    }),
    "",
  );
  assert.equal(
    getGithubPagesBasePath({ GITHUB_REPOSITORY: "octocat/portfolio" }),
    "",
  );
  assert.equal(withBasePath("/images/avatar.svg", "/portfolio"), "/portfolio/images/avatar.svg");
  assert.equal(getStaticPageHref("/config/", "/portfolio"), "/portfolio/config/index.html");
  assert.equal(
    getStaticPageHref("/projects/example/?view=full#results", "/portfolio/"),
    "/portfolio/projects/example/index.html?view=full#results",
  );
});

test("infers the Pages URL while preferring NEXT_PUBLIC_SITE_URL", () => {
  assert.equal(
    getSiteUrl({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "octocat/portfolio",
    }),
    "https://octocat.github.io/portfolio",
  );
  assert.equal(
    getSiteUrl({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "octocat/octocat.github.io",
    }),
    "https://octocat.github.io",
  );
  assert.equal(
    getSiteUrl({
      GITHUB_ACTIONS: "true",
      GITHUB_REPOSITORY: "octocat/portfolio",
      NEXT_PUBLIC_SITE_URL: "https://example.com/",
    }),
    "https://example.com",
  );
});

test("Pages workflow uses official actions, minimal permissions, and deployment controls", () => {
  const workflow = readProjectFile(".github/workflows/deploy-pages.yml");

  assert.match(workflow, /branches:\s*\n\s*- main/u);
  assert.match(workflow, /workflow_dispatch:/u);
  assert.match(workflow, /permissions:\s*\n\s*contents: read\s*\n\s*pages: write\s*\n\s*id-token: write/u);
  assert.match(workflow, /concurrency:\s*\n\s*group: pages/u);
  assert.match(workflow, /actions\/configure-pages@v5/u);
  assert.match(workflow, /actions\/upload-pages-artifact@v4[\s\S]*path: out/u);
  assert.match(workflow, /actions\/deploy-pages@v4/u);
  assert.match(workflow, /environment:\s*\n\s*name: github-pages/u);
});

test("simulated GitHub Pages build prefixes HTML assets and SEO URLs", () => {
  execFileSync(
    process.execPath,
    ["scripts/next-with-wasm.mjs", "build", "--webpack"],
    {
      cwd: projectRoot,
      env: buildEnvironment,
      stdio: "inherit",
    },
  );

  const home = readProjectFile("out/index.html");
  const profile = readProjectFile("out/profile/index.html");
  const config = readProjectFile("out/config/index.html");
  const robots = readProjectFile("out/robots.txt");
  const sitemap = readProjectFile("out/sitemap.xml");
  const escapedSiteUrl = escapeRegExp(expectedSiteUrl);
  const escapedBasePath = escapeRegExp(expectedBasePath);

  assert.match(home, new RegExp(`(?:href|src)="${escapedBasePath}/_next/`, "u"));
  assert.match(home, new RegExp(`src="${escapedBasePath}/images/avatar-placeholder\\.svg"`, "u"));
  assert.match(home, new RegExp(`href="${escapedBasePath}/config/index\\.html"`, "u"));
  assert.match(
    home,
    new RegExp(`href="${escapedBasePath}/projects/search-quality-ai-answer/index\\.html"`, "u"),
  );
  assert.match(home, new RegExp(`<link rel="canonical" href="${escapedSiteUrl}/"`, "u"));
  assert.match(
    home,
    new RegExp(
      `<meta name="baidu-site-verification" content="${fakeBaiduVerification}"\\s*/?>`,
      "u",
    ),
  );
  assert.doesNotMatch(home, /content="wrong-baidu-verification-token"/u);
  execFileSync(process.execPath, ["scripts/check-seo.mjs"], {
    cwd: projectRoot,
    env: buildEnvironment,
    stdio: "inherit",
  });
  assert.throws(
    () =>
      execFileSync(process.execPath, ["scripts/check-seo.mjs"], {
        cwd: projectRoot,
        env: {
          ...buildEnvironment,
          NEXT_PUBLIC_BAIDU_SITE_VERIFICATION:
            "wrong-baidu-verification-token",
        },
        stdio: "pipe",
      }),
    /Command failed/u,
  );

  const homePath = path.join(projectRoot, "out/index.html");
  const assertMutatedSeoFails = (mutatedHome) => {
    writeFileSync(homePath, mutatedHome);
    assert.throws(
      () => execFileSync(process.execPath, ["scripts/check-seo.mjs"], {
        cwd: projectRoot,
        env: buildEnvironment,
        stdio: "pipe",
      }),
      /Command failed/u,
    );
    writeFileSync(homePath, home);
  };
  assertMutatedSeoFails(home.replace(/og-share\.png/u, "missing-share-image.png"));
  assertMutatedSeoFails(home.replace(/content="https:[^"]+og-share\.png"/u, "content=\"/relative-share-image.png\""));
  assertMutatedSeoFails(home.replace(/content="index, follow"/u, "content=\"noindex, nofollow\""));
  assertMutatedSeoFails(home.replace(/content="summary_large_image"/u, "content=\"invalid-card\""));

  assert.match(config, new RegExp(`<link rel="canonical" href="${escapedSiteUrl}/config/"`, "u"));
  assert.match(config, new RegExp(`(?:href|src)="${escapedBasePath}/_next/`, "u"));
  assert.match(profile, new RegExp(`<link rel="canonical" href="${escapedSiteUrl}/profile/"`, "u"));
  assert.match(robots, new RegExp(`Allow: ${escapedBasePath || ""}/`, "u"));
  assert.match(robots, new RegExp(`Sitemap: ${escapedSiteUrl}/sitemap\\.xml`, "u"));
  assert.match(sitemap, new RegExp(`${escapedSiteUrl}/projects/search-quality-ai-answer/`, "u"));
  if (expectedBasePath) {
    assert.doesNotMatch(home, /(?:href|src)="\/(?:_next|images)\//u);
  }

  const unconfiguredEnvironment = {
    ...buildEnvironment,
    NEXT_PUBLIC_BAIDU_SITE_VERIFICATION: "",
  };
  execFileSync(
    process.execPath,
    ["scripts/next-with-wasm.mjs", "build", "--webpack"],
    {
      cwd: projectRoot,
      env: unconfiguredEnvironment,
      stdio: "inherit",
    },
  );
  const unconfiguredHome = readProjectFile("out/index.html");
  assert.doesNotMatch(unconfiguredHome, /name="baidu-site-verification"/u);
  execFileSync(process.execPath, ["scripts/check-seo.mjs"], {
    cwd: projectRoot,
    env: unconfiguredEnvironment,
    stdio: "inherit",
  });
});
