import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageLink } from "@/components/StaticPageLink";
import { getFeaturedProjects } from "@/lib/projects";
import {
  getTemplateDefinition,
  isTemplateId,
  TEMPLATE_IDS,
} from "@/lib/templates.mjs";
import { createPageMetadata } from "@/lib/seo";

type TemplateDetailPageProps = {
  params: Promise<{ id: string }>;
};

type TemplateDefinition = NonNullable<ReturnType<typeof getTemplateDefinition>>;
type Project = ReturnType<typeof getFeaturedProjects>[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: TemplateDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!isTemplateId(id)) {
    return {
      title: "模板不存在 | 产品经理作品集模板",
      robots: { index: false, follow: false },
    };
  }

  const template = getTemplateDefinition(id);
  if (!template) {
    return {
      title: "模板不存在 | 产品经理作品集模板",
      robots: { index: false, follow: false },
    };
  }
  return createPageMetadata({
    title: template.seo.title,
    description: template.seo.description,
    pathname: `/templates/${template.id}/`,
    keywords: template.seo.keywords,
  });
}

function firstSentence(value: string) {
  const match = value.match(/^.*?[。！？](?=.|$)/u);
  return match?.[0] ?? value;
}

function EvidenceExample({
  template,
  project,
}: {
  template: TemplateDefinition;
  project: Project;
}) {
  const roleEvidence = project.roleContribution
    ? [project.roleContribution.scope, project.roleContribution.judgment]
    : [];
  const metricEvidence = project.metrics.slice(0, 2).map(
    (metric) => `${metric.label}：${metric.value}`,
  );
  const evidence = template.exampleEvidence === "metrics"
    ? metricEvidence
    : roleEvidence;

  return (
    <section
      className="border-y border-[#14110e] bg-[#f4dfbd] px-4 py-14 sm:px-8"
      aria-labelledby="sanitized-example"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#8b211a]">
          SANITIZED EXAMPLE / 只读现有内容
        </p>
        <div className="mt-4 grid gap-7 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h2 id="sanitized-example" className="font-serif text-3xl font-semibold sm:text-4xl">
              脱敏示例片段
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5b4635]">
              来源：仓库当前 <code>data/projects.json</code> 中的公开脱敏内容；仅摘录 1 个
              featured project。这里没有补写业务事实，也不代表使用该模板一定会获得某种效果。
            </p>
          </div>
          <article className="border border-[#14110e]/25 bg-[#fffaf0] p-6 shadow-[6px_6px_0_rgba(20,17,14,0.1)]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#80654d]">
              featured project / {project.slug}
            </p>
            <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#5b4635]">
              {firstSentence(project.summary)}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {evidence.map((item, index) => (
                <div key={item} className="border-l-2 border-[#c92a20] bg-white/60 p-3">
                  <dt className="font-mono text-[10px] font-bold text-[#80654d]">
                    现有{template.exampleEvidence === "metrics" ? "指标" : "角色贡献"} 0{index + 1}
                  </dt>
                  <dd className="mt-2 text-sm leading-6">{item}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}

function BulletSection({
  id,
  eyebrow,
  title,
  items,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: string[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={dark ? "bg-[#14110e] p-6 text-[#fffaf0] sm:p-8" : "border border-[#14110e]/20 bg-[#fffdf8] p-6 sm:p-8"}
      aria-labelledby={id}
    >
      <p className={`font-mono text-[10px] font-bold tracking-[0.16em] ${dark ? "text-[#d3b992]" : "text-[#80654d]"}`}>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-2xl font-semibold">{title}</h2>
      <ul className={`mt-5 space-y-3 text-sm leading-7 ${dark ? "text-[#e5d6bf]" : "text-[#5b4635]"}`}>
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1rem_1fr] gap-2">
            <span aria-hidden="true">—</span><span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { id } = await params;
  if (!isTemplateId(id)) notFound();

  const template = getTemplateDefinition(id);
  if (!template) notFound();
  const projects = getFeaturedProjects();
  const exampleProject = projects[template.exampleProjectIndex] ?? projects[0];
  if (!exampleProject) notFound();

  return (
    <main className="bg-[#efefe9] text-[#14110e]">
      <section className="border-b border-[#14110e]/15 px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <StaticPageLink href="/templates/" className="font-mono text-xs font-bold text-[#8b211a] underline decoration-1 underline-offset-4">
            ← 返回四模板快速比较
          </StaticPageLink>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#c92a20]">
                template detail / {template.id}
              </p>
              <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">
                {template.name}
              </h1>
              <p className="mt-6 max-w-4xl text-xl font-semibold leading-9 sm:text-2xl">
                {template.tagline}
              </p>
            </div>
            <aside className="border-l-2 border-[#c92a20] bg-[#fffaf0] p-5">
              <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#80654d]">先看结论</p>
              <p className="mt-3 text-sm leading-7 text-[#5b4635]"><strong className="text-[#14110e]">一句话定位：</strong>{template.audience}</p>
              <p className="mt-3 text-sm font-semibold leading-7">{template.focus}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-8 lg:grid-cols-2" aria-label="适用判断">
        <BulletSection id="suitable-for" eyebrow="YES / 材料匹配" title="适合人群" items={template.suitableFor} />
        <BulletSection id="not-for" eyebrow="NOT YET / 先补材料" title="不适合人群" items={template.notFor} tone="dark" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-8" aria-labelledby="recruiter-path">
        <div className="border border-[#14110e]/20 bg-[#fffdf8] p-6 sm:p-8">
          <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#80654d]">RECRUITER PATH / 先后顺序</p>
          <h2 id="recruiter-path" className="mt-3 text-3xl font-semibold">招聘官第一眼与阅读路径</h2>
          <p className="mt-5 max-w-4xl border-l-2 border-[#c92a20] pl-5 text-base font-semibold leading-8">{template.recruiterFirstLook}</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {template.narrativeSteps.map((step, index) => (
              <li key={step.title} className="border-t border-[#14110e] pt-4">
                <p className="font-mono text-xs font-bold text-[#c92a20]">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b4635]">{step.purpose}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#e4e6df] px-4 py-14 sm:px-8" aria-labelledby="page-structure">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#80654d]">PAGE STRUCTURE / 页面结构</p>
          <h2 id="page-structure" className="mt-3 text-3xl font-semibold">首页负责定调，项目页负责举证</h2>
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {[{ title: "首页区块", items: template.homeStructure }, { title: "项目页区块", items: template.projectStructure }].map((group) => (
              <article key={group.title} className="border border-[#14110e]/20 bg-[#fffdf8] p-6">
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <ol className="mt-5 space-y-3">
                  {group.items.map((item, index) => <li key={item} className="flex gap-4 text-sm"><span className="font-mono font-bold text-[#c92a20]">0{index + 1}</span><span>{item}</span></li>)}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <BulletSection id="evidence-checklist" eyebrow="BEFORE PUBLISH / 不齐就先补" title="发布前证据准备清单" items={template.evidenceChecklist} />
        <BulletSection id="project-types" eyebrow="GOOD FIT / 常见题材" title="典型项目类型" items={template.projectTypes} />
        <BulletSection id="common-misuses" eyebrow="MISUSE / 可信度风险" title="常见误用" items={template.commonMisuses} tone="dark" />
        <BulletSection id="agent-help" eyebrow="AGENT / 只整理真实材料" title="如何让自己的 Agent 帮忙" items={template.agentMaterialAdvice} />
      </section>

      <EvidenceExample template={template} project={exampleProject} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8" aria-labelledby="selection-signals">
        <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#80654d]">SELECTION SIGNALS / 选择信号</p>
        <h2 id="selection-signals" className="mt-3 text-3xl font-semibold">出现这些信号，再选择这套结构</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {template.matchSignals.map((signal) => <li key={signal} className="border border-[#14110e]/20 bg-[#f4dfbd] px-4 py-2 text-sm font-semibold">{signal}</li>)}
        </ul>
      </section>

      <section className="bg-[#14110e] px-4 py-14 text-[#fffaf0] sm:px-8" aria-labelledby="field-mapping">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#d3b992]">DATA CONTRACT / 页面到数据</p>
          <h2 id="field-mapping" className="mt-3 text-3xl font-semibold">页面区块到 projects.json 字段映射</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d3b992]">字段只决定内容放在哪里，不会自动补齐事实。数组项不足时，应回到材料追问或明确标记待补充。</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-white/30"><th className="px-3 py-4">页面区块</th><th className="px-3 py-4">projects.json 字段</th><th className="px-3 py-4">这个区块要回答什么</th></tr></thead>
              <tbody>{template.fieldMappings.map((mapping) => (
                <tr key={mapping.block} className="border-b border-white/15 align-top">
                  <th className="px-3 py-5 font-semibold">{mapping.block}</th>
                  <td className="px-3 py-5 font-mono text-xs leading-6 text-[#b8ff5a]">{mapping.fields.join(" · ")}</td>
                  <td className="px-3 py-5 leading-6 text-[#e5d6bf]">{mapping.purpose}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <StaticPageLink href="/templates/" className="border border-white/35 px-5 py-3 text-sm font-semibold">比较其他模板</StaticPageLink>
            <StaticPageLink href="/start/" className="bg-[#c92a20] px-5 py-3 text-sm font-semibold text-white">把材料交给自己的 Agent →</StaticPageLink>
          </div>
        </div>
      </section>
    </main>
  );
}
