import { StaticPageLink } from "@/components/StaticPageLink";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const primaryMetric = project.metrics[0];

  return (
    <StaticPageLink
      href={`/projects/${project.slug}/`}
      className="group flex h-full flex-col border border-slate-300 bg-[#fbfaf7] p-5 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-normal text-slate-400">
            Case File / 0{project.order}
          </div>
          <div className="mt-2 inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
            {project.domain}
          </div>
        </div>
        <span className="text-right text-xs leading-5 text-slate-500">
          {project.period}
        </span>
      </div>

      <h3 className="mt-5 [font-family:var(--font-display)] text-2xl font-semibold leading-8 tracking-normal text-slate-950">
        {project.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {project.subtitle}
      </p>

      {project.roleContribution ? (
        <div className="mt-5 border-l-2 border-slate-950 pl-4">
          <div className="text-xs font-semibold text-slate-500">我的判断</div>
          <p className="mt-2 text-sm leading-6 text-slate-800">
            {project.roleContribution.judgment}
          </p>
        </div>
      ) : (
        <p className="mt-5 flex-1 text-sm leading-6 text-slate-600">
          {project.summary}
        </p>
      )}

      {project.valueAnchor ? (
        <div className="mt-5 border border-slate-200 bg-white/70 p-4">
          <div className="text-xs font-semibold text-slate-500">价值锚点</div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {project.valueAnchor.primary}
          </p>
        </div>
      ) : null}

      {primaryMetric ? (
        <div className="mt-5 grid grid-cols-[0.6fr_1fr] items-end gap-3 border-t border-slate-200 pt-4">
          <div className="text-4xl font-semibold tracking-normal text-slate-950">
            {primaryMetric.value}
          </div>
          <div className="pb-1 text-sm leading-5 text-slate-500">
            {primaryMetric.label}
          </div>
        </div>
      ) : null}

      <div className="mt-5 text-sm font-semibold text-sky-700 transition group-hover:text-sky-950">
        打开项目档案 →
      </div>
    </StaticPageLink>
  );
}
