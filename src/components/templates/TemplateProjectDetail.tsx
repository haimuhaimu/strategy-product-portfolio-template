import { StaticPageLink } from "@/components/StaticPageLink";
import type { Project, TemplateId } from "@/types/project";

type TemplateProjectDetailProps = {
  template: Exclude<TemplateId, "atlas">;
  project: Project;
};

type DetailSectionProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

function DetailSection({ eyebrow, title, items }: DetailSectionProps) {
  return (
    <section className="template-detail-section">
      <p className="template-kicker">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      {items.length ? <ul className="mt-5 space-y-3">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-4 text-sm text-[var(--template-muted)]">待补充：当前数据没有这一结构所需的事实。</p>}
    </section>
  );
}

function MetricGrid({ project }: { project: Project }) {
  return (
    <div className="template-detail-metrics">
      {project.metrics.length ? project.metrics.map((metric) => <div key={`${metric.label}-${metric.value}`} className="template-metric"><strong>{metric.value}</strong><span>{metric.label}</span></div>) : <div className="template-metric"><strong>待补充</strong><span>可核验结果</span></div>}
    </div>
  );
}

function GrowthProject({ project }: { project: Project }) {
  const experiments = project.caseStudy.productMethod.length ? project.caseStudy.productMethod : project.actions;
  const results = project.caseStudy.evaluation.length ? project.caseStudy.evaluation : project.results;
  return (
    <>
      <header className="template-detail-hero growth-detail-hero">
        <p className="template-kicker">GROWTH CASE / {project.domain}</p><MetricGrid project={project} />
        <h1>{project.title}</h1><p>{project.summary}</p>
      </header>
      <div className="template-detail-grid">
        <DetailSection eyebrow="01 / GROWTH GOAL" title="增长目标与基线" items={[project.caseStudy.question, project.background].filter(Boolean)} />
        <DetailSection eyebrow="02 / EXPERIMENT DESIGN" title="实验设计与关键动作" items={experiments} />
        <DetailSection eyebrow="03 / SIGNAL & GUARDRAIL" title="信号、指标与护栏" items={project.caseStudy.algorithmAndData} />
        <DetailSection eyebrow="04 / RESULT REVIEW" title="结果与复盘" items={results} />
        <DetailSection eyebrow="05 / REUSABLE LOOP" title="可复用增长资产" items={project.caseStudy.artifact} />
      </div>
    </>
  );
}

function SystemsProject({ project }: { project: Project }) {
  const mechanisms = project.caseStudy.productMethod.length ? project.caseStudy.productMethod : project.actions;
  return (
    <>
      <header className="template-detail-hero systems-detail-hero">
        <div className="template-domain-label">SYSTEM DOMAIN / {project.domain}</div><h1>{project.title}</h1><p>{project.summary}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="template-panel"><span>范围</span><strong>{project.roleContribution?.scope || project.company}</strong></div><div className="template-panel"><span>关键判断</span><strong>{project.roleContribution?.judgment || project.caseStudy.question}</strong></div><div className="template-panel"><span>协作边界</span><strong>{project.roleContribution?.boundary || "待补充"}</strong></div></div>
      </header>
      <div className="template-detail-grid systems-detail-grid">
        <DetailSection eyebrow="01 / SYSTEM BOUNDARY" title="系统边界与问题域" items={[project.background, project.caseStudy.question].filter(Boolean)} />
        <DetailSection eyebrow="02 / OPERATING MECHANISM" title="运行机制与规则" items={mechanisms} />
        <DetailSection eyebrow="03 / TEAM CONTRACT" title="跨团队契约与责任边界" items={[project.roleContribution?.usedBy, project.roleContribution?.boundary].filter((item): item is string => Boolean(item))} />
        <DetailSection eyebrow="04 / ASSET LAYER" title="标准、资产与复用" items={project.caseStudy.artifact} />
        <DetailSection eyebrow="05 / SYSTEM OUTCOME" title="系统结果与验证" items={project.results.length ? project.results : project.caseStudy.evaluation} />
      </div>
    </>
  );
}

function AiWorkflowProject({ project }: { project: Project }) {
  const workflow = project.detailContent?.aiMigration.map((step) => `${step.title}：${step.body}`) || [];
  const evaluation = project.caseStudy.evaluation.length ? project.caseStudy.evaluation : project.results;
  return (
    <>
      <header className="template-detail-hero ai-detail-hero">
        <p className="template-kicker">AI WORKFLOW CASE / HUMAN-IN-THE-LOOP</p><h1>{project.title}</h1><p>{project.summary}</p>
        <div className="template-console mt-7"><span>TASK</span><strong>{project.caseStudy.question}</strong><i>↓</i><span>HUMAN × AI</span><strong>{project.roleContribution?.judgment || project.actions[0] || "人机边界待补充"}</strong><i>↓</i><span>EVALUATE / ROLLBACK</span><strong>{evaluation[0] || "评估与回滚待补充"}</strong></div>
      </header>
      <div className="template-detail-grid ai-detail-grid">
        <DetailSection eyebrow="01 / TASK & BOUNDARY" title="任务与人机责任边界" items={[project.background, project.roleContribution?.boundary].filter((item): item is string => Boolean(item))} />
        <DetailSection eyebrow="02 / WORKFLOW" title="人机工作流" items={workflow.length ? workflow : project.caseStudy.productMethod} />
        <DetailSection eyebrow="03 / EVALUATION" title="评估方法与证据" items={[...project.caseStudy.algorithmAndData, ...evaluation]} />
        <DetailSection eyebrow="04 / GUARDRAIL" title="护栏与人工接管" items={project.detailContent?.review || []} />
        <DetailSection eyebrow="05 / ROLLBACK & ASSET" title="回滚条件与复用资产" items={project.caseStudy.artifact} />
      </div>
    </>
  );
}

export function TemplateProjectDetail({ template, project }: TemplateProjectDetailProps) {
  return (
    <main className="template-page template-project-detail mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <StaticPageLink href="/#projects" className="template-back-link">← 返回项目目录</StaticPageLink>
      {template === "growth" ? <GrowthProject project={project} /> : template === "systems" ? <SystemsProject project={project} /> : <AiWorkflowProject project={project} />}
    </main>
  );
}
