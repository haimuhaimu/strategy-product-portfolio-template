#!/usr/bin/env node

import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";

const THEME_ACCENTS = {
  vermilion: "#c92a20",
  cobalt: "#2457c5",
  forest: "#22704a",
};

const VALUE_FLAGS = new Map([
  ["--name", "name"],
  ["--role", "role"],
  ["--location", "location"],
  ["--email", "email"],
  ["--headline", "headline"],
  ["--summary", "summary"],
  ["--site-url", "siteUrl"],
  ["--theme", "theme"],
  ["--preset", "preset"],
]);

export function parseArgs(args) {
  const options = { dryRun: false, yes: false };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--yes" || argument === "-y") {
      options.yes = true;
      continue;
    }
    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    const key = VALUE_FLAGS.get(argument);
    if (!key) throw new Error(`未知参数：${argument}`);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${argument} 需要一个值`);
    }
    options[key] = value;
    index += 1;
  }

  return options;
}

function normalizeSiteUrl(value) {
  const normalized = value.trim().replace(/\/$/u, "");
  const url = new URL(normalized);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error("站点 URL 必须使用 http 或 https");
  }
  return normalized;
}

function validateEmail(value) {
  if (!value.includes("@") || value.startsWith("@") || value.endsWith("@")) {
    throw new Error("邮箱格式不正确");
  }
  return value;
}

function validateTheme(value) {
  if (!Object.hasOwn(THEME_ACCENTS, value)) {
    throw new Error(`主题必须是：${Object.keys(THEME_ACCENTS).join("、")}`);
  }
  return value;
}

function validatePreset(value) {
  if (!new Set(["product", "operations"]).has(value)) {
    throw new Error("预设必须是：product、operations");
  }
  return value;
}

function mergePreset(data, preset) {
  return {
    ...data,
    ...preset,
    profile: { ...data.profile, ...preset.profile },
  };
}

async function atomicWrite(filePath, content) {
  const temporaryPath = `${filePath}.portfolio-init.tmp`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, filePath);
}

async function ask(rl, label, defaultValue) {
  const answer = await rl.question(`${label}（默认：${defaultValue}）：`);
  return answer.trim() || defaultValue;
}

async function collectInteractiveOptions(defaults, input, output) {
  const rl = createInterface({ input, output });
  try {
    output.write("\n用几分钟生成你的产品经理 / 运营作品集。所有内容只会写入当前目录。\n\n");
    return {
      name: await ask(rl, "姓名", defaults.name),
      role: await ask(rl, "角色定位", defaults.role),
      location: await ask(rl, "所在城市", defaults.location),
      email: await ask(rl, "公开邮箱", defaults.email),
      headline: await ask(rl, "一句话定位", defaults.headline),
      summary: await ask(rl, "个人简介", defaults.summary),
      siteUrl: await ask(rl, "站点 URL", defaults.siteUrl),
      theme: await ask(
        rl,
        "强调色 vermilion / cobalt / forest",
        defaults.theme,
      ),
    };
  } finally {
    rl.close();
  }
}

function buildEnv(siteUrl, currentEnv = "") {
  const lines = currentEnv ? currentEnv.trimEnd().split("\n") : [];
  const nextLine = `NEXT_PUBLIC_SITE_URL=${siteUrl}`;
  const index = lines.findIndex((line) => line.startsWith("NEXT_PUBLIC_SITE_URL="));
  if (index === -1) lines.unshift(nextLine);
  else lines[index] = nextLine;

  for (const key of [
    "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=",
    "NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=",
  ]) {
    if (!lines.some((line) => line.startsWith(key))) lines.push(key);
  }
  return `${lines.join("\n")}\n`;
}

function updateTheme(css, theme) {
  const nextColor = THEME_ACCENTS[theme];
  if (!/--accent-red:\s*#[0-9a-f]{6};/iu.test(css)) {
    throw new Error("没有在 src/app/globals.css 中找到 --accent-red 变量");
  }
  return css.replace(/--accent-red:\s*#[0-9a-f]{6};/iu, `--accent-red: ${nextColor};`);
}

export async function initializePortfolio({
  root = process.cwd(),
  options,
  input = process.stdin,
  output = process.stdout,
}) {
  const dataPath = path.join(root, "data", "projects.json");
  const envPath = path.join(root, ".env.local");
  const envExamplePath = path.join(root, ".env.example");
  const cssPath = path.join(root, "src", "app", "globals.css");

  const [dataSource, envExample, css] = await Promise.all([
    readFile(dataPath, "utf8"),
    readFile(envExamplePath, "utf8"),
    readFile(cssPath, "utf8"),
  ]);
  let data = JSON.parse(dataSource);
  const preset = validatePreset(options.preset ?? data.rolePreset ?? "product");
  if (preset === "operations") {
    const presetPath = path.join(root, "data", "presets", "operations.json");
    const presetData = JSON.parse(await readFile(presetPath, "utf8"));
    data = mergePreset(data, presetData);
  } else {
    data.rolePreset = "product";
  }
  const siteUrl =
    envExample.match(/^NEXT_PUBLIC_SITE_URL=(.+)$/mu)?.[1] ??
    "https://portfolio.example.com";
  const defaults = {
    ...data.profile,
    siteUrl,
    theme: "vermilion",
  };

  const supplied = Object.fromEntries(
    Object.entries(options).filter(([, value]) => typeof value === "string"),
  );
  const answers = options.yes
    ? { ...defaults, ...supplied }
    : {
        ...(await collectInteractiveOptions(
          { ...defaults, ...supplied },
          input,
          output,
        )),
        ...supplied,
      };

  answers.email = validateEmail(answers.email.trim());
  answers.siteUrl = normalizeSiteUrl(answers.siteUrl);
  answers.theme = validateTheme(answers.theme);

  data.profile = {
    ...data.profile,
    name: answers.name.trim(),
    role: answers.role.trim(),
    location: answers.location.trim(),
    email: answers.email,
    headline: answers.headline.trim(),
    summary: answers.summary.trim(),
  };

  const nextData = `${JSON.stringify(data, null, 2)}\n`;
  const nextEnv = buildEnv(answers.siteUrl, envExample);
  const nextCss = updateTheme(css, answers.theme);
  const summary = {
    preset: data.rolePreset,
    profile: {
      name: data.profile.name,
      role: data.profile.role,
      location: data.profile.location,
      email: data.profile.email,
    },
    siteUrl: answers.siteUrl,
    theme: answers.theme,
    files: ["data/projects.json", ".env.local", "src/app/globals.css"],
  };

  if (options.dryRun) {
    output.write(`\n演练完成，未写入文件：\n${JSON.stringify(summary, null, 2)}\n`);
    return summary;
  }

  await Promise.all([
    atomicWrite(dataPath, nextData),
    atomicWrite(envPath, nextEnv),
    atomicWrite(cssPath, nextCss),
  ]);
  output.write(
    `\n初始化完成。下一步运行 npm run dev，并继续替换项目案例。\n` +
      `发布前请运行 npm run test:public。\n`,
  );
  return summary;
}

function printHelp(output) {
  output.write(`用法：npm run init -- [选项]\n\n`);
  output.write(`  -y, --yes              使用安全默认值，不进入问答\n`);
  output.write(`      --dry-run          只预览，不写入文件\n`);
  output.write(`      --name <姓名>\n`);
  output.write(`      --role <角色>\n`);
  output.write(`      --location <城市>\n`);
  output.write(`      --email <邮箱>\n`);
  output.write(`      --headline <一句话定位>\n`);
  output.write(`      --summary <个人简介>\n`);
  output.write(`      --site-url <URL>\n`);
  output.write(`      --theme <vermilion|cobalt|forest>\n`);
  output.write(`      --preset <product|operations>\n`);
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printHelp(process.stdout);
      return;
    }
    await initializePortfolio({ options });
  } catch (error) {
    process.stderr.write(`初始化失败：${error.message}\n`);
    process.exitCode = 1;
  }
}

const isDirectRun =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirectRun) await main();
