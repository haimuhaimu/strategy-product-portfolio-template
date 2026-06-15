import type { Project } from "@/types/project";

type ProjectValueAndRoleProps = {
  project: Project;
};

export function ProjectValueAndRole({ project }: ProjectValueAndRoleProps) {
  if (!project.valueAnchor && !project.roleContribution) {
    return null;
  }

  return (
    <section className="mt-6 border-2 border-[#14110e] bg-[#f4dfbd] p-4 shadow-[6px_6px_0_#14110e] sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-dashed border-[#b75a3a]/55 p-4">
          <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
            Value Anchor
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#14110e]">
            这件事到底让谁变好了
          </h2>
          <p className="mt-3 text-base leading-8 text-[#4b3829]">
            不先讲“我优化了什么指标”，先讲这件事回到了哪一类真实价值。
          </p>
        </div>

        {project.valueAnchor ? (
          <div className="grid gap-3 md:grid-cols-2">
            <InfoBlock title="主要价值对象" body={project.valueAnchor.primary} index={1} />
            <InfoBlock title="谁因此变好了" body={project.valueAnchor.improves} index={2} />
            <InfoBlock title="怎么证明" body={project.valueAnchor.proof} index={3} />
            <InfoBlock title="平台怎么受益" body={project.valueAnchor.platformBenefit} index={4} />
          </div>
        ) : null}
      </div>

      {project.roleContribution ? (
        <div className="mt-5 border-2 border-[#8b3a28] bg-[#fff2d8] p-4">
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
                Role Boundary
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#14110e]">
                我负责哪一段，以及我不抢哪一段
              </h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoBlock title="我负责的部分" body={project.roleContribution.scope} index={1} />
              <InfoBlock title="我推动的判断" body={project.roleContribution.judgment} index={2} />
              <InfoBlock title="这个判断被谁使用" body={project.roleContribution.usedBy} index={3} />
              <InfoBlock title="结果边界" body={project.roleContribution.boundary} index={4} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function InfoBlock({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  return (
    <div className="border border-[#8b3a28] bg-[#fff2d8] p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-7 place-items-center border border-[#14110e] bg-[#14110e] font-mono text-xs font-semibold text-[#f4dfbd]">
          {String(index).padStart(2, "0")}
        </span>
        <h4 className="text-sm font-semibold text-[#c92a20]">{title}</h4>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#35291f]">{body}</p>
    </div>
  );
}
