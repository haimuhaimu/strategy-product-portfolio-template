import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  assessShowcaseChanges,
  hasCurrentRepositoryIssueReference,
  normalizeRepositoryPath,
  parseGitNameStatus,
  verifyShowcaseOnlyPullRequest,
} from "../scripts/verify-showcase-only-pr.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(projectRoot, "scripts", "verify-showcase-only-pr.mjs");

function makeEntry(slug) {
  return {
    slug,
    kind: "community",
    publicUrl: `https://${slug}.example.com/`,
    roleTags: ["产品经理"],
    publicHighlights: ["公开亮点一", "公开亮点二", "公开亮点三"],
    auditSummary: {
      strict: true,
      score: 4,
      maxScore: 5,
      dimensions: {
        resultEvidence: true,
        scopeAndAttribution: false,
        methodEvidence: true,
        artifactEvidence: true,
        contributionBoundary: true,
      },
    },
    disclosure: {
      authorized: "confirmed",
      publiclyAccessible: "confirmed",
      sensitiveMaterialReviewed: "confirmed",
      takedownAvailable: "confirmed",
    },
  };
}

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", windowsHide: true }).trim();
}

async function writeEvent(root, payload) {
  const eventPath = path.join(root, "event.json");
  await writeFile(eventPath, JSON.stringify(payload), "utf8");
  return eventPath;
}

test("仓库路径统一为正斜杠，并解析无重命名的 name-status 输出", () => {
  assert.equal(normalizeRepositoryPath("showcase\\entries\\demo.json"), "showcase/entries/demo.json");
  assert.deepEqual(
    parseGitNameStatus("A\0showcase\\entries\\demo.json\0M\0README.md\0"),
    [
      { status: "A", statusCode: "A", path: "showcase/entries/demo.json" },
      { status: "M", statusCode: "M", path: "README.md" },
    ],
  );
});

test("未触及 showcase/entries 时直接通过", () => {
  assert.deepEqual(
    assessShowcaseChanges([{ status: "M", statusCode: "M", path: "README.md" }]),
    { touched: false, errors: [], entryPath: null },
  );
});

test("只允许新增恰好一个合法条目", () => {
  assert.deepEqual(
    assessShowcaseChanges([{ status: "A", statusCode: "A", path: "showcase\\entries\\new-entry.json" }]),
    { touched: true, errors: [], entryPath: "showcase/entries/new-entry.json" },
  );
});

test("修改条目并夹带其他文件时聚合可操作错误", () => {
  const result = assessShowcaseChanges([
    { status: "M", statusCode: "M", path: "showcase/entries/existing.json" },
    { status: "A", statusCode: "A", path: "showcase/entries/Bad_Name.json" },
    { status: "M", statusCode: "M", path: "README.md" },
  ]);

  assert.equal(result.touched, true);
  assert.equal(result.entryPath, null);
  assert.equal(result.errors.length, 4);
  assert.match(result.errors.join("\n"), /恰好 1 个/u);
  assert.match(result.errors.join("\n"), /不能修改、删除或重命名/u);
  assert.match(result.errors.join("\n"), /Bad_Name\.json/u);
  assert.match(result.errors.join("\n"), /README\.md/u);
});

test("Issue 判断兼容 closing 关键词单复数、过去式与大小写", () => {
  for (const body of [
    "Close #1",
    "Closes #2",
    "Closed #3",
    "Fix #4",
    "Fixes #5",
    "Fixed #6",
    "Resolve #7",
    "Resolves #8",
    "Resolved #9",
  ]) {
    assert.equal(hasCurrentRepositoryIssueReference(body, "owner/repo"), true, body);
  }
  assert.equal(hasCurrentRepositoryIssueReference("prefixes #12", "owner/repo"), false);
  assert.equal(hasCurrentRepositoryIssueReference("Closes owner/repo#12", "owner/repo"), false);
});

test("Issue 完整 URL 必须属于当前仓库", () => {
  assert.equal(
    hasCurrentRepositoryIssueReference(
      "背景见 https://github.com/owner/repo/issues/123。",
      "owner/repo",
    ),
    true,
  );
  assert.equal(
    hasCurrentRepositoryIssueReference(
      "背景见 https://github.com/another/repo/issues/123",
      "owner/repo",
    ),
    false,
  );
  assert.equal(
    hasCurrentRepositoryIssueReference(
      "背景见 https://github.com/owner/repo/pull/123",
      "owner/repo",
    ),
    false,
  );
});

test("非 pull_request 事件不读取 payload 并直接通过", async () => {
  const result = await verifyShowcaseOnlyPullRequest({
    eventName: "push",
    eventPath: "missing-event.json",
  });
  assert.equal(result.skipped, true);
  assert.match(result.message, /无需检查/u);
});

test("规则、Issue 与 JSON 校验错误会一次性报告", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "showcase-pr-errors-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "showcase", "entries"), { recursive: true });
  await writeFile(
    path.join(root, "showcase", "entries", "wrong-file.json"),
    JSON.stringify({ ...makeEntry("different-slug"), privateEmail: "private@example.com" }),
    "utf8",
  );
  const eventPath = await writeEvent(root, {
    repository: { full_name: "owner/repo" },
    pull_request: {
      body: "没有关联 Issue",
      base: { sha: "a".repeat(40) },
      head: { sha: "b".repeat(40) },
    },
  });

  await assert.rejects(
    verifyShowcaseOnlyPullRequest({
      eventName: "pull_request",
      eventPath,
      cwd: root,
      gitDiff: () => "A\0showcase/entries/wrong-file.json\0M\0README.md\0",
    }),
    (error) => {
      assert.match(error.message, /README\.md/u);
      assert.match(error.message, /必须关联 Issue/u);
      assert.match(error.message, /字段不符合公开 schema/u);
      return true;
    },
  );
});

test("临时 Git 仓库端到端校验合法 Showcase 投稿", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "showcase-pr-e2e-"));
  context.after(() => rm(root, { recursive: true, force: true }));

  git(root, ["init"]);
  git(root, ["config", "user.email", "showcase-test@example.com"]);
  git(root, ["config", "user.name", "Showcase Test"]);
  await writeFile(path.join(root, "README.md"), "fixture\n", "utf8");
  git(root, ["add", "README.md"]);
  git(root, ["commit", "-m", "initial"]);
  const baseSha = git(root, ["rev-parse", "HEAD"]);

  await mkdir(path.join(root, "showcase", "entries"), { recursive: true });
  await writeFile(
    path.join(root, "showcase", "entries", "portable-entry.json"),
    `${JSON.stringify(makeEntry("portable-entry"), null, 2)}\n`,
    "utf8",
  );
  git(root, ["add", "showcase/entries/portable-entry.json"]);
  git(root, ["commit", "-m", "add entry"]);
  const headSha = git(root, ["rev-parse", "HEAD"]);
  const eventPath = await writeEvent(root, {
    repository: { full_name: "owner/repo" },
    pull_request: {
      body: "Resolves #42",
      base: { sha: baseSha },
      head: { sha: headSha },
    },
  });

  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    env: {
      ...process.env,
      GITHUB_EVENT_NAME: "pull_request",
      GITHUB_EVENT_PATH: eventPath,
    },
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /校验通过/u);
  assert.equal(
    await readFile(path.join(root, "showcase", "entries", "portable-entry.json"), "utf8"),
    `${JSON.stringify(makeEntry("portable-entry"), null, 2)}\n`,
  );
});
