import Link from "next/link";
import { CareerLifeRoadmap } from "@/components/CareerLifeRoadmap";
import type { Profile } from "@/types/project";

type HeroOverviewProps = {
  profile: Profile;
};

const heroProofs = [
  {
    title: "内容形态",
    body: "图文不是视频补充，它需要被单独验证。",
  },
  {
    title: "作者价值",
    body: "收入高不等于健康，商业机会也不能只看成交。",
  },
  {
    title: "用户满足",
    body: "搜索不是给更多结果，而是更快把问题回答掉。",
  },
];

const heroTags = ["推荐", "搜索", "作者变现", "图文社区", "AI 工作流"];

export function HeroOverview({ profile }: HeroOverviewProps) {
  return (
    <section className="py-4 sm:py-7">
      <div className="max-w-full overflow-hidden rounded-[8px] border border-[#14110e] bg-[#fff8eb] shadow-[0_24px_70px_rgba(20,17,14,0.16)]">
        <div className="grid xl:grid-cols-[0.72fr_1.28fr] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative min-w-0 border-b border-[#14110e]/20 bg-[#fff8eb] p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-8 xl:p-9">
            <div className="absolute inset-3 rounded-[6px] border border-dashed border-[#c92a20]/28" />
            <div className="relative">
              <div className="inline-flex max-w-full flex-wrap rounded-[6px] bg-[#14110e] px-3 py-2 font-mono text-xs font-semibold leading-5 text-[#fff8eb] shadow-[inset_0_-2px_0_rgba(201,42,32,0.5)] sm:px-4 sm:text-sm">
                内容策略产品经理 · 真实业务 / 价值验证 / AI 工作流
              </div>

              <h1 className="mt-5 [font-family:var(--font-display)] text-[2.05rem] font-semibold leading-[1.14] tracking-normal text-[#14110e] sm:mt-7 sm:text-5xl xl:text-[3rem] 2xl:text-[3.38rem]">
                把真实业务判断，
                <span className="block text-[#c92a20]">做成能复用的工具。</span>
              </h1>

              <p className="mt-4 max-w-2xl text-[0.95rem] leading-6 text-[#3a2e24] sm:mt-5 sm:text-base sm:leading-7">
                这是一个个人作品集示例，当前作者名为「{profile.name}」。我做推荐、搜索、图文、游戏和作者变现，
                也在把这些经验带进 AI 产品经理的工作：把业务判断做成 AI 工作流和 Agent 产品。
                这些项目看起来分散，但我一直在处理同一个问题：
                平台应该把流量、曝光和商业机会给谁，以及怎么证明这个判断不是拍脑袋。
              </p>

              <div className="mt-5 grid gap-2 border-y border-[#14110e]/18 py-3 sm:mt-6 sm:gap-2.5 sm:py-4">
                {heroProofs.map((item) => (
                  <div
                    key={item.title}
                    className="grid gap-1.5 border-l-2 border-[#c92a20] bg-[#f8ead0]/58 px-3 py-2 text-[0.86rem] leading-5 text-[#35291f] sm:grid-cols-[5.2rem_1fr] sm:gap-2 sm:text-[0.88rem] sm:leading-6"
                  >
                    <span className="font-semibold text-[#c92a20]">
                      {item.title}
                    </span>
                    <span>{item.body}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
                <Link
                  href="/#projects"
                  className="rounded-[6px] border border-[#9f1d16] bg-[#c92a20] px-5 py-2.5 font-mono text-sm font-semibold uppercase text-[#fff8eb] shadow-[0_10px_24px_rgba(201,42,32,0.2)] transition hover:-translate-y-0.5 hover:bg-[#b12219]"
                >
                  先看项目
                </Link>
                <Link
                  href="/profile"
                  className="rounded-[6px] border border-[#14110e]/45 bg-[#fff8eb] px-5 py-2.5 font-mono text-sm font-semibold uppercase text-[#14110e] shadow-[0_10px_24px_rgba(20,17,14,0.08)] transition hover:-translate-y-0.5 hover:border-[#8b3a28] hover:text-[#8b3a28]"
                >
                  查看经历
                </Link>
              </div>

              <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
                {heroTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[4px] border border-[#8b3a28]/25 bg-[#f8ead0] px-2.5 py-1.5 text-xs font-semibold text-[#5b4635]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-w-0 bg-[#f4dfbd] p-3 sm:p-4 lg:p-5 xl:p-6">
            <CareerLifeRoadmap />
          </div>
        </div>
      </div>
    </section>
  );
}
