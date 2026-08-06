# Strategy Product Portfolio Template｜中文策略产品经理作品集模板

**Show your product judgment, not just your job description.｜把复杂产品经历讲成可验证的判断，而不是一份职责清单。**

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![License: MIT](https://img.shields.io/github/license/haimuhaimu/strategy-product-portfolio-template)](https://github.com/haimuhaimu/strategy-product-portfolio-template/blob/main/LICENSE)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

一套面向**策略产品经理、AI 产品经理、推荐 / 搜索产品经理和内容生态从业者**的中文个人作品集模板。它不鼓励堆砌职责，而是用一条清晰的证据链呈现每个案例：

> **Problem 问题 → Judgment 判断 → Validation 验证 → Result 结果**

与通用简历站模板相比，本项目把案例叙事、数据 / 算法协作和边界复盘放在核心位置；基于 Next.js、TypeScript 与 Tailwind CSS，使用单个 JSON 文件管理个人资料和案例，不需要后端或数据库。

- **隐私检查**：`npm run test:public` 检查私人身份、精确业务数据、私有文件和模板完整性等公开安全风险。
- **SEO 检查**：静态导出包含 metadata、JSON-LD、sitemap 与 robots；构建后运行 `npm run check:seo` 验证关键页面、canonical 和站点索引文件。

仓库中的姓名、公司、时间和指标均为匿名化示例，请替换成你有权公开的内容。

> 如果这套“用判断与证据讲产品故事”的方法对你有帮助，欢迎点一个 **Star**，也方便以后回来继续完善作品集。

## 模板亮点

- 以案例研究代替职责罗列，完整呈现背景、方法、数据协作、结果和复盘。
- 首页、个人页、思考页和项目详情页均支持静态导出。
- `data/projects.json` 集中管理个人信息、经历和项目，改内容不必改页面结构。
- 内置响应式布局、项目路线图、SEO、JSON-LD、sitemap 与 robots。
- 提供公开安全检查，避免误提交手机号、邮箱、真实雇主、精确业务数据和私人文件。

## 快速开始

环境要求：Node.js 20+，推荐使用 npm。

```bash
git clone https://github.com/your-name/strategy-product-portfolio-template.git
cd strategy-product-portfolio-template
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。

常用命令：

```bash
npm run lint
npm run test:public
npm run build
npm run check:seo
```

## 如何替换成你的内容

1. 编辑 `data/projects.json`：替换姓名、角色、简介、经历、项目和指标。
2. 编辑 `.env.local`：设置你的线上域名与搜索引擎验证值。
3. 替换 `public/images/avatar-placeholder.svg` 和 `public/images/portfolio-companion.svg`。
4. 按需修改 `src/components/HomeThinkingTeaser.tsx` 与 `src/components/PersonalOperatingSystem.tsx`，加入你的兴趣和判断方式。
5. 检查 `src/lib/seo.ts`、各页面 metadata 和项目关键词。

案例建议使用这一结构：

```text
业务问题 -> 核心判断 -> 产品方法 -> 数据/算法协作 -> 结果 -> 边界与复盘
```

不要公开无法解释来源的数字，也不要把公司内部材料、用户数据、未发布策略或同事信息直接放进仓库。

## 目录结构

```text
data/projects.json       个人资料、经历与项目案例
src/app                  页面、metadata、sitemap、robots
src/components           首页与案例展示组件
src/lib                  数据读取与 SEO 工具
public/images            可替换的公开图片
scripts/check-seo.mjs    静态导出后的 SEO 检查
tests/public-template.*  公开安全与模板完整性检查
```

## 隐私检查

发布前运行：

```bash
npm run test:public
git status --short
git diff --cached
```

检查重点：

- 姓名、手机号、私人邮箱、家庭住址与证件信息。
- 真实雇主、内部项目代号、未公开业务数据和精确实验指标。
- 简历 PDF、聊天记录、知识库、部署压缩包和本机绝对路径。
- 截图、图片 EXIF、PDF 元数据以及 Git 历史中的旧版本。

如果仓库历史曾提交过敏感信息，仅删除当前文件不够。公开发布时应创建一份无旧历史的新仓库，或使用经过审查的历史清理工具。

## 部署

项目使用 Next.js 静态导出，`npm run build` 后产物位于 `out/`。

- Vercel：导入仓库即可部署。
- GitHub Pages：将 `out/` 发布到 Pages，并根据仓库子路径配置站点 URL。
- OSS / CDN：上传 `out/` 内的文件，并将默认首页设为 `index.html`。

线上部署前，在 `.env.local` 或部署平台中设置：

```bash
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

## 开源许可

代码使用 [MIT License](LICENSE)。示例文字可自由改写；发布时请确保你替换的图片、字体、品牌标识和业务材料拥有可公开使用的权利。
