const disabledBasePaths = new Set(["", "/", "false", "off", "none"]);

function hasOwn(environment, key) {
  return Object.prototype.hasOwnProperty.call(environment, key);
}

export function normalizeBasePath(value) {
  const normalized = String(value ?? "").trim();

  if (disabledBasePaths.has(normalized.toLowerCase())) {
    return "";
  }

  const pathname = `/${normalized}`.replace(/\/+$/u, "").replace(/\/{2,}/gu, "/");

  if (/[?#]/u.test(pathname)) {
    throw new Error("GitHub Pages base path must not contain a query or hash.");
  }

  return pathname;
}

export function parseGithubRepository(repository) {
  const [owner, name, ...rest] = String(repository ?? "").trim().split("/");

  if (!owner || !name || rest.length > 0) {
    return null;
  }

  return { owner, name };
}

export function getGithubPagesBasePath(environment = {}) {
  const overrideKey = hasOwn(environment, "NEXT_PUBLIC_BASE_PATH")
    ? "NEXT_PUBLIC_BASE_PATH"
    : hasOwn(environment, "GITHUB_PAGES_BASE_PATH")
      ? "GITHUB_PAGES_BASE_PATH"
      : null;

  if (overrideKey) {
    return normalizeBasePath(environment[overrideKey]);
  }

  if (environment.GITHUB_ACTIONS !== "true") {
    return "";
  }

  const repository = parseGithubRepository(environment.GITHUB_REPOSITORY);

  if (!repository) {
    return "";
  }

  const isUserSite =
    repository.name.toLowerCase() ===
    `${repository.owner.toLowerCase()}.github.io`;

  return isUserSite ? "" : normalizeBasePath(repository.name);
}

export function getSiteUrl(environment = {}) {
  const configuredSiteUrl = environment.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/u, "");
  }

  if (environment.GITHUB_ACTIONS === "true") {
    const repository = parseGithubRepository(environment.GITHUB_REPOSITORY);

    if (repository) {
      return `https://${repository.owner}.github.io${getGithubPagesBasePath(environment)}`;
    }
  }

  return "https://portfolio.example.com";
}

export function withBasePath(pathname, basePath = "") {
  const normalizedPathname = `/${String(pathname).replace(/^\/+|\/+$/gu, "")}`;
  return `${normalizeBasePath(basePath)}${normalizedPathname}`;
}

export function getStaticPageHref(pathname, basePath = "") {
  const value = String(pathname);
  const suffixStart = value.search(/[?#]/u);
  const route = suffixStart === -1 ? value : value.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? "" : value.slice(suffixStart);
  const normalizedRoute = `/${route.replace(/^\/+|\/+$/gu, "")}`;
  const exportedFile = normalizedRoute === "/"
    ? "/index.html"
    : `${normalizedRoute}/index.html`;

  return `${normalizeBasePath(basePath)}${exportedFile}${suffix}`;
}
