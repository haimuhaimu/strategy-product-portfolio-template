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
    title: "AI 作者挖掘",
    body: "基于内容资产、用户需求和历史表现，先生成潜力作者候选池。",
  },
  {
    title: "人工校准边界",
    body: "运营确认哪些作者真的适合付费解锁，避免模型只按热度筛人。",
  },
  {
    title: "自动化投流",
    body: "把冷启验证、放大、观察和复盘拆成流程，减少重复手工跟进。",
  },
  {
    title: "复盘再迭代",
    body: "回收付费转化、用户反馈和作者状态，决定继续放大还是收敛。",
  },
];

const strategyOutputs = [
  "付费潜力作者池",
  "作者生命周期阶段",
  "流量策略匹配表",
  "投流自动化原型",
  "经营复盘口径",
];

export function MembershipBusinessOnePage() {
  return (
    <section className="mt-6 border-2 border-[#14110e] bg-[#f4dfbd] p-4 shadow-[6px_6px_0_#14110e] sm:p-5">
      <div className="grid gap-4 border-b-2 border-[#14110e] pb-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="border-2 border-[#14110e] bg-[#14110e] p-5 text-[#f4dfbd]">
          <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
            精选会员内容付费 · One Page
          </p>
          <h2 className="mt-3 [font-family:var(--font-display)] text-2xl font-semibold leading-tight sm:text-2xl">
            作者挖掘 × 流量策略 × AI 投流自动化
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#f8ead0]">
            这个项目不能包装成已经打穿的增长战役。更真实的说法是：我在一个仍在探索的内容付费业务里，尝试把“哪些作者值得被挖掘、如何验证、如何投流、如何复盘”做成更稳定的工作流。
          </p>
        </div>

        <div className="grid border-2 border-[#8b3a28] bg-[#fff2d8]">
          <BriefRow label="业务本质" text="用户付费解锁内容，不是泛会员运营。" />
          <BriefRow label="我的重点" text="作者挖掘、流量策略，以及 AI 辅助的投流自动化。" />
          <BriefRow label="结果边界" text="业务规模还在探索，现阶段更适合作为经营效率和工具化能力项目。" />
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
            我没有把精选会员讲成一个已经拿到硬结果的大业务，而是讲清楚我在探索期做了什么：先定义可付费作者，再匹配流量策略，最后把重复运营动作交给 AI 和自动化工具承接。
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
