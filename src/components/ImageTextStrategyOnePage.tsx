const scenes = [
  {
    label: "01",
    title: "单列主推荐场景",
    subtitle: "在短视频主推荐场景中证明图文能被有效消费",
    tension: "这里最容易被误判：图文没有播放、完播这些视频信号，不代表它没有价值。",
    strategy: "重新看阅读停留、滑动、收藏、搜索承接和负反馈，而不是只套短视频推荐逻辑。",
    proof: "图文 DAU 显著增长（具体数据已脱敏）",
  },
  {
    label: "02",
    title: "双列图文场景",
    subtitle: "验证图文更适合浏览发现的消费链路",
    tension: "双列不是把内容换个样式摆出来，而是用户先看封面标题，再选择阅读，再收藏或继续探索。",
    strategy: "围绕封面、标题、主题、画风、兴趣匹配和候选集组织，提升用户发现效率。",
    proof: "频道 DAU 达到大规模覆盖（具体数据已脱敏）",
  },
  {
    label: "03",
    title: "UGC 图文社区",
    subtitle: "从主要分发场景的体裁增长，走到独立社区冷启动",
    tension: "独立社区早期最难的不是扩大流量，而是用户第一眼能不能看到稳定、匹配、有消费价值的内容。",
    strategy: "建设内容池、频道候选集、新用户兴趣画像和首次浏览承接路径，让社区能开始运转。",
    proof: "社区 DAU 达到大规模覆盖（具体数据已脱敏）",
  },
];

const signals = [
  "信息密度",
  "收藏价值",
  "搜索承接",
  "封面标题",
  "画风审美",
  "互动反馈",
  "兴趣画像",
  "社区冷启",
];

const sceneMap = [
  ["视频补充", "独立体裁"],
  ["单点加量", "场景拆解"],
  ["经验判断", "系统信号"],
];

export function ImageTextStrategyOnePage() {
  return (
    <section className="mt-6 overflow-hidden rounded-[8px] border border-[#8b3a28]/18 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#14110e] p-6 text-[#fff8eb] sm:p-8">
          <p className="text-sm font-semibold text-[#e13024]">
            图文体裁价值验证 · One Page
          </p>
          <h2 className="mt-3 [font-family:var(--font-display)] text-2xl font-semibold leading-tight tracking-normal sm:text-3xl">
            图文不是视频补充，
            <span className="block">它需要被独立验证。</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-[#d8c9b4]">
            我参与这个项目比较早。早期真正难的不是“给图文一点流量”，
            而是平台要先回答：图文到底是不是一个值得独立建设的新体裁，
            应该用什么信号评价，又该被分发到哪里。
          </p>

          <div className="mt-8 grid gap-3">
            {sceneMap.map(([from, to], index) => (
              <div
                key={`${from}-${to}`}
                className="grid grid-cols-[2.5rem_1fr_auto_1fr] items-center gap-3 border border-white/10 bg-white/[0.06] p-3"
              >
                <span className="text-sm font-semibold text-[#80654d]">
                  0{index + 1}
                </span>
                <span className="text-sm font-semibold text-[#fff8eb]">
                  {from}
                </span>
                <span className="text-[#80654d]">→</span>
                <span className="text-sm font-semibold text-[#fff8eb]">{to}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#fbfaf7] p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {scenes.map((scene) => (
              <article
                key={scene.title}
                className="flex min-h-[28rem] flex-col justify-between rounded-[8px] border border-[#8b3a28]/25 bg-white p-5 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-normal text-[#8b3a28]">
                      场景
                    </span>
                    <span className="rounded-full bg-[#14110e] px-3 py-1 text-xs font-semibold text-[#fff8eb]">
                      {scene.label}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight text-[#14110e]">
                    {scene.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#c92a20]">
                    {scene.subtitle}
                  </p>

                  <div className="mt-5 border-l-2 border-[#14110e] pl-4">
                    <p className="text-sm leading-7 text-[#3a2e24]">
                      {scene.tension}
                    </p>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#4b3829]">
                    {scene.strategy}
                  </p>
                </div>

                <div className="mt-6 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] p-4">
                  <p className="text-xs font-semibold text-[#80654d]">结果证据</p>
                  <p className="mt-2 text-2xl font-semibold text-[#14110e]">
                    {scene.proof}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-[#8b3a28]/18 p-5 sm:p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold text-[#c92a20]">统一方法层</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-normal text-[#14110e]">
            不是三个孤立增长项目，而是把新体裁价值拆清楚
          </h3>
          <p className="mt-4 text-base leading-8 text-[#4b3829]">
            单列、双列、社区的目标不同，但底层都依赖同一件事：
            先定义图文在这个场景里为什么有价值，再把它翻译成推荐和流量系统能用的信号。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {signals.map((signal) => (
            <div
              key={signal}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fff8eb] px-4 py-4 text-center text-sm font-semibold text-[#35291f]"
            >
              {signal}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b3a28]/18 bg-[#fff8eb] px-5 py-4 text-center text-base font-semibold leading-8 text-[#14110e] sm:px-6">
        我在这个项目里的价值，不是单独完成所有增长，而是作为早期成员，把图文从“视频补充体裁”推进成可独立评估、分发和经营的内容形态。
      </div>
    </section>
  );
}
