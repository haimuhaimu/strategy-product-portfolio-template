import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function collectFiles(target) {
  const absolute = path.join(root, target);
  if (!existsSync(absolute)) return [];
  if (statSync(absolute).isFile()) return [absolute];
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(absolute, entry.name);
    return entry.isDirectory() ? collectFiles(path.relative(root, child)) : [child];
  });
}

test("start 只提供 Agent 与已有 projects.json 两个入口，并展示三步主路径", () => {
  const start = read("src/app/start/page.tsx");
  assert.match(start, /用你自己的 Agent，把经历变成可发布的作品集/u);
  assert.match(start, /<span[^>]*>A<\/span>/u);
  assert.match(start, /<span[^>]*>B<\/span>/u);
  assert.match(start, /用自己的 Agent/u);
  assert.match(start, /已有 projects\.json/u);
  assert.match(start, /href="\/launchpad\/"/u);
  assert.doesNotMatch(start, /href="\/config\/"/u);
  for (const phrase of ["把材料交给 Agent", "回答少量关键问题", "获得并发布作品集"]) {
    assert.match(start, new RegExp(phrase, "u"));
  }
  assert.match(start, /任何能够访问网页、读取仓库并生成文件的个人 Agent/u);
  assert.match(start, /不对具体品牌或服务能力作承诺/u);
});

test("通用提示词包含完整 Agent 工作要求与复制失败降级", () => {
  const card = read("src/components/start/AgentPromptCard.tsx");
  for (const phrase of [
    "skills/portfolio-story-builder/SKILL.md",
    "盘点我提供的简历",
    "每次只问我一个",
    "精选三个",
    "不要编造指标",
    "检查隐私",
    "v2 projects.json",
    "data/projects.json",
    "测试、代码检查、构建和网页检查",
    "部署预览",
  ]) {
    assert.match(card, new RegExp(phrase.replaceAll("/", "\\/"), "u"));
  }
  assert.match(card, /navigator\.clipboard\?\.writeText/u);
  assert.match(card, /promptRef\.current\?\.select\(\)/u);
  assert.match(card, /Ctrl\/Cmd\+C/u);
  assert.match(card, /<button[^>]*onClick/u);
  assert.match(card, /<textarea[^>]*readOnly/u);
});

test("公开产品与测试中不再保留已删除的试点路由或记录机制", () => {
  const targets = [".github", "src", "scripts", "README.md", "CHANGELOG.md"];
  const residue = [];
  const retiredName = ["p", "m", "f", "-", "pilot"].join("");
  const retiredRoute = ["/", "pilot", "/"].join("");
  const pattern = new RegExp(`${retiredName.replace("-", "[-_ ]?")}|${retiredRoute}`, "iu");
  for (const file of targets.flatMap(collectFiles)) {
    const content = readFileSync(file, "utf8");
    if (pattern.test(content)) residue.push(path.relative(root, file));
  }
  assert.deepEqual(residue, []);
  assert.equal(existsSync(path.join(root, "src/app", "pilot")), false);
  assert.equal(existsSync(path.join(root, "src/lib", `${retiredName}.mjs`)), false);
  assert.equal(existsSync(path.join(root, ".github/ISSUE_TEMPLATE", `${retiredName}.yml`)), false);
});

test("作品集检查页使用人话标签并保留模板匹配解释", () => {
  const workbench = read("src/components/launchpad/LaunchpadWorkbench.tsx");
  for (const phrase of ["作品集检查与下载", "发布文件", "文件结构", "需要处理", "可以继续", "检查通过", "加分理由", "当前缺口"]) {
    assert.match(workbench, new RegExp(phrase, "u"));
  }
  for (const phrase of ["PORTFOLIO LAUNCHPAD", "RELEASE PACK", "Schema-lite", "BLOCK", "WARN", "PASS"]) {
    assert.doesNotMatch(workbench, new RegExp(phrase, "u"));
  }
});
