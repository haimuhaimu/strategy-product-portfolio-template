const workflowCards = [
  {
    label: "01 / 探索中",
    title: "内容付费作者挖掘与流量分配自动化",
    truth:
      "这个方向还不能包装成“业务已经全面解决”。更准确地说，我在做的是把作者筛选、付费潜力判断和流量分配动作从运营经验里拆出来。",
    made:
      "用 AI 辅助识别有付费供给潜力的作者，再把流量分配、观察、复盘这些重复动作做成自动化流程。",
    proof:
      "价值先体现在经营效率和策略一致性上，业务规模还在继续探索。",
    tags: ["作者挖掘模型", "付费潜力", "自动化流量分配"],
  },
  {
    label: "02 / 工具化",
    title: "作者收入诊断 Agent",
    truth:
      "运营和管理者面对作者收入问题时，最难的不是看一个收入数，而是快速判断：这个作者靠什么赚钱，处在什么阶段，卡点在哪里。",
    made:
      "我把作者收入体系做成可对话的诊断工具，让它能帮助定位变现方式、作者阶段、收入问题和下一步经营方向。",
    proof:
      "这不是炫技型 Agent，而是把作者变现里的判断口径，变成团队可以调用的工作流。",
    tags: ["收入诊断", "作者阶段", "经营建议"],
  },
];

const checkpoints = [
  "先把问题讲清楚",
  "再定义判断口径",
  "接着让 AI 承接重复判断",
  "最后进入运营动作",
];

export function AiWorkflowExperiments() {
  return (
    <section id="ai-workflows" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#f4dfbd] p-3 shadow-[0_20px_56px_rgba(20,17,14,0.12)] sm:p-4">
        <div className="grid gap-4 border-b border-[#14110e]/18 pb-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              AI 工作流实验
            </p>
            <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight text-[#14110e] sm:text-3xl">
              我现在做的，是把判断变成可调用工具。
            </h2>
          </div>
          <p className="text-[0.95rem] leading-7 text-[#3a2e24]">
            我不想把 AI 写成一个新标签。更真实的表达是：过去我在定义作者价值、内容价值、搜索满足和流量策略；现在我在尝试把这些判断做成运营、管理者和 AI 都能调用的工作流。
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {workflowCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4 shadow-[0_14px_34px_rgba(20,17,14,0.1)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
                    {card.label}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-7 text-[#14110e]">
                    {card.title}
                  </h3>
                </div>
                <span className="rounded-[6px] border border-[#c92a20]/25 bg-[#14110e] px-3 py-1.5 font-mono text-xs font-semibold text-[#fff8eb]">
                  AI FLOW
                </span>
              </div>

              <div className="mt-4 grid gap-2.5 text-[0.86rem] leading-[1.62] text-[#35291f]">
                <WorkflowLine label="真实边界" text={card.truth} />
                <WorkflowLine label="做成什么" text={card.made} />
                <WorkflowLine label="怎么证明" text={card.proof} />
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#8b3a28]/18 pt-3">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[6px] border border-[#8b3a28]/20 bg-[#f8ead0] px-2.5 py-1 text-xs font-semibold text-[#5b4635]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-[8px] border border-[#14110e] bg-[#14110e] p-4 text-[#fff8eb]">
          <div className="grid gap-3 lg:grid-cols-[13rem_1fr] lg:items-center">
            <p className="font-mono text-sm font-semibold uppercase text-[#e13024]">
              我的判断顺序
            </p>
            <div className="grid gap-2 sm:grid-cols-4">
              {checkpoints.map((checkpoint, index) => (
                <div
                  key={checkpoint}
                  className="rounded-[6px] border border-[#fff8eb]/18 bg-[#fff8eb]/5 px-3 py-2 text-[0.86rem] font-semibold"
                >
                  <span className="mr-2 font-mono text-[#e13024]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {checkpoint}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowLine({ label, text }: { label: string; text: string }) {
  return (
    <p>
      <span className="mr-2 rounded-[4px] border border-[#8b3a28]/18 bg-[#fff2d8] px-1.5 py-0.5 text-[0.72rem] font-semibold text-[#c92a20]">
        {label}：
      </span>
      {text}
    </p>
  );
}
