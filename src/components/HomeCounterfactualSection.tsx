const counterfactualSteps = [
  {
    title: "先看缺口",
    body: "用户、作者或广告主是不是已经在用别的方式绕路满足需求。",
  },
  {
    title: "再定义价值",
    body: "不是谁声量大就扶持谁，而是看它能不能留下真实供给和信任。",
  },
  {
    title: "最后进系统",
    body: "判断如果不能变成标签、指标、实验和策略，就很难真正改变分发。",
  },
];

export function HomeCounterfactualSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="border-y border-[#211915] py-8">
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <div>
            <p className="text-sm font-semibold text-[#7a1f17]">
              编辑手记
            </p>
            <p className="mt-3 text-sm leading-7 text-[#6f6256]">
              这是我做内容生态和推荐策略时，经常拿来校准自己的一个问题。
            </p>
          </div>

          <div>
            <h2 className="[font-family:var(--font-display)] text-3xl font-semibold leading-tight tracking-normal text-[#17120f] sm:text-5xl">
              不是图文社区产品怎么做，
              <span className="block">
                而是内容平台不做什么，未来会长出一个图文社区产品。
              </span>
            </h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-[#3b332c]">
              这句话对我的提醒是：策略不是抄外部答案，而是判断平台缺口。
              图文、搜索、关注关系、作者变现，本质上都在问同一件事：
              哪些真实需求，正在被现有系统漏掉。
            </p>

            <div className="mt-8 grid border-t border-[#211915]/25 lg:grid-cols-3">
            {counterfactualSteps.map((step, index) => (
              <div
                key={step.title}
                  className="border-b border-[#211915]/20 py-5 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0"
              >
                  <div className="text-sm font-semibold text-[#7a1f17]">
                  0{index + 1}
                </div>
                  <p className="mt-3 font-semibold text-[#17120f]">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5c5147]">
                    {step.body}
                  </p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
