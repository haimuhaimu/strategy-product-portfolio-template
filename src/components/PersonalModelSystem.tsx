import type {
  Influence,
  InfluenceStatus,
  PersonalOperatingSystem as PersonalOperatingSystemData,
  TrainingHistory,
} from "@/types/project";

type PersonalModelSystemProps = {
  operatingSystem: PersonalOperatingSystemData;
  influences: Influence[];
  trainingHistory: TrainingHistory[];
};

const statusMeta: Record<InfluenceStatus, { label: string; className: string }> = {
  retained: {
    label: "保留",
    className: "border-[#14110e] bg-[#14110e] text-[#fff8eb]",
  },
  revised: {
    label: "修正",
    className: "border-[#c92a20] bg-[#c92a20] text-[#fff8eb]",
  },
  pending: {
    label: "待验证",
    className: "border-[#c92a20] bg-[#fff2d8] text-[#c92a20]",
  },
  applied: {
    label: "应用中",
    className: "border-[#286246] bg-[#e2efe4] text-[#286246]",
  },
};

const influenceType = {
  work: "作品",
  person: "人物",
  method: "方法",
  experience: "经历",
} as const;

const weightLabel = {
  high: "高权重",
  medium: "中权重",
  low: "低权重",
} as const;

export function PersonalModelSystem({
  operatingSystem,
  influences,
  trainingHistory,
}: PersonalModelSystemProps) {
  return (
    <section
      id="personal-model"
      className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8"
    >
      <div className="rounded-[8px] border border-[#14110e] bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="grid gap-4 border-b border-[#14110e]/25 pb-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Personal Model / v.current
            </p>
            <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight text-[#14110e] sm:text-3xl">
              个人认知操作系统
            </h2>
          </div>
          <p className="border-l-2 border-[#c92a20] pl-4 text-[0.95rem] leading-7 text-[#3a2e24]">
            把“我是谁、为何行动、如何更新”写成可观察的数据，而不是固定的人设。
          </p>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          <ModelColumn title="人物模型" code="01 / INPUT">
            {operatingSystem.personModel.map((item) => (
              <article key={item.dimension} className="border-t border-[#14110e]/15 pt-3 first:border-0 first:pt-0">
                <h3 className="font-semibold text-[#14110e]">{item.dimension}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#4b3829]">{item.observation}</p>
                <p className="mt-2 border-l-2 border-[#c92a20] pl-3 text-xs leading-5 text-[#8b3a28]">
                  → {item.implication}
                </p>
              </article>
            ))}
          </ModelColumn>

          <ModelColumn title="奖励函数" code="02 / REWARD">
            {operatingSystem.rewardFunction.map((item) => (
              <article key={item.signal} className="border-t border-[#14110e]/15 pt-3 first:border-0 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-[#14110e]">{item.signal}</h3>
                  <span className="shrink-0 rounded-full border border-[#c92a20]/40 px-2 py-0.5 font-mono text-[0.65rem] text-[#c92a20]">
                    {weightLabel[item.weight]}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#4b3829]">护栏：{item.guardrail}</p>
              </article>
            ))}
          </ModelColumn>

          <ModelColumn title="行动策略" code="03 / POLICY">
            {operatingSystem.actionStrategy.map((item) => (
              <article key={item.trigger} className="border-t border-[#14110e]/15 pt-3 first:border-0 first:pt-0">
                <p className="font-mono text-[0.68rem] font-semibold uppercase text-[#8b3a28]">IF · {item.trigger}</p>
                <p className="mt-1.5 text-sm font-semibold leading-6 text-[#14110e]">THEN · {item.action}</p>
                <p className="mt-1.5 text-xs leading-5 text-[#4b3829]">反馈：{item.feedback}</p>
              </article>
            ))}
          </ModelColumn>
        </div>

        <div className="mt-5 grid gap-5 border-t border-[#14110e]/25 pt-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <SectionHeading code="INFLUENCE SET" title="影响来源与当前状态" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {influences.map((item) => {
                const status = statusMeta[item.status];
                return (
                  <article key={item.name} className="rounded-[6px] border border-[#14110e]/35 bg-[#fffdf8] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[0.65rem] font-semibold uppercase text-[#8b3a28]">{influenceType[item.type]}</p>
                        <h3 className="mt-1 font-semibold text-[#14110e]">{item.name}</h3>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#4b3829]">{item.takeaway}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div>
            <SectionHeading code="TRAINING LOG" title="个人模型训练史" />
            <ol className="mt-3 space-y-3">
              {trainingHistory.map((item) => (
                <li key={item.stage} className="rounded-[6px] border border-[#14110e]/35 bg-[#f4dfbd] p-3">
                  <p className="font-mono text-[0.65rem] font-semibold uppercase text-[#c92a20]">{item.period}</p>
                  <h3 className="mt-1 font-semibold text-[#14110e]">{item.stage}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#4b3829]">训练数据：{item.trainingData}</p>
                  <p className="mt-2 border-l-2 border-[#c92a20] pl-3 text-sm leading-6 text-[#14110e]">{item.modelUpdate}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModelColumn({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[6px] border border-[#14110e]/40 bg-[#fffdf8] p-4">
      <SectionHeading code={code} title={title} />
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function SectionHeading({ code, title }: { code: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-[0.65rem] font-semibold uppercase text-[#c92a20]">{code}</p>
      <h3 className="mt-1 text-lg font-semibold text-[#14110e]">{title}</h3>
    </div>
  );
}
