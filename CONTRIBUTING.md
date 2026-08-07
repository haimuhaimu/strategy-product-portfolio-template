# 贡献指南

<!-- markdownlint-disable MD013 -->

感谢你帮助改进这套面向产品经理与运营从业者的个人认知作品集模板。项目采用 Next.js、TypeScript、Tailwind CSS 和数据驱动内容，默认纯静态导出。请优先提交范围清晰、可验证且不包含真实内部材料的改动。

## 开始之前

- Bug、文案修正和小范围可访问性改进可以直接提交 PR。
- 新角色 preset、新主题、数据结构变化或跨多个页面的功能，请先提交 Feature Request，对齐用户场景、最小范围和兼容性。
- 不确定是否适合核心模板时，先描述真实使用问题，不要先做大规模重构。
- Showcase 不通过代码 PR 征集，请使用 Showcase Issue 模板。

## 本地开发

环境要求为 Node.js 20+，使用 npm 和已提交的 `package-lock.json`：

```bash
npm ci
cp .env.example .env.local
npm run init -- --preset product
npm run dev
```

运营方向可改用：

```bash
npm run init -- --preset operations
```

初始化会修改 `data/projects.json`、`.env.local` 和 `src/app/globals.css`。如只需检查参数影响，请使用：

```bash
npm run init -- --preset operations --dry-run
```

不要提交本地 `.env.local` 或初始化后带有个人资料的数据。开始开发前可用 `git status --short` 确认工作区。

## 分支与提交

1. 从最新 `main` 创建短生命周期分支，建议命名：
   - `preset/<role>`
   - `model/<component-or-behavior>`
   - `theme/<theme-name>`
   - `fix/<short-description>`
2. 一个 PR 解决一个问题；避免顺手格式化无关文件或更新依赖。
3. 提交信息使用祈使、具体的描述，例如 `feat: add customer success preset`、`fix: preserve long model labels`。
4. 不要提交 `.next/`、`out/`、`.env.local`、个人作品原稿或与验证无关的生成文件。

## 按贡献类型操作

### 角色 preset

当前初始化器支持 `product` 和 `operations`。`product` 使用 `data/projects.json` 的默认数据，`operations` 的覆盖数据位于 `data/presets/operations.json`；合法值同时受 `RolePreset` 类型和 `scripts/init-portfolio.mjs` 校验。

新增或修改 preset 时：

1. 先在 Feature Request 中说明目标角色、与现有 preset 的差异，以及至少一个真实但已匿名化的使用场景。
2. 保持 `PortfolioData` 结构兼容。需要新增字段时，同步更新 `src/types/project.ts`、消费该字段的组件和相关空状态。
3. 新 preset 应使用独立、可审阅的 `data/presets/<name>.json`；示例公司、人物、指标和项目必须是虚构或充分匿名化内容。
4. 同步更新 `scripts/init-portfolio.mjs` 中的合法 preset、加载/合并逻辑和帮助文本，确保显式 CLI 参数仍优先于 preset。
5. 在 `tests/init-portfolio.test.mjs` 增加正常初始化、`--dry-run`、显式覆盖和非法输入测试。
6. 至少运行 `npm run test:init`、`npm run test:public`、`npm run lint` 和 `npm run build`。

不要只添加 JSON 文件却不接入初始化器，也不要用特定公司的内部术语冒充通用角色能力。

### 个人模型组件

个人模型数据由 `personalOperatingSystem`、`influences`、`trainingHistory` 和 `calibrationLogs` 等字段提供，类型位于 `src/types/project.ts`，展示组件位于 `src/components/`。

1. 说明组件解决的是人物模型、奖励函数、行动策略、影响来源、训练史还是认知校准中的哪类阅读问题。
2. 优先复用现有 `PortfolioData`；如需改 schema，说明对现有 `data/projects.json` 和 preset 的兼容影响。
3. 同时处理空数组、长中文/英文、移动端窄屏和键盘访问，不把示例文本硬编码进组件。
4. 更新对应数据测试；现有专项命令为 `npm run test:personal-model` 和 `npm run test:calibration`。
5. 涉及页面输出时，再运行 `npm run lint`、`npm run build` 和 `npm run check:seo`。

