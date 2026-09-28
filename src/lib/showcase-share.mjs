export function getSafeCurrentPageUrl(currentHref, expectedSlug = "") {
  const url = new URL(String(currentHref));
  if (!new Set(["http:", "https:"]).has(url.protocol) || url.username || url.password) {
    throw new TypeError("Invalid Showcase page URL");
  }
  if (expectedSlug) {
    const expectedSuffix = `/showcase/${expectedSlug}/`;
    if (!url.pathname.endsWith(expectedSuffix)) throw new TypeError("Unexpected Showcase detail URL");
  }
  url.search = "";
  url.hash = "";
  return url.toString();
}

export async function shareShowcasePage({ navigatorObject, currentHref }) {
  const url = getSafeCurrentPageUrl(currentHref);
  const shareData = {
    title: "社区作品集案例",
    text: "查看这个公开、已脱敏的作品集案例。",
    url,
  };

  if (typeof navigatorObject?.share === "function") {
    try {
      await navigatorObject.share(shareData);
      return { method: "share", url };
    } catch {
      // Native sharing can fail or be cancelled; copying remains a safe fallback.
    }
  }

  if (typeof navigatorObject?.clipboard?.writeText !== "function") {
    throw new Error("Clipboard unavailable");
  }
  await navigatorObject.clipboard.writeText(url);
  return { method: "copy", url };
}
