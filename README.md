# 用你自己的 Agent，把经历变成可发布的作品集

这不是在线简历编辑器，也不要求你先学习一套复杂工具。它是一套给**你自己的 Agent**使用的开源作品集方法、展示模板和本地检查工具：Agent 负责盘点材料、追问关键证据、精选三个项目、检查隐私并生成文件；网站负责把结果展示和发布出来。

| 适合谁 | 最终得到什么 |
| --- | --- |
| 产品经理、策略 / 增长产品、产品运营、策略 / 增长运营 | 3 个代表项目 + 可检查的作品集文件 + 可部署网站 |

[**开始：把提示词交给自己的 Agent →**](https://haimuhaimu.github.io/strategy-product-portfolio-template/start/) · [**已有文件：检查并下载 →**](https://haimuhaimu.github.io/strategy-product-portfolio-template/launchpad/) · [**浏览四种展示结构 →**](https://haimuhaimu.github.io/strategy-product-portfolio-template/templates/) · [**查看 portfolio-story-builder Agent 工作说明 →**](skills/portfolio-story-builder/)

![真实作品集成品首页](public/images/portfolio-preview.png)

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)

## 两种开始方式

### A. 用自己的 Agent（推荐）

任何能够访问网页、读取仓库并生成文件的个人 Agent 都可以使用这套方法。把简历、项目材料和下面的提示词一起交给它：

```text
请作为我的作品集 Agent，先阅读：
https://github.com/haimuhaimu/strategy-product-portfolio-template/blob/main/skills/portfolio-story-builder/SKILL.md

请盘点我提供的全部材料，每次只问一个最关键的问题，从全部经历中精选三个代表项目。只使用我提供或确认的事实，不要编造指标、客户、职责或结果；信息不足时写“待补充”。发布前检查隐私，并生成 v2 projects.json。如果你有目标仓库权限，请接入 data/projects.json，运行仓库已有的测试、代码检查、构建和网页检查，通过后部署预览。
```

