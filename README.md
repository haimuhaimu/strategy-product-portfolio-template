# Skill-first：把简历 / 经历变成可投递作品集

**简历 / 经历 → 单问题追问 → 精选 3 个案例 → 证据与隐私审计 → 可投递网站。**

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)

项目的核心是 [`portfolio-story-builder` Skill](skills/portfolio-story-builder/)：它帮助产品经理、产品运营和策略 / 增长运营把零散材料整理成有证据的 3 个代表案例。Next.js 网站模板是可投递输出，不是起点；不使用 Agent 时，`/config/` 可视化编辑器仍可作为 fallback。

> 触发示例：“把我的简历做成产品经理作品集”“从这些经历中选 3 个增长运营案例”“生成可投递作品集并做隐私检查”。

## 模板亮点

- **一次只追问一个高价值问题**：材料足够就继续，不机械盘问。
- **严格精选 3 个案例**：按岗位相关性、证据、个人判断、差异化和互补性选择。
- **0–5 分证据评分**：检查结果、口径、方法、交付物和贡献边界，不编造指标。
- **招聘官 30 秒测试**：首屏必须快速回答项目、本人判断、可信证据和岗位关系。
- **证据 / 隐私审计**：发现占位、弱证据、空话、结构问题和常见敏感信息模式。
- **首次使用保持硬收缩**：默认仍只有介绍、3 个项目、结果证据、联系方式；高级模块默认关闭。

## 快速开始

1. 让支持 Agent Skills 的 Agent 读取 [`skills/portfolio-story-builder/SKILL.md`](skills/portfolio-story-builder/SKILL.md)。
2. 提供简历、经历摘要或项目材料，并说明目标岗位。
3. 回答每轮一个证据问题，确认 3 个案例和隐私边界。
4. 让 Agent 生成 v2 `projects.json`、运行 strict 审计，并写入 `data/projects.json`。
5. 运行测试和构建，得到静态网站。

Skill 的完整价值、工作流与隐私承诺见 [`skills/README.md`](skills/README.md)。

## 可视化 fallback

不使用 Agent 时，可继续用本地编辑器：

```bash
npx degit haimuhaimu/strategy-product-portfolio-template my-portfolio
cd my-portfolio
npm install
npm run dev
```

1. 打开 `http://localhost:3000/config/`。
2. 选择「产品经理」或「运营」，填写基本信息和严格 3 个项目。
3. 下载 `projects.json`，替换 `data/projects.json`。
4. 回到首页检查内容，然后运行 `npm run build`。

配置页只在浏览器内处理数据，不会上传。它保留为可视化 fallback，不会把首次使用扩张到个人模型或思考页面。

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

`--preset` 可选 `product` / `operations`；其他参数继续兼容。运营预设会替换为 3 个运营案例，但不会要求填写高级个人模型。

## 如何替换成你的内容

```text
skills/portfolio-story-builder/       Skill 开源分发镜像
skills/.../assets/portfolio-v2-minimal.json
                                      匿名安全的 v2 起草骨架
data/projects.json                    网站使用的作品集 v2 数据
src/app/config/page.tsx               可视化 fallback
src/lib/normalize.mjs                 v1 / v2 兼容与默认值
scripts/init-portfolio.mjs            兼容 CLI
```

v2 核心字段包括 `home`、`features`、`contact`、`featuredProjectSlugs`、`profile` 和 `projects`。旧版 v1 JSON 可继续使用。发布前请将示例指标换成有权公开、能解释口径的数据；`profile`、`thinking`、`advancedModels` 默认关闭。

## 隐私检查

Skill 审计器和配置页均在本地处理数据，不要求后端、数据库或上传原始简历。不要公开私人邮箱、手机号、家庭住址、内部项目代号、未公开业务数据、聊天记录或无权公开的素材。

```bash
npm run test:skill
npm run test:init
npm run test:portfolio-v2
npm run test:personal-model
npm run test:calibration
npm run test:public
npm run lint
npm run build
npm run check:seo
npm run test:pages

git diff --check
```

`test:skill` 对匿名起草骨架执行非 strict 审计；真正可投递的数据仍应按 Skill 流程运行 strict 审计，并完成本人隐私确认。

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
