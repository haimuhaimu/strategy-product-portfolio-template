# 30 分钟生成可投递的产品经理 / 运营作品集

**无需后端，不上传数据：10 分钟看到自己的页面，30 分钟完成发布。**

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)

默认首页刻意只保留四段：个人介绍、严格 3 个代表项目、结果证据、联系方式。高级的个人模型与思考页面仍在仓库中，但默认不占用导航和首次配置时间。

## 模板亮点

- `/config/` 可视化填写、实时预览、一键下载 `projects.json`。
- 产品与运营使用不同的问题引导和案例结构，不是只替换标题。
- v2 数据结构集中管理首页、功能开关、联系方式和代表项目。
- 自动兼容旧 v1 数据；自定义 slug 自动使用数据驱动的通用详情页。
- 纯前端静态导出，无后端、数据库和上传行为。
- 保留 profile、thinking、个人模型和专用案例页，需要时通过 feature flags 开启。

## 快速开始

环境要求：Node.js 20+，推荐使用 npm。

```bash
npx degit haimuhaimu/strategy-product-portfolio-template my-portfolio
cd my-portfolio
npm install
npm run dev
```

1. 打开 `http://localhost:3000/config/`。
2. 选择「产品经理」或「运营」，填写基本信息和 3 个项目。
3. 下载 `projects.json`，替换仓库中的 `data/projects.json`。
4. 回到首页检查内容，然后运行 `npm run build`。

配置页只在浏览器内处理数据，不会上传。导出的 JSON 已包含通用项目详情页所需字段。

## 一键初始化

CLI 保持兼容，适合批量初始化或偏好终端的用户：

```bash
npm run init -- --yes \
  --preset operations \
  --name "你的名字" \
  --role "增长运营负责人" \
  --site-url "https://portfolio.example.com" \
  --theme cobalt
```

`--preset` 可选 `product` / `operations`；`--name`、`--role`、`--location`、`--email`、`--headline`、`--summary`、`--site-url`、`--theme` 参数继续兼容。运营预设会替换为 3 个运营案例，但不会要求填写高级个人模型。

## 如何替换成你的内容

优先使用 `/config/`。需要手动编辑时，核心字段如下：

- `home`：首页介绍标题和结果指标。
- `features`：`profile`、`thinking`、`advancedModels` 功能开关，默认均为 `false`。
- `contact`：联系方式区文案与邮箱。
- `featuredProjectSlugs`：首页严格展示的 3 个项目 slug。
- `profile`：姓名、角色、简介等基本信息。
- `projects`：项目背景、问题、方法、动作、结果和指标。

旧版 v1 JSON 可继续使用，normalize 层会补齐 v2 默认值。发布前请将示例指标换成你有权公开、能解释口径的数据。

## 目录结构

```text
data/projects.json                  作品集 v2 数据
src/app/config/page.tsx             静态可视化配置页
src/components/config               配置表单与实时预览
src/lib/normalize.mjs               v1 / v2 兼容与默认值
src/lib/config-export.mjs           product / operations 导出逻辑
scripts/init-portfolio.mjs          兼容 CLI
```

## 隐私检查

发布前运行：

```bash
npm run test:public
git status --short
git diff --check
```

不要公开私人邮箱、手机号、家庭住址、内部项目代号、未公开业务数据、聊天记录或无权公开的素材。配置页不会上传数据，但下载后的 JSON 会进入你的本地仓库，请在提交前复查。

## 验证

```bash
npm run test:init
npm run test:portfolio-v2
npm run test:personal-model
npm run test:calibration
npm run test:public
npm run lint
npm run build
npm run check:seo
npm run test:pages
```

## 部署

项目使用 Next.js 静态导出，`npm run build` 后产物位于 `out/`，可部署到 GitHub Pages、Vercel 或任意静态托管。

GitHub Pages 会根据 `GITHUB_REPOSITORY` 自动推断仓库子路径。也可显式设置：

```bash
NEXT_PUBLIC_BASE_PATH=/preview npm run build
# 禁用子路径
NEXT_PUBLIC_BASE_PATH=false npm run build
```

自定义域名建议同时设置 `NEXT_PUBLIC_SITE_URL=https://portfolio.example.com` 和 `NEXT_PUBLIC_BASE_PATH=false`。

## 开源许可

代码使用 [MIT License](LICENSE)。
