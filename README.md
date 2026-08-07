# Product & Operations Portfolio Template｜产品经理与运营个人认知作品集模板

**Show how you decide, operate, and evolve.｜不只展示做过什么，也展示你如何判断、行动与更新自己。**

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![License: MIT](https://img.shields.io/github/license/haimuhaimu/strategy-product-portfolio-template)](https://github.com/haimuhaimu/strategy-product-portfolio-template/blob/main/LICENSE)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)

[![Live Preview](https://img.shields.io/badge/Live_Preview-Open-CC2E24?logo=vercel&logoColor=white)](https://6559d4c732a5.aime-app.bytedance.net)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhaimuhaimu%2Fstrategy-product-portfolio-template)

![产品经理与运营个人认知作品集模板首页预览](public/images/portfolio-preview.png)

一套面向**产品经理、产品运营、策略运营、增长运营及 AI / 内容 / 搜索从业者**的中文个人认知作品集模板。案例仍沿用清晰的证据链：

> **Problem 问题 → Judgment 判断 → Validation 验证 → Result 结果**

同时，`/thinking/` 将个人认知表达成可维护的数据模型：

> **人物模型 → 奖励函数 → 行动策略 → 影响来源 → 训练史 → 认知校准**

项目基于 Next.js、TypeScript 与 Tailwind CSS，保持纯静态导出，无后端、数据库和新增运行时依赖。产品与运营使用同一套页面结构，通过初始化预设切换起始内容。

## 模板亮点

- 面向产品经理与运营岗位，不把作品集限制在单一职能或行业。
- 用案例研究呈现背景、判断、动作、实验、结果与边界，而非职责罗列。
- 数据驱动的个人操作系统：人物模型、奖励函数、行动策略、影响来源与成长阶段。
- 保留认知校准日志，记录“先验判断 → 现实反馈 → 保留 / 修正 / 待验证”。
- `data/projects.json` 集中管理个人信息、兴趣、认知模型、经历和案例。
- 内置 `product` / `operations` 初始化预设，显式参数可继续覆盖预设字段。
- 首页、个人页、思考页与项目详情页均支持 Next.js 静态导出。
- 内置响应式布局、SEO、JSON-LD、sitemap、robots 与公开安全检查。

仓库中的姓名、公司、时间和指标均为匿名化示例，请替换成你有权公开的内容。

## 快速开始

环境要求：Node.js 20+，推荐使用 npm。

```bash
npx degit haimuhaimu/strategy-product-portfolio-template my-portfolio
cd my-portfolio
npm install
cp .env.example .env.local
npm run init -- --preset product
npm run dev
```

运营方向可直接运行：

```bash
npm run init -- --preset operations
```

打开 `http://localhost:3000` 预览。也可以点击上方 **Deploy with Vercel** 从公开模板创建部署。

## 一键初始化

交互式初始化不会上传内容，所有修改只发生在当前目录。先预览运营预设会改什么：

```bash
npm run init -- --preset operations --dry-run
```

自动化使用预设，并继续用现有参数覆盖姓名、角色等字段：

```bash
npm run init -- --yes \
  --preset operations \
  --name "你的名字" \
  --role "增长运营负责人" \
  --site-url "https://portfolio.example.com" \
  --theme cobalt
```

`--preset` 可选 `product` 或 `operations`；强调色可选 `vermilion`、`cobalt`、`forest`。`--name`、`--role`、`--location`、`--email`、`--headline`、`--summary`、`--site-url` 和 `--theme` 均保持兼容，且显式覆盖值优先于预设。运行 `npm run init -- --help` 查看完整参数。

常用验证命令：

```bash
npm run test:init
npm run test:personal-model
npm run test:calibration
npm run test:public
npm run lint
npm run build
npm run check:seo
```

## 如何替换成你的内容

1. 编辑 `data/projects.json`，替换 `rolePreset`、个人资料、兴趣、认知模型、经历和项目。
2. 在 `personalOperatingSystem` 中维护人物模型、奖励函数与行动策略。
3. 在 `influences` 中记录作品、人物、方法或经历，并标记保留、修正、待验证或应用中。
4. 在 `trainingHistory` 中记录成长阶段、训练数据与模型更新。
5. 编辑 `.env.local`，设置线上域名与搜索引擎验证值。
6. 替换 `public/images/avatar-placeholder.svg` 和 `public/images/portfolio-companion.svg`。
7. 运营用户可修改 `data/presets/operations.json`，形成自己的团队起始预设。

项目案例建议使用：

```text
业务问题 -> 核心判断 -> 产品 / 运营动作 -> 数据协作 -> 结果 -> 边界与复盘
```

不要公开无法解释来源的数字，也不要把公司内部材料、用户数据、未发布策略或同事信息直接放进仓库。

## 目录结构

```text
data/projects.json                 个人资料、认知模型、经历与项目案例
data/presets/operations.json      运营角色初始化预设
src/app                            页面、metadata、sitemap、robots
src/components/PersonalModelSystem.tsx  个人认知模型展示组件
src/lib                            数据读取与 SEO 工具
scripts/init-portfolio.mjs         初始化 CLI
scripts/check-seo.mjs              静态导出 SEO 检查
tests                              初始化、个人模型、校准与公开安全测试
```

## 隐私检查

发布前运行：

```bash
npm run test:public
git status --short
git diff --cached
```

检查姓名、手机号、私人邮箱、家庭住址、真实雇主、内部项目代号、未公开业务数据、精确实验指标、聊天记录和私人文件。图片还应检查 EXIF 与其他元数据。

如果仓库历史曾提交敏感信息，仅删除当前文件不够；应使用经过审查的历史清理方案，或创建无旧历史的新仓库。

## 部署

项目使用 Next.js 静态导出，`npm run build` 后产物位于 `out/`。

### GitHub Pages（零配置）

1. 点击仓库页右上角 **Use this template → Create a new repository**，创建公开仓库并保留默认分支名 `main`。
2. 在新仓库打开 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 推送到 `main`，或在 **Actions → Deploy to GitHub Pages → Run workflow** 手动触发。
4. 部署完成后，从工作流的 `github-pages` environment 打开站点。

`.github/workflows/deploy-pages.yml` 会安装依赖、测试 Pages 路径、构建 `out/`，再通过 GitHub 官方 Pages actions 上传和发布。普通仓库会自动发布到 `https://owner.github.io/repository/`；名为 `owner.github.io` 的用户站点仓库不会增加子路径。本地 `npm run dev` 和默认构建不受影响。

如已绑定自定义域名，请同时设置 `NEXT_PUBLIC_SITE_URL=https://portfolio.example.com` 和 `NEXT_PUBLIC_BASE_PATH=false`，让 canonical、sitemap、robots 与静态资源都从自定义域名根路径提供。路径也可在构建环境中显式控制：

```bash
# 覆盖自动推断的仓库子路径
NEXT_PUBLIC_BASE_PATH=/preview npm run build

# 禁用子路径（false、off、none、/ 均可）
NEXT_PUBLIC_BASE_PATH=false npm run build
```

`GITHUB_PAGES_BASE_PATH` 是 `NEXT_PUBLIC_BASE_PATH` 的兼容别名，后者优先。在 Actions 中可将这些值写入工作流 job/step 的 `env`，或映射到 GitHub Repository Variables。

其他部署方式：

- Vercel：导入仓库即可部署。
- OSS / CDN：上传 `out/`，将默认首页设为 `index.html`。

线上部署可配置：

```bash
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

## 开源许可

代码使用 [MIT License](LICENSE)。示例文字可自由改写；发布时请确保替换的图片、字体、品牌标识和业务材料可公开使用。
