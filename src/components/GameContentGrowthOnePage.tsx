const problemCards = [
  {
    title: "游戏不是普通内容品类",
    body: "它表面是视频消费，背后其实是游戏发行：最终要看激活、留存和流水。",
  },
  {
    title: "播放不等于带游戏",
    body: "热视频可能只提供娱乐，不一定让用户点击、下载、试玩或回到游戏里。",
  },
  {
    title: "创作者需要明确任务",
    body: "作者不是自然持续为游戏生产内容，需要把游戏目标翻译成可创作、可激励、可反馈的任务。",
  },
];

const translationLayer = [
  {
    title: "游戏目标",
    body: "小游戏看即时试玩和 DAU，重度游戏看预约、下载、激活和长期留存。",
  },
  {
    title: "内容表达",
    body: "把卖点拆成玩法、爽点、攻略、剧情、挑战和社交话题，而不是只做广告口播。",
  },
  {
    title: "作者供给",
    body: "用任务和激励找到愿意持续生产、且能说清楚游戏价值的作者。",
  },
  {
    title: "推荐分发",
    body: "推荐侧不只看播放互动，还要看内容、作者、人群和游戏转化之间的匹配。",
  },
  {
    title: "结果复盘",
    body: "用点击、下载、激活、留存和流水回看，哪些内容真的把兴趣带成了业务。",
  },
];

const workTracks = [
  {
    label: "主线 A",
    title: "把游戏发行目标翻译成作者任务",
    subtitle: "游戏卖点 / 创作方向 / 激励规则",
    items: [
      "按游戏阶段拆解目标：冷启曝光、预约下载、激活试玩、留存召回",
      "把游戏卖点拆成作者能拍的内容方向，而不是只给一个游戏名称",
      "通过创作者激励机制提升投稿规模、任务承接和内容稳定性",
      "用内容表现和转化反馈，迭代任务设计和作者筛选口径",
    ],
  },
  {
    label: "主线 B",
    title: "把内容热度翻译成游戏转化",
    subtitle: "高转化内容 / 人群匹配 / 漏斗复盘",
    items: [
      "区分播放价值和游戏转化价值，避免只放大热视频",
      "识别更可能带来点击、下载、激活的内容类型、作者和人群",
      "推动推荐分发从内容消费延伸到游戏激活，而不是停在播放层",
      "按游戏、作者、内容类型和流量来源复盘真实贡献",
    ],
  },
];

const funnelSteps = [
  "游戏目标",
  "内容任务",
  "创作者激励",
  "人群分发",
  "激活留存",
  "流水复盘",
];

const scenarioCards = [
  {
    title: "小游戏",
    metric: "百万级规模",
    label: "DAU",
    body: "低门槛、即时体验，内容更像试玩入口，重点承接兴趣点击和快速启动。",
    examples: [
      "超休闲：人生重开模拟器、羊了个羊式扩散",
      "棋牌类：更看复访、留存和熟人局心智",
    ],
  },
  {
    title: "重度游戏",
    metric: "万级规模",
    label: "日激活",
    body: "链路更长，内容更像种草和解释，重点靠预约下载和高意向人群触达。",
    examples: [
      "IP / 世界观：哈利波特魔法觉醒、镇魂街",
      "竞技 / 操作：王牌竞速",
    ],
  },
  {
    title: "归因口径",
    metric: "数亿级",
    label: "可归因年流水",
    body: "统计口径是平台内可归因渠道下载且充值的流水，核心链路是内容带发行，不是纯广告投流。",
    examples: [
      "内容链路提供低成本、高意向发行入口",
      "广告投流当时效率并不是主驱动",
    ],
  },
];

const outcomes = [
  {
    value: "万级规模",
    label: "游戏内容日均产出",
  },
  {
    value: "十亿级规模",
    label: "游戏内容日均播放",
  },
  {
    value: "增长漏斗",
    label: "内容带发行判断口径",
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

export function GameContentGrowthOnePage() {
  return (
    <section className="mt-6 rounded-[8px] border border-[#8b3a28]/18 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-[#8b3a28]/18 pb-5">
        <p className="text-sm font-semibold text-[#c92a20]">
          游戏内容增长 · One Page
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-[#14110e]">
          把内容平台，变成游戏发行的前端漏斗
        </h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-[#4b3829]">
          这个项目真正要解决的不是“多做一些游戏内容”，而是让内容平台能参与游戏发行：把游戏目标翻译成作者任务，把内容热度翻译成激活转化，再用留存和流水判断哪些内容真的有用。
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
          label="核心判断"
          title="我做的是三套语言的翻译：发行目标、内容供给、推荐分发"
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {translationLayer.map((item) => (
            <div
              key={item.title}
              className="rounded-[8px] border border-white bg-white p-4"
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
        <SectionHeader label="增长链路" title="从游戏内容到业务结果的闭环" />
        <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
          {funnelSteps.map((step, index) => (
            <div key={step} className="contents">
              <div className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4 text-center">
                <div className="mx-auto grid size-9 place-items-center rounded-full bg-[#14110e] text-sm font-semibold text-[#fff8eb]">
                  {index + 1}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#35291f]">
                  {step}
                </p>
              </div>
              {index < funnelSteps.length - 1 ? (
                <div className="hidden items-center text-xl font-semibold text-[#8b3a28] lg:flex">
                  →
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <div className="rounded-[8px] border border-[#8b3a28]/18 p-4">
          <SectionHeader label="场景拆解" title="小游戏和重度游戏的转化目标不同" />
          <div className="grid gap-3 md:grid-cols-3">
            {scenarioCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4"
              >
                <h4 className="text-base font-semibold text-[#14110e]">
                  {card.title}
                </h4>
                <div className="mt-3 text-2xl font-semibold tracking-normal text-[#14110e]">
                  {card.metric}
                </div>
                <p className="text-sm font-semibold text-[#80654d]">
                  {card.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4b3829]">
                  {card.body}
                </p>
                <div className="mt-4 space-y-2 border-t border-[#8b3a28]/18 pt-3">
                  {card.examples.map((example) => (
                    <p
                      key={example}
                      className="text-xs font-medium leading-5 text-[#80654d]"
                    >
                      {example}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-[#8b3a28]/18 p-4">
          <p className="text-sm font-semibold text-[#c92a20]">
            结果与沉淀
          </p>
          <div className="mt-3 grid gap-3">
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
        </div>
      </section>

      <div className="mt-5 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] px-4 py-3 text-center text-sm font-semibold text-[#14110e]">
        我的重点：不是把游戏内容做热，而是判断哪些内容、作者和人群，真的能把一次观看变成一次游戏行动。
      </div>
    </section>
  );
}
