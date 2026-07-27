import assert from "node:assert/strict";
import test from "node:test";

import { assertProductionAudit } from "../scripts/check-security-audit.mjs";

const knownAuditReport = {
  metadata: {
    vulnerabilities: {
      critical: 0,
      high: 3,
      moderate: 0,
      low: 0,
      total: 3,
    },
  },
  vulnerabilities: {
    next: {
      severity: "high",
      via: ["postcss", "sharp"],
    },
    postcss: {
      severity: "high",
      via: [
        {
          url: "https://github.com/advisories/GHSA-qx2v-qp2m-jg93",
        },
        {
          url: "https://github.com/advisories/GHSA-6g55-p6wh-862q",
        },
        {
          url: "https://github.com/advisories/GHSA-r28c-9q8g-f849",
        },
      ],
    },
    sharp: {
      severity: "high",
      via: [
        {
          url: "https://github.com/advisories/GHSA-f88m-g3jw-g9cj",
        },
      ],
    },
  },
};

test("accepts the documented upstream production blockers", () => {
  assert.doesNotThrow(() => assertProductionAudit(knownAuditReport));
});

test("rejects a newly vulnerable production package", () => {
  const report = structuredClone(knownAuditReport);
  report.vulnerabilities.react = {
    severity: "high",
    via: [
      {
        url: "https://github.com/advisories/GHSA-new-package",
      },
    ],
  };

  assert.throws(
    () => assertProductionAudit(report),
    /Unexpected vulnerable packages: react/u,
  );
});

test("rejects a new advisory on an allowlisted package", () => {
  const report = structuredClone(knownAuditReport);
  report.vulnerabilities.postcss.via.push({
    url: "https://github.com/advisories/GHSA-new-advisory",
  });

  assert.throws(
    () => assertProductionAudit(report),
    /Unexpected advisories: GHSA-new-advisory/u,
  );
});

test("rejects critical production findings", () => {
  const report = structuredClone(knownAuditReport);
  report.metadata.vulnerabilities.critical = 1;

  assert.throws(
    () => assertProductionAudit(report),
    /Critical production vulnerabilities: 1/u,
  );
});
