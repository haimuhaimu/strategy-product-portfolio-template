const thinkingCards = [
  {
    mark: "↻",
    title: "反馈回路",
    body: "好的工作不是持续消耗，而是让投入、判断和结果之间形成清晰反馈。我的项目沉淀，本质上是在重新建立这种反馈回路。",
  },
  {
    mark: "◇",
    title: "价值识别",
    body: "从搜索质量、图文推荐、关注关系到作者变现，我长期做的是同一件事：识别复杂内容生态里的真实价值，并把它转化为可评估标准。",
  },
  {
    mark: "▦",
    title: "组织系统",
    body: "资源决定业务下限，组织决定业务上限。很多问题不是个体不努力，而是目标、角色、反馈和协作机制没有形成稳定合力。",
  },
  {
    mark: "AI",
    title: "AI共识",
    body: "AI 不只是效率工具。它正在成为新的判断接口，帮助人类更好地表达、评估、理解和形成共识。",
  },
];

export function BehindTheWork() {
  return (
    <section
      id="behind-the-work"
      className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8"
    >
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="mb-5 grid gap-4 border-b border-[#14110e]/18 pb-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Thinking System
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#14110e]">
              Behind the Work｜我的思考底层
            </h2>
          </div>
          <p className="text-[0.95rem] leading-7 text-[#3a2e24]">
            我长期关注一个问题：在复杂系统里，价值如何被识别、被验证、被分发，并最终被现实回应。
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {thinkingCards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-[6px] border border-[#8b3a28]/18 bg-[#f8ead0] text-sm font-semibold text-[#14110e]"
                >
                  {card.mark}
                </span>
                <span className="font-mono text-xs font-semibold text-[#c92a20]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-normal text-[#14110e]">
                {card.title}
              </h3>
              <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-[8px] border border-[#8b3a28]/18 bg-[#fff2d8] px-4 py-3 text-[0.95rem] font-semibold leading-7 text-[#14110e]">
          我希望把过去的业务判断能力，进一步沉淀为 AI 时代的内容评估、作者价值建模和策略诊断能力。
        </div>
      </div>
    </section>
  );
}
