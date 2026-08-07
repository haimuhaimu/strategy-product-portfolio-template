import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  initializePortfolio,
  parseArgs,
} from "../scripts/init-portfolio.mjs";

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-init-"));
  await mkdir(path.join(root, "data", "presets"), { recursive: true });
  await mkdir(path.join(root, "src", "app"), { recursive: true });
  await writeFile(
    path.join(root, "data", "projects.json"),
    `${JSON.stringify(
      {
        rolePreset: "product",
        profile: {
          name: "你的名字",
          role: "策略产品经理",
          location: "你的城市",
          email: "hello@example.com",
          headline: "把判断变成工具",
          summary: "匿名化作品集示例",
          tags: ["策略产品"],
        },
        projects: [{ slug: "demo" }],
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    path.join(root, "data", "presets", "operations.json"),
    `${JSON.stringify(
      {
        rolePreset: "operations",
        profile: {
          role: "产品运营",
          headline: "用实验沉淀运营机制",
          interests: ["用户行为", "增长实验"],
        },
        personalOperatingSystem: { personModel: [{ dimension: "用户" }] },
        influences: [{ name: "用户旅程" }],
        trainingHistory: [{ stage: "运营验证" }],
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    path.join(root, ".env.example"),
    "NEXT_PUBLIC_SITE_URL=https://portfolio.example.com\nNEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=\nNEXT_PUBLIC_BAIDU_SITE_VERIFICATION=\n",
  );
  await writeFile(
    path.join(root, "src", "app", "globals.css"),
    ":root {\n  --accent-red: #c92a20;\n}\n",
  );
  return root;
}

function captureOutput() {
  let value = "";
  return {
    output: { write: (chunk) => (value += chunk) },
    value: () => value,
  };
}

test("parseArgs supports non-interactive customization", () => {
  assert.deepEqual(
    parseArgs([
      "--yes",
      "--dry-run",
      "--name",
      "示例用户",
      "--preset",
      "operations",
      "--theme",
      "cobalt",
    ]),
    {
      yes: true,
      dryRun: true,
      name: "示例用户",
      preset: "operations",
      theme: "cobalt",
    },
  );
  assert.throws(() => parseArgs(["--unknown"]), /未知参数/u);
});

test("dry-run previews changes without writing files", async () => {
  const root = await createFixture();
  const capture = captureOutput();

  const result = await initializePortfolio({
    root,
    options: {
      yes: true,
      dryRun: true,
      name: "示例用户",
      siteUrl: "https://example.test/",
      theme: "forest",
    },
    output: capture.output,
  });

  const data = JSON.parse(
    await readFile(path.join(root, "data", "projects.json"), "utf8"),
  );
  const css = await readFile(path.join(root, "src", "app", "globals.css"), "utf8");

  assert.equal(result.profile.name, "示例用户");
  assert.equal(result.siteUrl, "https://example.test");
  assert.equal(data.profile.name, "你的名字");
  assert.match(css, /#c92a20/u);
  await assert.rejects(readFile(path.join(root, ".env.local"), "utf8"));
  assert.match(capture.value(), /未写入文件/u);
});

test("non-interactive initialization preserves schema and writes configuration", async () => {
  const root = await createFixture();
  const capture = captureOutput();

  await initializePortfolio({
    root,
    options: {
      yes: true,
      dryRun: false,
      name: "示例用户",
      role: "AI 产品经理",
      location: "杭州",
      email: "public@example.test",
      headline: "让复杂判断可以复用",
      summary: "关注 AI 产品与内容生态。",
      siteUrl: "https://portfolio.example.test",
      theme: "cobalt",
    },
    output: capture.output,
  });

  const data = JSON.parse(
    await readFile(path.join(root, "data", "projects.json"), "utf8"),
  );
  const env = await readFile(path.join(root, ".env.local"), "utf8");
  const css = await readFile(path.join(root, "src", "app", "globals.css"), "utf8");

  assert.equal(data.profile.name, "示例用户");
  assert.equal(data.profile.role, "AI 产品经理");
  assert.deepEqual(data.profile.tags, ["策略产品"]);
  assert.deepEqual(data.projects, [{ slug: "demo" }]);
  assert.match(env, /^NEXT_PUBLIC_SITE_URL=https:\/\/portfolio\.example\.test$/mu);
  assert.match(css, /--accent-red: #2457c5;/u);
  assert.match(capture.value(), /初始化完成/u);
});

test("operations preset updates model data and keeps explicit overrides", async () => {
  const root = await createFixture();
  const capture = captureOutput();

  const result = await initializePortfolio({
    root,
    options: {
      yes: true,
      dryRun: false,
      preset: "operations",
      role: "增长运营负责人",
    },
    output: capture.output,
  });

  const data = JSON.parse(
    await readFile(path.join(root, "data", "projects.json"), "utf8"),
  );

  assert.equal(result.preset, "operations");
  assert.equal(data.rolePreset, "operations");
  assert.equal(data.profile.role, "增长运营负责人");
  assert.deepEqual(data.profile.interests, ["用户行为", "增长实验"]);
  assert.deepEqual(data.projects, [{ slug: "demo" }]);
  assert.equal(data.personalOperatingSystem.personModel[0].dimension, "用户");
  assert.equal(data.trainingHistory[0].stage, "运营验证");
});

test("operations preset also respects dry-run", async () => {
  const root = await createFixture();
  const capture = captureOutput();

  const result = await initializePortfolio({
    root,
    options: { yes: true, dryRun: true, preset: "operations" },
    output: capture.output,
  });
  const data = JSON.parse(
    await readFile(path.join(root, "data", "projects.json"), "utf8"),
  );

  assert.equal(result.preset, "operations");
  assert.equal(result.profile.role, "产品运营");
  assert.equal(data.rolePreset, "product");
  assert.equal(data.profile.role, "策略产品经理");
});

test("initialization rejects invalid public configuration", async () => {
  const root = await createFixture();
  const capture = captureOutput();

  await assert.rejects(
    initializePortfolio({
      root,
      options: {
        yes: true,
        dryRun: true,
        preset: "sales",
      },
      output: capture.output,
    }),
    /预设必须是/u,
  );

  await assert.rejects(
    initializePortfolio({
      root,
      options: {
        yes: true,
        dryRun: true,
        email: "not-an-email",
      },
      output: capture.output,
    }),
    /邮箱格式不正确/u,
  );

  await assert.rejects(
    initializePortfolio({
      root,
      options: {
        yes: true,
        dryRun: true,
        theme: "neon",
      },
      output: capture.output,
    }),
    /主题必须是/u,
  );
});
