import type { Metadata } from "next";
import { StaticPageLink } from "@/components/StaticPageLink";
import { getAbsoluteUrl, createPageMetadata, serializeJsonLd } from "@/lib/seo";
import { loadShowcaseEntries } from "@/lib/showcase.mjs";

export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: "社区作品集案例墙",
  description: "查看经公开授权与隐私检查的产品经理、AI 产品经理和运营作品集；当前维护者自测会被明确标记，不作为用户口碑。",
  pathname: "/showcase/",
  keywords: ["产品经理作品集案例", "运营作品集案例", "AI 产品经理作品集", "社区作品集"],
});

const ISSUE_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/new?template=showcase.yml";
const dimensionEntries = [
  ["resultEvidence", "结果证据"],
  ["scopeAndAttribution", "口径与归因"],
  ["methodEvidence", "方法证据"],
  ["artifactEvidence", "资产证据"],
  ["contributionBoundary", "贡献边界"],
] as const;
const privacyChecks = [
  "只提交无需登录的 HTTPS 公开链接，不带令牌、签名、查询参数或片段。",
  "删除内部链接、用户明细、私人联系方式、密钥与未经确认的精确业务数据。",
  "检查截图中的通知栏、访问参数、图片元数据，以及组织对公开披露的要求。",
];

