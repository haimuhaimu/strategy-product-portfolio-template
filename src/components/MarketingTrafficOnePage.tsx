const problemCards = [
  {
    title: "核心矛盾",
    items: [
      "优质作者品牌合作内容少、流量少、收入低",
      "作者长期留存和投稿意愿被削弱",
      "商业内容供给结构容易失衡",
    ],
  },
  {
    title: "分歧来源",
    items: [
      "担心影响整体分发效率",
      "担心流量倾斜造成生态失衡",
      "本质是缺少因果证据",
    ],
  },
  {
    title: "验证目标",
    items: [
      "证明给优质作者更多品牌合作内容流量是否成立",
      "同时观察作者收入和用户体验",
      "为长期机制提供实验依据",
    ],
  },
];

const valueSystem = [
  {
    title: "传统指标",
    body: "粉丝量 / 播放量 / 点赞量 / 完播率",
  },
  {
    title: "价值体系 2.0",
    body: "高价值用户覆盖 / 内容质量 / 商业适配度 / 历史变现 / 投稿稳定性 / 负向反馈率",
  },
];

const experimentCards = [
  {
    title: "品牌合作内容场景",
    body: "优质作者池 → 随机分组 → 流量倾斜验证 → 对比作者收入、用户体验护栏、投稿供给变化",
  },
  {
    title: "交易内容场景",
    body: "优质作者池 → 随机分组 → 流量倾斜验证 → 对比 VV、GMV、投稿供给变化",
  },
  {
    title: "验证边界",
    body: "控制基础流量、作者分层与用户体验护栏；具体周期、样本量和提升比例未公开。",
  },
];

const resultCards = [
  {
    title: "分组验证",
    metrics: [
      { label: "已验证场景", value: "2 类" },
      { label: "用户体验", value: "设置护栏" },
    ],
    note: "品牌合作内容与交易内容分别验证，不用未经确认的比例替代结论。",
  },
  {
    title: "机制承接",
    metrics: [
      { label: "策略状态", value: "已应用" },
      { label: "结果边界", value: "不披露未确认比例" },
    ],
    note: "验证结论进入评级、分层流量和反馈调优机制。",
  },
];

const mechanismCards = [
  {
    title: "优质品牌合作内容评级体系",
    body: "沉淀作者与品牌合作内容的评级标准。",
  },
  {
    title: "分层流量倾斜策略",
    body: "按作者价值和品牌合作内容质量分配推荐增量。",
  },
  {
    title: "优质内容加权曝光",
    body: "提升优质商业内容的冷启和分发效率。",
  },
  {
    title: "反馈驱动动态调优",
    body: "根据实验和线上表现持续迭代机制。",
  },
];

const impactCards = [
  {
    title: "对作者",
    items: ["按价值口径进入候选池", "获得可验证的品牌合作内容与流量机会", "反馈进入后续分层"],
  },
  {
    title: "对平台",
    items: ["形成商业内容评级", "用实验而非观点决策", "把结论沉淀为策略机制"],
  },
  {
    title: "对用户",
    items: ["体验指标作为护栏", "不默认放大所有商业内容", "负向反馈约束策略"],
  },
];

const loopSteps = [
  "精准识别优质作者与内容",
  "流量倾斜实验验证",
  "收入提升与供给增加",
  "生态策略体验提升",
];

