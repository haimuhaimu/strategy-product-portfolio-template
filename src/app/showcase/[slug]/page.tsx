import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowcaseShareButton } from "@/components/showcase/ShowcaseShareButton";
import { StaticPageLink } from "@/components/StaticPageLink";
import { createPageMetadata, getAbsoluteUrl, serializeJsonLd } from "@/lib/seo";
import { loadShowcaseEntries } from "@/lib/showcase.mjs";

type ShowcaseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type ShowcaseEntry = ReturnType<typeof loadShowcaseEntries>[number];

const dimensions = [
  ["resultEvidence", "结果证据"],
  ["scopeAndAttribution", "口径与归因"],
  ["methodEvidence", "方法证据"],
  ["artifactEvidence", "资产证据"],
  ["contributionBoundary", "贡献边界"],
] as const;

const disclosures = [
  ["authorized", "公开授权已确认"],
  ["publiclyAccessible", "作品可公开访问"],
  ["sensitiveMaterialReviewed", "敏感材料已检查"],
  ["takedownAvailable", "支持更新或下架"],
] as const;

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return loadShowcaseEntries().map(({ slug }) => ({ slug }));
}

function findEntry(slug: string) {
  return loadShowcaseEntries().find((entry) => entry.slug === slug);
}

function entryTitle(entry: ShowcaseEntry) {
  return `${entry.roleTags[0]}作品集案例 · ${entry.slug}`;
}

function entryDescription(entry: ShowcaseEntry) {
  return `查看 ${entry.roleTags.join("、")} 的公开作品集案例（${entry.slug}）：3 条公开亮点、${entry.auditSummary.score}/${entry.auditSummary.maxScore} 五维审计状态与披露确认。`;
}

export async function generateMetadata({ params }: ShowcaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) {
    return {
      title: "案例不存在 | 社区作品集案例墙",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: entryTitle(entry),
    description: entryDescription(entry),
    pathname: `/showcase/${entry.slug}/`,
    keywords: [...entry.roleTags, "产品经理作品集案例", "社区作品集"],
    type: "article",
  });
}

function createEntryJsonLd(entry: ShowcaseEntry) {
  const url = getAbsoluteUrl(`/showcase/${entry.slug}/`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: getAbsoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "社区案例", item: getAbsoluteUrl("/showcase/") },
          { "@type": "ListItem", position: 3, name: entryTitle(entry), item: url },
        ],
      },
      {
        "@type": "CreativeWork",
        headline: entryTitle(entry),
        description: entryDescription(entry),
        url,
        mainEntityOfPage: url,
        inLanguage: "zh-CN",
        keywords: entry.roleTags,
        sameAs: entry.publicUrl,
        isPartOf: {
          "@type": "CollectionPage",
          url: getAbsoluteUrl("/showcase/"),
          name: "社区作品集案例墙",
        },
      },
    ],
  };
}

export default async function ShowcaseDetailPage({ params }: ShowcaseDetailPageProps) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) notFound();

  const isSelfTest = entry.kind === "maintainer/self-test";

  return (
    <main className="min-h-screen bg-[#efefe9] text-[#14110e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(createEntryJsonLd(entry)) }}
      />
      <section className="border-b border-[#14110e]/15 bg-[#fffaf0] px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="面包屑" className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-[#80654d]">
            <StaticPageLink href="/">首页</StaticPageLink><span aria-hidden="true">/</span>
            <StaticPageLink href="/showcase/">社区案例</StaticPageLink><span aria-hidden="true">/</span>
            <span aria-current="page">{entry.slug}</span>
          </nav>
          <div className="mt-8 flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#c92a20]">SHOWCASE DETAIL / {entry.slug}</p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">{entry.roleTags[0]}作品集案例</h1>
            </div>
            <span className={`px-3 py-2 text-xs font-bold ${isSelfTest ? "border border-[#c92a20]/40 bg-[#f4dfbd] text-[#6b211a]" : "bg-[#1437d6] text-white"}`}>
              {isSelfTest ? "维护者自测" : "社区投稿"}
            </span>
          </div>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#5b4635]">
            {isSelfTest ? "此条目是维护者自测，不是第三方用户案例或客户推荐。" : "此条目由社区投稿，并按公开字段与披露规则展示；审计结果不等于平台背书或第三方事实核验。"}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="角色标签">
            {entry.roleTags.map((tag) => <li key={tag} className="border border-[#14110e]/15 bg-white px-3 py-1 text-sm font-semibold">{tag}</li>)}
          </ul>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="border border-[#14110e]/20 bg-[#fffdf8] p-6 sm:p-8" aria-labelledby="highlights-title">
          <p className="font-mono text-xs font-bold text-[#80654d]">PUBLIC HIGHLIGHTS / 3</p>
          <h2 id="highlights-title" className="mt-2 text-3xl font-semibold">公开亮点</h2>
          <ol className="mt-6 space-y-5">
            {entry.publicHighlights.map((highlight, index) => (
              <li key={highlight} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-7 text-[#5b4635]">
                <span className="font-mono font-bold text-[#c92a20]">0{index + 1}</span><span>{highlight}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-[#14110e] p-6 text-[#fffaf0] sm:p-8" aria-labelledby="audit-title">
          <div className="flex items-end justify-between gap-4">
            <div><p className="font-mono text-xs font-bold text-[#d3b992]">STRICT AUDIT</p><h2 id="audit-title" className="mt-2 text-2xl font-semibold">五维状态</h2></div>
            <p className="text-4xl font-semibold">{entry.auditSummary.score}<span className="text-base font-normal text-[#d3b992]"> / {entry.auditSummary.maxScore}</span></p>
          </div>
          <ul className="mt-6 space-y-2">
            {dimensions.map(([key, label]) => {
              const passed = entry.auditSummary.dimensions[key];
              return <li key={key} className="flex items-center justify-between gap-4 border-t border-white/15 py-3 text-sm"><span>{label}</span><span className={passed ? "font-bold text-[#b8ff5a]" : "font-bold text-[#f4b183]"}>{passed ? "已覆盖" : "待补强"}</span></li>;
            })}
          </ul>
          <p className="mt-5 text-xs leading-6 text-[#d3b992]">严格审计：{entry.auditSummary.strict ? "已启用" : "未启用"}。分数仅表示材料结构覆盖。</p>
        </section>

        <section className="border border-[#14110e]/20 bg-[#f4dfbd] p-6 sm:p-8 lg:col-span-2" aria-labelledby="disclosure-title">
          <p className="font-mono text-xs font-bold text-[#80654d]">DISCLOSURE</p>
          <h2 id="disclosure-title" className="mt-2 text-2xl font-semibold">披露说明</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {disclosures.map(([key, label]) => <li key={key} className="flex items-center gap-3 bg-[#fffaf0]/75 px-4 py-3 text-sm font-semibold"><span aria-hidden="true">✓</span><span>{label}：{entry.disclosure[key] === "confirmed" ? "已确认" : "未确认"}</span></li>)}
          </ul>
        </section>
      </div>

      <section className="border-t border-[#14110e]/15 bg-white/50 px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-start gap-4">
          <a href={entry.publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex bg-[#14110e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c92a20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6] motion-reduce:transition-none">访问公开作品 ↗</a>
          <StaticPageLink href="/launchpad/showcase/" className="inline-flex bg-[#c92a20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a91f17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1437d6] motion-reduce:transition-none">我也要投稿 →</StaticPageLink>
          <ShowcaseShareButton entry={entry} />
        </div>
      </section>
    </main>
  );
}
