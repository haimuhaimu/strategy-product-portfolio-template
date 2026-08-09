# 把经历变成证据，把证据变成作品集

**为产品经理和运营设计的 Agent Skill：从全部经历中选出最强的 3 个项目，追问关键证据，生成可投递的网站。**

[`portfolio-story-builder`](skills/portfolio-story-builder/) 把项目选择、证据审计与案例表达放进同一条工作流，交付 **3 个代表项目**、可直接构建的 **`projects.json`**，以及记录证据分、待补事实和披露边界的**审计报告**。

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)

> **5 分钟开始：**让 Agent 导入 [`skills/portfolio-story-builder/`](skills/portfolio-story-builder/)，然后说：
>
> `请根据我的简历和项目材料，为「增长产品经理」岗位选出 3 个最有说服力的案例；一次只问一个关键问题，核对指标与归因，生成 projects.json 和审计报告，并在发布前检查隐私。所有事实以我的材料为准。`

## 核心能力

多数作品集工具解决排版；这个 Skill 解决排版之前更关键的三件事：**选什么、凭什么、怎么讲。**

| 能力 | 产出 |
| --- | --- |
| 三项目精选 | 按岗位相关性、证据、个人判断与组合价值，从全部经历中选出 3 个代表项目 |
| 证据评分 | 检查基线、周期、口径、证据载体与个人贡献，逐项目给出 0–5 分 |
| 招聘官 30 秒测试 | 检验首屏信息密度，让项目、动作、证据与岗位关系一目了然 |
| 挑战模式 | 从招聘官视角追问归因、失败样本和贡献边界，定位薄弱环节 |
| 产品 / 运营双叙事 | 产品突出问题、机制与取舍；运营突出人群、策略与经营闭环 |
| 网站生成 | 生成 v2 `projects.json`、审计报告和可构建的静态作品集 |

工作流：

`材料盘点 → 叙事判断 → 一次一问补证据 → 精选 3 个项目 → 证据评分 → 30 秒测试 → 挑战模式 → 隐私检查 → 生成网站`

输入可以是简历、项目复盘、工作笔记、指标或交付物摘要；建议同时提供目标岗位或 JD。

## 三种使用方式

### A. 导入 Agent Skill（推荐）

在支持 Agent Skills 的客户端中导入 [`skills/portfolio-story-builder/`](skills/portfolio-story-builder/) 目录，然后发送：

```text
请把我的简历和项目材料做成可投递的产品/运营作品集。先判断目标岗位，一次只问一个最关键的问题；从全部经历中选 3 个项目，检查证据、归因和隐私，最后生成 projects.json 和审计报告。所有事实以我的材料为准。
```

### B. 让 Agent 直接读取 Skill

让 Agent 读取 [`skills/portfolio-story-builder/SKILL.md`](skills/portfolio-story-builder/SKILL.md)，再提供上面的触发语和材料。客户端没有 Skill 导入功能时，也可按其中的工作流执行。

### C. 使用可视化编辑器

在已下载的仓库目录中运行：

```bash
npm ci
npm run dev
```

打开 [`http://localhost:3000/config/`](http://localhost:3000/config/)，完成下面这条真实闭环：

`输入项目草稿 → 浏览器即时审计 → 按 1–3 条高价值追问补证据 → 导出作品集`

配置页会按结果证据、口径完整、方法证据、资产证据、贡献边界五维评分，并单独提示常见隐私红线与空泛表达。诊断只在浏览器内存运行，不上传填写内容；可复制不含原始敏感内容的诊断摘要，交给 Agent 或同事继续协作。完成后下载 `projects.json`，直接替换 `data/projects.json`。自动检查不能判断组织保密规则，发布前仍需本人确认披露权限。

## 对话示例

```text
你：这是我的简历，我想投增长运营，请帮我做作品集。

Agent：我盘点出 6 段候选经历。为了判断哪个项目最值得进入前三，先确认一件事：
在“新用户召回”活动中，最能证明效果的一项结果是什么？请同时说明指标口径和观察周期。

你：活动后 14 天内，沉默 30 天用户的回访率从 8.1% 提升到 11.6%；数据来自活动复盘看板。

Agent：已记录结果、基线、周期和证据载体。下一个最大缺口是个人贡献：
这个提升中，你亲自做出的一个关键判断是什么？
```

每轮聚焦当前价值最高的证据缺口；信息充分时直接推进，缺失事实进入“待补充”。

## 适用场景

- 产品经理、产品运营、策略 / 增长运营求职
- 晋升答辩前整理代表项目与个人贡献
- 建设个人品牌，将职业经历沉淀为公开案例

## 发布流程

1. 从 Agent 或 `/config/` 导出 `projects.json`。
2. 替换 [`data/projects.json`](data/projects.json)。
3. 在仓库根目录运行审计、测试与构建：

```bash
python3 skills/portfolio-story-builder/scripts/audit_portfolio.py data/projects.json --strict --output audit-report.json
npm run test:portfolio-v2
npm run test:public
npm run lint
npm run build
```

4. 将 `out/` 发布到 **GitHub Pages**、**Vercel** 或其他静态托管服务。

GitHub Pages 会根据 `GITHUB_REPOSITORY` 推断仓库子路径；也可显式设置：

```bash
NEXT_PUBLIC_BASE_PATH=/preview npm run build
# 自定义域名或根路径
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com NEXT_PUBLIC_BASE_PATH=false npm run build
```

## 隐私与边界

Skill 依据用户材料组织内容，对证据不足处明确标记“待补充”，并在生成前检查常见敏感信息。指标、客户、职责、因果关系与个人贡献均以可核验事实为准；事实核验和最终披露权限由使用者确认。处理工作材料时，请先脱敏并遵守所在组织的保密规则。

## 可选：高级个人模型 / 兴趣史

完成 3 个案例与网站后，可按需加入个人工作系统、影响来源或训练史，用于补充个人特质，不替代项目证据。

## 仓库结构

```text
skills/portfolio-story-builder/  Agent Skill：访谈、选项目、审计与生成规范
data/projects.json               网站读取的作品集数据
src/app/config/page.tsx          可视化编辑器
out/                             npm run build 生成的静态网站
```

详细能力边界与工作流见 [`skills/README.md`](skills/README.md)，近期面向使用者的变化见 [`CHANGELOG.md`](CHANGELOG.md)。

## 开源许可

代码使用 [MIT License](LICENSE)。安全问题和敏感信息披露方式见 [`SECURITY.md`](SECURITY.md)。
