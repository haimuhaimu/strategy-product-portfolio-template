import type { Project } from "@/types/project";

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-xl border border-[#14110e]/15 bg-[#fffdf8] p-5 sm:p-7">
      <h2 className="text-xl font-semibold text-[#14110e]">{title}</h2>
      <ul className="mt-4 space-y-3 text-[0.95rem] leading-7 text-[#4b3829]">
        {items.map((item) => <li key={item} className="border-l-2 border-[#c92a20] pl-4">{item}</li>)}
      </ul>
    </section>
  );
}

export function GenericProjectDetail({ project }: { project: Project }) {
  const methods = project.caseStudy.productMethod.length ? project.caseStudy.productMethod : project.actions;
  const results = project.caseStudy.evaluation.length ? project.caseStudy.evaluation : project.results;
  return (
    <div data-generic-project-detail className="mt-5 grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-[#14110e]/15 bg-[#14110e] p-5 text-white sm:p-7 lg:col-span-2">
        <p className="font-mono text-xs font-semibold text-[#e85a4f]">问题 / 目标</p>
        <h2 className="mt-3 text-2xl font-semibold">{project.caseStudy.question}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-[#d8c9b4]">{project.background}</p>
      </section>
      <DetailList title="方法与动作" items={methods} />
      <DetailList title="结果与证据" items={results} />
      {project.caseStudy.algorithmAndData.length ? <DetailList title="数据与协作" items={project.caseStudy.algorithmAndData} /> : null}
      {project.caseStudy.artifact.length ? <DetailList title="交付与沉淀" items={project.caseStudy.artifact} /> : null}
    </div>
  );
}
