import { getActiveTemplateId } from "./templates.mjs";

export const CONFIG_DRAFT_VERSION = 1;
export const CONFIG_DRAFT_KEY = "portfolio-config-draft:v1";

const EMPTY_PROJECT = Object.freeze({
  title: "", problem: "", method: "", goal: "", actions: "", result: "", artifact: "", contribution: "",
});

export function createEmptyConfigDraft() {
  return {
    mode: "product",
    template: "atlas",
    profile: { name: "", role: "", summary: "", email: "" },
    projects: Array.from({ length: 3 }, () => ({ ...EMPTY_PROJECT })),
  };
}

function strings(value) {
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(strings);
  return [];
}

function joinUnique(...values) {
  return [...new Set(values.flatMap(strings))].join("\n");
}

function metricText(metrics) {
  return Array.isArray(metrics)
    ? metrics.flatMap((metric) => metric && typeof metric === "object"
      ? [joinUnique(metric.label && metric.value ? `${metric.label}：${metric.value}` : "", metric.value)]
      : strings(metric)).filter(Boolean)
    : [];
}

function contributionText(roleContribution) {
  if (!roleContribution || typeof roleContribution !== "object") return "";
  return joinUnique(
    roleContribution.scope && `职责范围：${roleContribution.scope}`,
    roleContribution.judgment && `关键判断：${roleContribution.judgment}`,
    roleContribution.usedBy && `协作对象：${roleContribution.usedBy}`,
    roleContribution.boundary && `贡献边界：${roleContribution.boundary}`,
  );
}

function mapProject(project, mode) {
  const source = project && typeof project === "object" ? project : {};
  const caseStudy = source.caseStudy && typeof source.caseStudy === "object" ? source.caseStudy : {};
  const challenge = joinUnique(caseStudy.question, source.background, source.summary, source.subtitle);
  const approach = joinUnique(caseStudy.productMethod, caseStudy.algorithmAndData, source.actions);
  return {
    ...EMPTY_PROJECT,
    title: typeof source.title === "string" ? source.title : "",
    problem: mode === "product" ? challenge : "",
    method: mode === "product" ? approach : "",
    goal: mode === "operations" ? challenge : "",
    actions: mode === "operations" ? approach : "",
    result: joinUnique(metricText(source.metrics), caseStudy.evaluation, source.results),
    artifact: joinUnique(caseStudy.artifact),
    contribution: contributionText(source.roleContribution),
  };
}

export function portfolioDataToConfigDraft(input) {
  const data = input && typeof input === "object" ? input : {};
  const mode = data.rolePreset === "operations" ? "operations" : "product";
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const bySlug = new Map(projects.map((project) => [project?.slug, project]));
  const ordered = [];
  for (const slug of Array.isArray(data.featuredProjectSlugs) ? data.featuredProjectSlugs : []) {
    const project = bySlug.get(slug);
    if (project && !ordered.includes(project)) ordered.push(project);
  }
  for (const project of projects) if (!ordered.includes(project)) ordered.push(project);
  const mapped = ordered.slice(0, 3).map((project) => mapProject(project, mode));
  while (mapped.length < 3) mapped.push({ ...EMPTY_PROJECT });
  const profile = data.profile && typeof data.profile === "object" ? data.profile : {};
  return {
    mode,
    template: getActiveTemplateId(data),
    profile: {
      name: typeof profile.name === "string" ? profile.name : "",
      role: typeof profile.role === "string" ? profile.role : "",
      summary: joinUnique(profile.summary, profile.headline),
      email: typeof profile.email === "string" ? profile.email : "",
    },
    projects: mapped,
  };
}

export function serializeConfigDraft(draft) {
  return JSON.stringify({ version: CONFIG_DRAFT_VERSION, savedAt: new Date().toISOString(), draft });
}

export function parseConfigDraft(raw) {
  if (typeof raw !== "string" || !raw.trim()) return { ok: false, reason: "missing" };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== CONFIG_DRAFT_VERSION) return { ok: false, reason: "version" };
    if (!parsed.draft || !Array.isArray(parsed.draft.projects) || !parsed.draft.profile) return { ok: false, reason: "shape" };
    const empty = createEmptyConfigDraft();
    const text = (value) => typeof value === "string" ? value : "";
    const projects = parsed.draft.projects.slice(0, 3).map((project) => Object.fromEntries(
      Object.keys(EMPTY_PROJECT).map((key) => [key, text(project?.[key])]),
    ));
    while (projects.length < 3) projects.push({ ...EMPTY_PROJECT });
    return {
      ok: true,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
      draft: {
        mode: parsed.draft.mode === "operations" ? "operations" : "product",
        template: getActiveTemplateId({ template: { active: parsed.draft.template } }),
        profile: Object.fromEntries(Object.keys(empty.profile).map((key) => [key, text(parsed.draft.profile[key])])),
        projects,
      },
    };
  } catch {
    return { ok: false, reason: "corrupt" };
  }
}

export function loadConfigDraft(storage) {
  try {
    return parseConfigDraft(storage.getItem(CONFIG_DRAFT_KEY));
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export function saveConfigDraft(storage, draft) {
  try {
    storage.setItem(CONFIG_DRAFT_KEY, serializeConfigDraft(draft));
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export function removeConfigDraft(storage) {
  try {
    storage.removeItem(CONFIG_DRAFT_KEY);
    return { ok: true };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
