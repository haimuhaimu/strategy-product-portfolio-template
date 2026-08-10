# Showcase 提交流程

Showcase 只展示已公开、已获授权的真实作品。为了降低多人贡献时的合并冲突，每位贡献者在 `showcase/entries/` 新增一个独立 JSON，不修改共享名单。

## 提交步骤

1. 先通过 [Showcase Issue](https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/new?template=showcase.yml) 提交公开作品与披露确认。
2. 复制现有条目的结构，新建 `showcase/entries/<slug>.json`；文件名必须与 `slug` 一致。
3. 只填写无需登录的 HTTPS 公开 URL、角色标签、公开亮点、审计摘要与披露确认。
4. 运行 `npm run test:showcase` 和 `npm run test:public`。
5. 提交一个仅包含本人条目的 PR，并在 PR 中链接对应 Issue。

## 明确不收集

- 邮箱、手机号或其他私人联系方式
- 公司内部链接、带签名或令牌的预览链接
- 原始简历、聊天记录、用户明细或未脱敏项目材料
- 未经确认的精确业务指标、组织名或时间

## 审核规则

- `kind` 必须明确标记 `community` 或 `maintainer/self-test`；维护者自测不能写成第三方客户案例。
- `auditSummary` 只能填写实际审计输出，不得提高分数。
- `disclosure` 的授权、公开可访问、安全检查与下架机制均须明确确认为 `confirmed`。
- URL 必须是公共 HTTPS 地址，不得包含用户名、密码、查询参数、片段、localhost、IP 地址或内部域名。

字段契约见 [`schema.json`](schema.json)，首个自测条目见 [`entries/maintainer-ai-pm.json`](entries/maintainer-ai-pm.json)。
