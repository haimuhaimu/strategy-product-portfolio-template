import { auditPortfolioDraft, createSafeDiagnosticSummary } from "./evidence-audit.mjs";

export const MIN_EXPERIENCE_LENGTH = 20;

export function createExperienceDraft(rawText) {
  const text = typeof rawText === "string" ? rawText.trim() : "";
  return {
    projects: [{
      title: "即时诊断项目",
      diagnosticText: text,
    }],
  };
}

export function diagnoseExperienceText(rawText) {
  const text = typeof rawText === "string" ? rawText.trim() : "";
  if (text.length < MIN_EXPERIENCE_LENGTH) {
    return {
      ok: false,
      message: `请至少输入 ${MIN_EXPERIENCE_LENGTH} 个字，尽量包含你的动作和结果。`,
    };
  }

  const report = auditPortfolioDraft(createExperienceDraft(text));
  return {
    ok: true,
    report,
    safeSummary: createSafeDiagnosticSummary(report),
  };
}
