export const DIAGNOSTIC_SHARE_VERSION = 1;
export const DIAGNOSTIC_SHARE_HASH_PREFIX = "#diagnostic=";
export const MAX_DIAGNOSTIC_SHARE_PAYLOAD_LENGTH = 2048;

export const SHARE_DIMENSIONS = [
  ["resultEvidence", "结果证据"],
  ["scopeAndAttribution", "口径完整"],
  ["methodEvidence", "方法证据"],
  ["artifactEvidence", "资产证据"],
  ["contributionBoundary", "贡献边界"],
];

export const SAFE_PRIORITY_QUESTIONS = new Set([
  "先确认隐私红线：能否删除或脱敏已命中的标识，并确认公开授权？",
  "最能证明效果的一项结果是什么？请给出可查验的数值、采用或交付事实。",
  "这项结果的对象、范围、时间窗、基线或对照是什么？请至少补两项。",
  "你用什么具体方法验证判断？例如样本、漏斗、实验、访谈、日志或评估标准。",
  "项目沉淀了什么可复用交付物？例如规则、原型、SOP、看板或评估集。",
  "哪项判断或动作由你完成，哪些结果属于团队，哪些仍未验证？",
  "哪些空泛表述可以改成具体对象、动作和证据，而不是只写负责、赋能或闭环？",
  "五维证据已覆盖，下一步确认公开边界并放入完整作品集。",
]);

export const SAFE_QUESTION_FALLBACK = "请回到诊断页，根据当前缺口补充一项可核对证据。";

const MODEL_KEYS = [
  "version",
  "totalScore",
  "level",
  "dimensions",
  "privacyRiskCount",
  "priorityQuestion",
];
const DIMENSION_KEYS = SHARE_DIMENSIONS.map(([key]) => key);
const LEVELS = new Set(["弱证据", "可用", "强证据"]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value, expectedKeys) {
  if (!isPlainObject(value)) return false;
  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  return actualKeys.length === sortedExpectedKeys.length
    && actualKeys.every((key, index) => key === sortedExpectedKeys[index]);
}

function normalizeScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.round(Math.min(5, Math.max(0, score)) * 10) / 10;
}

function scoreLevel(score) {
  if (score >= 4) return "强证据";
  if (score >= 3) return "可用";
  return "弱证据";
}

function coverageOf(report, key) {
  const value = Number(report?.dimensionScores?.[key]?.value);
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.min(1, Math.max(0, value)) * 100);
}

export function normalizeSafePriorityQuestion(question) {
  return SAFE_PRIORITY_QUESTIONS.has(question) ? question : SAFE_QUESTION_FALLBACK;
}

export function createSafeDiagnosticShareModel(report) {
  const totalScore = normalizeScore(report?.totalScore);
  return {
    version: DIAGNOSTIC_SHARE_VERSION,
    totalScore,
    level: scoreLevel(totalScore),
    dimensions: Object.fromEntries(
      SHARE_DIMENSIONS.map(([key]) => [key, coverageOf(report, key)]),
    ),
    privacyRiskCount: Array.isArray(report?.privacyRisks) ? report.privacyRisks.length : 0,
    priorityQuestion: normalizeSafePriorityQuestion(report?.questions?.[0]),
  };
}

