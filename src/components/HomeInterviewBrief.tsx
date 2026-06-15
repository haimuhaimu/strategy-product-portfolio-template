const briefItems = [
  {
    label: "用户",
    body: "不是让他多刷一会儿，而是让他少一点反感和困惑。",
  },
  {
    label: "作者",
    body: "不是只多赚一单，而是知道什么内容值得持续做。",
  },
  {
    label: "商业",
    body: "不是短期转化好看，而是别把信任越卖越薄。",
  },
];

export function HomeInterviewBrief() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 pb-6 sm:px-8">
      <div className="border-2 border-[#14110e] bg-[#fff2d8] shadow-[6px_6px_0_#14110e]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b-2 border-[#14110e] bg-[#14110e] p-4 text-[#f4dfbd] lg:border-b-0 lg:border-r-2">
            <p className="font-mono text-xs font-semibold uppercase text-[#ff3b2f]">
              目标模式
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-8 sm:text-3xl sm:leading-10">
              我会先问：这个增长，到底让谁真的变好？
            </h2>
          </div>

          <div className="grid divide-y-2 divide-[#8b3a28]/35 md:grid-cols-3 md:divide-x-2 md:divide-y-0">
            {briefItems.map((item) => (
              <div key={item.label} className="p-4">
                <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#2b2119]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t-2 border-[#14110e] bg-[#f4dfbd] px-4 py-3">
          <p className="text-sm font-semibold leading-6 text-[#3a2e24]">
            目标没说清，后面越会做，越容易把错误的增长做得更彻底。
          </p>
        </div>
      </div>
    </section>
  );
}
