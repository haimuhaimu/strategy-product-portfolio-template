const lifecycleStages = [
  {
    title: "冷启期",
    goal: "发现付费信号",
    action: "小流量验证内容是否真的值得付费解锁。",
  },
  {
    title: "爆发期",
    goal: "放大付费转化",
    action: "在用户反馈可控的前提下放大转化效率。",
  },
  {
    title: "成长期",
    goal: "提升复购留存",
    action: "用关注承接、系列化内容和复购动作接住用户。",
  },
  {
    title: "过载期",
    goal: "控制商业化伤害",
    action: "观察疲劳、负反馈和内容同质化，避免透支信任。",
  },
  {
    title: "IP 稳定期",
    goal: "长期 LTV 经营",
    action: "让优质付费供给沉淀为长期作者经营资产。",
  },
];

const miningSignals = [
  {
    title: "内容资产",
    body: "内容是否稳定、稀缺、有专业壁垒，是否值得被用户反复消费。",
  },
  {
    title: "用户需求",
    body: "用户是否真的有解锁意愿，需求是不是集中在明确垂类或高价值人群里。",
  },
  {
    title: "作者状态",
    body: "作者是否能持续更新，创作成本是否可控，内容寿命是不是足够长。",
  },
  {
    title: "商业风险",
    body: "付费表达是否会打扰用户，是否容易带来疲劳、投诉或内容同质化。",
  },
];

const aiWorkflow = [
  {
    title: "已发生：AI 内容理解",
    body: "理解作者内容并生成付费潜力候选，能力已服务大范围作者群。",
  },
  {
    title: "已发生：业务自助",
    body: "产品和运营可自行完成过去通常依赖数据分析师或算法同学的工作。",
  },
  {
    title: "已发生：策略应用",
    body: "自动化策略已在大范围作者群中实际应用；具体数据已脱敏。",
  },
  {
    title: "今天重做：策略治理",
    body: "补齐版本、复核、回滚和效果归因；这是下一步设想，不是既有成果。",
  },
];

const strategyOutputs = [
  "大范围作者内容理解能力",
  "付费潜力作者挖掘流程",
  "产品运营自助策略能力",
  "自动化策略应用链路",
  "大规模覆盖（具体数据已脱敏）",
];

export function MembershipBusinessOnePage() {
  return (
    <section className="mt-6 border-2 border-[#14110e] bg-[#f4dfbd] p-4 shadow-[6px_6px_0_#14110e] sm:p-5">
      <div className="grid gap-4 border-b-2 border-[#14110e] pb-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="border-2 border-[#14110e] bg-[#14110e] p-5 text-[#f4dfbd]">
          <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
            内容付费 · One Page
          </p>
          <h2 className="mt-3 [font-family:var(--font-display)] text-2xl font-semibold leading-tight sm:text-2xl">
            作者挖掘 × 流量策略 × AI 自动化流量分配
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#f8ead0]">
            已发生的变化是：过去通常需要 1 名数据分析师或 1 名算法同学写 SQL、制定策略；现在产品和运营可借助 AI 内容理解与自动化策略自行完成，服务大范围作者群，相关策略已经实际应用；具体数据已脱敏。
          </p>
        </div>

        <div className="grid border-2 border-[#8b3a28] bg-[#fff2d8]">
          <BriefRow label="业务本质" text="识别可持续供给付费价值的作者，并匹配流量策略。" />
          <BriefRow label="已发生" text="产品和运营自助完成；服务大范围作者群；策略已实际应用；具体数据已脱敏。" />
          <BriefRow label="结果边界" text="具体转化、收入、留存与日期未获公开确认，因此不展示。" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1.2fr_1.05fr]">
        <section className="border-2 border-[#8b3a28] bg-[#fff2d8] p-4">
          <SectionTitle marker="01" title="先判断谁值得做付费" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {miningSignals.map((signal) => (
              <SignalBox key={signal.title} title={signal.title} body={signal.body} />
            ))}
          </div>
        </section>

        <section className="border-2 border-[#8b3a28] bg-[#fff2d8] p-4">
          <SectionTitle marker="02" title="再判断处在哪个阶段" />
          <div className="mt-4 grid gap-2">
            {lifecycleStages.map((stage, index) => (
              <div
                key={stage.title}
                className="grid gap-3 border border-[#8b3a28]/45 bg-[#f8ead0] p-3 sm:grid-cols-[4.5rem_1fr]"
              >
                <div>
                  <span className="block font-mono text-xs font-semibold text-[#c92a20]">
                    STAGE {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-1 text-lg font-semibold text-[#14110e]">
                    {stage.title}
                  </h4>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#14110e]">
                    {stage.goal}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#4b3829]">
                    {stage.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-2 border-[#8b3a28] bg-[#fff2d8] p-4">
          <SectionTitle marker="03" title="把运营动作做成 AI 工作流" />
          <div className="mt-4 grid gap-3">
            {aiWorkflow.map((item, index) => (
              <div
                key={item.title}
                className="relative border-2 border-[#14110e] bg-[#f4dfbd] p-4"
              >
                <span className="absolute right-3 top-3 font-mono text-xs font-semibold text-[#c92a20]">
                  AI {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="pr-16 text-lg font-semibold text-[#14110e]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <section className="border-2 border-[#14110e] bg-[#fff2d8] p-4">
          <SectionTitle marker="04" title="最后留下什么" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {strategyOutputs.map((output, index) => (
              <div
                key={output}
                className="border border-[#8b3a28]/45 bg-[#f8ead0] px-3 py-3 text-sm font-semibold text-[#14110e]"
              >
                <span className="mr-2 font-mono text-[#c92a20]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {output}
              </div>
            ))}
          </div>
        </section>

        <section className="border-2 border-[#14110e] bg-[#14110e] p-4 text-[#f4dfbd]">
          <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
            这个项目的正确讲法
          </p>
          <p className="mt-3 text-lg font-semibold leading-8">
            我把作者挖掘从逐次依赖专业同学的 SQL 和策略支持，转成产品、运营可自助使用的 AI 能力。大规模覆盖和策略实际应用是已发生事实，具体数据已脱敏；版本治理与效果归因是今天重做的下一步。
          </p>
        </section>
      </div>
    </section>
  );
}

function BriefRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid gap-2 border-b border-[#8b3a28]/35 px-4 py-3 last:border-b-0 sm:grid-cols-[5.5rem_1fr]">
      <span className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
        {label}
      </span>
      <span className="text-sm font-semibold leading-6 text-[#14110e]">
        {text}
      </span>
    </div>
  );
}

function SectionTitle({ marker, title }: { marker: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-[#14110e] pb-3">
      <span className="grid size-9 shrink-0 place-items-center border-2 border-[#14110e] bg-[#14110e] font-mono text-xs font-semibold text-[#f4dfbd]">
        {marker}
      </span>
      <h3 className="text-xl font-semibold leading-7 text-[#14110e]">
        {title}
      </h3>
    </div>
  );
}

function SignalBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-[#8b3a28]/45 bg-[#f8ead0] p-4">
      <h4 className="text-lg font-semibold text-[#14110e]">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-[#4b3829]">{body}</p>
    </div>
  );
}
