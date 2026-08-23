import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { validateShowcaseEntry } from "../src/lib/showcase-entry.mjs";

const ENTRY_DIRECTORY = "showcase/entries";
const ENTRY_PATH_PATTERN = /^showcase\/entries\/([a-z0-9]+(?:-[a-z0-9]+)*)\.json$/u;
const SHA_PATTERN = /^[0-9a-f]{40,64}$/iu;

export function normalizeRepositoryPath(filePath) {
  return String(filePath ?? "").replace(/\\/gu, "/");
}

export function parseGitNameStatus(output) {
  if (!output) return [];
  const fields = String(output).split("\0");
  if (fields.at(-1) === "") fields.pop();
  const changes = [];

  for (let index = 0; index < fields.length;) {
    const status = fields[index++];
    if (!status) throw new Error("Git diff 返回了无法识别的空状态。");
    const statusCode = status[0];
    if (statusCode === "R" || statusCode === "C") {
      const oldPath = fields[index++];
      const filePath = fields[index++];
      if (oldPath === undefined || filePath === undefined) throw new Error("Git diff 的重命名记录不完整。");
      changes.push({
        status,
        statusCode,
        oldPath: normalizeRepositoryPath(oldPath),
        path: normalizeRepositoryPath(filePath),
      });
      continue;
    }
    const filePath = fields[index++];
    if (filePath === undefined) throw new Error("Git diff 的文件记录不完整。");
    changes.push({ status, statusCode, path: normalizeRepositoryPath(filePath) });
  }

  return changes;
}

function touchesEntryDirectory(change) {
  return [change.path, change.oldPath]
    .filter(Boolean)
    .some((filePath) => filePath === ENTRY_DIRECTORY || filePath.startsWith(`${ENTRY_DIRECTORY}/`));
}

function describePaths(paths) {
  return paths.map((filePath) => `\`${filePath}\``).join("、");
}