完整可复制版本在 [`/start/`](https://haimuhaimu.github.io/strategy-product-portfolio-template/start/)。工作过程是：

`把材料交给 Agent → 回答少量关键问题 → 获得并发布作品集`

### B. 已有 `projects.json`

打开[作品集检查与下载](https://haimuhaimu.github.io/strategy-product-portfolio-template/launchpad/)，在浏览器本地导入文件。工具会检查文件结构、三个代表项目、占位内容、证据完整度、隐私和内容关联，并给出“需要处理 / 可以继续 / 检查通过”的明确结论。

文件不会上传；刷新页面即可清空。通过隐私与内容关联检查后，可以分别下载 5 个发布文件：

- `projects.json`
- `audit-report.json`
- `RELEASE_CHECKLIST.md`
- `SHARE_COPY.md`
- `SHOWCASE_ENTRY.json`

## Agent 会在后台做什么

1. 盘点简历、项目文档和零散材料，确认目标岗位与公开边界。
2. 一次只追问一个高价值问题，材料足够时直接继续。
3. 从全部经历中精选三个项目，覆盖核心能力、复杂推进和差异化。
4. 检查结果口径、个人贡献与团队边界，不虚构指标或因果。
5. 删除内部链接、用户明细、密钥、项目代号和未经确认的精确数据。
6. 生成 v2 `projects.json`，有仓库权限时继续接入、测试、构建和部署。

## 四种展示结构

四种结构读取同一份作品集事实，只调整招聘官先看到的信息顺序：

| 展示结构 | 优先突出 | 更适合的材料 |
| --- | --- | --- |
| [Atlas](https://haimuhaimu.github.io/strategy-product-portfolio-template/templates/atlas/) | 个人判断、代表项目与证据图谱 | 综合型产品或运营经历，三个项目能共同支撑一条判断主线 |
| [Growth](https://haimuhaimu.github.io/strategy-product-portfolio-template/templates/growth/) | 指标、实验与增长闭环 | 增长、转化、留存材料较强，并且有基线、对照、时间窗或护栏 |
| [Systems](https://haimuhaimu.github.io/strategy-product-portfolio-template/templates/systems/) | 系统机制、资产与协作边界 | 平台、策略、治理、跨团队项目，能拿出采用事实或机制资产 |
| [AI Workflow](https://haimuhaimu.github.io/strategy-product-portfolio-template/templates/ai-workflow/) | 人机工作流、评估、护栏与回滚 | AI、Agent、自动化项目，能说清任务边界、评估和人工接管 |

选择时不要先看模板名字，先看现有材料：跨项目判断与证据回链完整，选 Atlas；指标口径、实验和护栏完整，选 Growth；规则、系统边界、采用与协作契约更强，选 Systems；任务、人机分工、评估、降级和回滚更强，选 AI Workflow。材料暂时支撑不了某套结构时，先补证据，不要把目标岗位想看到的效果写成已经发生的事实。

[模板库](https://haimuhaimu.github.io/strategy-product-portfolio-template/templates/)保留四种结构的快速比较；四个详情页会进一步解释适合与不适合人群、招聘官阅读路径、证据清单、常见误用、Agent 补材料方法和 `projects.json` 字段映射。[作品集检查与下载](https://haimuhaimu.github.io/strategy-product-portfolio-template/launchpad/)会根据已提供的真实内容给出排序、加分理由和缺口。手动选择展示结构不能绕过隐私或内容关联检查。

## 动效原则与降级

v0.7.0 的动效只帮助读者理解信息关系，不承担内容呈现：Atlas 用档案展开与坐标扫描表达“证据可追溯”，Growth 用指标卡节奏和闭环轨迹表达“实验—复盘”，Systems 用系统域建立与连线表达“机制—边界”，AI Workflow 用“人 → Agent → 工具 → 结果 → 人工复核”的脉冲流表达人工接管、评估与回滚。页面不滚动数字，也不会为动效生成指标、状态或项目事实。

- 首屏正文服务端直接输出并保持可读；关闭 JavaScript 后内容仍完整可见。
- 章节显现与顶部阅读进度使用 CSS scroll/view timeline 渐进增强；不支持相关能力的浏览器直接显示完整内容。
- 自动动画只使用 `transform`、`opacity` 与 SVG `stroke` 等低成本属性，避免改变布局尺寸；移动端会减少装饰轨迹和缩短入场。
- `prefers-reduced-motion: reduce` 会关闭自动动效、滚动显现、阅读进度动画与平滑滚动，不影响导航、星图点击或键盘操作。
- hover 反馈只对 fine pointer 启用；触屏使用点击，键盘保留 `focus-visible` 与星图方向键浏览。复制、下载结果通过既有状态和 `aria-live` 反馈。

## 隐私与边界

Agent 只能依据用户材料组织内容。证据不足处应明确标记“待补充”，不得编造指标、客户、职责、结果或个人贡献。默认删除内部链接、用户明细、密钥、项目代号和未经确认可披露的精确业务数据。

自动检查不能判断组织保密规则。发布前仍需本人确认：别名是否充分、指标是否允许披露、截图是否安全、联系方式是否愿意公开。

<details>
<summary><strong>高级开发与本地发布说明</strong></summary>

### 数据接入

Agent 生成文件后，将其写入 [`data/projects.json`](data/projects.json)，再运行：

```bash
npm ci
python3 skills/portfolio-story-builder/scripts/audit_portfolio.py data/projects.json --strict --output audit-report.json
npm run test:portfolio-v2
npm run test:public
npm run lint
npm run build
npm run check:seo
```

构建结果位于 `out/`，可发布到 GitHub Pages、Vercel 或其他静态托管服务。

### 本地开发

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000/`。可视化配置页位于 `http://localhost:3000/config/`，它是保留给高级使用者的本地工具，不是默认主路径。

### GitHub Pages 子路径

项目会根据 `GITHUB_REPOSITORY` 推断仓库子路径，也可显式设置：

```bash
NEXT_PUBLIC_BASE_PATH=/preview npm run build
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com NEXT_PUBLIC_BASE_PATH=false npm run build
```

### 数据与代码位置

```text
skills/portfolio-story-builder/  Agent 的访谈、选项目、检查与生成说明
data/projects.json               网站读取的作品集数据
src/app/start/page.tsx           两种开始方式与通用提示词
src/app/templates/page.tsx       四种展示结构说明
src/app/launchpad/page.tsx       作品集检查与下载
src/lib/launchpad.mjs            本地检查与 5 个发布文件生成
src/app/config/page.tsx          高级本地配置工具
showcase/entries/                公开作品示例
out/                             npm run build 生成的静态网站
```

完整字段兼容性以模板类型、数据整理逻辑和测试结果为准。旧数据缺少展示结构选择时默认使用 Atlas；下载时只写入最终选择，不改写项目事实。

</details>

## Showcase 与贡献

Showcase 使用“一位贡献者一个 JSON”的方式，避免多人修改同一清单：

- 流程与字段说明：[`showcase/README.md`](showcase/README.md)
- 公开字段约束：[`showcase/schema.json`](showcase/schema.json)
- 维护者自测：[`showcase/entries/maintainer-ai-pm.json`](showcase/entries/maintainer-ai-pm.json)
- 提交入口：[Showcase Issue](https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/new?template=showcase.yml)

详细能力边界见 [`skills/README.md`](skills/README.md)，版本变化见 [`CHANGELOG.md`](CHANGELOG.md)，贡献流程见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 开源许可

代码使用 [MIT License](LICENSE)。安全问题和敏感信息披露方式见 [`SECURITY.md`](SECURITY.md)。
