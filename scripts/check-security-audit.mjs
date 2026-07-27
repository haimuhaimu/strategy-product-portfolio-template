import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TRACKING_ISSUE =
  "https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/9";

const ALLOWED_PACKAGES = new Set(["next", "postcss", "sharp"]);

const ALLOWED_ADVISORIES = new Set([
  "GHSA-qx2v-qp2m-jg93",
  "GHSA-6g55-p6wh-862q",
  "GHSA-r28c-9q8g-f849",
  "GHSA-f88m-g3jw-g9cj",
]);

function advisoryId(url) {
  return url.split("/").at(-1);
}

export function assertProductionAudit(report) {
  const vulnerabilities = report?.vulnerabilities;
  const counts = report?.metadata?.vulnerabilities;

  if (!vulnerabilities || !counts) {
    throw new Error("npm audit returned an incomplete report.");
  }

  const packageNames = Object.keys(vulnerabilities);
  const unexpectedPackages = packageNames.filter(
    (name) => !ALLOWED_PACKAGES.has(name),
  );
  const advisoryIds = packageNames.flatMap((name) =>
    (vulnerabilities[name].via ?? [])
      .filter((finding) => typeof finding === "object" && finding.url)
      .map((finding) => advisoryId(finding.url)),
  );
  const unexpectedAdvisories = advisoryIds.filter(
    (id) => !ALLOWED_ADVISORIES.has(id),
  );
  const criticalCount = Number(counts.critical);
  const failures = [];

  if (criticalCount > 0) {
    failures.push(`Critical production vulnerabilities: ${criticalCount}`);
  }

  if (unexpectedPackages.length > 0) {
    failures.push(
      `Unexpected vulnerable packages: ${unexpectedPackages.sort().join(", ")}`,
    );
  }

  if (unexpectedAdvisories.length > 0) {
    failures.push(
      `Unexpected advisories: ${[...new Set(unexpectedAdvisories)]
        .sort()
        .join(", ")}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(
      `${failures.join("\n")}\nReview the audit output and update ${TRACKING_ISSUE}.`,
    );
  }

  return {
    advisoryCount: advisoryIds.length,
    criticalCount,
    packageCount: packageNames.length,
  };
}

export function checkInstalledProductionAudit() {
  const npmExecutable = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(
    npmExecutable,
    ["audit", "--omit=dev", "--json"],
    {
      encoding: "utf8",
    },
  );

  if (result.error) {
    throw result.error;
  }

  let report;

  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error(
      `npm audit did not return JSON.${result.stderr ? `\n${result.stderr.trim()}` : ""}`,
    );
  }

  return assertProductionAudit(report);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  try {
    const result = checkInstalledProductionAudit();

    console.log(
      `Production audit baseline passed: ${result.packageCount} allowlisted packages, ${result.advisoryCount} documented advisories, ${result.criticalCount} critical.`,
    );
    console.log(`Upstream blockers are tracked in ${TRACKING_ISSUE}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
