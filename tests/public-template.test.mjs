import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicSources = [
  "README.md",
  "package.json",
  "package-lock.json",
  "data",
  "showcase",
  "docs",
  "src",
  "scripts",
];

const forbiddenPatterns = [
  /陈全/u,
  /Chen Quan/iu,
  /chenquan/iu,
  /17600571711/u,
  /453431035@qq\.com/iu,
  /chenquan\.club/iu,
  /字节跳动/u,
  /抖音/u,
  /快手/u,
  /今日头条/u,
  /西瓜/u,
  /\/Users\/bytedance/u,
  /\+7\.2%/u,
  /\+30%/u,
  /\+50%/u,
  /\+500万/u,
  /1700万/u,
  /300万/u,
  /5亿/u,
  /10亿/u,
  /10%\+/u,
];

function versionIsAtLeast(actual, minimum) {
  const actualParts = actual.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  for (let index = 0; index < minimumParts.length; index += 1) {
    const actualPart = actualParts[index] ?? 0;
    const minimumPart = minimumParts[index] ?? 0;
    if (actualPart > minimumPart) return true;
    if (actualPart < minimumPart) return false;
  }

  return true;
}

test("version comparison treats omitted segments as zero", () => {
  assert.equal(versionIsAtLeast("1.2", "1.2.1"), false);
  assert.equal(versionIsAtLeast("1.2", "1.2.0"), true);
});

function collectTextFiles(target) {
  const absolutePath = path.join(root, target);
  if (!existsSync(absolutePath)) return [];

  if (statSync(absolutePath).isFile()) {
    return [absolutePath];
  }

  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(absolutePath, entry.name);
    if (entry.isDirectory()) {
      return collectTextFiles(path.relative(root, child));
    }
    return [child];
  });
}

test("public template contains no private identity or exact business data", () => {
  const violations = [];

  for (const filePath of publicSources.flatMap(collectTextFiles)) {
    const content = readFileSync(filePath, "utf8");
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        violations.push(
          `${path.relative(root, filePath)} matches ${pattern.toString()}`,
        );
      }
    }
  }

  assert.deepEqual(violations, []);
});

test("private documents are not part of the public template", () => {
  const gitignore = readFileSync(path.join(root, ".gitignore"), "utf8");
  const trackedPrivateFiles = execFileSync(
    "git",
    ["ls-files", "--", "public/files"],
    {
      cwd: root,
      encoding: "utf8",
    },
  ).trim();

  assert.match(gitignore, /^\/public\/files\/$/m);
  assert.equal(trackedPrivateFiles, "");
});

test("README documents the stable portfolio generation and delivery contract", () => {
  const readme = readFileSync(path.join(root, "README.md"), "utf8");

  assert.match(readme, /\[.*portfolio-story-builder.*\]\(skills\/portfolio-story-builder\/\)/u);
  assert.match(readme, /data\/projects\.json/u);
  assert.match(
    readme,
    /audit_portfolio\.py data\/projects\.json --strict --output audit-report\.json/u,
  );
  for (const command of [
    "npm run test:portfolio-v2",
    "npm run test:public",
    "npm run lint",
    "npm run build",
  ]) {
    assert.ok(readme.includes(command), `README 缺少发布校验命令：${command}`);
  }
  assert.match(readme, /^## 隐私与边界$/mu);
});

test("Next.js packages meet the audited security baseline", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  );
  const nextVersion = packageJson.dependencies.next;

  assert.match(nextVersion, /^\d+\.\d+\.\d+$/u);
  assert.equal(packageJson.devDependencies["eslint-config-next"], nextVersion);
  assert.equal(
    packageJson.devDependencies["@next/swc-wasm-nodejs"],
    nextVersion,
  );
  assert.ok(
    versionIsAtLeast(nextVersion, "16.3.0"),
    `Expected Next.js 16.3.0 or newer, received ${nextVersion}`,
  );
});

test("Next.js transitive production dependencies meet audited floors", () => {
  const packageLock = JSON.parse(
    readFileSync(path.join(root, "package-lock.json"), "utf8"),
  );
  const nextPackage = packageLock.packages["node_modules/next"];
  const resolvedPostcss =
    packageLock.packages["node_modules/next/node_modules/postcss"]?.version ??
    packageLock.packages["node_modules/postcss"]?.version;
  const sharp = packageLock.packages["node_modules/sharp"]?.version;

  assert.ok(nextPackage, "Expected Next.js in the lockfile");
  assert.ok(nextPackage.dependencies?.postcss, "Expected Next.js to use PostCSS");
  assert.ok(resolvedPostcss, "Expected Next.js to resolve PostCSS");
  assert.ok(sharp, "Expected the optional Sharp dependency in the lockfile");
  assert.ok(
    versionIsAtLeast(nextPackage.dependencies.postcss, "8.5.18"),
    `Expected Next.js to require PostCSS 8.5.18 or newer, received ${nextPackage.dependencies.postcss}`,
  );
  assert.ok(
    versionIsAtLeast(resolvedPostcss, "8.5.18"),
    `Expected resolved PostCSS 8.5.18 or newer, received ${resolvedPostcss}`,
  );
  assert.ok(
    versionIsAtLeast(sharp, "0.35.3"),
    `Expected Sharp 0.35.3 or newer, received ${sharp}`,
  );
});

test("direct PostCSS dependency meets the audited security baseline", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  );
  const postcssVersion = packageJson.devDependencies.postcss;

  assert.match(postcssVersion, /^\d+\.\d+\.\d+$/u);
  assert.ok(
    versionIsAtLeast(postcssVersion, "8.5.18"),
    `Expected PostCSS 8.5.18 or newer, received ${postcssVersion}`,
  );
});

test("GitHub Actions use supported JavaScript runtimes", () => {
  const workflow = readFileSync(
    path.join(root, ".github/workflows/portable-build.yml"),
    "utf8",
  );

  assert.match(workflow, /uses: actions\/checkout@v7/u);
  assert.match(workflow, /uses: actions\/setup-node@v7/u);
  assert.doesNotMatch(
    workflow,
    /uses: actions\/(?:checkout|setup-node)@v[1-4]\b/u,
  );
});
