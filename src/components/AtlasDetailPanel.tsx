type AtlasDetailPanelProps = {
  index: string;
  title: string;
  summary: string;
  proof?: string;
  tags?: string[];
  tone?: "blue" | "orange" | "gold";
};

const toneClass = {
  blue: "text-[#1437d6] border-[#1437d6]/35",
  orange: "text-[#d84b28] border-[#d84b28]/35",
  gold: "text-[#9a6818] border-[#9a6818]/35",
};

export function AtlasDetailPanel({
  index,
  title,
  summary,
  proof,
  tags = [],
  tone = "blue",
}: AtlasDetailPanelProps) {
  return (
    <aside className="atlas-detail relative overflow-hidden border border-[#242320]/20 bg-[#f8f8f3]/92 p-5 sm:p-6" aria-live="polite">
      <div className="atlas-contour" aria-hidden="true" />
      <div className="relative">
        <p className={`font-mono text-xs font-bold tracking-[0.18em] ${toneClass[tone].split(" ")[0]}`}>{index}</p>
        <h3 className="mt-3 text-2xl font-semibold text-[#242320]">{title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#55534d]">{summary}</p>
        {proof ? (
          <div className={`mt-5 border-l-2 pl-4 ${toneClass[tone]}`}>
            <p className="font-mono text-[0.68rem] font-bold tracking-[0.16em] text-[#77736a]">EVIDENCE TRACE</p>
            <p className="mt-2 text-sm leading-6 text-[#34332f]">{proof}</p>
          </div>
        ) : null}
        {tags.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => <span key={tag} className="border border-[#242320]/15 bg-white/70 px-2.5 py-1 font-mono text-[0.68rem] text-[#55534d]">{tag}</span>)}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
