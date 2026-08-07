"use client";

type DraftProject = { title: string; problem: string; method: string; goal: string; actions: string; result: string };

type Props = {
  mode: "product" | "operations";
  projects: DraftProject[];
  onChange: (index: number, key: keyof DraftProject, value: string) => void;
};

const fields = {
  product: [
    ["problem", "用户问题 / 业务问题", "当时最值得解决的问题是什么？"],
    ["method", "产品方法 / 关键判断", "你如何定义问题、设计方案并验证？"],
    ["result", "结果证据", "填写指标变化、效率提升或定性反馈"],
  ],
  operations: [
    ["goal", "运营目标 / 人群", "目标人群是谁，要推动什么关键行为？"],
    ["actions", "运营动作 / 节奏", "写清渠道、内容、活动、分层或协作动作"],
    ["result", "增长结果 / 复盘", "填写转化、留存、成本变化及复盘结论"],
  ],
} as const;

export type { DraftProject };

export function ConfigProjectFields({ mode, projects, onChange }: Props) {
  return (
    <div className="space-y-5">
      {projects.map((project, index) => (
        <fieldset key={index} className="rounded-xl border border-[#14110e]/15 bg-white p-4">
          <legend className="px-2 text-sm font-semibold text-[#c92a20]">代表项目 {index + 1}</legend>
          <label className="block text-sm font-semibold text-[#14110e]">项目标题
            <input value={project.title} onChange={(event) => onChange(index, "title", event.target.value)} placeholder={mode === "product" ? "例如：新用户激活流程改版" : "例如：沉默用户召回增长"} className="mt-2 w-full rounded-lg border border-[#14110e]/20 px-3 py-2.5 font-normal outline-none focus:border-[#c92a20]" />
          </label>
          {fields[mode].map(([key, label, placeholder]) => (
            <label key={key} className="mt-4 block text-sm font-semibold text-[#14110e]">{label}
              <textarea value={project[key]} onChange={(event) => onChange(index, key, event.target.value)} placeholder={placeholder} rows={3} className="mt-2 w-full resize-y rounded-lg border border-[#14110e]/20 px-3 py-2.5 font-normal leading-6 outline-none focus:border-[#c92a20]" />
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
}
