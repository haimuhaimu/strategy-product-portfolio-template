const STORAGE_KEY = "pmf-pilot-v1";
const FORMAT_VERSION = 1;
export const PMF_PILOT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const PMF_PILOT_EVENTS = [
  "persona_confirmed",
  "path_selected",
  "import_result",
  "audit_result",
  "release_pack_generated",
  "published_confirmed",
  "applied",
  "interview_feedback",
];

export const PMF_PILOT_PATHS = ["skill_first", "launchpad", "example_config"];
export const PMF_PILOT_IMPORT_RESULTS = ["real_success", "example_loaded", "failed"];
export const PMF_PILOT_AUDIT_RESULTS = ["pass", "warn", "block"];
export const PMF_PILOT_PLATFORMS = ["github_pages", "vercel", "netlify", "cloudflare_pages", "other_static"];
export const PMF_PILOT_INTERVIEW_FEEDBACK = [
  "not_received",
  "scheduled",
  "positive",
  "mixed",
  "negative",
  "offer",
  "withdrawn",
];
export const PMF_PILOT_TEMPLATE_IDS = ["atlas", "growth", "systems", "ai-workflow"];

export function getPmfImportResult(importKind, ok) {
  if (!ok) return "failed";
  if (importKind === "example") return "example_loaded";
  if (importKind === "real") return "real_success";
  throw new TypeError("未知的 PMF Pilot 导入来源枚举。");
}

const allowedKeysByEvent = {
  persona_confirmed: ["value", "count"],
  path_selected: ["value"],
  import_result: ["value"],
  audit_result: ["value"],
  release_pack_generated: ["value", "templateId"],
  published_confirmed: ["value", "platform"],
  applied: ["value"],
  interview_feedback: ["value"],
};

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isEnum(value, allowed) {
  return typeof value === "string" && allowed.includes(value);
}

