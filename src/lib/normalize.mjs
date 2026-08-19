import { resolveTemplateId } from "./templates.mjs";

const emptyOperatingSystem = {
  personModel: [],
  rewardFunction: [],
  actionStrategy: [],
};

const defaultFeatures = {
  profile: false,
  thinking: false,
  advancedModels: false,
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeProject(project, index) {
  const title = project?.title || `代表项目 ${index + 1}`;
  const summary = project?.summary || project?.subtitle || "请补充这个项目的背景与价值。";
  const actions = asArray(project?.actions);
  const results = asArray(project?.results);
  const metrics = asArray(project?.metrics);

  return {
    ...(project && typeof project === "object" ? project : {}),
    slug: project?.slug || `project-${index + 1}`,
    title,
    subtitle: project?.subtitle || summary,
    company: project?.company || "项目经历",
    period: project?.period || "",
    domain: project?.domain || "项目案例",
    order: Number.isFinite(project?.order) ? project.order : index + 1,
    summary,
    keywords: asArray(project?.keywords),
    metrics,
    background: project?.background || summary,
    caseStudy: {
      ...(project?.caseStudy && typeof project.caseStudy === "object" ? project.caseStudy : {}),
      question: project?.caseStudy?.question || project?.background || summary,
      productMethod: asArray(project?.caseStudy?.productMethod).length
        ? project.caseStudy.productMethod
        : actions,
      algorithmAndData: asArray(project?.caseStudy?.algorithmAndData),
      evaluation: asArray(project?.caseStudy?.evaluation).length
        ? project.caseStudy.evaluation
        : results,
      artifact: asArray(project?.caseStudy?.artifact),
    },
    actions,
    results,
    ...(project?.valueAnchor ? { valueAnchor: project.valueAnchor } : {}),
    ...(project?.roleContribution ? { roleContribution: project.roleContribution } : {}),
    ...(project?.detailContent ? { detailContent: project.detailContent } : {}),
  };
}

export function normalizePortfolioData(input = {}) {
  const projects = asArray(input.projects).map(normalizeProject);
  const profile = input.profile || {};
  const featuredProjectSlugs = asArray(input.featuredProjectSlugs).length
    ? input.featuredProjectSlugs
    : projects.slice(0, 3).map((project) => project.slug);
  const evidenceMetrics = asArray(input.home?.evidenceMetrics).length
    ? input.home.evidenceMetrics
    : projects.flatMap((project) => project.metrics.slice(0, 1)).slice(0, 4);

  return {
    ...input,
    schemaVersion: 2,
    rolePreset: input.rolePreset === "operations" ? "operations" : "product",
    template: {
      ...(input.template && typeof input.template === "object" ? input.template : {}),
      active: resolveTemplateId(input.template?.active),
    },
    profile: {
      ...profile,
      name: profile.name || "你的名字",
      role: profile.role || "产品经理 / 运营",
      location: profile.location || "",
      phone: profile.phone || "",
      email: profile.email || "hello@example.com",
      headline: profile.headline || "用项目与结果证明你的能力",
      summary: profile.summary || "请用两三句话介绍你擅长解决的问题。",
      about: asArray(profile.about),
      tags: asArray(profile.tags),
      interests: asArray(profile.interests),
      positioning: asArray(profile.positioning),
      methodology: asArray(profile.methodology),
      insights: asArray(profile.insights),
      workGroups: asArray(profile.workGroups),
      capabilityGroups: asArray(profile.capabilityGroups),
      experiences: asArray(profile.experiences),
    },
    home: {
      ...(input.home && typeof input.home === "object" ? input.home : {}),
      introEyebrow: input.home?.introEyebrow || "个人作品集",
      introTitle: input.home?.introTitle || profile.headline || "用项目与结果证明你的能力",
      featuredTitle: input.home?.featuredTitle || "三个代表项目",
      evidenceTitle: input.home?.evidenceTitle || "结果证据",
      evidenceMetrics,
    },
    features: { ...defaultFeatures, ...(input.features || {}) },
    contact: {
      ...(input.contact && typeof input.contact === "object" ? input.contact : {}),
      title: input.contact?.title || "期待与你交流",
      description: input.contact?.description || "如果这些项目与你正在解决的问题有关，欢迎通过邮件联系。",
      email: input.contact?.email || profile.email || "hello@example.com",
    },
    featuredProjectSlugs: featuredProjectSlugs.slice(0, 3),
    roadmap: asArray(input.roadmap),
    starMap: {
      ...(input.starMap && typeof input.starMap === "object" ? input.starMap : {}),
      nodes: asArray(input.starMap?.nodes),
      edges: asArray(input.starMap?.edges),
    },
    personalOperatingSystem: input.personalOperatingSystem || emptyOperatingSystem,
    influences: asArray(input.influences),
    trainingHistory: asArray(input.trainingHistory),
    calibrationLogs: asArray(input.calibrationLogs),
    projects,
  };
}