export function isValidSafeDiagnosticShareModel(value) {
  if (!hasExactKeys(value, MODEL_KEYS)) return false;
  if (value.version !== DIAGNOSTIC_SHARE_VERSION) return false;
  if (typeof value.totalScore !== "number" || !Number.isFinite(value.totalScore)) return false;
  if (value.totalScore < 0 || value.totalScore > 5 || Math.round(value.totalScore * 10) !== value.totalScore * 10) return false;
  if (!LEVELS.has(value.level) || value.level !== scoreLevel(value.totalScore)) return false;
  if (!hasExactKeys(value.dimensions, DIMENSION_KEYS)) return false;
  if (!DIMENSION_KEYS.every((key) => Number.isInteger(value.dimensions[key]) && value.dimensions[key] >= 0 && value.dimensions[key] <= 100)) return false;
  const scoreFromDimensions = Math.round(
    (DIMENSION_KEYS.reduce((sum, key) => sum + value.dimensions[key], 0) / 100) * 10,
  ) / 10;
  if (scoreFromDimensions !== value.totalScore) return false;
  if (!Number.isInteger(value.privacyRiskCount) || value.privacyRiskCount < 0 || value.privacyRiskCount > 100) return false;
  if (!SAFE_PRIORITY_QUESTIONS.has(value.priorityQuestion) && value.priorityQuestion !== SAFE_QUESTION_FALLBACK) return false;
  return true;
}

export function encodeUtf8Base64Url(value) {
  const bytes = new TextEncoder().encode(String(value));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export function decodeUtf8Base64Url(value) {
  const encoded = String(value);
  if (!encoded || encoded.length > MAX_DIAGNOSTIC_SHARE_PAYLOAD_LENGTH) return null;
  if (!/^[A-Za-z0-9_-]+$/u.test(encoded) || encoded.length % 4 === 1) return null;

  try {
    const base64 = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function encodeDiagnosticSharePayload(model) {
  if (!isValidSafeDiagnosticShareModel(model)) {
    throw new TypeError("Invalid safe diagnostic share model");
  }
  return encodeUtf8Base64Url(JSON.stringify(model));
}

export function decodeDiagnosticSharePayload(payload) {
  const json = decodeUtf8Base64Url(payload);
  if (!json) return null;

  try {
    const model = JSON.parse(json);
    if (!isValidSafeDiagnosticShareModel(model)) return null;
    if (encodeDiagnosticSharePayload(model) !== payload) return null;
    return model;
  } catch {
    return null;
  }
}

function payloadChecksum(payload) {
  const bytes = new TextEncoder().encode(payload);
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function createDiagnosticShareHash(model) {
  const payload = encodeDiagnosticSharePayload(model);
  return `${DIAGNOSTIC_SHARE_HASH_PREFIX}${payload}.${payloadChecksum(payload)}`;
}

export function parseDiagnosticShareHash(hash) {
  const value = String(hash ?? "");
  if (!value.startsWith(DIAGNOSTIC_SHARE_HASH_PREFIX)) return null;
  if (value.length > DIAGNOSTIC_SHARE_HASH_PREFIX.length + MAX_DIAGNOSTIC_SHARE_PAYLOAD_LENGTH + 9) return null;

  const encoded = value.slice(DIAGNOSTIC_SHARE_HASH_PREFIX.length);
  const separatorIndex = encoded.lastIndexOf(".");
  if (separatorIndex <= 0) return null;
  const payload = encoded.slice(0, separatorIndex);
  const checksum = encoded.slice(separatorIndex + 1);
  if (!/^[a-f0-9]{8}$/u.test(checksum) || checksum !== payloadChecksum(payload)) return null;
  return decodeDiagnosticSharePayload(payload);
}

function normalizeBasePath(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "/" || raw.toLowerCase() === "false") return "";
  if (/[?#]/u.test(raw)) throw new TypeError("Invalid base path");
  return `/${raw}`.replace(/\/+$/u, "").replace(/\/{2,}/gu, "/");
}

export function createDiagnosticExperienceUrl(origin, basePath = "") {
  const url = new URL(String(origin));
  if (!new Set(["http:", "https:"]).has(url.protocol)) throw new TypeError("Invalid origin");
  return `${url.origin}${normalizeBasePath(basePath)}/#instant-diagnostic`;
}

export function createDiagnosticShareUrl(experienceUrl, model) {
  const url = new URL(String(experienceUrl));
  if (!new Set(["http:", "https:"]).has(url.protocol)) throw new TypeError("Invalid experience URL");
  url.search = "";
  url.hash = createDiagnosticShareHash(model);
  return url.toString();
}
