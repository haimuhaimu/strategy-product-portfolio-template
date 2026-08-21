"use client";

import React, { useRef, useState } from "react";

const DIAGNOSTIC_EVENT = "portfolio:load-diagnostic-example";

const CASES = [
  {
    id: "product-validation",
    audience: "产品经理",
    title: "把“负责需求”改成可追问的验证链",
    before: "负责新手引导优化，推动多团队上线，效果不错。",
    after: "面向首次使用者，我先拆分关键流失节点，再用访谈与漏斗定位首个阻塞点；与设计、研发共同上线分步引导。4 周试运行后，关键步骤完成率较脱敏基线提升约 6 个百分点。我负责问题定义、方案取舍与复盘，整体上线结果属于团队。",
  },
  {
    id: "operations-loop",
    audience: "增长运营",
    title: "把“做了活动”改成对象—动作—结果",
    before: "策划拉新活动，通过多渠道推广提升用户增长。",
    after: "针对沉默新用户，我按来源与首周行为分层，设计两组触达节奏并保留未触达对照；两周后，目标行为转化率出现可复核提升。沉淀人群规则、触达 SOP 与复盘看板；我负责分层和节奏，渠道执行由团队协作完成，长期留存待验证。",
  },
  {
    id: "cross-team-system",
    audience: "产品 / 运营",
    title: "把“推动落地”改成判断与边界",
    before: "协调产品、运营和技术搭建数据平台，提升团队效率。",
    after: "面对口径不一致和重复取数，我访谈三类使用角色，按决策频次取舍首批指标；联合数据团队建立指标字典、异常检查与周度复盘机制。试运行周期内，核心看板被两个协作角色持续采用。我负责需求优先级与验收规则，技术实现和采用结果属于团队。",
  },
];

const RECRUITMENT_COPY = [
  {
    id: "short",
    label: "一句话短版",
    copy: "免费体验本地作品集证据体检：现招募首批 20 位产品/运营用户，经历不上传，也不替你编造结果。",
  },
  {
    id: "community",
    label: "社群版",
    copy: "正在招募首批 20 位产品经理 / 运营用户，免费体验一款本地作品集证据体检工具。粘贴一段经历，就能检查结果、口径、方法、资产与贡献边界，并得到一个优先追问。全程在浏览器本地运行，不上传经历，不替用户编造结果。欢迎来试用，也欢迎把真实卡点反馈给我们。",
  },
  {
    id: "direct",
    label: "私聊邀请版",
    copy: "嗨，我在测试一款免费的本地作品集证据体检工具，想邀请首批 20 位产品/运营用户体验。你可以粘贴一段脱敏经历，马上看到五维证据覆盖和一个优先补充问题；内容不会上传，也不会替你编造结果。如果你愿意，我把体验入口发你，几分钟就能完成。",
  },
];

function loadDiagnosticExample(text: string) {
  window.dispatchEvent(new CustomEvent(DIAGNOSTIC_EVENT, { detail: { text } }));
  document.getElementById("instant-diagnostic")?.scrollIntoView({ block: "start" });
}

export function ColdStartGrowthSections() {
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const [copyStatus, setCopyStatus] = useState("选择一版文案复制");
  const [fallbackCopy, setFallbackCopy] = useState("");

  async function copyRecruitment(label: string, copy: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copy);
      } else {
        setFallbackCopy(copy);
        window.setTimeout(() => {
          fallbackRef.current?.select();
          document.execCommand("copy");
        }, 0);
      }
      setCopyStatus(`已复制${label}`);
    } catch {
      setFallbackCopy(copy);
      setCopyStatus("自动复制失败，请选中备用文本手动复制");
      window.setTimeout(() => fallbackRef.current?.select(), 0);
    }
  }

  return (
    <>
      <section id="before-after-examples" className="border-b border-[#14110e]/15 bg-[#f4dfbd] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="before-after-title" data-motion-section>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#8b3a28]">BEFORE / AFTER</p>
              <h2 id="before-after-title" className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#14110e] sm:text-5xl">不是润色，是把证据结构写清楚。</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#5b4635] sm:text-base">以下均为匿名教学示例，不对应真实公司、项目或业务数据。改写只调整对象、判断、动作、口径与贡献边界，不把缺失结果写成既成事实。</p>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {CASES.map((item) => (
              <article key={item.id} className="motion-card flex h-full flex-col border border-[#14110e] bg-[#fffaf0] p-5 shadow-[6px_6px_0_rgba(20,17,14,0.16)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="bg-[#14110e] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-white">{item.audience}</span>
                  <span className="font-mono text-[10px] text-[#80654d]">匿名教学示例</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-7 text-[#14110e]">{item.title}</h3>
                <div className="mt-5 border-l-4 border-[#80654d]/45 bg-white p-4">
                  <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#80654d]">BEFORE</p>
                  <p className="mt-2 text-sm leading-6 text-[#6e5743]">{item.before}</p>
                </div>
                <div className="mt-3 flex-1 border-l-4 border-[#26734d] bg-[#eff9f2] p-4">
                  <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#26734d]">AFTER</p>
                  <p className="mt-2 text-sm leading-6 text-[#273f30]">{item.after}</p>
                </div>
                <button type="button" onClick={() => loadDiagnosticExample(item.after)} className="feedback-button mt-5 w-full border border-[#14110e] px-4 py-3 text-sm font-semibold text-[#14110e] hover:bg-[#14110e] hover:text-white">
                  载入这段脱敏示例并诊断
                </button>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center">
            <a href="#instant-diagnostic" className="font-semibold text-[#c92a20] underline decoration-[#c92a20]/30 underline-offset-4">或从我的经历开始诊断 ↑</a>
          </div>
        </div>
      </section>

      <section id="early-user-recruitment" className="border-b border-[#14110e]/15 bg-[#f8f8f3] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="recruitment-title" data-motion-section>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">FIRST 20 USERS</p>
              <h2 id="recruitment-title" className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#14110e] sm:text-5xl">邀请 20 位产品 / 运营，一起把体检做实用。</h2>
              <p className="mt-5 text-sm leading-7 text-[#6e5743] sm:text-base">免费、本地、不上传经历；只检查证据结构，不替用户编造结果。选择适合的版本，一键复制给同事或朋友。</p>
              <a href="#instant-diagnostic" className="mt-6 inline-flex bg-[#c92a20] px-5 py-3 font-semibold text-white transition hover:bg-[#a92119]">先完成我的免费体检 ↑</a>
            </div>

            <div className="grid gap-4">
              {RECRUITMENT_COPY.map((item) => (
                <article key={item.id} className="motion-card border border-[#14110e]/25 bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#14110e]">{item.label}</h3>
                    <button type="button" onClick={() => void copyRecruitment(item.label, item.copy)} className="feedback-button border border-[#14110e] bg-[#14110e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c92a20]">一键复制</button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#5b4635]">{item.copy}</p>
                </article>
              ))}
              <textarea ref={fallbackRef} readOnly value={fallbackCopy} aria-label="复制失败时的备用招募文案" className={fallbackCopy ? "w-full border border-[#c92a20] bg-white p-3 text-xs leading-5" : "sr-only"} />
              <p role="status" aria-live="polite" className="text-sm font-semibold text-[#80654d]">{copyStatus}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
