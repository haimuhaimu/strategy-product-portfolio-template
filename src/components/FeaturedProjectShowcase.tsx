import { StaticPageLink } from "@/components/StaticPageLink";
import type { Project } from "@/types/project";

export function FeaturedProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-8 sm:py-16" data-motion-section>
      <div className="flex items-end justify-between gap-5 border-b border-[#14110e]/15 pb-5">
        <div>
          <p className="font-mono text-sm font-semibold text-[#c92a20]">SELECTED WORK</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#14110e] sm:text-4xl">3 个代表项目</h2>
        </div>
        <span className="text-sm text-[#80654d]">只保留最能证明能力的案例</span>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {projects.map((project, index) => (
          <StaticPageLink key={project.slug} href={`/projects/${project.slug}/`} className="motion-card group flex min-h-[25rem] flex-col rounded-xl border border-[#14110e]/15 bg-[#fffdf8] p-6 transition">
            <p className="font-mono text-xs font-semibold text-[#c92a20]">0{index + 1} / {project.domain}</p>
            <h3 className="mt-4 text-2xl font-semibold leading-8 text-[#14110e]">{project.title}</h3>
            <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#5b4635]">{project.summary}</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {project.metrics.slice(0, 2).map((metric) => (
                <div key={`${metric.label}-${metric.value}`} className="rounded-lg bg-[#f7ecdb] p-3">
                  <p className="font-mono text-lg font-semibold text-[#c92a20]">{metric.value}</p>
                  <p className="mt-1 text-xs text-[#6f6256]">{metric.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-auto pt-7 text-sm font-semibold text-[#c92a20]">阅读案例详情 <span className="inline-block transition group-hover:translate-x-1">→</span></p>
          </StaticPageLink>
        ))}
      </div>
    </section>
  );
}
