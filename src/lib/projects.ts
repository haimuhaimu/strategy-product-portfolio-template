import portfolioData from "../../data/projects.json";
import { normalizePortfolioData } from "./normalize.mjs";
import { getActiveTemplateId } from "./templates.mjs";
import type {
  CognitiveCalibrationLog, Influence, PersonalOperatingSystem, PortfolioData,
  Project, RoadmapStage, StarMap, TemplateId, TrainingHistory,
} from "@/types/project";

const data = normalizePortfolioData(portfolioData) as PortfolioData;

export function getPortfolioData() { return data; }
export function getActiveTemplate(): TemplateId { return getActiveTemplateId(data) as TemplateId; }
export function getProfile() { return data.profile; }
export function getHomeConfig() { return data.home; }
export function getFeatureFlags() { return data.features; }
export function getContact() { return data.contact; }
export function getProjects(): Project[] { return [...data.projects].sort((a, b) => a.order - b.order); }
export function getFeaturedProjects(): Project[] {
  const bySlug = new Map(getProjects().map((project) => [project.slug, project]));
  return data.featuredProjectSlugs.map((slug) => bySlug.get(slug)).filter((project): project is Project => Boolean(project)).slice(0, 3);
}
export function getCalibrationLogs(): CognitiveCalibrationLog[] { return data.calibrationLogs; }
export function getPersonalOperatingSystem(): PersonalOperatingSystem { return data.personalOperatingSystem; }
export function getInfluences(): Influence[] { return data.influences; }
export function getTrainingHistory(): TrainingHistory[] { return data.trainingHistory; }
export function getRoadmap(): RoadmapStage[] { return data.roadmap; }
export function getStarMap(): StarMap { return data.starMap; }
export function getProjectBySlug(slug: string): Project | undefined { return getProjects().find((project) => project.slug === slug); }
export function getProjectSlugs() { return getProjects().map((project) => ({ slug: project.slug })); }
export function getFeaturedMetrics() { return data.home.evidenceMetrics; }
