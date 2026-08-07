import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  getGithubPagesBasePath,
  getSiteUrl,
  normalizeBasePath,
  withBasePath,
} from "../src/lib/github-pages.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const repository = process.env.GITHUB_REPOSITORY || "octocat/portfolio";
const buildEnvironment = {
  ...process.env,
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: repository,
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
  const robots = readProjectFile("out/robots.txt");
  const sitemap = readProjectFile("out/sitemap.xml");
  const escapedSiteUrl = escapeRegExp(expectedSiteUrl);
  const escapedBasePath = escapeRegExp(expectedBasePath);

  assert.match(home, new RegExp(`(?:href|src)="${escapedBasePath}/_next/`, "u"));
  assert.match(home, new RegExp(`src="${escapedBasePath}/images/avatar-placeholder\\.svg"`, "u"));
  assert.match(home, new RegExp(`href="${escapedBasePath}/profile/"`, "u"));
  assert.match(home, new RegExp(`<link rel="canonical" href="${escapedSiteUrl}/"`, "u"));
  assert.match(profile, new RegExp(`<link rel="canonical" href="${escapedSiteUrl}/profile/"`, "u"));
  assert.match(robots, new RegExp(`Allow: ${escapedBasePath || ""}/`, "u"));
  assert.match(robots, new RegExp(`Sitemap: ${escapedSiteUrl}/sitemap\\.xml`, "u"));
  assert.match(sitemap, new RegExp(`${escapedSiteUrl}/projects/search-quality-ai-answer/`, "u"));
  if (expectedBasePath) {
    assert.doesNotMatch(home, /(?:href|src)="\/(?:_next|images)\//u);
  }
});
