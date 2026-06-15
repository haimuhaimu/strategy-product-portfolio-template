const problemCards = [
  {
    title: "不是 AI 项目",
    body: "当时还没有大模型搜索叙事。更真实的问题是：用户搜完以后，到底有没有少走弯路。",
  },
  {
    title: "模型不是万能解",
    body: "当时有过语义模型探索，但收益有限。很多 bad case 最后还是回到意图、供给和评估标准。",
  },
  {
    title: "Top1 决定体验",
    body: "搜索不像推荐可以慢慢纠偏。很多时候，第一条结果就决定这次搜索是不是成立。",
  },
];

const satisfactionQuestions = [
  {
    title: "用户在找什么？",
    body: "Query 是找事实、教程、视频、事件，还是在问一个可以被直接回答的问题。",
  },
  {
    title: "供给够好吗？",
    body: "没有好内容，排序很难救；有好内容但标准不清，也很难稳定优化。",
  },
  {
    title: "Top1 命中了吗？",
    body: "不是结果列表看起来相关就够了，要看第一条是否真正解决用户问题。",
  },
  {
    title: "要不要直接回答？",
    body: "只有适合直接回答的需求，才应该追求问答式结果、答案可信和可验证。",
  },
];

const workTracks = [
  {
    label: "主线 A",
    title: "视频搜索质量",
    subtitle: "供给标准 × 结果评估 × 排序调优",
    items: [
      "定义哪些视频内容适合进入搜索供给",
      "建立相关性、可消费性、质量稳定性和时效口径",
      "用横向对照和人工评估校准搜索体验",
      "联动算法调优候选、排序和结果准确性",
    ],
  },
  {
    label: "主线 B",
    title: "问答式搜索探索",
    subtitle: "可回答需求 × Top1 命中 × 答案可信",
    items: [
      "识别适合直接回答的搜索需求",
      "把 Top1 精准命中作为核心体验目标，而不是只看列表整体相关性",
      "评估答案是否准确、完整、可信、可验证",
      "用覆盖范围判断问答式结果对搜索满足度的增量",
    ],
  },
];

const flowSteps = [
  "Query 分型",
  "供给补齐",
  "评估标准",
  "排序调优",
  "Top1 命中",
  "答案承接",
];

const outcomes = [
  {
    value: "行业第一",
    label: "多端视频搜索体验",
  },
  {
    value: "双位数比例",
    label: "问答式结果覆盖用户搜索需求",
  },
  {
    value: "达到目标水平",
    label: "综合搜索结果准确性",
  },
];

function SectionHeader({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-[#c92a20]">{label}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-normal text-[#14110e]">
        {title}
      </h3>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-[#3a2e24]">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#14110e]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SearchQualityOnePage() {
  return (
    <section className="mt-6 rounded-[8px] border border-[#8b3a28]/18 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-[#8b3a28]/18 pb-5">
        <p className="text-sm font-semibold text-[#c92a20]">
          搜索质量与问答式搜索 · One Page
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-[#14110e]">
          搜索不是给一堆结果，
          <span className="block">而是让用户少走弯路。</span>
        </h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-[#4b3829]">
          这个项目不要硬讲成今天的大模型项目。当时更真实的问题是：
          用户搜完以后，到底有没有解决问题。我的重点不是证明某个模型很先进，
          而是先定义什么叫搜索满足，再把它转成内容引入、结果评估、排序调优和问答式结果命中的策略动作。
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
        <SectionHeader
          label="核心口径"
          title="搜索满足度四问：意图、供给、Top1、答案"
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {satisfactionQuestions.map((question) => (
            <div
              key={question.title}
              className="rounded-[8px] border border-white bg-white p-4"
            >
              <h4 className="text-base font-semibold text-[#14110e]">
                {question.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#4b3829]">
                {question.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        {workTracks.map((track) => (
          <div
            key={track.title}
            className={
              track.label === "主线 A"
                ? "rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
                : "rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] p-4"
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#c92a20]">
                {track.label}
              </p>
              <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-[#3a2e24]">
                {track.subtitle}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-[#14110e]">
              {track.title}
            </h3>
            <BulletList items={track.items} />
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-[8px] border border-[#8b3a28]/18 p-4">
        <SectionHeader label="策略链路" title="从 Query 到少走弯路的质量链路" />
        <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
          {flowSteps.map((step, index) => (
            <div key={step} className="contents">
              <div className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4 text-center">
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
          我的重点：不是证明某个模型很先进，而是先定义什么叫满足，
          再让模型、供给、排序和问答式结果一起服务这个目标。
        </div>
      </section>
    </section>
  );
}
