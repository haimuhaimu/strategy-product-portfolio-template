import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { TemplateProjectDetail } from "@/components/templates/TemplateProjectDetail";
import { getActiveTemplate, getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import {
  createPageMetadata,
  createProjectJsonLd,
  getProjectSeoKeywords,
  serializeJsonLd,
} from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "项目不存在 | 产品经理作品集模板",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createPageMetadata({
    title: project.title,
    description: project.summary,
    pathname: `/projects/${project.slug}/`,
    keywords: getProjectSeoKeywords(project),
    type: "article",
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectJsonLd = createProjectJsonLd(project);
  const activeTemplate = getActiveTemplate();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(projectJsonLd),
        }}
      />
      {activeTemplate === "atlas" ? <ProjectDetail project={project} /> : <TemplateProjectDetail template={activeTemplate} project={project} />}
    </>
  );
}
