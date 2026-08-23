"use client";

import { useState } from "react";
import { shareShowcasePage } from "@/lib/showcase-share.mjs";

export function ShowcaseShareButton() {
  const [status, setStatus] = useState("");

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

  return (
    <div>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex border border-[#14110e]/30 bg-[#fffdf8] px-5 py-3 text-sm font-semibold transition hover:border-[#c92a20] hover:text-[#c92a20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6] motion-reduce:transition-none"
      >
        分享这个案例
      </button>
      <p className="mt-3 min-h-6 text-sm text-[#5b4635]" aria-live="polite" role="status">
        {status}
      </p>
    </div>
  );
}
