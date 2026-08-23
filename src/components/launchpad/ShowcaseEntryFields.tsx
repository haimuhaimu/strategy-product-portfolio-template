"use client";

import {
  SHOWCASE_DIMENSIONS,
  SHOWCASE_DISCLOSURES,
  SHOWCASE_LIMITS,
} from "@/lib/showcase-entry.mjs";

export type ShowcaseDraft = {
  slug: string;
  publicUrl: string;
  roleTags: string[];
  publicHighlights: string[];
  auditSummary: { dimensions: Record<string, boolean> };
  disclosure: Record<string, boolean>;
};

type Props = {
  draft: ShowcaseDraft;
  onChange: (draft: ShowcaseDraft) => void;
};

const dimensionLabels: Record<string, string> = {
  resultEvidence: "结果证据",
  scopeAndAttribution: "口径与归因",
  methodEvidence: "方法证据",
  artifactEvidence: "资产证据",
  contributionBoundary: "贡献边界",
};

const disclosureLabels: Record<string, string> = {
  authorized: "我有权公开此作品及填写的内容",
  publiclyAccessible: "链接无需登录即可公开访问",
  sensitiveMaterialReviewed: "已移除邮箱、电话、原始简历、用户明细、内部链接、密钥和未经授权的精确业务数据",
  takedownAvailable: "我理解授权变化后应通过原 Issue 申请更新或下架",
};

const fieldClass = "mt-2 w-full border border-[#14110e]/25 bg-white px-3 py-2.5 text-sm outline-none focus-visible:border-[#1437d6] focus-visible:ring-2 focus-visible:ring-[#1437d6]/25";

export function ShowcaseEntryFields({ draft, onChange }: Props) {
  function updateField(field: "slug" | "publicUrl", value: string) {
    onChange({ ...draft, [field]: value });
  }

  function updateHighlight(index: number, value: string) {
    const publicHighlights = [...draft.publicHighlights];
    publicHighlights[index] = value;
    onChange({ ...draft, publicHighlights });
  }

  function updateCheckbox(group: "dimensions" | "disclosure", field: string, checked: boolean) {
    if (group === "dimensions") {
      onChange({
        ...draft,
        auditSummary: { dimensions: { ...draft.auditSummary.dimensions, [field]: checked } },
      });
      return;
    }
    onChange({ ...draft, disclosure: { ...draft.disclosure, [field]: checked } });
  }

  function updateRoleTags(value: string) {
    const roleTags = value.split(/[，,]/u).map((item) => item.trim()).filter(Boolean);
    onChange({ ...draft, roleTags });
  }

  return (
    <div className="space-y-7">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">公开条目基本字段</legend>
        <label className="text-sm font-semibold text-[#14110e]">
          slug
          <input
            value={draft.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            maxLength={SHOWCASE_LIMITS.slug}
            autoComplete="off"
            placeholder="your-public-slug"
            className={fieldClass}
          />
          <span className="mt-1 block text-xs font-normal leading-5 text-[#80654d]">小写字母、数字与单个连字符；最长 {SHOWCASE_LIMITS.slug} 字符。</span>
        </label>
        <label className="text-sm font-semibold text-[#14110e]">
          publicUrl
          <input
            type="url"
            value={draft.publicUrl}
            onChange={(event) => updateField("publicUrl", event.target.value)}
            maxLength={SHOWCASE_LIMITS.publicUrl}
            autoComplete="url"
            placeholder="https://portfolio.example.com/"
            className={fieldClass}
          />
          <span className="mt-1 block text-xs font-normal leading-5 text-[#80654d]">只接受公共 HTTPS；不能含凭据、参数、片段、端口、IP 或内网域。</span>
        </label>
      </fieldset>

      <label className="block text-sm font-semibold text-[#14110e]">
        roleTags
        <input
          key={draft.roleTags.join("\u0000")}
          defaultValue={draft.roleTags.join("，")}
          onBlur={(event) => updateRoleTags(event.target.value)}
          placeholder="产品经理，AI 产品经理"
          className={fieldClass}
        />
        <span className="mt-1 block text-xs font-normal leading-5 text-[#80654d]">用逗号分隔，1–{SHOWCASE_LIMITS.roleTags} 项；每项最长 {SHOWCASE_LIMITS.roleTag} 字符。</span>
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-[#14110e]">publicHighlights · 恰好 3 条</legend>
        <div className="mt-3 space-y-3">
          {draft.publicHighlights.map((highlight, index) => (
            <label key={index} className="block text-xs font-bold text-[#80654d]">
              公开亮点 {index + 1}
              <textarea
                value={highlight}
                onChange={(event) => updateHighlight(index, event.target.value)}
                maxLength={SHOWCASE_LIMITS.publicHighlight}
                rows={3}
                className={fieldClass}
              />
              <span className="mt-1 block text-right font-normal">{[...highlight].length}/{SHOWCASE_LIMITS.publicHighlight}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-[#14110e]/15 bg-[#fffaf0] p-4">
        <legend className="px-2 text-sm font-semibold text-[#14110e]">严格审计五维状态</legend>
        <p className="mb-3 text-xs leading-5 text-[#80654d]">从 Launchpad 草稿导入时会保留；空白开始请只勾选实际通过的维度，分数将自动计算。</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SHOWCASE_DIMENSIONS.map((field) => (
            <label key={field} className="flex cursor-pointer items-start gap-3 text-sm leading-6">
              <input
                type="checkbox"
                checked={draft.auditSummary.dimensions[field]}
                onChange={(event) => updateCheckbox("dimensions", field, event.target.checked)}
                className="mt-1 size-4 accent-[#1437d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1437d6]"
              />
              <span>{dimensionLabels[field]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-2 border-[#c92a20] bg-[#fff0ec] p-4">
        <legend className="px-2 text-sm font-semibold text-[#8e211b]">四项公开披露 · 必须全部确认</legend>
        <div className="space-y-3">
          {SHOWCASE_DISCLOSURES.map((field) => (
            <label key={field} className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#5b302b]">
              <input
                type="checkbox"
                checked={draft.disclosure[field]}
                onChange={(event) => updateCheckbox("disclosure", field, event.target.checked)}
                className="mt-1 size-4 accent-[#c92a20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1437d6]"
              />
              <span>{disclosureLabels[field]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
