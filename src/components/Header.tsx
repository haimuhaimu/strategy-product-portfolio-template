import Image from "next/image";
import { StaticPageLink } from "@/components/StaticPageLink";
import { withBasePath } from "@/lib/paths";
import type { FeatureFlags, Profile } from "@/types/project";

const REPOSITORY_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template";
const CONTRIBUTING_URL = `${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`;

export function Header({ profile, features }: { profile: Profile; features: FeatureFlags }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#14110e]/10 bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <StaticPageLink href="/" className="flex min-w-0 items-center gap-3">
          <Image src={withBasePath("/images/avatar-placeholder.svg")} alt="作品集头像" width={36} height={36} className="size-9 rounded-full border border-[#14110e]/15 object-cover" priority unoptimized />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold text-[#14110e]">{profile.name}</span>
            <span className="block truncate text-xs text-[#80654d]">{profile.role}</span>
          </span>
        </StaticPageLink>
        <nav className="flex items-center gap-2 text-sm font-semibold text-[#4b3829] sm:gap-4" aria-label="主导航">
          <StaticPageLink href="/#projects" className="hidden transition hover:text-[#c92a20] lg:block">项目</StaticPageLink>
          {features.profile ? <StaticPageLink href="/profile/" className="hidden transition hover:text-[#c92a20] xl:block">关于</StaticPageLink> : null}
          {features.thinking ? <StaticPageLink href="/thinking/" className="hidden transition hover:text-[#c92a20] xl:block">思考</StaticPageLink> : null}
          <StaticPageLink href="/showcase/" className="hidden transition hover:text-[#c92a20] sm:block">案例墙</StaticPageLink>
          <StaticPageLink href="/start/" className="hidden text-xs font-semibold text-[#80654d] transition hover:text-[#c92a20] lg:block">用 Agent 制作</StaticPageLink>
          <a href={CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-[#c92a20]">贡献</a>
          <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center whitespace-nowrap border border-[#14110e] bg-[#14110e] px-3 py-2 text-xs font-bold text-white transition hover:border-[#c92a20] hover:bg-[#c92a20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1437d6] sm:text-sm" aria-label="在 GitHub 为项目 Star">
            <span aria-hidden="true">★</span>&nbsp;GitHub Star
          </a>
        </nav>
      </div>
    </header>
  );
}
