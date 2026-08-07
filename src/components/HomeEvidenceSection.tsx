import type { HomeConfig } from "@/types/project";

export function HomeEvidenceSection({ home }: { home: HomeConfig }) {
  return (
    <section className="border-y border-[#14110e]/10 bg-[#fffdf8] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="font-mono text-sm font-semibold text-[#c92a20]">EVIDENCE</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#14110e] sm:text-4xl">{home.evidenceTitle}</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-[#14110e]/10 bg-[#14110e]/10 sm:grid-cols-2 lg:grid-cols-4">
          {home.evidenceMetrics.map((metric) => (
            <div key={`${metric.label}-${metric.value}`} className="bg-white p-6">
              <p className="font-mono text-3xl font-semibold text-[#c92a20]">{metric.value}</p>
              <p className="mt-3 text-sm leading-6 text-[#5b4635]">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
