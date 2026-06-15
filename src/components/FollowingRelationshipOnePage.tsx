const problemCards = [
  {
    title: "这个项目不算性感",
    body: "它不是新业务，也不是大增长战役。但它解决了推荐里一个底层问题：关注关系到底该不该被放大。",
  },
  {
    title: "关注动作有水分",
    body: "用户可能因为一条爆款、一次活动、一个热点点关注，过几天就不看了。",
  },
  {
    title: "真正要做的是降噪",
    body: "不是把关注内容整体加大，而是分清哪些关系还活着，哪些关系已经变成打扰。",
  },
];

const valueDimensions = [
  {
    title: "还看不看",
    items: ["关注后复访", "稳定观看", "推荐中仍点击"],
  },
  {
    title: "会不会回来",
    items: ["主动访问", "评论收藏", "互动反馈"],
  },
  {
    title: "内容还像不像",
    items: ["方向稳定", "兴趣一致", "体裁适配"],
  },
  {
    title: "作者还更不更",
    items: ["更新频率", "作者活跃", "质量稳定"],
  },
  {
    title: "有没有反感",
    items: ["低取关", "低屏蔽", "低负反馈"],
  },
];

const definitionEvolution = [
  {
    title: "1. 先别急着加流量",
    body: "如果所有关注关系都被放大，短期看像是增强关系分发，长期可能是在放大噪声。",
  },
  {
    title: "2. 看关注之后发生了什么",
    body: "关注后还看、还互动、低负反馈，才更像一条有后续价值的关系。",
  },
  {
    title: "3. 把判断交给推荐用",
    body: "最后不是生成一个漂亮标签，而是让召回、排序、混排、推人真的用得上。",
  },
];

const recommendationUses = [
  {
    title: "召回",
    body: "先把用户还会看的作者内容捞出来。",
  },
  {
    title: "排序",
    body: "不是所有关注一视同仁，真关系可以更靠前。",
  },
  {
    title: "混排",
    body: "别让关注内容过度挤占兴趣内容。",
  },
  {
    title: "降噪",
    body: "弱关系、过期关系、负反馈关系少打扰用户。",
  },
  {
    title: "推人",
    body: "少一点盲推，多找后面真会被消费的作者。",
  },
];

const flowSteps = [
  "看关注后行为",
  "拆真关系/弱关系",
  "校准样本",
  "接入推荐",
  "调整推人",
  "复盘 正向增量",
];

const outcomes = [
  {
    value: "正向增量",
    label: "关注关系流量 DAU",
  },
  {
    value: "真关系",
    label: "核心判断从关注动作转向关系价值",
  },
  {
    value: "少打扰",
    label: "让弱关系在推荐里降噪",
  },
];

function SectionLabel({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold text-[#c92a20]">{label}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-normal text-[#14110e]">
          {title}
        </h3>
      </div>
    </div>
  );
}

function SmallList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 grid gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-[#8b3a28]/18 bg-[#fff8eb] px-3 py-2 text-sm font-medium text-[#3a2e24]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FollowingRelationshipOnePage() {
  return (
    <section className="mt-6 rounded-[8px] border border-[#8b3a28]/18 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-[#8b3a28]/18 pb-5">
        <p className="text-sm font-semibold text-[#c92a20]">
          关注关系推荐 · One Page
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-[#14110e]">
          这个项目不性感，但它把一个弱信号讲清了
        </h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-[#4b3829]">
          用户点了关注，不代表这条关系一直有价值。我当时真正想解决的不是“多给关注内容一点流量”，而是让推荐系统知道：哪些关系还值得放大，哪些关系已经该降噪。
        </p>
      </div>

      <section className="mt-5 grid gap-3 lg:grid-cols-3">
        {problemCards.map((card, index) => (
          <div
            key={card.title}
            className={
              index === 2
                ? "rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4"
                : "rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
            }
          >
            <div className="text-xs font-semibold text-[#80654d]">
              0{index + 1}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-[#14110e]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#4b3829]">
              {card.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4">
        <SectionLabel
          label="核心定义"
          title="真关系 = 关注后还在消费 × 作者还在供给 × 用户没有反感"
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {valueDimensions.map((dimension) => (
            <div
              key={dimension.title}
              className="rounded-[8px] border border-white bg-white p-4"
            >
              <h4 className="text-base font-semibold text-[#14110e]">
                {dimension.title}
              </h4>
              <SmallList items={dimension.items} />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.25fr]">
        <section className="rounded-[8px] border border-[#8b3a28]/18 p-4">
          <SectionLabel label="定义优化" title="从“点了关注”到“后面还看”" />
          <div className="grid gap-3">
            {definitionEvolution.map((item) => (
              <div
                key={item.title}
                className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
              >
                <h4 className="text-base font-semibold text-[#14110e]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-[#8b3a28]/18 p-4">
          <SectionLabel label="推荐侧使用" title="让关系信号进推荐，但别乱用" />
          <div className="grid gap-3 md:grid-cols-2">
            {recommendationUses.map((item) => (
              <div
                key={item.title}
                className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
              >
                <h4 className="text-base font-semibold text-[#14110e]">
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

      <section className="mt-5 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4">
        <SectionLabel label="策略链路" title="一条关注关系，先判断，再分发" />
        <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
          {flowSteps.map((step, index) => (
            <div key={step} className="contents">
              <div className="rounded-[8px] border border-white bg-white p-4 text-center">
                <div className="mx-auto grid size-9 place-items-center rounded-full bg-[#14110e] text-sm font-semibold text-[#fff8eb]">
                  {index + 1}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#35291f]">
                  {step}
                </p>
              </div>
              {index < flowSteps.length - 1 ? (
                <div className="hidden items-center text-xl font-semibold text-[#8b3a28] lg:flex">
                  →
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[8px] border border-[#8b3a28]/18 p-4">
        <p className="text-sm font-semibold text-[#c92a20]">结果与沉淀</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <div
              key={outcome.label}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
            >
              <div className="text-2xl font-semibold tracking-normal text-[#14110e]">
                {outcome.value}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                {outcome.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] px-4 py-3 text-center text-sm font-semibold text-[#14110e]">
          我的重点：这个项目没有惊天动地的故事，但它留下了一个很实用的判断：关注动作不等于关系价值，推荐系统应该放大真关系，减少弱关系打扰。
        </div>
      </section>
    </section>
  );
}
