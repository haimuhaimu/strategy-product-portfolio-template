import { ClosingCTA } from "@/components/ClosingCTA";
import { StaticPageLink } from "@/components/StaticPageLink";
import type { PortfolioData, Project, TemplateId } from "@/types/project";

type TemplateHomeProps = {
  template: Exclude<TemplateId, "atlas">;
  data: PortfolioData;
  projects: Project[];
};

function ProjectLink({ project, label }: { project: Project; label: string }) {
  return (
    <StaticPageLink href={`/projects/${project.slug}/`} className="template-project-card group block border border-[var(--template-line)] bg-[var(--template-card)] p-[var(--template-card-pad)] transition hover:-translate-y-1">
      <p className="template-kicker">{label} · {project.domain}</p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight">{project.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--template-muted)]">{project.summary}</p>
      <span className="mt-5 block text-sm font-bold text-[var(--template-accent)]">进入案例结构 →</span>
    </StaticPageLink>
  );
}

function GrowthHome({ data, projects }: Omit<TemplateHomeProps, "template">) {
  const metrics = data.home.evidenceMetrics.length
    ? data.home.evidenceMetrics
    : projects.flatMap((project) => project.metrics).slice(0, 4);
  return (
    <main className="template-page template-home growth-home">
      <section className="template-hero mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
        <p className="template-kicker">GROWTH SYSTEM / METRIC FIRST</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div><h1 className="template-title">{data.home.introTitle}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--template-muted)]">{data.profile.summary}</p></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.slice(0, 4).map((metric) => <div key={`${metric.label}-${metric.value}`} className="template-metric"><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8" aria-labelledby="growth-loop-title">
        <p className="template-kicker">01 / EXPERIMENT LOOP</p><h2 id="growth-loop-title" className="template-section-title">从目标到实验，再到复盘资产</h2>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {projects.map((project, index) => <article key={project.slug} className="template-panel"><span className="template-step">0{index + 1}</span><h3>{index === 0 ? "定义增长目标" : index === 1 ? "运行实验与护栏" : "复盘并机制化"}</h3><p>{project.caseStudy.productMethod[0] || project.actions[0] || project.summary}</p><strong>{project.caseStudy.evaluation[0] || project.results[0] || "结果证据待补充"}</strong></article>)}
        </div>
      </section>
      <section id="projects" className="mx-auto max-w-7xl px-4 py-12 sm:px-8"><p className="template-kicker">02 / GROWTH CASES</p><h2 className="template-section-title">按增长链路阅读三个项目</h2><div className="mt-7 grid gap-4 lg:grid-cols-3">{projects.map((project, index) => <ProjectLink key={project.slug} project={project} label={`LOOP 0${index + 1}`} />)}</div></section>
      <ClosingCTA contact={data.contact} />
    </main>
  );
}

