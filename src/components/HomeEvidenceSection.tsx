const evidenceItems = [
  {
    question: "好内容，为什么没有被看见？",
    judgment:
      "图文和经验内容不是低配视频，而是另一种消费需求。场景拆清楚后，流量才有分发依据。",
    proof: "图文 DAU 百万级增量｜频道 DAU 千万级规模",
  },
  {
    question: "好作者，凭什么拿更多流量？",
    judgment:
      "在营销和商单场景里，我先定义什么叫优质作者，再用实验验证流量倾斜是不是值得。",
    proof: "优质作者样本：商单收入 +X%｜交易内容 GMV +Z%",
  },
  {
    question: "用户在搜什么，系统真的懂吗？",
    judgment:
      "搜索不是把结果排出来就结束。很多需求其实是在问一个可以被直接回答的问题。",
    proof: "问答式搜索覆盖双位数比例的搜索需求",
  },
  {
    question: "内容热闹，能不能变成业务？",
    judgment:
      "游戏内容不能只看播放，还要看它能不能带来激活、留存和真实付费。",
    proof: "小游戏 DAU 百万级规模｜重度游戏日激活 万级规模｜可归因流水 数亿级",
  },
];

export function HomeEvidenceSection() {
  return (
    <section className="border-y border-[#211915] bg-[#fbf6ec] py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <div>
            <p className="text-sm font-semibold text-[#7a1f17]">
            我反复处理的 4 类误判
          </p>
            <h2 className="mt-3 [font-family:var(--font-display)] text-3xl font-semibold tracking-normal text-[#17120f] sm:text-4xl">
            数字是结果，判断才是起点。
          </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-[#3b332c] lg:pt-7">
            我更在意的是：一个容易被看错的问题，最后有没有被拆成标准、
            实验和推荐 / 搜索 / 商业化系统能用的动作。
          </p>
        </div>

        <div className="mt-8 border-y border-[#211915]">
          {evidenceItems.map((item, index) => (
            <article
              key={item.question}
              className="grid gap-4 border-b border-[#211915]/20 py-5 last:border-b-0 lg:grid-cols-[5rem_1fr_1.1fr_0.85fr] lg:items-start"
            >
              <div className="text-sm font-semibold text-[#7a1f17]">
                0{index + 1}
              </div>
              <p className="text-lg font-semibold leading-7 text-[#17120f]">
                {item.question}
              </p>
              <p className="text-sm leading-7 text-[#5c5147]">
                {item.judgment}
              </p>
              <div className="border-t border-[#211915]/15 pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <p className="text-xs font-semibold text-[#6f6256]">
                  证据
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#17120f]">
                  {item.proof}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
