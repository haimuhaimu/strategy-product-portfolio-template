export type Metric = {
  label: string;
  value: string;
};

export type Experience = {
  company: string;
  title: string;
  period: string;
  focus: string;
};

export type Methodology = {
  title: string;
  description: string;
  proof: string;
};

export type Insight = {
  title: string;
  description: string;
};

export type WorkGroup = {
  title: string;
  description: string;
  projectSlugs: string[];
};

export type CapabilityGroup = {
  title: string;
  items: string[];
};

export type Profile = {
  name: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  headline: string;
  summary: string;
  about: string[];
  tags: string[];
  positioning: string[];
  methodology: Methodology[];
  insights: Insight[];
  workGroups: WorkGroup[];
  capabilityGroups: CapabilityGroup[];
  experiences: Experience[];
};

export type CaseStudy = {
  question: string;
  productMethod: string[];
  algorithmAndData: string[];
  evaluation: string[];
  artifact: string[];
};

export type ProjectDetailContent = {
  difficulty: string[];
  judgment: string[];
  review: string[];
  aiMigration: Array<{
    title: string;
    body: string;
  }>;
};

export type ProjectValueAnchor = {
  primary: string;
  improves: string;
  proof: string;
  platformBenefit: string;
};

export type ProjectRoleContribution = {
  scope: string;
  judgment: string;
  usedBy: string;
  boundary: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  company: string;
  period: string;
  domain: string;
  order: number;
  summary: string;
  valueAnchor?: ProjectValueAnchor;
  roleContribution?: ProjectRoleContribution;
  keywords: string[];
  metrics: Metric[];
  background: string;
  caseStudy: CaseStudy;
  detailContent?: ProjectDetailContent;
  actions: string[];
  results: string[];
};

export type PortfolioData = {
  profile: Profile;
  projects: Project[];
};
