export type Metric = { label: string; value: string };
export type Experience = { company: string; title: string; period: string; focus: string };
export type Methodology = { title: string; description: string; proof: string };
export type Insight = { title: string; description: string };
export type WorkGroup = { title: string; description: string; projectSlugs: string[] };
export type CapabilityGroup = { title: string; items: string[] };
export type RolePreset = "product" | "operations";

export type Profile = {
  name: string; role: string; location: string; phone: string; email: string;
  headline: string; summary: string; about: string[]; tags: string[];
  interests: string[]; positioning: string[]; methodology: Methodology[];
  insights: Insight[]; workGroups: WorkGroup[]; capabilityGroups: CapabilityGroup[];
  experiences: Experience[];
};

export type CaseStudy = {
  question: string; productMethod: string[]; algorithmAndData: string[];
  evaluation: string[]; artifact: string[];
};
export type ProjectDetailContent = {
  difficulty: string[]; judgment: string[]; review: string[];
  aiMigration: Array<{ title: string; body: string }>;
};
export type ProjectValueAnchor = { primary: string; improves: string; proof: string; platformBenefit: string };
export type ProjectRoleContribution = { scope: string; judgment: string; usedBy: string; boundary: string };
export type Project = {
  slug: string; title: string; subtitle: string; company: string; period: string;
  domain: string; order: number; summary: string; valueAnchor?: ProjectValueAnchor;
  roleContribution?: ProjectRoleContribution; keywords: string[]; metrics: Metric[];
  background: string; caseStudy: CaseStudy; detailContent?: ProjectDetailContent;
  actions: string[]; results: string[];
};

export type CalibrationStatus = "retained" | "revised" | "pending";
export type CognitiveCalibrationLog = {
  projectSlug: string; prior: string; feedback: string; currentVersion: string;
  status: CalibrationStatus;
};
export type PersonalOperatingSystem = {
  personModel: Array<{ dimension: string; observation: string; implication: string }>;
  rewardFunction: Array<{ signal: string; weight: "high" | "medium" | "low"; guardrail: string }>;
  actionStrategy: Array<{ trigger: string; action: string; feedback: string }>;
};
export type InfluenceStatus = CalibrationStatus | "applied";
export type Influence = {
  name: string; type: "work" | "person" | "method" | "experience";
  takeaway: string; status: InfluenceStatus;
};
export type TrainingHistory = { stage: string; period: string; trainingData: string; modelUpdate: string };
export type HomeConfig = {
  introEyebrow: string; introTitle: string; featuredTitle: string; evidenceTitle: string; evidenceMetrics: Metric[];
};
export type RoadmapStage = {
  id: string; index: string; title: string; summary: string; proof: string; projectSlugs: string[];
};
export type StarMapNode = {
  id: string; label: string; kind: "capability" | "project"; x: number; y: number;
  summary: string; projectSlugs: string[];
};
export type StarMapEdge = { source: string; target: string; label: string };
export type StarMap = { nodes: StarMapNode[]; edges: StarMapEdge[] };
export type FeatureFlags = { profile: boolean; thinking: boolean; advancedModels: boolean };
export type ContactConfig = { title: string; description: string; email: string };
export type PortfolioData = {
  schemaVersion: 2; rolePreset: RolePreset; profile: Profile; home: HomeConfig;
  features: FeatureFlags; contact: ContactConfig; featuredProjectSlugs: string[];
  roadmap: RoadmapStage[]; starMap: StarMap;
  personalOperatingSystem: PersonalOperatingSystem; influences: Influence[];
  trainingHistory: TrainingHistory[]; calibrationLogs: CognitiveCalibrationLog[];
  projects: Project[];
};
