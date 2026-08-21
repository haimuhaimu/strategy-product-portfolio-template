"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createDiagnosticExperienceUrl,
  createDiagnosticShareUrl,
  createSafeDiagnosticShareModel,
  parseDiagnosticShareHash,
} from "@/lib/diagnostic-share.mjs";

export type SafeDiagnosticShareModel = ReturnType<typeof createSafeDiagnosticShareModel>;

export function getCurrentDiagnosticExperienceUrl() {
  return createDiagnosticExperienceUrl(
    window.location.origin,
    process.env.NEXT_PUBLIC_BASE_PATH,
  );
}

export function useDiagnosticShare() {
  const [sharedResult, setSharedResult] = useState<SafeDiagnosticShareModel | null>(null);
  const [shareLinkStatus, setShareLinkStatus] = useState("复制可转发链接（不含原文）");

  useEffect(() => {
    function syncFromHash() {
      const parsed = parseDiagnosticShareHash(window.location.hash);
      setSharedResult(parsed);
      if (!parsed) return;

      window.requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("shared-diagnostic-result")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const copyShareLink = useCallback(async (report: unknown) => {
    const safeModel = createSafeDiagnosticShareModel(report);
    const shareUrl = createDiagnosticShareUrl(getCurrentDiagnosticExperienceUrl(), safeModel);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLinkStatus("已复制安全链接，不含原文");
    } catch {
      setShareLinkStatus("复制失败，请检查浏览器剪贴板权限");
    }
  }, []);

  const clearSharedResult = useCallback(() => {
    setSharedResult(null);
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", cleanUrl);
  }, []);

  const resetShareLinkStatus = useCallback(() => {
    setShareLinkStatus("复制可转发链接（不含原文）");
  }, []);

  return {
    sharedResult,
    shareLinkStatus,
    copyShareLink,
    clearSharedResult,
    resetShareLinkStatus,
  };
}
