import type { Metric } from "@/types/project";

type MetricStripProps = {
  metrics: Metric[];
  compact?: boolean;
};

export function MetricStrip({ metrics, compact = false }: MetricStripProps) {
  return (
    <div
      className={
        compact
          ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {metrics.map((metric) => (
        <div
          key={`${metric.label}-${metric.value}`}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            {metric.value}
          </div>
          <div className="mt-2 text-sm leading-5 text-slate-500">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
