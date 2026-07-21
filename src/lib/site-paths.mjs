function containsUnsafeSegment(value) {
  return value.split("/").some((segment) => {
    if (!segment) return false;

    try {
      const decoded = decodeURIComponent(segment);
      return decoded === "." || decoded === "..";
    } catch {
      return true;
    }
  });
}

/**
 * Normalize a deployment subpath for Next.js `basePath`.
 *
 * @param {string | undefined | null} value
 */
export function normalizeBasePath(value) {
  const trimmed = value?.trim() || "";

  if (!trimmed || trimmed === "/") return "";
  if (/^[a-z][a-z\d+.-]*:\/\//iu.test(trimmed)) {
    throw new TypeError("NEXT_PUBLIC_BASE_PATH must be a path, not a URL.");
  }
  if (/[?#\\]/u.test(trimmed) || containsUnsafeSegment(trimmed)) {
    throw new TypeError(
      "NEXT_PUBLIC_BASE_PATH must not contain traversal, query, hash, or backslash characters.",
    );
  }

  const segments = trimmed.split("/").filter(Boolean);
  return segments.length ? `/${segments.join("/")}` : "";
}

export const BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH,
);

/**
 * Prefix a root-relative public asset with the configured deployment subpath.
 *
 * @param {string} pathname
 * @param {string} [basePath]
 */
export function withBasePath(pathname, basePath = BASE_PATH) {
  if (!pathname.startsWith("/")) {
    throw new TypeError("Asset pathname must start with a slash.");
  }

  return `${normalizeBasePath(basePath)}${pathname}`;
}

/**
 * Join a public site root and route without discarding a repository subpath.
 *
 * @param {string} siteUrl
 * @param {string} pathname
 */
export function joinSiteUrl(siteUrl, pathname) {
  const base = new URL(siteUrl);

  if (base.protocol !== "https:" && base.protocol !== "http:") {
    throw new TypeError("Site URL must use http or https.");
  }
  if (base.search || base.hash) {
    throw new TypeError("Site URL must not contain a query string or hash.");
  }
  if (containsUnsafeSegment(pathname)) {
    throw new TypeError("Site pathname must not contain traversal segments.");
  }

  base.pathname = `${base.pathname.replace(/\/+$/u, "")}/`;
  return new URL(pathname.replace(/^\/+/, ""), base).toString();
}
