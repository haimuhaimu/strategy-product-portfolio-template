# strategy-product-portfolio-template v2 数据规范

本规范定义 `portfolio-story-builder` 审计器覆盖的 **v2 最小契约**。它用于在接入模板前发现结构和内容问题，不等同于模板自身的 TypeScript 类型、normalize 逻辑或构建测试；最终兼容性以目标模板的 test/build 为准。

## 约定

- “必填”表示 strict 模式必须存在且满足非空约束；非 strict 模式允许字段缺失或使用“待补充”等占位，但已提供值仍必须满足声明类型。
- `string` 的 strict 非空要求是去除首尾空白后至少 1 个字符。
- `string[]` 的最小元素结构是非空字符串；strict 要求标为必填的数组至少 1 项，非 strict 可为空。
- 未列出的扩展字段可以保留，但不要依赖它们表达首屏或项目主线信息。

## 顶层对象

| 字段 | 类型 | strict | 最小结构 |
|---|---|---:|---|
| `schemaVersion` | integer | 必填 | 固定为 `2`，布尔值不视为整数 |
| `rolePreset` | string | 必填 | `product` 或 `operations` |
| `home` | object | 必填 | 见下文 |
| `features` | object | 必填 | 见下文 |
| `contact` | object | 必填 | 见下文 |
| `featuredProjectSlugs` | string[] | 必填 | 恰好 3 个非空且互不重复的 slug，并均指向 `projects` |
| `profile` | object | 必填 | 见下文 |
| `projects` | object[] | 必填 | 至少 3 个项目对象；slug 唯一 |
| `personalOperatingSystem` | object | 可选增强 | 见“可选增强对象” |
| `influences` | object[] | 可选增强 | 可为空 |
| `trainingHistory` | object[] | 可选增强 | 可为空 |
| `calibrationLogs` | object[] | 可选增强 | 可为空 |

## home、features、contact、profile

### `home`

strict 必填字段：

| 字段 | 类型 | 最小结构 |
|---|---|---|
| `introEyebrow` | string | 非空的作品集眉题 |
| `introTitle` | string | 非空的首屏主标题 |
| `featuredTitle` | string | 非空的精选项目区标题 |
| `evidenceTitle` | string | 非空的证据区标题 |
| `evidenceMetrics` | metric[] | 至少 1 项；元素结构与项目 `metrics` 相同 |

### `features`

`profile`、`thinking`、`advancedModels` 均为 strict 必填的 boolean。不能使用 `0/1`、`"false"` 或空值代替。主线默认关闭非必要展示。

### `contact`

`title`、`description`、`email` 均为 string。strict 要求 `title` 与 `description` 非空；`email` 可为空，以支持匿名安全输出。填写 email 时必须包含 `@`，且只放用户明确授权公开的求职邮箱。

### `profile`

strict 必填 string：`name`、`role`、`headline`、`summary`。其中 `name` 可使用匿名称谓，但不得为空。

以下字段可选；若提供则类型必须正确：

- string：`location`、`phone`、`email`；匿名输出可为空。
- string[]：`about`、`tags`、`interests`、`positioning`、`methodology`、`insights`。
- object[]：`workGroups`、`capabilityGroups`、`experiences`；空数组合法，非空元素至少是对象。

## projects 与数组元素

每个项目是 object，strict 必填：

| 字段 | 类型 | 最小结构 |
|---|---|---|
| `slug` | string | 非空、全局唯一 |
| `title`、`subtitle`、`company`、`period`、`domain` | string | 非空 |
| `order` | integer | 非负整数，布尔值不合法 |
| `summary`、`background` | string | 非空 |
| `keywords` | string[] | 至少 1 个非空关键词 |
| `metrics` | metric[] | 至少 1 项 |
| `caseStudy` | object | 见下文角色分支 |
| `actions` | string[] | 至少 1 个具体动作 |
| `results` | string[] | 至少 1 个结果或交付事实 |

`metric` 的最小元素结构：

```json
{ "label": "激活率", "value": "+18%" }
```

`label` 与 `value` 都是必填非空 string。可增加说明字段，但不能用裸字符串替代 metric 对象。

`keywords`、`actions`、`results` 和 caseStudy 中的数组都只接受非空 string 元素；嵌套 object、数字、null 或空字符串均不合法。

## caseStudy 角色分支

两种 preset 沿用相同字段名，以兼容模板 normalize 层；审计器按 `rolePreset` 分支验证同一最小类型契约，并在报告中给出对应语义。

### product

| 字段 | 类型 | strict 最小结构 |
|---|---|---|
| `question` | string | 1 个非空用户/业务问题 |
| `productMethod` | string[] | 至少 1 个问题拆解、产品机制或关键取舍 |
| `algorithmAndData` | string[] | 至少 1 个调研、数据、实验或验证方法；不要求必须使用算法 |
| `evaluation` | string[] | 至少 1 个结果、护栏或结论边界 |
| `artifact` | string[] | 至少 1 个真实交付物或复用机制 |

### operations

字段类型和 strict 最小数量与 product 相同，但语义映射为：

- `question`：业务目标、人群或经营问题。
- `productMethod`：运营策略、人群分层、渠道、节奏或执行机制。
- `algorithmAndData`：漏斗、口径、对照、渠道归因或复盘方法。
- `evaluation`：转化/留存/效率结果、成本、护栏和适用边界。
- `artifact`：SOP、策略表、素材模板、看板、人群规则或自动化流程。

## 可选增强对象

可选对象一旦出现，已提供值必须满足类型；strict 模式下，该对象的下列成员均必填且非空。

- `valueAnchor`：object；`primary`、`improves`、`proof`、`platformBenefit` 均为 string。
- `roleContribution`：object；`scope`、`judgment`、`usedBy`、`boundary` 均为 string。
- `detailContent`：object；`difficulty`、`judgment`、`review`、`aiMigration` 均为 string。
- `personalOperatingSystem`：object；`personModel`、`rewardFunction`、`actionStrategy` 均为 string[]。对象存在时 strict 要求三个数组存在；彩蛋关闭时允许数组为空。
- `influences`：object[]；非空元素至少含 string `name`、`impact`。
- `trainingHistory`：object[]；非空元素至少含 string `topic`、`practice`。
- `calibrationLogs`：object[]；非空元素至少含 string `date`、`observation`、`adjustment`。

## 草稿骨架与验证

`assets/portfolio-v2-minimal.json` 是匿名安全、带结构化 product 示例的 **非 strict 起草骨架**。其中占位词、空数组和不足三项的内容证据是刻意保留的，因此不能当作 strict 合格作品。

起草阶段运行：

```bash
python3 scripts/audit_portfolio.py assets/portfolio-v2-minimal.json
```

完成内容后运行：

```bash
python3 scripts/audit_portfolio.py <projects.json> --strict
```

审计通过后仍需把数据写入目标模板并运行其 test/build；normalize 默认值不能替代投递数据中的显式关键字段。