function createShowcaseJsonLd(entries: ReturnType<typeof loadShowcaseEntries>) {
  const pageUrl = getAbsoluteUrl("/showcase/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: getAbsoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "社区案例", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#portfolio-list`,
        name: "社区作品集案例",
        numberOfItems: entries.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: entries.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${entry.roleTags[0]}作品集`,
          url: entry.publicUrl,
        })),
      },
    ],
  };
}

export default function ShowcasePage() {
  const entries = loadShowcaseEntries();
  const communityCount = entries.filter((entry) => entry.kind === "community").length;
  const onlySelfTests = entries.length > 0 && communityCount === 0;

  return (
    <main className="bg-[#efefe9] text-[#14110e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(createShowcaseJsonLd(entries)) }}
      />
      <section className="border-b border-[#14110e]/15 bg-[#fffaf0] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="面包屑" className="flex items-center gap-2 font-mono text-xs font-bold text-[#80654d]">
            <StaticPageLink href="/" className="underline decoration-[#80654d]/35 underline-offset-4 hover:text-[#c92a20]">首页</StaticPageLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">社区案例</span>
          </nav>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.18em] text-[#c92a20]">COMMUNITY SHOWCASE / v0.9.2</p>
              <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">社区作品集案例墙</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#5b4635]">这里只展示已公开、已授权且完成敏感材料检查的作品集。审计分数表示材料结构覆盖，不代表平台背书、第三方事实核验或作品效果排名。</p>
            </div>
            <aside className="border-l-2 border-[#c92a20] bg-white/55 p-5">
              <p className="font-mono text-xs font-bold text-[#80654d]">当前收录</p>
              <p className="mt-2 text-4xl font-semibold">{entries.length} <span className="text-base font-normal text-[#6e5743]">个公开条目</span></p>
              <p className="mt-3 text-sm leading-6 text-[#6e5743]">其中社区投稿 {communityCount} 个，维护者自测 {entries.length - communityCount} 个。</p>
            </aside>
          </div>
          {onlySelfTests ? (
            <p role="note" className="mt-8 border border-[#c92a20]/40 bg-[#f4dfbd] px-4 py-3 text-sm font-semibold leading-6 text-[#6b211a]">当前仅有维护者自测，用于验证模板与公开流程；不是第三方用户案例，也不代表用户口碑。</p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16" aria-labelledby="showcase-list-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-mono text-xs font-bold tracking-[0.16em] text-[#80654d]">PUBLIC ENTRIES</p><h2 id="showcase-list-title" className="mt-2 text-3xl font-semibold">公开案例</h2></div>
          <p className="max-w-xl text-sm leading-6 text-[#6e5743]">社区投稿优先展示，其次为维护者自测；同类条目按 slug 稳定排序。</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {entries.map((entry) => {
            const isSelfTest = entry.kind === "maintainer/self-test";
            return (
              <article key={entry.slug} className="border border-[#14110e]/20 bg-[#fffdf8] p-5 shadow-[7px_7px_0_rgba(20,17,14,0.08)] sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#80654d]">{entry.slug}</p><h3 className="mt-2 text-2xl font-semibold">{entry.roleTags[0]}作品集</h3></div>
                  <span className={`px-3 py-1 text-xs font-bold ${isSelfTest ? "border border-[#c92a20]/40 bg-[#f4dfbd] text-[#6b211a]" : "bg-[#1437d6] text-white"}`}>{isSelfTest ? "维护者自测" : "社区投稿"}</span>
                </div>
                {isSelfTest ? <p className="mt-4 text-sm leading-6 text-[#6e5743]">此条目由维护者用本人已确认并脱敏的材料自测，不是第三方客户案例或用户推荐。</p> : null}
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="角色标签">{entry.roleTags.map((tag) => <li key={tag} className="border border-[#14110e]/15 bg-[#f4dfbd] px-3 py-1 text-xs font-semibold">{tag}</li>)}</ul>
                <div className="mt-6"><h4 className="font-mono text-xs font-bold text-[#80654d]">3 个公开亮点</h4><ul className="mt-3 space-y-3">{entry.publicHighlights.slice(0, 3).map((highlight) => <li key={highlight} className="flex gap-3 text-sm leading-6 text-[#5b4635]"><span aria-hidden="true" className="font-mono font-bold text-[#c92a20]">—</span><span>{highlight}</span></li>)}</ul></div>
                <div className="mt-7 border-t border-[#14110e]/15 pt-5">
                  <div className="flex items-baseline justify-between gap-4"><h4 className="font-mono text-xs font-bold text-[#80654d]">STRICT AUDIT / 五维状态</h4><p className="text-2xl font-semibold">{entry.auditSummary.score}<span className="text-sm font-normal text-[#80654d]"> / {entry.auditSummary.maxScore}</span></p></div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">{dimensionEntries.map(([dimension, label]) => { const passed = entry.auditSummary.dimensions[dimension]; return <li key={dimension} className="flex items-center justify-between gap-3 border border-[#14110e]/10 px-3 py-2 text-xs"><span>{label}</span><span className={passed ? "font-bold text-[#166534]" : "font-bold text-[#9a3412]"}>{passed ? "已覆盖" : "待补强"}</span></li>; })}</ul>
                </div>
                <a href={entry.publicUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex bg-[#14110e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c92a20] motion-reduce:transition-none">访问公开作品 ↗</a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#14110e]/15 bg-[#14110e] px-4 py-14 text-[#f8f8f3] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div><p className="font-mono text-xs font-bold text-[#d3b992]">SUBMIT YOUR PORTFOLIO</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">提交你的作品集</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#d3b992]">请使用现有 GitHub Showcase Issue 模板提交。GitHub Issue 会公开显示你的 GitHub 账号和填写内容，不是匿名渠道；如不接受公开，请不要提交。</p><a href={ISSUE_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex bg-[#c92a20] px-6 py-3 font-semibold text-white transition hover:bg-[#e13b30] motion-reduce:transition-none">打开公开提交 Issue ↗</a></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="border border-white/20 p-5"><h3 className="font-semibold">提交前隐私检查</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-[#d3b992]">{privacyChecks.map((item) => <li key={item}>— {item}</li>)}</ul></div>
            <div className="border border-white/20 p-5"><h3 className="font-semibold">更新与下架机制</h3><p className="mt-4 text-sm leading-7 text-[#d3b992]">链接失效、公开权限变化或授权撤回时，请在原 Showcase Issue 中提出更新或下架请求；维护者核验后会移除对应条目。紧急安全问题请按仓库 SECURITY 指引处理。</p><a href="https://github.com/haimuhaimu/strategy-product-portfolio-template/blob/main/showcase/README.md" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-white underline decoration-white/35 underline-offset-4">查看完整提交规则 ↗</a></div>
          </div>
        </div>
      </section>
    </main>
  );
}
