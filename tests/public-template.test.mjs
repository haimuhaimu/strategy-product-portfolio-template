import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicSources = [
  ".env.example",
  "README.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "ROADMAP.md",
  "package.json",
  "package-lock.json",
  "data",
  "docs",
  "examples",
  "presets",
  "schema",
  "showcase",
  "src",
  "scripts",
  "skills",
  "tests",
  "public",
];

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsonl",
  ".md",
  ".mjs",
  ".py",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const scanExcludedFiles = new Set([
  // 测试定义本身必须声明禁用词，不能反向把规则源码判成公开内容命中。
  "tests/public-template.test.mjs",
]);

const allowedTechnicalFixtures = new Map([
  // 审计器必须保留一个虚构百分比来验证“数值结果”识别；该文件不会进入网站构建产物。
  ["skills/portfolio-story-builder/scripts/test_audit_portfolio.py", new Set(["exact-business-percentage"])],
]);

const allowedFrontmatterLines = new Map([
  // 项目作者署名允许公开；仅豁免此文件 frontmatter 中完全一致的这一行。
  [
    "skills/portfolio-story-builder/SKILL.md",
    new Map([["private-account", "author: chenquan.66"]]),
  ],
]);

const forbiddenPatterns = [
  { id: "private-name-zh", pattern: /陈全/u },
  { id: "private-name-en", pattern: /Chen Quan/iu },
  { id: "private-account", pattern: /chenquan/iu },
  { id: "private-phone", pattern: /17600571711/u },
  { id: "private-email", pattern: /453431035@qq\.com/iu },
  { id: "private-domain", pattern: /chenquan\.club/iu },
  { id: "company-name", pattern: /字节跳动/u },
  { id: "product-name-douyin", pattern: /抖音/u },
  { id: "product-name-kuaishou", pattern: /快手/u },
  { id: "product-name-toutiao", pattern: /今日头条/u },
  { id: "product-name-xigua", pattern: /西瓜/u },
  { id: "private-home-path", pattern: /\/Users\/bytedance/u },
  { id: "legacy-percentage-7-2", pattern: /\+7\.2%/u },
  { id: "legacy-percentage-30", pattern: /\+30%/u },
  { id: "legacy-percentage-50", pattern: /\+50%/u },
  { id: "legacy-scale-500w", pattern: /\+500万/u },
  { id: "legacy-scale-1700w", pattern: /1700万/u },
  { id: "legacy-scale-300w", pattern: /300万/u },
  { id: "legacy-scale-5y", pattern: /5亿/u },
  { id: "legacy-scale-10y", pattern: /10亿/u },
  { id: "legacy-percentage-10-plus", pattern: /10%\+/u },
  { id: "business-jargon", pattern: /优质营销|精选会员|商单|软单|投流|主\s*feed|主端|主站/iu },
  { id: "identifiable-author-scale", pattern: /全量业务作者|全量作者|全量覆盖|几十万(?:量级)?/u },
  { id: "identifiable-volume", pattern: /百万级(?:增量|规模)?|千万级(?:增量|规模)?|(?:万|亿|数亿|十亿)级(?:增量|规模)?/u },
  { id: "identifiable-ratio-or-rank", pattern: /双位数(?:比例|百分比)?|行业第(?:一|1)/u },
  {
    id: "exact-business-percentage",
    pattern: /(?:增长|提升|下降|降低|转化率|激活率|完成率|召回率|留存率|占比|比例|命中率|准确率|渗透率|执行效率)[^。\n]{0,24}[+-]?\d+(?:\.\d+)?%|[+-]?\d+(?:\.\d+)?%[^。\n]{0,24}(?:增长|提升|下降|降低|转化率|激活率|完成率|召回率|留存率|占比|比例|命中率|准确率|渗透率|执行效率)/u,
  },
];

function contentWithoutAllowedFrontmatterLine(relativePath, ruleId, content) {
  const allowedLine = allowedFrontmatterLines.get(relativePath)?.get(ruleId);
  if (!allowedLine) return content;

  const lines = content.split("\n");
  if (lines[0] !== "---") return content;

  const frontmatterEnd = lines.indexOf("---", 1);
  if (frontmatterEnd === -1) return content;

  const matchingLines = lines
    .slice(1, frontmatterEnd)
    .map((line, index) => ({ index: index + 1, line }))
    .filter(({ line }) => line === allowedLine);
  if (matchingLines.length !== 1) return content;

  lines[matchingLines[0].index] = "";
  return lines.join("\n");
}

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

test("frontmatter allowlist is limited to the exact author line and file", () => {
  const skillPath = "skills/portfolio-story-builder/SKILL.md";
  const authorLine = "author: chenquan.66";
  const frontmatter = `---\nname: portfolio-story-builder\n${authorLine}\n---\n`;

  assert.doesNotMatch(
    contentWithoutAllowedFrontmatterLine(skillPath, "private-account", frontmatter),
    /chenquan/iu,
  );
  assert.match(
    contentWithoutAllowedFrontmatterLine("README.md", "private-account", frontmatter),
    /chenquan/iu,
  );
  assert.match(
    contentWithoutAllowedFrontmatterLine(
      skillPath,
      "private-account",
      `---\nname: portfolio-story-builder\n---\n${authorLine}\n`,
    ),
    /chenquan/iu,
  );
  assert.match(
    contentWithoutAllowedFrontmatterLine(
      skillPath,
      "private-account",
      `---\nname: portfolio-story-builder\n${authorLine} extra\n---\n`,
    ),
    /chenquan/iu,
  );
});

const ignoredDirectories = new Set([".git", ".next", "node_modules", "out", "__pycache__"]);

function isScannableTextFile(filePath) {
  const relativePath = path.relative(root, filePath).split(path.sep).join("/");
  return !scanExcludedFiles.has(relativePath) && (
    path.basename(filePath) === ".env.example" || textExtensions.has(path.extname(filePath))
  );
}

function collectTextFiles(target) {
  const absolutePath = path.join(root, target);
  if (!existsSync(absolutePath)) return [];

  if (statSync(absolutePath).isFile()) {
    return isScannableTextFile(absolutePath) ? [absolutePath] : [];
  }

  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const child = path.join(absolutePath, entry.name);
    if (entry.isDirectory()) {
      return collectTextFiles(path.relative(root, child));
    }
    return isScannableTextFile(child) ? [child] : [];
  });
}

test("public template contains no private identity, business jargon or identifiable business data", () => {
  const violations = [];

  for (const filePath of publicSources.flatMap(collectTextFiles)) {
    const relativePath = path.relative(root, filePath).split(path.sep).join("/");
    const allowedRules = allowedTechnicalFixtures.get(relativePath) ?? new Set();
    const content = readFileSync(filePath, "utf8");
    for (const { id, pattern } of forbiddenPatterns) {
      const scannableContent = contentWithoutAllowedFrontmatterLine(relativePath, id, content);
      if (!allowedRules.has(id) && pattern.test(scannableContent)) {
        violations.push(`${relativePath} matches ${id} (${pattern.toString()})`);
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

test("SEO checker uses the documented Baidu verification variable", () => {
  const envExample = readFileSync(path.join(root, ".env.example"), "utf8");
  const seoCheck = readFileSync(
    path.join(root, "scripts/check-seo.mjs"),
    "utf8",
  );

  assert.match(envExample, /^NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=/m);
  assert.match(
    seoCheck,
    /process\.env\.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION/u,
  );
  assert.doesNotMatch(seoCheck, /process\.env\.BAIDU_SITE_VERIFICATION/u);
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
