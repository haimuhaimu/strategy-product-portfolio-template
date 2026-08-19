# 变更记录

本文件记录面向使用者的重要变化。完整提交历史与技术细节请查看 GitHub Commits 和 Pull Requests。

## 2026-08-19 — v0.5.0

新增可扩展模板注册表与纯函数匹配器。Atlas 保持原首页和项目页；Growth、Systems、AI Workflow 分别以指标实验闭环、系统机制资产边界、人机工作流评估护栏回滚组织首页和项目页，不是仅替换色彩。全局 `data-template` 提供四组主题 token，在密度、字号、圆角/边框、色彩与背景装置上形成差异。

`projects.json` 根级新增可选 `template.active`，schemaVersion 继续为 `2`。旧数据默认 Atlas，normalize 保留未知字段；配置器和 Launchpad Release Pack 均支持写回选择。Launchpad 增加四模板 0–100 可解释评分、理由、缺口与手动选择，隐私和引用阻断保持优先。新增可索引 `/templates/` 模板库并加入 sitemap，同时覆盖静态导出、canonical 与 basePath 测试。

## 2026-08-19 — v0.4.0

新增 `/start/` 三路径起步页与 `/launchpad/` 本地发布工作台。Launchpad 可上传或粘贴 v2 `projects.json`，在浏览器内完成 schema-lite、normalize、引用、隐私与证据检查，并以 BLOCK / WARN / PASS 和唯一下一步呈现结论；隐私或断链阻断时禁止生成包含 5 个独立文件的 Release Pack。同步增加首次成功护栏、低干扰作者入口、SEO/robots/sitemap 约束与发布安全测试。

## 2026-08-10 — v0.3.0

本版暂停扩展功能，集中优化转化、证据、Showcase 与发布：README 首屏统一为“面向产品经理与运营的证据驱动作品集系统”，增加真实成品与配置器审计截图、三个直接入口，以及维护者真实 Before / After 自测案例。

新增低冲突 Showcase 目录、公开字段 schema、首个 `maintainer/self-test` 条目和自动校验；校验覆盖字段、slug 唯一、公共 URL 安全与明确披露确认。同步 CONTRIBUTING、Showcase Issue、`0.3.0` 版本号与发布说明。Skill 逻辑未修改。

## 2026-08-09 — Skill-first 作品集体验

这次更新把项目从静态作品集模板升级为以 `portfolio-story-builder` 为入口的完整工作流：材料盘点、单问题追问、三项目精选、五维证据评分、隐私检查和静态网站生成被连接到同一条路径。

主要变化包括：配置页支持产品经理与运营示例、本地草稿和实时证据审计；首页增加招聘官 30 秒证据快览；作品集增加个人路线图与思考星图；JS 与 Python 共用审计清单并校验项目引用；静态导出继续兼容 GitHub Pages 和纯静态托管。

审计结果只表示项目材料的结构完整度，不代表第三方事实核验。所有指标、归因和披露权限仍需使用者本人确认。

## 2026-08-06 — v0.2.0

模板扩展为产品经理与运营双叙事，增加初始化预设、认知校准、个人模型、GitHub Pages 自动部署和社区治理文件。