### 主题

当前初始化主题为 `vermilion`、`cobalt`、`forest`，初始化器通过 `scripts/init-portfolio.mjs` 更新 `src/app/globals.css` 中的 `--accent-red`。

1. 主题应基于语义 token 调整，而不是在组件中散落新的硬编码颜色。
2. 新主题需同步更新初始化器的 `THEME_ACCENTS`、参数校验、帮助文本和 `tests/init-portfolio.test.mjs`。
3. 检查文字、链接、焦点态、选中态的对比度，以及首页、个人页、思考页、项目详情页在桌面和移动端的表现。
4. 保证 `npm run init -- --yes --theme <name> --dry-run` 可验证且不写文件；再运行 `npm run test:init`、`npm run lint` 和 `npm run build`。
5. PR 中提供关键页面截图，并注明浏览器、视口和是否使用初始化器生成主题。

主题贡献不应改写示例内容，也不应引入仅为主题服务的运行时依赖。

### Bugfix

1. Bug Report 中提供最小复现、Node.js 版本、操作系统、浏览器（如相关）及实际/预期结果。
2. 优先添加能在修复前失败、修复后通过的回归测试；将测试放到最接近功能的现有测试文件。
3. 修复根因并限制变更范围，不在 bugfix PR 中重构无关组件。
4. 根据影响范围运行专项测试，并执行完整验证清单。

## 测试与验证

提交前建议运行与 CI 一致的命令：

```bash
npm run test:portable-scripts
npm run test:init
npm run test:personal-model
npm run test:calibration
npm run test:public
npm run lint
npm run build
npm run check:seo
```

`npm run check:seo` 检查静态导出，因此应在 `npm run build` 之后运行。若某项无法运行，请在 PR 中写明命令、错误和原因，不要只写“测试通过”。提交前还应运行：

```bash
git diff --check
git status --short
```

## 隐私与公开安全

本仓库面向公开发布，所有贡献都必须满足以下要求：

- 不提交公司内部文档、项目代号、聊天记录、客户/用户数据、访问令牌、Cookie、环境变量或未发布策略。
- 不提交私人手机号、私人邮箱、家庭地址、精确行程、身份证明等个人敏感信息。
- 业务结果使用虚构或充分匿名化示例；即使去掉公司名，也要避免可由时间、角色和精确指标重新识别。
- 只提交你有权公开的文字、图片、字体和品牌素材；图片发布前检查 EXIF、文件名、截图通知栏和背景信息。
- 运行 `npm run test:public`，但不要把自动测试视为人工审查的替代品。
- 如果敏感信息进入 Git 历史，立即停止推送；仅删除当前文件并不足以清理历史。请通过仓库托管平台提供的私密安全报告入口（如已启用）联系维护者，不要在公开 Issue 中粘贴秘密或个人数据。

## PR Checklist

提交 PR 前确认：

- [ ] 改动对应一个明确问题，且没有夹带无关格式化、依赖升级或生成文件。
- [ ] 新功能已先讨论；数据结构或初始化参数变化包含兼容性说明。
- [ ] 已添加或更新测试，并在 PR 中逐项列出实际运行的命令和结果。
- [ ] 已运行 `npm run test:public`、`npm run lint`、`npm run build`；构建后已运行 `npm run check:seo`。
- [ ] 已运行 `git diff --check` 并检查 `git status --short`。
- [ ] 文本、JSON、截图和 Git diff 不含内部数据、敏感信息、密钥或未授权素材。
- [ ] UI 改动已检查桌面、移动端、键盘访问和长文本，并附必要截图。
- [ ] preset/主题改动已同步初始化器、帮助文本和初始化测试。
- [ ] PR 描述包含动机、范围、验证方式、隐私检查和潜在兼容影响。

提交贡献即表示你愿意遵守 [社区行为准则](CODE_OF_CONDUCT.md)。
