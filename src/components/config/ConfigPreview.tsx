import type { DraftProject } from "./ConfigProjectFields";

type Props = {
  name: string; role: string; summary: string; mode: "product" | "operations";
  projects: DraftProject[];
};

export function ConfigPreview({ name, role, summary, mode, projects }: Props) {
  return (
    <div className="sticky top-24 rounded-xl border border-[#14110e]/15 bg-[#fffdf8] p-5 shadow-[0_16px_40px_rgba(20,17,14,0.08)]">
      <p className="font-mono text-xs font-semibold text-[#c92a20]">实时预览 · {mode === "product" ? "产品" : "运营"}</p>
      <h2 className="mt-4 text-3xl font-semibold text-[#14110e]">{name || "你的名字"}</h2>
      <p className="mt-2 text-sm text-[#80654d]">{role || (mode === "product" ? "产品经理" : "产品运营")}</p>
      <p className="mt-4 text-sm leading-7 text-[#4b3829]">{summary || "你的个人简介会显示在这里。"}</p>
      <div className="mt-6 space-y-3">
        {projects.map((project, index) => {
          const challenge = mode === "product" ? project.problem : project.goal;
          const approach = mode === "product" ? project.method : project.actions;
          return (
            <article key={index} className="rounded-lg border border-[#14110e]/10 bg-white p-4">
              <p className="font-mono text-xs text-[#c92a20]">0{index + 1}</p>
              <h3 className="mt-2 font-semibold text-[#14110e]">{project.title || `代表项目 ${index + 1}`}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5b4635]">{challenge || (mode === "product" ? "等待填写问题" : "等待填写目标与人群")}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5b4635]">{approach || (mode === "product" ? "等待填写产品方法" : "等待填写运营动作")}</p>
              <p className="mt-3 text-sm font-semibold text-[#c92a20]">{project.result || "等待填写结果"}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
