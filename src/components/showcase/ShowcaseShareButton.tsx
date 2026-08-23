"use client";

import { useState } from "react";
import {
  createShowcaseShareCardSvg,
  SHOWCASE_SHARE_CARD_HEIGHT,
  SHOWCASE_SHARE_CARD_WIDTH,
} from "@/lib/showcase-share-card.mjs";
import { shareShowcasePage } from "@/lib/showcase-share.mjs";

type ShowcaseShareEntry = {
  slug: string;
  kind: string;
  roleTags: string[];
  publicHighlights: string[];
  auditSummary: {
    score: number;
    maxScore: number;
    dimensions: Record<string, boolean>;
  };
};

export function ShowcaseShareButton({ entry }: { entry: ShowcaseShareEntry }) {
  const [status, setStatus] = useState("PNG 分享卡仅在当前浏览器本地生成");

  async function handleShare() {
    try {
      const result = await shareShowcasePage({
        navigatorObject: navigator,
        currentHref: window.location.href,
      });
      setStatus(result.method === "share" ? "分享面板已打开" : "已复制当前案例详情链接");
    } catch {
      setStatus("分享失败，请复制浏览器地址栏中的当前页面链接");
    }
  }

  async function downloadShareCard() {
    setStatus("正在本地生成 PNG…");
    let svgUrl = "";
    try {
      const svg = createShowcaseShareCardSvg(entry, window.location.href);
      svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      image.decoding = "async";
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("SVG image failed to load"));
        image.src = svgUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = SHOWCASE_SHARE_CARD_WIDTH;
      canvas.height = SHOWCASE_SHARE_CARD_HEIGHT;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, 0, 0, SHOWCASE_SHARE_CARD_WIDTH, SHOWCASE_SHARE_CARD_HEIGHT);
      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG conversion failed")), "image/png");
      });
      const downloadUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `showcase-${entry.slug}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      setStatus("PNG 分享卡已下载，仅含公开白名单字段");
    } catch {
      setStatus("生成失败，请换用支持 Canvas 的现代浏览器");
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
    }
  }

  const buttonClass = "inline-flex border border-[#14110e]/30 bg-[#fffdf8] px-5 py-3 text-sm font-semibold transition hover:border-[#c92a20] hover:text-[#c92a20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6] motion-reduce:transition-none";

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={downloadShareCard} className="inline-flex bg-[#1437d6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102aab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6] motion-reduce:transition-none">
          下载 PNG 分享卡
        </button>
        <button type="button" onClick={handleShare} className={buttonClass}>
          分享这个案例
        </button>
      </div>
      <p className="mt-3 min-h-6 text-sm text-[#5b4635]" aria-live="polite" role="status">
        {status}
      </p>
    </div>
  );
}
