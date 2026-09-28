export type EvidenceDimensionKey = "resultEvidence" | "scopeAndAttribution" | "methodEvidence" | "artifactEvidence" | "contributionBoundary";

export type EvidenceAuditReport = {
  totalScore: number;
  maxScore: number;
  level: string;
  dimensionScores: Record<string, { label: string; value: number }>;
  projectScores: Array<{
    index: number;
    title: string;
    score: number;
    maxScore: number;
    rubric: Record<EvidenceDimensionKey, boolean>;
  }>;
  privacyRisks: Array<{ category: string; count: number; message: string }>;
  fluffFindings: Array<{ word: string; message: string }>;
  questions: string[];
};
