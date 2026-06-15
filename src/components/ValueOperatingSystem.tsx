const valueLoops = [
  {
    title: "看见价值",
    body: "先问清楚：谁的价值被低估了，谁的价值被系统错误放大了。",
    proof: "关注关系、图文体裁、作者变现",
  },
  {
    title: "验证价值",
    body: "不要只相信感觉，用标注、实验、归因和边界样本把判断校准。",
    proof: "分组实验、人工标注、搜索满足度",
  },
  {
    title: "交给系统",
    body: "好的判断不能只留在 PPT 里，要变成标签、排序、流量规则和运营动作。",
    proof: "推荐 / 运营 / 商业化三方共用",
  },
  {
    title: "留下复利",
    body: "一次项目会结束，但好的口径应该能被下一次业务、下一套模型继续使用。",
    proof: "价值评估、AI Judge、Field Notes",
  },
];

const anchors = [
  "用户少被打扰",
  "作者获得可持续收入",
  "广告主拿到健康转化",
  "平台减少短视激励",
];

export function ValueOperatingSystem() {
  return (
    <section id="value-os" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e] bg-[#14110e] p-4 text-[#fff8eb] shadow-[0_18px_48px_rgba(20,17,14,0.16)] sm:p-5">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#e13024]">
              Value Operating System
            </p>
            <h2 className="mt-3 [font-family:var(--font-display)] text-2xl font-semibold leading-tight tracking-normal sm:text-3xl">
              我真正想沉淀的，不是项目清单。
            </h2>
            <p className="mt-4 text-[0.95rem] leading-7 text-[#d8c9b4]">
              是一套判断复杂内容系统的方式：价值怎么被看见，怎么被验证，怎么进入推荐、运营和商业化系统，最后怎么变成长期复利。
            </p>

            <div className="mt-6 border-l-2 border-[#c92a20] pl-4">
              <p className="[font-family:var(--font-display)] text-xl font-semibold leading-8">
                如果一个项目只带来一次指标提升，它还不够好。真正值得留下的，是下一次还能用的判断口径。
              </p>
            </div>

            <div className="mt-5 rounded-[8px] border border-[#fff8eb]/18 bg-[#fff8eb]/5 p-4">
              <div className="font-mono text-xs font-semibold uppercase tracking-normal text-[#e13024]">
                Counterfactual Lens
              </div>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#fff8eb]">
                一个合作同事说过一句话，我很认同：我们今天要判断的，不是“图文社区产品怎么做”，而是如果内容平台不做什么，未来会不会长出一个图文社区产品。
              </p>
              <p className="mt-3 text-[0.84rem] leading-6 text-[#d8c9b4]">
                这句话提醒我，策略不是跟着外部答案抄动作，而是看清平台里哪些用户需求、内容价值和作者供给没有被承接。
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {valueLoops.map((item, index) => (
              <article
                key={item.title}
                className="grid gap-4 rounded-[8px] border border-[#fff8eb]/18 bg-[#fff8eb]/5 p-4 sm:grid-cols-[4rem_1fr_10rem]"
              >
                <div>
                  <div className="font-mono text-xs font-semibold text-[#b89e7c]">
                    STEP
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-[#e13024]">
                    0{index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-normal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.86rem] leading-6 text-[#d8c9b4]">
                    {item.body}
                  </p>
                </div>
                <div className="border-t border-[#fff8eb]/14 pt-3 text-[0.84rem] leading-6 text-[#b89e7c] sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                  {item.proof}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-[#fff8eb]/14 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {anchors.map((anchor) => (
            <div
              key={anchor}
              className="rounded-[6px] border border-[#fff8eb]/14 bg-[#fff8eb]/5 px-4 py-3 text-sm font-semibold text-[#fff8eb]"
            >
              {anchor}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
