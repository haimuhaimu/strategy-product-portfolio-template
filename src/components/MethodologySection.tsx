import type { Profile } from "@/types/project";

type MethodologySectionProps = {
  profile: Profile;
};

export function MethodologySection({ profile }: MethodologySectionProps) {
  return (
    <section id="methodology" className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="mb-5 grid gap-4 border-b border-[#14110e]/18 pb-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Working Method
            </p>
            <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight tracking-normal text-[#14110e] sm:text-3xl">
              我通常从误判开始。
            </h2>
          </div>
          <p className="text-[0.95rem] leading-7 text-[#3a2e24]">
            很多项目一开始看起来都是指标问题：收入、播放、点击、关注、DAU。真正要做的是判断：这个指标背后代表的价值是不是被看对了。
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {profile.methodology.map((item, index) => (
            <div
              key={item.title}
              className="rounded-[8px] border border-[#8b3a28]/18 bg-[#fffdf8] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-semibold text-[#c92a20]">
                  0{index + 1}
                </span>
                <span className="h-px flex-1 bg-[#8b3a28]/18" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#14110e]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.86rem] leading-6 text-[#4b3829]">
                {item.description}
              </p>
              <p className="mt-4 rounded-[6px] bg-[#fff2d8] p-3 text-[0.84rem] leading-6 text-[#3a2e24]">
                {item.proof}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
