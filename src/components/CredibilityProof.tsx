const proofCards = [
  {
    title: "我先问谁变好了",
    body: "一个项目不先讲指标，先讲它让用户、作者、广告主还是平台哪一方变好了。这个问题说不清，指标再漂亮也容易虚。",
  },
  {
    title: "我负责把问题讲清楚",
    body: "我不把自己包装成每个项目的最终 owner。很多时候，我做的是把模糊问题拆成团队能验证、能执行的口径。",
  },
  {
    title: "我把判断交给系统",
    body: "好的判断不能只停在 PPT 里。它要变成标签、实验、分层、推荐信号、运营规则，最后真的被别人使用。",
  },
  {
    title: "我知道结果边界",
    body: "我不会把团队结果都说成个人功劳。更重要的是讲清楚：我负责哪一段，这一段为什么对最后结果有用。",
  },
];

export function CredibilityProof() {
  return (
    <section id="credibility" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="mb-5 grid gap-4 border-b border-[#14110e]/18 pb-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Why Trust Me
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#14110e]">
              我怎么证明自己靠谱
            </h2>
          </div>
          <p className="text-[0.95rem] leading-7 text-[#3a2e24]">
            我不想把这些项目讲成“都是我一个人做成的”。更真实的说法是：我在复杂问题里负责提出判断、定义口径，并推动它进入团队协作和系统策略。
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {proofCards.map((card, index) => (
            <div
              key={card.title}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-semibold text-[#c92a20]">
                  0{index + 1}
                </span>
                <span className="h-px flex-1 bg-[#8b3a28]/18" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#14110e]">
                {card.title}
              </h3>
              <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
