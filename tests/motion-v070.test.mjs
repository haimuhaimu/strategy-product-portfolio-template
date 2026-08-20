import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("四模板均有独立首屏 motion hook 与叙事装置", () => {
  const atlas = `${read("src/app/page.tsx")}\n${read("src/components/HeroOverview.tsx")}`;
  const home = read("src/components/templates/TemplateHome.tsx");

  assert.match(atlas, /data-motion-template="atlas"/u);
  assert.match(atlas, /data-motion-hero="atlas"/u);
  for (const id of ["growth", "systems", "ai-workflow"]) {
    assert.match(home, new RegExp(`data-motion-template="${id}"`, "u"));
    assert.match(home, new RegExp(`data-motion-hero="${id}"`, "u"));
  }
  assert.match(home, /growth-loop-path/u);
  assert.match(home, /systems-domain-map/u);
  for (const step of ["HUMAN", "AGENT", "TOOLS", "RESULT", "HUMAN REVIEW"]) {
    assert.match(home, new RegExp(step, "u"));
  }
});

test("scroll/view timeline 仅在 @supports 内增强且 reduced motion 关闭新增动画", () => {
  const css = read("src/app/motion.css");
  assert.match(css, /@supports \(animation-timeline: scroll\(\)\)[\s\S]*animation-timeline: scroll\(root block\)/u);
  assert.match(css, /@supports \(animation-timeline: view\(\)\) and \(animation-range: entry 0% exit 100%\)[\s\S]*animation-timeline: view\(block\)[\s\S]*animation-range: entry 0% exit 100%/u);
  assert.match(css, /@supports not \(\(animation-timeline: view\(\)\) and \(animation-range: entry 0% exit 100%\)\)[\s\S]*motion-fallback-ready/u);
  assert.match(css, /@keyframes section-scroll-flow[\s\S]*opacity: 0\.16[\s\S]*opacity: 1[\s\S]*opacity: 0\.28/u);
  assert.match(css, /@keyframes item-scroll-flow[\s\S]*translate: 0 18px[\s\S]*translate: 0 0/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none !important/u);
  assert.match(css, /scroll-behavior: auto !important/u);
  assert.match(css, /\[data-motion-state\],[\s\S]*opacity: 1 !important/u);
  assert.doesNotMatch(css.split("@supports (animation-timeline: view()) and")[0], /\[data-motion-section\]\s*\{[^}]*opacity:\s*0/u);
});

test("不支持 view timeline 时用观察器双向渐入渐出且尊重减弱动效", () => {
  const observer = read("src/components/MotionRevealObserver.tsx");
  const layout = read("src/app/layout.tsx");

  assert.match(layout, /<MotionRevealObserver \/>/u);
  assert.match(observer, /IntersectionObserver/u);
  assert.match(observer, /prefers-reduced-motion: reduce/u);
  assert.match(observer, /CSS\.supports\("animation-timeline: view\(\)"\)/u);
  assert.match(observer, /CSS\.supports\("animation-range: entry 0% exit 100%"\)/u);
  assert.match(observer, /clearMotionStates\(\)/u);
  assert.match(observer, /entry\.isIntersecting \? "in" : "out"/u);
  for (const selector of ["data-motion-section", "motion-card", "template-panel", "template-detail-section li"]) {
    assert.match(observer, new RegExp(selector, "u"));
  }
});

test("星图支持 pointer、focus、键盘和点击联动并描画活动连线", () => {
  const component = read("src/components/ThinkingStarMap.tsx");
  const css = read("src/app/motion.css");
  for (const token of ["onPointerEnter", "pointerType === \"mouse\"", "onFocus", "onClick", "ArrowRight", "ArrowLeft", "Home", "End", "aria-pressed"]) {
    assert.match(component, new RegExp(token, "u"));
  }
  assert.match(css, /\.star-edges line\.is-active[\s\S]*stroke-dasharray/u);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/u);
});

test("AI Workflow 首页和项目页表达人工复核、评估与回滚且读取现有字段", () => {
  const home = read("src/components/templates/TemplateHome.tsx");
  const detail = read("src/components/templates/TemplateProjectDetail.tsx");
  for (const phrase of ["人工复核", "人工接管", "评估", "回滚"]) {
    assert.match(`${home}\n${detail}`, new RegExp(phrase, "u"));
  }
  assert.match(detail, /caseStudy\.algorithmAndData/u);
  assert.match(detail, /caseStudy\.evaluation/u);
  assert.match(detail, /detailContent\?\.review/u);
  assert.doesNotMatch(`${home}\n${detail}`, /setInterval|requestAnimationFrame|countUp/iu);
});

test("复制与下载反馈使用状态、aria-live 和 focus-visible", () => {
  const copy = read("src/components/start/AgentPromptCard.tsx");
  const download = read("src/components/launchpad/LaunchpadWorkbench.tsx");
  const css = read("src/app/motion.css");
  assert.match(copy, /setCopyStatus/u);
  assert.match(copy, /role="status" aria-live="polite"/u);
  assert.match(download, /setDownloadStatus/u);
  assert.match(download, /id="download-feedback" role="status" aria-live="polite"/u);
  assert.match(css, /:focus-visible/u);
});

test("v0.7.1 不改变静态导出、SEO/basePath 入口与数据版本", () => {
  const pkg = JSON.parse(read("package.json"));
  const lock = JSON.parse(read("package-lock.json"));
  const config = read("next.config.ts");
  const layout = read("src/app/layout.tsx");
  const seo = read("scripts/check-seo.mjs");
  const data = JSON.parse(read("data/projects.json"));
  assert.equal(pkg.version, "0.7.1");
  assert.equal(lock.version, "0.7.1");
  assert.equal(data.schemaVersion, 2);
  assert.match(config, /output: "export"/u);
  assert.match(config, /basePath/u);
  assert.match(layout, /data-template=\{activeTemplate\}/u);
  assert.match(seo, /canonical/u);
});