function SectionTitle({
  index,
  title,
}: {
  index: number;
  title: string;
}) {
  return (
    <div className="rounded-t-[8px] bg-[#14110e] px-4 py-3 text-center text-sm font-semibold text-[#fff8eb]">
      {index}. {title}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="text-sm leading-6 text-[#3a2e24]">
          <span className="mr-2 font-semibold text-[#14110e]">·</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function MarketingTrafficOnePage() {
  return (
    <section className="mt-6 rounded-[8px] border border-[#8b3a28]/18 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-[#8b3a28]/18 pb-5">
        <p className="text-sm font-semibold text-[#c92a20]">
          高质量商业内容项目 · One Page
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-[#14110e]">
          用实验证明“给优质作者更多流量”是对的
        </h2>
        <p className="mt-3 text-base leading-7 text-[#4b3829]">
          通过作者价值体系 2.0 + 分组实验验证 + 机制化落地，构建可持续的优质商业内容生态。
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.08fr_1.12fr_1.7fr_1fr_1fr]">
        <section className="rounded-[8px] border border-[#8b3a28]/18">
          <SectionTitle index={1} title="问题与目标" />
          <div className="space-y-4 p-4">
            {problemCards.map((card) => (
              <div key={card.title} className="border-b border-[#8b3a28]/18 pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-base font-semibold text-[#14110e]">
                  {card.title}
                </h3>
                <BulletList items={card.items} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-[#8b3a28]/18">
          <SectionTitle index={2} title="解决方案" />
          <div className="space-y-4 p-4">
            <div>
              <h3 className="text-base font-semibold text-[#14110e]">
                构建作者价值体系 2.0
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                从“结果指标”升级到“价值指标”，让流量倾斜有可解释的作者筛选口径。
              </p>
            </div>
            <div className="grid gap-3">
              {valueSystem.map((item, index) => (
                <div
                  key={item.title}
                  className={
                    index === 0
                      ? "rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
                      : "rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4"
                  }
                >
                  <h4 className="text-sm font-semibold text-[#14110e]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4">
              <h4 className="text-sm font-semibold text-[#14110e]">
                设计分组实验验证
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                在品牌合作内容、交易内容两个核心场景并行验证：通过分组实验验证流量倾斜。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[8px] border border-[#8b3a28]/18">
          <SectionTitle index={3} title="实验设计" />
          <div className="space-y-4 p-4">
            {experimentCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
              >
                <h3 className="text-base font-semibold text-[#14110e]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                  {card.body}
                </p>
              </div>
            ))}
            <div className="grid gap-3 md:grid-cols-4">
              {["作者分层", "流量倾斜", "护栏指标", "统计方法"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] px-3 py-4 text-center text-sm font-semibold text-[#14110e]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[8px] border border-[#8b3a28]/18">
          <SectionTitle index={4} title="实验结果" />
          <div className="space-y-4 p-4">
            {resultCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4"
              >
                <h3 className="text-base font-semibold text-[#14110e]">
                  {card.title}
                </h3>
                <div className="mt-3 space-y-3">
                  {card.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-2xl font-semibold tracking-normal text-[#c92a20]">
                        {metric.value}
                      </div>
                      <div className="text-sm leading-5 text-[#4b3829]">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#4b3829]">
                  {card.note}
                </p>
              </div>
            ))}
            <div className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4 text-sm leading-6 text-[#3a2e24]">
              作品集仅保留两类场景完成验证及策略已应用的事实；具体比例、收入、周期与样本量未获公开确认。
            </div>
          </div>
        </section>

        <section className="rounded-[8px] border border-[#8b3a28]/18">
          <SectionTitle index={5} title="机制化落地" />
          <div className="space-y-3 p-4">
            {mechanismCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
              >
                <h3 className="text-sm font-semibold text-[#14110e]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h3 className="text-base font-semibold text-[#14110e]">
              价值与影响
            </h3>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {impactCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[8px] border border-white bg-white p-4"
                >
                  <h4 className="text-sm font-semibold text-[#14110e]">
                    {card.title}
                  </h4>
                  <BulletList items={card.items} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#14110e]">
              数据驱动的闭环迭代
            </h3>
            <div className="mt-3 grid gap-2">
              {loopSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid grid-cols-[2rem_1fr] items-center gap-3 rounded-[8px] border border-white bg-white p-3"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-[#14110e] text-sm font-semibold text-[#fff8eb]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#35291f]">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[8px] border border-[#8b3a28]/18 bg-white px-4 py-3 text-center text-sm font-semibold text-[#14110e]">
          方法论沉淀：用实验结果而不是观点推动决策，并把结论复用到多个生态策略项目。
        </div>
      </section>
    </section>
  );
}
