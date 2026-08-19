"use client";

import { useState, useSyncExternalStore } from "react";
import { StaticPageLink } from "@/components/StaticPageLink";
import {
  clearPmfPilotLog,
  disablePmfPilotLog,
  enablePmfPilotLog,
  exportPmfPilotLog,
  getPmfPilotServerStatusSnapshot,
  getPmfPilotStatusSnapshot,
  recordPmfPilotEvent,
  subscribePmfPilotStatus,
} from "@/lib/pmf-pilot.mjs";

type PilotStatus = {
  enabled: boolean;
  expiresAt: string | null;
  eventCount: number;
};

const checks = [
  "我有 3–8 年产品或运营相关经验",
  "我正在转型 AI / 策略产品或产品运营",
  "我的材料很多，但还不会筛选、证明或脱敏",
] as const;

function formatExpiry(expiresAt: string | null) {
  if (!expiresAt) return "";
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(expiresAt));
}

export function PilotParticipationPanel() {
  const [checked, setChecked] = useState<boolean[]>(checks.map(() => false));
  const status = JSON.parse(useSyncExternalStore(
    subscribePmfPilotStatus,
    getPmfPilotStatusSnapshot,
    getPmfPilotServerStatusSnapshot,
  )) as PilotStatus;
  const [notice, setNotice] = useState("默认关闭；启用前不会写入 localStorage。");

  function enable() {
    const nextStatus = enablePmfPilotLog();
    if (!nextStatus.enabled) {
      setNotice("浏览器未开放 localStorage，未启用任何记录。你仍可继续使用试点流程。");
      return;
    }
    const count = checked.filter(Boolean).length;
    recordPmfPilotEvent("persona_confirmed", { value: count === checks.length, count });
    setNotice("已启用匿名本地记录；7 天后自动过期。你可以随时清空或关闭。");
  }

  function updateCheck(index: number, value: boolean) {
    const next = checked.map((item, itemIndex) => itemIndex === index ? value : item);
    setChecked(next);
    if (status.enabled) {
      const count = next.filter(Boolean).length;
      recordPmfPilotEvent("persona_confirmed", { value: count === checks.length, count });
    }
  }

  function clear() {
    clearPmfPilotLog();
    setNotice("已清空事件；启用状态和到期时间保持不变。");
  }

  function disable() {
    disablePmfPilotLog();
    setNotice("已关闭并删除本地试点记录。");
  }

  function download() {
    const content = `${JSON.stringify(exportPmfPilotLog(), null, 2)}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "application/json;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "PMF_PILOT_LOG.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("日志已导出。提交前请自行打开检查，不要追加任何原始材料或链接。");
  }

  function choosePath(path: "skill_first" | "launchpad") {
    recordPmfPilotEvent("path_selected", { value: path });
  }

  return (
    <section className="mt-10 grid gap-6 border-2 border-[#14110e] bg-[#fffaf0] p-5 shadow-[7px_7px_0_#14110e] sm:p-8 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="pilot-check-title">
      <div>
        <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#c92a20]">SELF CHECK / ENUM ONLY</p>
        <h2 id="pilot-check-title" className="mt-3 text-3xl font-semibold">先判断这轮试点是否适合你</h2>
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">PMF Pilot 目标人群自检</legend>
          {checks.map((label, index) => (
            <label key={label} className="flex cursor-pointer gap-3 border border-[#14110e]/15 bg-white p-4 text-sm font-medium leading-6">
              <input type="checkbox" checked={checked[index]} onChange={(event) => updateCheck(index, event.target.checked)} className="mt-1 size-4 accent-[#c92a20]" />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <p className="mt-4 text-sm text-[#6e5743]">命中越多越适合首批试点；不命中不影响继续使用公开模板。</p>
      </div>

      <div className="border border-[#14110e]/20 bg-white p-5 sm:p-6">
        <p className="font-mono text-xs font-bold text-[#80654d]">ANONYMOUS LOCAL LOG</p>
        <h3 className="mt-2 text-2xl font-semibold">匿名本地记录由你主动开启</h3>
        <p className="mt-3 text-sm leading-7 text-[#5b4635]">只记录枚举、布尔、计数、模板 ID 和时间戳；不记录自由文本、URL、公司名、项目原文、邮箱或电话。数据只在本机 localStorage，7 天 TTL，默认关闭，不上传。</p>
        <div className="mt-5 border-l-4 border-[#d84b28] bg-[#fff8df] p-4 text-sm leading-6 text-[#6f4a0c]" role="status" aria-live="polite">
          <strong>{status.enabled ? `已启用 · ${status.eventCount} 个事件` : "未启用"}</strong>
          {status.enabled ? <span className="block">自动过期：{formatExpiry(status.expiresAt)}</span> : null}
          <span className="mt-1 block">{notice}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {!status.enabled ? <button type="button" onClick={enable} className="bg-[#14110e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c92a20]">主动启用</button> : null}
          {status.enabled ? <button type="button" onClick={clear} className="border border-[#14110e]/25 px-4 py-2.5 text-sm font-semibold hover:border-[#c92a20]">清空事件</button> : null}
          {status.enabled ? <button type="button" onClick={download} className="border border-[#14110e]/25 px-4 py-2.5 text-sm font-semibold hover:border-[#c92a20]">导出检查</button> : null}
          {status.enabled ? <button type="button" onClick={disable} className="px-4 py-2.5 text-sm font-semibold text-[#9d2119] underline underline-offset-4">关闭并删除</button> : null}
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <a href="https://github.com/haimuhaimu/strategy-product-portfolio-template/tree/main/skills/portfolio-story-builder" target="_blank" rel="noreferrer" onClick={() => choosePath("skill_first")} className="border border-[#14110e] p-4 text-sm font-semibold hover:bg-[#fffaf0]">材料很多，从 Skill 开始 ↗</a>
          <StaticPageLink href="/launchpad/" onClick={() => choosePath("launchpad")} className="bg-[#c92a20] p-4 text-sm font-semibold text-white hover:bg-[#a8221a]">已有 JSON，进入 Launchpad →</StaticPageLink>
        </div>
      </div>
    </section>
  );
}