export function assessShowcaseChanges(rawChanges) {
  const changes = rawChanges.map((change) => ({
    ...change,
    path: normalizeRepositoryPath(change.path),
    ...(change.oldPath ? { oldPath: normalizeRepositoryPath(change.oldPath) } : {}),
  }));
  const touched = changes.some(touchesEntryDirectory);
  if (!touched) return { touched: false, errors: [], entryPath: null };

  const errors = [];
  const validAdditions = changes.filter(
    (change) => change.statusCode === "A" && ENTRY_PATH_PATTERN.test(change.path),
  );
  const changedEntries = changes.filter(
    (change) => touchesEntryDirectory(change) && change.statusCode !== "A",
  );
  const invalidEntryAdditions = changes.filter(
    (change) => change.statusCode === "A" && touchesEntryDirectory(change) && !ENTRY_PATH_PATTERN.test(change.path),
  );
  const unrelatedChanges = changes.filter((change) => !touchesEntryDirectory(change));

  if (changes.length !== 1 || validAdditions.length !== 1) {
    errors.push("Showcase 投稿 PR 必须只新增恰好 1 个 `showcase/entries/<slug>.json`，请把其他改动移到单独的 PR。");
  }
  if (changedEntries.length > 0) {
    errors.push(`不能修改、删除或重命名已有 Showcase 条目：${describePaths(changedEntries.flatMap((change) => [change.oldPath, change.path]).filter(Boolean))}。请撤销这些改动。`);
  }
  if (invalidEntryAdditions.length > 0) {
    errors.push(`新增条目的路径或文件名不正确：${describePaths(invalidEntryAdditions.map((change) => change.path))}。请使用小写字母、数字和单个连字符命名为 \`showcase/entries/<slug>.json\`。`);
  }
  if (unrelatedChanges.length > 0) {
    errors.push(`Showcase 投稿 PR 不能包含其他文件：${describePaths(unrelatedChanges.map((change) => change.path))}。请把这些文件移到单独的 PR。`);
  }

  return {
    touched: true,
    errors,
    entryPath: validAdditions.length === 1 ? validAdditions[0].path : null,
  };
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export function hasCurrentRepositoryIssueReference(body, repositoryFullName) {
  if (typeof body !== "string") return false;
  const closingKeyword = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#\d+\b/iu;
  if (closingKeyword.test(body)) return true;
  if (typeof repositoryFullName !== "string" || !repositoryFullName.includes("/")) return false;

  const repositoryPath = escapeRegularExpression(repositoryFullName);
  const issueUrl = new RegExp(
    `https:\\/\\/(?:www\\.)?github\\.com\\/${repositoryPath}\\/issues\\/\\d+(?=$|[\\s#?)/.,，。；;:])`,
    "iu",
  );
  return issueUrl.test(body);
}

function getRepositoryFullName(payload) {
  return payload?.repository?.full_name ?? payload?.pull_request?.base?.repo?.full_name ?? "";
}

function runGitDiff({ cwd, baseSha, headSha }) {
  return execFileSync(
    "git",
    ["diff", "--name-status", "--no-renames", "-z", baseSha, headSha, "--"],
    { cwd, encoding: "utf8", windowsHide: true },
  );
}

async function readPayload(eventPath) {
  if (!eventPath) throw new Error("没有找到 GitHub 事件文件。请重新运行检查；如仍失败，请联系维护者。");
  try {
    return JSON.parse(await readFile(eventPath, "utf8"));
  } catch {
    throw new Error("GitHub PR 信息无法读取。请重新运行检查；如仍失败，请联系维护者。");
  }
}

export async function verifyShowcaseOnlyPullRequest({
  eventName = process.env.GITHUB_EVENT_NAME,
  eventPath = process.env.GITHUB_EVENT_PATH,
  cwd = process.cwd(),
  gitDiff = runGitDiff,
} = {}) {
  if (eventName !== "pull_request") {
    return { skipped: true, message: "当前不是 pull_request 事件，无需检查 Showcase 投稿。" };
  }

  const payload = await readPayload(eventPath);
  const baseSha = payload?.pull_request?.base?.sha;
  const headSha = payload?.pull_request?.head?.sha;
  if (!SHA_PATTERN.test(baseSha ?? "") || !SHA_PATTERN.test(headSha ?? "")) {
    throw new Error("PR 的 base/head 提交信息不完整。请重新运行检查；如仍失败，请联系维护者。");
  }

  let changes;
  try {
    changes = parseGitNameStatus(await gitDiff({ cwd, baseSha, headSha }));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`无法比较 PR 改动（${detail}）。请确认检出步骤使用 fetch-depth: 0 后重新运行。`);
  }

  const assessment = assessShowcaseChanges(changes);
  if (!assessment.touched) {
    return { skipped: true, message: "PR 未改动 showcase/entries，无需检查 Showcase 投稿。" };
  }

  const errors = [...assessment.errors];
  const repositoryFullName = getRepositoryFullName(payload);
  if (!hasCurrentRepositoryIssueReference(payload?.pull_request?.body, repositoryFullName)) {
    errors.push("PR 描述必须关联 Issue。请加入 `Closes #123`（也可使用 Fixes/Resolves）或当前仓库 Issue 的完整 GitHub URL，并替换为真实编号。");
  }

  if (assessment.entryPath) {
    const fileName = assessment.entryPath.split("/").at(-1);
    try {
      const source = await readFile(path.join(cwd, ...assessment.entryPath.split("/")), "utf8");
      const entry = JSON.parse(source);
      validateShowcaseEntry(entry, fileName);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      errors.push(`新增条目 \`${assessment.entryPath}\` 未通过校验：${detail}。请按 \`showcase/schema.json\` 修正 JSON，并确保文件名与 slug 一致。`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Showcase 投稿校验未通过，请按下面提示修改：\n\n${errors.map((message) => `- ${message}`).join("\n")}`);
  }

  return {
    skipped: false,
    message: `Showcase 投稿校验通过：${assessment.entryPath}`,
    entryPath: assessment.entryPath,
  };
}

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  try {
    const result = await verifyShowcaseOnlyPullRequest();
    console.log(result.message);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
