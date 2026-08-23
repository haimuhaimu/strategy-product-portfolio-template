function getSafeCurrentPageUrl(currentHref) {
  const url = new URL(String(currentHref));
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new TypeError("Invalid Showcase page URL");
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
