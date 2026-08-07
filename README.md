# 把零散经历变成可投递的产品 / 运营作品集

**把简历和零散经历变成 3 个有证据、可投递的产品 / 运营案例，并生成作品集网站。**

这不是一个让你手填文案的网页模板，而是一个**会追问、会挑项目、会去水分、会检查隐私的 Agent Skill**：[`portfolio-story-builder`](skills/portfolio-story-builder/)。网站只是最终交付物。

[![CI](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml/badge.svg)](https://github.com/haimuhaimu/strategy-product-portfolio-template/actions/workflows/portable-build.yml)
[![Next.js 16.3](https://img.shields.io/badge/Next.js-16.3-000000?logo=next.js)](https://nextjs.org/)

> **5 分钟开始：**让 Agent 导入 [`skills/portfolio-story-builder/`](skills/portfolio-story-builder/)，然后说：
>
> `请根据我的简历和零散项目材料，为「增长产品经理」岗位选择 3 个最有说服力的案例；一次只问我一个关键问题，不编造指标，生成 projects.json，并在发布前检查证据和隐私。`

## 为什么需要它

大多数作品集卡住的地方不是页面不好看，而是内容经不起追问。

| 常见问题 | Skill 怎么解决 |
| --- | --- |
| 不会选项目，什么都想放 | 先盘点全部经历，再按岗位相关性、证据、个人判断、差异化和互补性只选 3 个 |
| 写成职责罗列，看不出能力 | 追问关键判断、取舍、动作和交付物，把“参与了”改成可解释的案例 |
| 指标看起来漂亮，但口径和归因虚 | 对证据打分，挑战基线、周期、口径和个人贡献；证据不足就标记待补充，不编造 |
| 内部代号、数据、链接可能泄密 | 生成前和发布前检查常见敏感信息，并列出仍需本人确认的披露边界 |
| 手填一大份 JSON 太重 | 先用自然语言和材料完成访谈，再生成可接入网站的结构化数据 |

因此它比普通模板多做了最关键的一层：**先把经历变成可信内容，再把内容变成网站。**

## 输入 → 过程 → 输出

### 输入

任意一种或混合提供即可，不要求先整理成表格：

- 简历（可先脱敏）
- 项目经历文字、复盘或工作笔记
- 零散材料，如指标摘要、交付物说明、截图中的文字信息
- 目标岗位或 JD（建议提供，用于选项目）

### 过程

`材料盘点 → 产品 / 运营角色判断 → 一次一问补证据 → 精选 3 个项目 → 证据评分 → 招聘官 30 秒测试 → 挑战归因与水分 → 隐私检查`

### 输出

- **`projects.json`**：网站可直接读取的 v2 数据
- **可投递网站**：严格聚焦介绍、3 个案例、结果证据和联系方式
- **审计报告**：证据分、待补事实、隐私风险和仍需本人确认的项目

## 5 分钟开始使用

### 方式 A：在支持 Agent Skills 的客户端中导入（推荐）

导入仓库内的 [`skills/portfolio-story-builder/`](skills/portfolio-story-builder/) 目录。不同客户端的导入入口不同，本仓库不提供未经验证的第三方安装命令。

导入后复制这句：

```text
请把我的简历和项目材料做成可投递的产品/运营作品集。先判断目标岗位，一次只问一个最关键的问题；从全部经历中选 3 个项目，检查证据、归因和隐私，最后生成 projects.json 和审计报告。不要编造任何事实或指标。
```

### 方式 B：让 Agent 直接读取 Skill

让 Agent 读取 [`skills/portfolio-story-builder/SKILL.md`](skills/portfolio-story-builder/SKILL.md)，再粘贴上面的触发语和材料。即使客户端没有 Skill 导入功能，也可以按文档中的工作流执行。

### 方式 C：不使用 Agent，打开可视化编辑器

在已下载的仓库目录中运行：

```bash
npm ci
npm run dev
```

打开 [`http://localhost:3000/config/`](http://localhost:3000/config/)，填写信息和严格 3 个项目，下载 `projects.json`。配置页只在浏览器内处理数据，不会上传材料；但它不会像 Skill 一样主动选项目和追问证据。

## 它会怎么问：一次一个关键问题

```text
你：这是我的简历，我想投增长运营，请帮我做作品集。

Agent：我盘点出 6 段候选经历。为了判断哪个项目最值得进入前三，先只确认一件事：
在“新用户召回”活动中，最能证明效果的一项结果是什么？请同时说明指标口径和观察周期。

你：活动后 14 天内，沉默 30 天用户的回访率从 8.1% 提升到 11.6%；数据来自活动复盘看板。

Agent：已记录结果、基线、周期和证据载体。下一个最大缺口是你的个人贡献：
这个提升中，你亲自做出的一个关键判断是什么？
```

它不会一上来丢出十个表格问题。材料足够就继续；确实不知道的事实标记为“待补充”，不会换个说法逼你编答案。

## 什么时候值得用

**适合：**

- 产品经理、产品运营、策略 / 增长运营求职
- 晋升答辩前整理代表项目与个人贡献
- 建设个人品牌，把零散经历沉淀成可公开案例

**不适合或不承诺：**

- 不伪造指标、客户、职责或因果关系
- 不替代本人、前同事或原始数据的事实核验
- 不要求上传私密材料；建议先脱敏，并遵守所在组织的保密规则
- 自动隐私扫描只能发现常见风险，不能替代本人对披露权限的最终确认

## 完成后怎么发布

1. 从 Agent 或 `/config/` 导出 `projects.json`。
2. 用它替换 [`data/projects.json`](data/projects.json)。
3. 在仓库根目录执行与 [`package.json`](package.json) 一致的检查和构建：

```bash
python3 skills/portfolio-story-builder/scripts/audit_portfolio.py data/projects.json --strict --output audit-report.json
npm run test:portfolio-v2
npm run test:public
npm run lint
npm run build
```

4. 构建产物位于 `out/`：可发布到 **GitHub Pages**、**Vercel** 或其他静态托管服务。

GitHub Pages 会根据 `GITHUB_REPOSITORY` 自动推断仓库子路径；也可以显式设置：

```bash
NEXT_PUBLIC_BASE_PATH=/preview npm run build
# 自定义域名或根路径
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com NEXT_PUBLIC_BASE_PATH=false npm run build
```

## 可选彩蛋：高级个人模型 / 兴趣史

个人工作系统、影响来源、训练史等高级个人模型是**求职主线完成后的可选彩蛋**。只有 3 个案例、证据审计、隐私检查和网站构建完成后，才值得按需开启；它们默认关闭，**不会阻塞交付**，也不能替代项目证据。

## 仓库结构

```text
skills/portfolio-story-builder/  Agent Skill：访谈、选项目、审计与生成规范
data/projects.json               网站读取的作品集数据
src/app/config/page.tsx          不使用 Agent 时的可视化编辑器
out/                             npm run build 生成的静态网站
```

Skill 的详细能力边界与工作流见 [`skills/README.md`](skills/README.md)。

## 开源许可

代码使用 [MIT License](LICENSE)。如果这个项目帮你把“做过什么”变成了“能证明什么”，欢迎 Star。
