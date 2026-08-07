import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/types/project";
import { withBasePath } from "@/lib/paths";

type HomeThinkingTeaserProps = {
  profile: Profile;
};

export function HomeThinkingTeaser({ profile }: HomeThinkingTeaserProps) {
  return (
    <section className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="grid overflow-hidden rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] shadow-[0_18px_48px_rgba(20,17,14,0.12)] lg:grid-cols-[0.95fr_1.4fr_0.9fr_1fr]">
        <Link
          href="/profile"
          className="group border-b border-[#14110e]/18 p-3.5 transition hover:bg-[#fff2d8] lg:border-b-0 lg:border-r"
        >
          <p className="font-mono text-sm font-semibold uppercase text-[#c92a20]">
            更具体一点
          </p>
          <div className="mt-3 flex gap-3">
            <Image
              src={withBasePath("/images/avatar-placeholder.svg")}
              alt="作品集头像占位图"
              width={58}
              height={58}
              className="size-12 rounded-[6px] border border-[#8b3a28]/25 object-cover"
              unoptimized
            />
            <div>
              <h3 className="font-semibold text-[#14110e]">
                {profile.name}
              </h3>
              <p className="mt-1.5 text-[0.84rem] leading-5 text-[#4b3829]">
                有些项目不热闹，但很练人：先把问题讲清楚，别人才愿意一起做。
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/thinking"
          className="group border-b border-[#14110e]/18 p-3.5 transition hover:bg-[#fff2d8] lg:border-b-0 lg:border-r"
        >
          <p className="font-mono text-sm font-semibold uppercase text-[#c92a20]">
            平时看什么
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-[6px] border border-[#8b3a28]/16 bg-[#fffdf8] px-2 py-2.5 text-center font-mono text-xs font-semibold uppercase text-[#14110e]"
              >
                {interest}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[0.84rem] leading-5 text-[#4b3829]">
            我看的是人怎么表达、怎么下注，又怎么被环境改变。
          </p>
        </Link>

        <Link
          href="/thinking"
          className="group border-b border-[#14110e]/18 p-3.5 transition hover:bg-[#fff2d8] lg:border-b-0 lg:border-r"
        >
          <p className="font-mono text-sm font-semibold uppercase text-[#c92a20]">
            桌面伙伴
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Image
              src={withBasePath("/images/portfolio-companion.svg")}
              alt="作品集桌面伙伴占位图"
              width={64}
              height={64}
              className="size-14 rounded-[6px] border border-[#8b3a28]/30 object-cover"
              unoptimized
            />
            <p className="text-[0.86rem] font-semibold leading-5 text-[#14110e]">
              我喜欢它那种劲儿：有点好笑，但不放弃。
            </p>
          </div>
        </Link>

        <div className="bg-[#14110e] p-3.5 text-[#fff8eb]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-semibold uppercase text-[#e13024]">
                一句自检
              </p>
              <h3 className="mt-2.5 text-base font-semibold">
                爱好别抢工作
              </h3>
              <p className="mt-2 text-[0.84rem] leading-5 text-[#d8c9b4]">
                首页先把项目讲明白。个人观察只负责补一点人的味道。
              </p>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-[6px] border border-[#c92a20]/65 font-mono text-[#e13024]">
              YOU
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
