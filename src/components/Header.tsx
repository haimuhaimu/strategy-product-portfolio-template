import Link from "next/link";
import Image from "next/image";
import type { Profile } from "@/types/project";

type HeaderProps = {
  profile: Profile;
};

export function Header({ profile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#c92a20]/45 bg-[#0d0d0b]/95 text-[#fffaf2] shadow-[0_10px_30px_rgba(20,17,14,0.16)] backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/avatar-placeholder.svg"
            alt="作品集头像占位图"
            width={40}
            height={40}
            className="size-10 rounded-[6px] border border-[#f7ead4]/30 object-cover shadow-[0_0_0_2px_rgba(201,42,32,0.28)]"
            priority
            unoptimized
          />
          <span>
            <span className="block font-mono text-base font-semibold uppercase tracking-normal text-[#fffaf2]">
              Portfolio
            </span>
            <span className="block text-xs text-[#c9bba7]">{profile.name} / {profile.role}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 font-mono text-sm font-semibold uppercase tracking-normal text-[#f7ead4] md:flex">
          <Link href="/#projects" className="transition hover:text-[#e13024]">
            项目
          </Link>
          <Link href="/thinking" className="transition hover:text-[#e13024]">
            模型 / 思考
          </Link>
          <Link href="/profile" className="transition hover:text-[#e13024]">
            关于
          </Link>
          <Link href="/profile" className="transition hover:text-[#e13024]">
            经历
          </Link>
          <Link href="/#contact" className="rounded-[6px] border border-[#c92a20]/75 bg-[#c92a20]/10 px-3 py-2 text-[#fffaf2] transition hover:bg-[#c92a20] hover:text-[#100d0b]">
            联系
          </Link>
        </nav>
      </div>
    </header>
  );
}
