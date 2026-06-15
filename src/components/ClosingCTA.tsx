import Link from "next/link";
import type { Profile } from "@/types/project";

type ClosingCTAProps = {
  profile: Profile;
};

export function ClosingCTA({ profile }: ClosingCTAProps) {
  return (
    <section id="contact" className="mx-auto max-w-[1680px] px-4 pb-8 sm:px-8">
      <div className="overflow-hidden rounded-[8px] border border-[#14110e] bg-[#0d0d0b] p-4 text-[#fffaf2] shadow-[0_22px_60px_rgba(20,17,14,0.22)] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="font-mono text-sm font-semibold uppercase text-[#e13024]">
              联系我
            </p>
            <h2 className="mt-3 [font-family:var(--font-display)] text-3xl font-semibold leading-tight tracking-normal text-[#fffaf2] sm:text-5xl">
              欢迎直接看项目。
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#d8c9b4]">
              想看我靠不靠谱，建议先看三个代表项目。里面有我当时怎么想、怎么验证，以及哪些数字能说明问题。
            </p>
          </div>

          <div className="grid overflow-hidden rounded-[6px] border border-[#c92a20]/65 sm:grid-cols-2">
            <a
              href={`mailto:${profile.email}`}
              className="border-b border-[#c92a20]/65 px-4 py-4 text-center font-mono text-sm font-semibold uppercase text-[#fffaf2] transition hover:bg-[#c92a20] hover:text-[#100d0b] sm:border-r"
            >
              邮件
            </a>
            <Link
              href="/profile"
              className="border-b border-[#c92a20]/65 px-4 py-4 text-center font-mono text-sm font-semibold uppercase text-[#fffaf2] transition hover:bg-[#c92a20] hover:text-[#100d0b]"
            >
              经历
            </Link>
            <Link
              href="/#projects"
              className="border-b border-[#c92a20]/65 px-4 py-4 text-center font-mono text-sm font-semibold uppercase text-[#fffaf2] transition hover:bg-[#c92a20] hover:text-[#100d0b] sm:border-b-0 sm:border-r"
            >
              项目
            </Link>
            <Link
              href="/thinking"
              className="px-4 py-4 text-center font-mono text-sm font-semibold uppercase text-[#fffaf2] transition hover:bg-[#c92a20] hover:text-[#100d0b]"
            >
              思考
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-[#c92a20]/45 pt-4 font-mono text-xs uppercase text-[#c9bba7] sm:flex-row sm:items-center sm:justify-between">
          <span>少包装，多证据。</span>
          <span>中文策略产品经理作品集模板。</span>
        </div>
      </div>
    </section>
  );
}
