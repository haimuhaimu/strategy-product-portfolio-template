import assert from "node:assert/strict";
import test from "node:test";

import {
  joinSiteUrl,
  normalizeBasePath,
  withBasePath,
} from "../src/lib/site-paths.mjs";

test("normalizes a GitHub Pages repository base path", () => {
  assert.equal(normalizeBasePath(" portfolio-template/ "), "/portfolio-template");
  assert.equal(normalizeBasePath("/portfolio-template/"), "/portfolio-template");
  assert.equal(normalizeBasePath("/"), "");
  assert.equal(normalizeBasePath(""), "");

  assert.throws(
    () => normalizeBasePath("https://example.com/portfolio-template"),
    /path, not a URL/u,
  );
  assert.throws(() => normalizeBasePath("/../private"), /must not contain/u);
});

test("prefixes public assets without changing root deployments", () => {
  assert.equal(
    withBasePath("/images/avatar-placeholder.svg", "/portfolio-template"),
    "/portfolio-template/images/avatar-placeholder.svg",
  );
  assert.equal(
    withBasePath("/images/avatar-placeholder.svg", ""),
    "/images/avatar-placeholder.svg",
  );
});

test("keeps repository subpaths in canonical URLs", () => {
  assert.equal(
    joinSiteUrl("https://example.github.io/portfolio-template", "/profile/"),
    "https://example.github.io/portfolio-template/profile/",
  );
  assert.equal(
    joinSiteUrl("https://portfolio.example.com", "/profile/"),
    "https://portfolio.example.com/profile/",
  );
});
