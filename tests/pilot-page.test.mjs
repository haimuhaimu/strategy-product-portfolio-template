import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("Pilot 页面明确人群、成功 gate、隐私承诺且不虚构 PMF 数据", () => {
  const page = read("src/app/pilot/page.tsx");
  const panel = read("src/components/pilot/PilotParticipationPanel.tsx");

  for (const phrase of ["3–8 年", "AI / 策略产品", "产品运营", "筛选", "证明", "脱敏"]) {
    assert.match(page, new RegExp(phrase.replace("/", "\\/"), "u"));
  }
  assert.match(page, /真实材料导入/u);
  assert.match(page, /Release Pack/u);
  assert.match(page, /公开上线/u);
  assert.match(page, /投递与面试是后续强信号/u);
  assert.match(page, /不宣称已有试点用户或验证效果/u);
  assert.doesNotMatch(page, /已有\s*\d+\s*(?:位|名|个)|提升\s*\d+%/u);

  for (const phrase of ["默认关闭", "7 天", "一键清空", "自由文本", "URL", "公司名", "项目原文", "邮箱", "电话"]) {
    assert.match(`${page}\n${panel}`, new RegExp(phrase, "u"));
  }
  assert.match(panel, /enablePmfPilotLog/u);
  assert.match(panel, /disablePmfPilotLog/u);
  assert.match(panel, /clearPmfPilotLog/u);
  assert.match(panel, /exportPmfPilotLog/u);
});

test("PMF Pilot Issue Form 反复警告不要提交敏感原文或标识", () => {
  const issue = read(".github/ISSUE_TEMPLATE/pmf-pilot.yml");
  for (const phrase of ["简历", "项目原文", "内部链接", "公司名", "URL", "联系方式", "敏感业务指标", "公开内容", "完全自愿"]) {
    assert.match(issue, new RegExp(phrase, "u"));
  }
  assert.match(issue, /PMF_PILOT_LOG\.json/u);
  assert.match(issue, /自行检查/u);
  assert.doesNotMatch(issue, /showcase\/schema\.json/u);
});

test("Launchpad 只用平台枚举确认公开，不提供 URL 输入框", () => {
  const workbench = read("src/components/launchpad/LaunchpadWorkbench.tsx");
  assert.match(workbench, /PMF_PILOT_PLATFORMS/u);
  assert.match(workbench, /我已公开上线/u);
  assert.match(workbench, /不会保存或要求作品集 URL/u);
  assert.doesNotMatch(workbench, /type="url"/u);
  assert.doesNotMatch(workbench, /setPublicUrl|publicUrlInput/u);
});
