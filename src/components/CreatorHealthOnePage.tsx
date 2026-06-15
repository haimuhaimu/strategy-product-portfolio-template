const coreDefinitions = [
  {
    title: "作者收益可持续",
    body: "收益结构健康，收入稳步增长。",
  },
  {
    title: "内容供给不劣化",
    body: "内容质量稳定，持续优质供给。",
  },
  {
    title: "用户信任不受损",
    body: "用户体验良好，信任长期积累。",
  },
];

const monetizationTypes = [
  {
    title: "内容付费型",
    body: "付费内容 / 会员 / 课程",
  },
  {
    title: "广告商单型",
    body: "品牌合作 / 软单内容",
  },
  {
    title: "交易转化型",
    body: "交易带货 / 本地生活 / 小程序交易",
  },
  {
    title: "关系服务型",
    body: "咨询 / 社群 / 私域服务",
  },
  {
    title: "平台激励型",
    body: "任务补贴 / 创作激励 / 活动奖金",
  },
];

const healthQuestions = [
  {
    title: "A. 内容有没有变差？",
    body: "优质率、自然投稿稳定性、互动 / 完播。",
  },
  {
    title: "B. 用户有没有反感？",
    body: "负评率、拉黑 / 取关、举报 / 投诉。",
  },
  {
    title: "C. 变现有没有过度？",
    body: "变现频次、变现内容占比、连续铺垫天数、引流强度。",
  },
  {
    title: "D. 商业效率是否健康？",
    body: "转化率、复购率、退货 / 售后、品牌建设。",
  },
];

const attributionSteps = [
  {
    title: "变现事件识别",
    body: "识别变现行为与节点。",
  },
  {
    title: "同类作者匹配",
    body: "匹配相似作者样本。",
  },
  {
    title: "变现前后对比",
    body: "指标趋势对比分析。",
  },
  {
    title: "PSM/DID 归因",
    body: "识别真实因果影响。",
  },
  {
    title: "健康度评分",
    body: "输出健康度评分。",
  },
];

const valueOutputs = [
  {
    title: "对生态治理",
    body: "沉淀可复用模型框架，支持后续作者价值评估和治理。",
  },
  {
    title: "对作者分层",
    body: "识别健康变现、模式风险、用户反感和内容承接弱等作者类型。",
  },
  {
    title: "对策略协同",
    body: "让推荐、运营、商业化共用同一套健康度标准。",
  },
  {
    title: "对治理落地",
    body: "在过度营销场景下，承接为识别模型和治理动作。",
  },
];

