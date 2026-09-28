import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { auditPortfolioDraft } from "../src/lib/evidence-audit.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("首页在三项目后展示克制的 Evidence Snapshot", () => {
  const page = read("src/app/page.tsx");
  assert.match(page, /EvidenceSnapshot projects=\{featuredProjects\}/u);
  assert.ok(page.indexOf("EvidenceSnapshot projects") > page.indexOf("FeaturedProjectShowcase projects"));
  const component = read("src/components/EvidenceSnapshot.tsx");
  assert.match(component, /结构完整度自检，不是第三方事实核验/u);
  assert.doesNotMatch(component, /AI 验证通过|事实验证通过/u);
  assert.match(component, /待补证据/u);
  assert.match(component, /motion-reduce:transition-none/u);
  assert.match(component, /github\.com\/haimuhaimu\/strategy-product-portfolio-template/u);
});

test("证据快览对空白与弱数据如实给出低覆盖", () => {
  const empty = auditPortfolioDraft({ projects: [{ title: "空白项目" }, { title: "待写项目" }, { title: "第三项目" }] });
  assert.equal(empty.totalScore, 0);
  assert.deepEqual(Object.values(empty.dimensionScores).map((item) => item.value), [0, 0, 0, 0, 0]);
  assert.ok(empty.questions.length > 0);
});

test("快览最多展示三个核心判断", () => {
  const component = read("src/components/EvidenceSnapshot.tsx");
  assert.match(component, /\.slice\(0, 3\)/u);
  assert.match(component, /roleContribution\?\.judgment/u);
});
