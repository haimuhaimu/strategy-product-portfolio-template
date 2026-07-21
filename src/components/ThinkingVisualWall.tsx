import Image from "next/image";
import { withBasePath } from "@/lib/site-paths.mjs";

const rapTags = ["圈层", "身份", "情绪", "机制"];

const scoreboardRows = [
  ["RES", "资源"],
  ["ORG", "组织"],
  ["TIME", "耐心"],
  ["FDBK", "反馈"],
];

const formationDots = [
  "left-[50%] top-[14%]",
  "left-[28%] top-[34%]",
  "left-[50%] top-[38%]",
  "left-[72%] top-[34%]",
  "left-[38%] top-[58%]",
  "left-[62%] top-[58%]",
  "left-[24%] top-[78%]",
  "left-[50%] top-[82%]",
  "left-[76%] top-[78%]",
];

export function ThinkingVisualWall() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
        <article className="relative min-h-[420px] overflow-hidden rounded-[8px] border border-[#14110e] bg-black text-[#fff8eb] shadow-[0_18px_48px_rgba(20,17,14,0.16)] sm:min-h-[460px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(201,42,32,0.48),transparent_22%),radial-gradient(circle_at_76%_38%,rgba(76,155,180,0.35),transparent_26%),linear-gradient(145deg,#14110e_20%,#33241b_62%,#0d0d0b)]" />
          <div className="absolute left-8 top-8 font-mono text-[7rem] font-black leading-none text-[#fff8eb]/[0.06] sm:text-[11rem]">
            VOICE
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 sm:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-normal text-[#e13024]">
              Rap Culture / Content Lens
            </p>
            <h2 className="mt-3 max-w-2xl [font-family:var(--font-display)] text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              内容不是中性的。
            </h2>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[#d8c9b4]">
              它带着圈层、身份和情绪；进入商业系统后，又会被重新放大、包装或磨平。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {rapTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[6px] border border-[#fff8eb]/20 bg-[#fff8eb]/10 px-3 py-1.5 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <div className="grid gap-4">
          <article className="grid min-h-40 grid-cols-[7rem_1fr] overflow-hidden rounded-[8px] border border-[#14110e]/25 bg-[#fff8eb] shadow-[0_14px_34px_rgba(20,17,14,0.1)]">
            <div className="relative">
              <Image
                src={withBasePath("/images/portfolio-companion.svg")}
                alt="作品集桌面伙伴占位图"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-between p-5">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-normal text-[#c92a20]">
                  Companion
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#14110e]">
                  幽默的坚韧
                </h3>
              </div>
              <p className="mt-4 text-[0.86rem] leading-6 text-[#4b3829]">
                认真判断问题，但别把自己包装得太严肃。
              </p>
            </div>
          </article>

          <article className="relative min-h-60 overflow-hidden rounded-[8px] border border-[#14110e] bg-[#8b1d17] p-4 text-[#fff8eb] shadow-[0_14px_34px_rgba(20,17,14,0.12)]">
            <div className="absolute right-[-4rem] top-[-4rem] size-48 rounded-full border-[18px] border-yellow-300/80" />
            <div className="absolute bottom-[-3rem] left-[-3rem] size-40 rounded-full border-[14px] border-yellow-300/70" />
            <div className="relative">
              <p className="font-mono text-xs font-semibold uppercase tracking-normal text-[#f4dfbd]">
                United Lens
              </p>
              <h3 className="mt-2 [font-family:var(--font-display)] text-3xl font-semibold leading-tight">
                资源不等于结果。
              </h3>
              <p className="mt-4 max-w-sm text-[0.86rem] leading-6 text-[#f8ead0]">
                一个组织反复投入资源却没有结果，真正要看的不是谁不够努力。
              </p>
            </div>

            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-4 gap-2">
              {scoreboardRows.map(([code, label]) => (
                <div
                  key={code}
                  className="rounded-[6px] border border-[#f4dfbd]/35 bg-black/20 px-2 py-2 text-center"
                >
                  <p className="text-[10px] font-semibold text-[#f4dfbd]/70">
                    {code}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#fff8eb]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      <article className="mt-4 overflow-hidden rounded-[8px] border border-[#14110e] bg-[#14110e] p-4 text-[#fff8eb] shadow-[0_18px_48px_rgba(20,17,14,0.16)] sm:p-5">
        <div className="grid gap-6 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-normal text-[#e13024]">
              FIFA / FM
            </p>
            <h3 className="mt-2 [font-family:var(--font-display)] text-3xl font-semibold leading-tight">
              一个训练临场，
              <span className="block">一个训练系统。</span>
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.72fr]">
            <div className="relative min-h-60 rounded-[8px] border border-[#fff8eb]/18 bg-[#2c3a28]">
              <div className="absolute inset-4 rounded border border-white/40" />
              <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px bg-white/25" />
              <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
              <div className="absolute inset-x-4 top-1/2 h-px bg-white/25" />
              {formationDots.map((className, index) => (
                <span
                  key={className}
                  className={`absolute grid size-9 place-items-center rounded-full border border-white/20 text-[10px] font-semibold ${
                    index % 2 === 0 ? "bg-[#f4dfbd] text-[#14110e]" : "bg-[#c92a20] text-[#fff8eb]"
                  } ${className}`}
                >
                  {index + 1}
                </span>
              ))}
              <div className="absolute bottom-4 left-4 rounded-[6px] bg-black/35 px-3 py-2">
                <p className="text-sm font-semibold">即时执行</p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                ["FM", "长期系统", "目标 / 预算 / 阵容 / 战术"],
                ["FIFA", "临场反馈", "观察 / 判断 / 动作 / 修正"],
              ].map(([title, label, body]) => (
                <div
                  key={title}
                  className="rounded-[8px] border border-[#fff8eb]/14 bg-[#fff8eb]/5 p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-2xl font-semibold italic">{title}</p>
                    <p className="text-sm font-semibold text-[#e13024]">
                      {label}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#d8c9b4]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