function isIsoTimestamp(value) {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function disabledExport(timestamp) {
  return {
    formatVersion: FORMAT_VERSION,
    status: "disabled",
    enabled: false,
    eventCount: 0,
    generatedAt: timestamp,
    events: [],
  };
}

function assertExactPayloadKeys(event, payload) {
  if (!isRecord(payload)) throw new TypeError("PMF Pilot 事件载荷必须是对象。");
  const allowed = allowedKeysByEvent[event];
  const unexpected = Object.keys(payload).filter((key) => !allowed.includes(key));
  if (unexpected.length) throw new TypeError(`PMF Pilot 事件包含未允许字段：${unexpected.join(", ")}`);
}

export function validatePmfPilotEvent(event, payload) {
  if (!PMF_PILOT_EVENTS.includes(event)) throw new TypeError("未知的 PMF Pilot 事件枚举。");
  assertExactPayloadKeys(event, payload);

  if (event === "persona_confirmed") {
    if (typeof payload.value !== "boolean") throw new TypeError("persona_confirmed.value 必须是布尔值。");
    if (!Number.isInteger(payload.count) || payload.count < 0 || payload.count > 3) {
      throw new TypeError("persona_confirmed.count 必须是 0–3 的整数。");
    }
  }
  if (event === "path_selected" && !isEnum(payload.value, PMF_PILOT_PATHS)) {
    throw new TypeError("path_selected.value 必须是允许的路径枚举。");
  }
  if (event === "import_result" && !isEnum(payload.value, PMF_PILOT_IMPORT_RESULTS)) {
    throw new TypeError("import_result.value 必须是允许的导入结果枚举。");
  }
  if (event === "audit_result" && !isEnum(payload.value, PMF_PILOT_AUDIT_RESULTS)) {
    throw new TypeError("audit_result.value 必须是允许的审计结果枚举。");
  }
  if (event === "release_pack_generated") {
    if (payload.value !== true) throw new TypeError("release_pack_generated.value 只能为 true。");
    if (!isEnum(payload.templateId, PMF_PILOT_TEMPLATE_IDS)) {
      throw new TypeError("release_pack_generated.templateId 必须是允许的模板 ID。");
    }
  }
  if (event === "published_confirmed") {
    if (typeof payload.value !== "boolean") throw new TypeError("published_confirmed.value 必须是布尔值。");
    if (payload.value && !isEnum(payload.platform, PMF_PILOT_PLATFORMS)) {
      throw new TypeError("确认公开时必须选择允许的平台枚举。");
    }
    if (!payload.value && payload.platform !== undefined) {
      throw new TypeError("未确认公开时不得记录平台。");
    }
  }
  if (event === "applied" && typeof payload.value !== "boolean") {
    throw new TypeError("applied.value 必须是布尔值。");
  }
  if (event === "interview_feedback" && !isEnum(payload.value, PMF_PILOT_INTERVIEW_FEEDBACK)) {
    throw new TypeError("interview_feedback.value 必须是允许的反馈枚举。");
  }

  return true;
}

function sanitizeEvent(input) {
  if (!isRecord(input) || !isIsoTimestamp(input.timestamp) || typeof input.event !== "string") return null;
  const { event, timestamp, ...payload } = input;
  try {
    validatePmfPilotEvent(event, payload);
  } catch {
    return null;
  }
  return { event, ...payload, timestamp };
}

function sanitizeStoredState(input, now) {
  if (!isRecord(input) || input.formatVersion !== FORMAT_VERSION || input.enabled !== true) return null;
  if (!isIsoTimestamp(input.startedAt) || !isIsoTimestamp(input.expiresAt) || !Array.isArray(input.events)) return null;
  if (Date.parse(input.expiresAt) <= now) return null;
  if (Object.keys(input).some((key) => !["formatVersion", "enabled", "startedAt", "expiresAt", "events"].includes(key))) {
    return null;
  }
  const events = input.events.map(sanitizeEvent);
  if (events.some((event) => event === null)) return null;
  const uniqueNames = new Set(events.map((event) => event.event));
  if (uniqueNames.size !== events.length) return null;
  return { formatVersion: FORMAT_VERSION, enabled: true, startedAt: input.startedAt, expiresAt: input.expiresAt, events };
}

export function sanitizePmfPilotExport(input, timestamp = new Date().toISOString()) {
  if (!isRecord(input) || input.status !== "enabled" || input.enabled !== true || !Array.isArray(input.events)) {
    return disabledExport(timestamp);
  }
  if (!isIsoTimestamp(input.startedAt) || !isIsoTimestamp(input.expiresAt)) return disabledExport(timestamp);
  if (Date.parse(input.expiresAt) <= Date.parse(timestamp) || Date.parse(input.startedAt) >= Date.parse(input.expiresAt)) {
    return disabledExport(timestamp);
  }
  const events = input.events.map(sanitizeEvent);
  if (events.some((event) => event === null)) return disabledExport(timestamp);
  const uniqueNames = new Set(events.map((event) => event.event));
  if (uniqueNames.size !== events.length) return disabledExport(timestamp);
  return {
    formatVersion: FORMAT_VERSION,
    status: "enabled",
    enabled: true,
    startedAt: input.startedAt,
    expiresAt: input.expiresAt,
    eventCount: events.length,
    generatedAt: timestamp,
    events,
  };
}

export function createPmfPilotLogger({ storage, now = () => Date.now() } = {}) {
  function timestamp() {
    return new Date(now()).toISOString();
  }

  function remove() {
    try {
      storage?.removeItem(STORAGE_KEY);
    } catch {
      return false;
    }
    return true;
  }

  function read() {
    if (!storage) return null;
    let raw;
    try {
      raw = storage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
    if (!raw) return null;
    try {
      const state = sanitizeStoredState(JSON.parse(raw), now());
      if (!state) remove();
      return state;
    } catch {
      remove();
      return null;
    }
  }

  function write(state) {
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  function status() {
    const state = read();
    return state
      ? { enabled: true, expiresAt: state.expiresAt, eventCount: state.events.length }
      : { enabled: false, expiresAt: null, eventCount: 0 };
  }

  function enable() {
    const startedAt = timestamp();
    const state = {
      formatVersion: FORMAT_VERSION,
      enabled: true,
      startedAt,
      expiresAt: new Date(now() + PMF_PILOT_TTL_MS).toISOString(),
      events: [],
    };
    write(state);
    return status();
  }

  function disable() {
    remove();
    return status();
  }

  function clear() {
    const state = read();
    if (!state) return status();
    write({ ...state, events: [] });
    return status();
  }

  function record(event, payload) {
    validatePmfPilotEvent(event, payload);
    const state = read();
    if (!state) return false;
    const nextEvent = { event, ...payload, timestamp: timestamp() };
    const events = [...state.events.filter((item) => item.event !== event), nextEvent];
    write({ ...state, events });
    return true;
  }

  function exportLog() {
    const state = read();
    if (!state) return disabledExport(timestamp());
    return sanitizePmfPilotExport({ ...state, status: "enabled" }, timestamp());
  }

  return { enable, disable, clear, export: exportLog, record, status };
}

let browserLogger;
const PMF_PILOT_CHANGE_EVENT = "pmf-pilot-change";
const DISABLED_STATUS_SNAPSHOT = JSON.stringify({ enabled: false, expiresAt: null, eventCount: 0 });

function getBrowserLogger() {
  if (typeof window === "undefined") return createPmfPilotLogger();
  if (!browserLogger) {
    let storage;
    try {
      storage = window.localStorage;
    } catch {
      storage = undefined;
    }
    browserLogger = createPmfPilotLogger({ storage });
  }
  return browserLogger;
}

function notifyBrowserSubscribers() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PMF_PILOT_CHANGE_EVENT));
}

export function enablePmfPilotLog() {
  const status = getBrowserLogger().enable();
  notifyBrowserSubscribers();
  return status;
}

export function disablePmfPilotLog() {
  const status = getBrowserLogger().disable();
  notifyBrowserSubscribers();
  return status;
}

export function clearPmfPilotLog() {
  const status = getBrowserLogger().clear();
  notifyBrowserSubscribers();
  return status;
}

export function exportPmfPilotLog() {
  return getBrowserLogger().export();
}

export function recordPmfPilotEvent(event, payload) {
  const recorded = getBrowserLogger().record(event, payload);
  if (recorded) notifyBrowserSubscribers();
  return recorded;
}

export function getPmfPilotStatus() {
  return getBrowserLogger().status();
}

export function subscribePmfPilotStatus(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PMF_PILOT_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PMF_PILOT_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getPmfPilotStatusSnapshot() {
  return JSON.stringify(getPmfPilotStatus());
}

export function getPmfPilotServerStatusSnapshot() {
  return DISABLED_STATUS_SNAPSHOT;
}
