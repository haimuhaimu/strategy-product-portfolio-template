import Image from "next/image";
import { StaticPageLink } from "@/components/StaticPageLink";
import { withBasePath } from "@/lib/paths";
import type { FeatureFlags, Profile } from "@/types/project";

export function Header({ profile, features }: { profile: Profile; features: FeatureFlags }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#14110e]/10 bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <StaticPageLink href="/" className="flex min-w-0 items-center gap-3">
          <Image src={withBasePath("/images/avatar-placeholder.svg")} alt="作品集头像" width={36} height={36} className="size-9 rounded-full border border-[#14110e]/15 object-cover" priority unoptimized />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#14110e]">{profile.name}</span>
            <span className="block truncate text-xs text-[#80654d]">{profile.role}</span>
          </span>
        </StaticPageLink>
        <nav className="flex items-center gap-2 text-sm font-semibold text-[#4b3829] sm:gap-5">
          <StaticPageLink href="/#projects" className="hidden transition hover:text-[#c92a20] sm:block">项目</StaticPageLink>
          {features.profile ? <StaticPageLink href="/profile/" className="hidden transition hover:text-[#c92a20] md:block">关于</StaticPageLink> : null}
          {features.thinking ? <StaticPageLink href="/thinking/" className="hidden transition hover:text-[#c92a20] md:block">思考</StaticPageLink> : null}
          <StaticPageLink href="/start/" className="hidden text-xs font-semibold text-[#80654d] transition hover:text-[#c92a20] sm:block">作者入口</StaticPageLink>
          <StaticPageLink href="/#contact" className="transition hover:text-[#c92a20]">联系</StaticPageLink>
        </nav>
      </div>
    </header>
  );
}