function SystemsHome({ data, projects }: Omit<TemplateHomeProps, "template">) {
  return (
    <main className="template-page template-home systems-home">
      <section className="template-hero mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-24">
        <div className="template-domain-label">SYSTEM MAP / {projects.length} DOMAINS</div>
        <h1 className="template-title mt-6">{data.home.introTitle}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--template-muted)]">{data.profile.summary}</p>
        <div className="mt-8 flex flex-wrap gap-2">{projects.map((project) => <span key={project.slug} className="template-chip">{project.domain}</span>)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8" aria-labelledby="system-mechanism-title">
        <p className="template-kicker">01 / OPERATING MECHANISM</p><h2 id="system-mechanism-title" className="template-section-title">系统域、机制与跨团队契约</h2>
        <div className="mt-8 divide-y divide-[var(--template-line)] border-y border-[var(--template-line)]">
          {projects.map((project, index) => <article key={project.slug} className="grid gap-4 py-6 lg:grid-cols-[4rem_0.8fr_1.2fr_1fr]"><span className="template-step">0{index + 1}</span><div><p className="template-kicker">系统域</p><h3 className="mt-2 text-xl font-semibold">{project.domain}</h3></div><div><p className="template-kicker">机制 / 规则</p><p className="mt-2 text-sm leading-6">{project.roleContribution?.judgment || project.caseStudy.productMethod[0] || project.summary}</p></div><div><p className="template-kicker">边界 / 资产</p><p className="mt-2 text-sm leading-6">{project.roleContribution?.boundary || project.caseStudy.artifact.join("；") || "边界与资产待补充"}</p></div></article>)}
        </div>
      </section>
      <section id="projects" className="mx-auto max-w-7xl px-4 py-12 sm:px-8"><p className="template-kicker">02 / SYSTEM CASE FILES</p><h2 className="template-section-title">从机制与资产进入项目</h2><div className="mt-7 grid gap-4 lg:grid-cols-3">{projects.map((project, index) => <ProjectLink key={project.slug} project={project} label={`DOMAIN 0${index + 1}`} />)}</div></section>
      {data.roadmap.length ? <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8"><p className="template-kicker">03 / ASSET ROADMAP</p><h2 className="template-section-title">可复用能力如何演进</h2><ol className="mt-7 grid gap-3 md:grid-cols-5">{data.roadmap.map((stage) => <li key={stage.id} className="template-panel"><span className="template-step">{stage.index}</span><h3>{stage.title}</h3><p>{stage.summary}</p></li>)}</ol></section> : null}
      <ClosingCTA contact={data.contact} />
    </main>
  );
}

function AiWorkflowHome({ data, projects }: Omit<TemplateHomeProps, "template">) {
  return (
    <main className="template-page template-home ai-workflow-home">
      <section className="template-hero mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-24">
        <p className="template-kicker">HUMAN × AI / EVALUATION BEFORE AUTOMATION</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><div><h1 className="template-title">{data.home.introTitle}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--template-muted)]">{data.profile.summary}</p></div><div className="template-console"><span>INPUT</span><strong>任务与上下文</strong><i>↓</i><span>HUMAN × AI</span><strong>生成、判断、人工接管</strong><i>↓</i><span>EVAL / GUARDRAIL</span><strong>评估、护栏、回滚</strong></div></div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8" aria-labelledby="workflow-title"><p className="template-kicker">01 / WORKFLOW</p><h2 id="workflow-title" className="template-section-title">人机分工不是一句“用了 AI”</h2><div className="mt-8 grid gap-4 lg:grid-cols-3">{projects.map((project, index) => <article key={project.slug} className="template-panel"><span className="template-step">FLOW 0{index + 1}</span><h3>{project.title}</h3><p><b>人负责：</b>{project.roleContribution?.judgment || project.actions[0] || "关键判断待补充"}</p><p><b>机器负责：</b>{project.caseStudy.algorithmAndData[0] || project.detailContent?.aiMigration[0]?.body || "AI 环节待补充"}</p><strong>评估：{project.caseStudy.evaluation[0] || project.results[0] || "待补充"}</strong></article>)}</div></section>
      <section id="projects" className="mx-auto max-w-7xl px-4 py-12 sm:px-8"><div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="template-kicker">02 / EVAL & GUARDRAIL</p><h2 className="template-section-title">先看评估、护栏与回滚，再看模型名</h2><p className="mt-4 text-sm leading-7 text-[var(--template-muted)]">所有区块只重排已有数据；缺失项明确显示待补充，不生成模型、指标或结果。</p></div><div className="grid gap-4">{projects.map((project, index) => <ProjectLink key={project.slug} project={project} label={`WORKFLOW 0${index + 1}`} />)}</div></div></section>
      <ClosingCTA contact={data.contact} />
    </main>
  );
}

export function TemplateHome({ template, data, projects }: TemplateHomeProps) {
  if (template === "growth") return <GrowthHome data={data} projects={projects} />;
  if (template === "systems") return <SystemsHome data={data} projects={projects} />;
  return <AiWorkflowHome data={data} projects={projects} />;
}