export function CreatorHealthOnePage() {
  return (
    <section className="mt-6 rounded-[8px] border border-[#8b3a28]/18 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 border-b border-[#8b3a28]/18 pb-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-[#c92a20]">作者变现健康度评估体系 · One Page</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-[#14110e]">
            多来源变现下，识别风险 → 因果归因 → 作者分层 → 策略干预
          </h2>
        </div>
        <div className="rounded-[8px] border border-[#8b3a28]/25 bg-[#fff8eb] px-5 py-4 text-base font-semibold text-[#14110e]">
          核心收益：沉淀机制与标准，并落到过度营销识别和治理
        </div>
      </div>

      <div className="grid gap-6 divide-y divide-[#8b3a28]/18">
        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
            <SectionLabel index="1" title="核心定义" />
            <div>
              <div className="grid gap-3 lg:grid-cols-3">
                {coreDefinitions.map((item) => (
                  <InfoCard key={item.title} title={item.title} body={item.body} />
                ))}
              </div>
              <div className="mt-3 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] px-5 py-3 text-center text-lg font-semibold text-[#14110e]">
                健康变现 = 收益增长 × 内容投入 × 用户喜爱
              </div>
            </div>
          </div>
        </section>

        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
            <SectionLabel index="2" title="变现来源五分型" tone="teal" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {monetizationTypes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[8px] border border-teal-200 bg-teal-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-[#14110e]">{item.title}</h3>
                    <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                      风险
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4b3829]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
            <SectionLabel index="3" title="统一健康度四问" />
            <div className="grid gap-3 lg:grid-cols-2">
              {healthQuestions.map((item) => (
                <InfoCard key={item.title} title={item.title} body={item.body} />
              ))}
            </div>
          </div>
        </section>

        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
            <SectionLabel index="4" title="归因引擎" tone="teal" helper="判断是否由变现导致" />
            <div>
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
                {attributionSteps.map((item, index) => (
                  <div key={item.title} className="contents">
                    <InfoCard title={`${index + 1}. ${item.title}`} body={item.body} />
                    {index < attributionSteps.length - 1 ? (
                      <div className="hidden items-center text-lg font-semibold text-teal-700 lg:flex">
                        →
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-[8px] border border-teal-200 bg-teal-50 px-5 py-3 text-center text-base font-semibold text-teal-900">
                区分自然波动、内容周期变化、流量环境变化与变现行为带来的真实影响
              </div>
            </div>
          </div>
        </section>

        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
            <SectionLabel index="5" title="作者分层与策略输出" tone="orange" />
            <div>
              <div className="grid gap-3 lg:grid-cols-2">
                <Quadrant
                  title="模式风险型"
                  body="阶段性滑坡 / 临近引导 / 观察期"
                  tone="orange"
                />
                <Quadrant
                  title="健康变现型"
                  body="放大推荐 / 返传激励 / 标杆沉淀"
                  tone="green"
                />
                <Quadrant
                  title="用户反感型"
                  body="预警降权 / 负反馈治理 / 风险拦截"
                  tone="red"
                />
                <Quadrant
                  title="内容承接弱型"
                  body="选题扶持 / 冷启动包 / 创作激励"
                  tone="blue"
                />
              </div>
              <div className="mt-3 grid gap-2 text-sm text-[#4b3829] sm:grid-cols-2">
                <div className="rounded-[8px] bg-[#fff8eb] px-4 py-3">纵轴：内容生态正贡献，从低到高。</div>
                <div className="rounded-[8px] bg-[#fff8eb] px-4 py-3">横轴：变现行为健康度，从低到高。</div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[9rem_1fr]">
            <SectionLabel index="6" title="价值输出" />
            <div>
              <div className="mb-3 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] px-5 py-3 text-base font-semibold text-[#14110e]">
                不是把收入数字当作结果，而是让平台能持续识别、分层和治理不同类型的变现作者；在过度营销场景下，这套标准已经承接为识别模型和治理动作。
              </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {valueOutputs.map((item) => (
                <InfoCard key={item.title} title={item.title} body={item.body} />
              ))}
            </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function SectionLabel({
  index,
  title,
  tone = "blue",
  helper,
}: {
  index: string;
  title: string;
  tone?: "blue" | "teal" | "orange";
  helper?: string;
}) {
  const toneClass =
    tone === "orange"
      ? "bg-orange-600"
      : tone === "teal"
        ? "bg-teal-700"
        : "bg-[#14110e]";

  return (
    <div className="flex gap-3 lg:block">
      <div className={`grid size-10 shrink-0 place-items-center rounded-[8px] text-lg font-semibold text-[#fff8eb] ${toneClass}`}>
        {index}
      </div>
      <div className="lg:mt-3">
        <h3 className="text-lg font-semibold leading-6 text-[#14110e]">{title}</h3>
        {helper ? <p className="mt-1 text-sm leading-5 text-[#80654d]">{helper}</p> : null}
      </div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4">
      <h3 className="text-base font-semibold text-[#14110e]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#4b3829]">{body}</p>
    </div>
  );
}

function Quadrant({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "orange" | "green" | "red" | "blue";
}) {
  const toneClass = {
    orange: "border-orange-300 bg-orange-50 text-orange-800",
    green: "border-green-300 bg-green-50 text-green-800",
    red: "border-red-300 bg-red-50 text-red-800",
    blue: "border-[#8b3a28]/25 bg-[#fff2d8] text-[#c92a20]",
  }[tone];

  return (
    <div className={`rounded-[8px] border p-5 ${toneClass}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#3a2e24]">{body}</p>
    </div>
  );
}
