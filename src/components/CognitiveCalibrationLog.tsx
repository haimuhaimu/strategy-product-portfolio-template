import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import type {
  CalibrationStatus,
  CognitiveCalibrationLog,
} from "@/types/project";

type CognitiveCalibrationLogProps = {
  logs: CognitiveCalibrationLog[];
};

const statusMeta: Record<
  CalibrationStatus,
  { label: string; className: string }
> = {
  retained: {
    label: "保留",
    className: "border-[#14110e] bg-[#14110e] text-[#fff8eb]",
  },
  revised: {
    label: "修正",
    className: "border-[#c92a20] bg-[#c92a20] text-[#fff8eb]",
  },
  pending: {
    label: "待验证",
    className: "border-[#c92a20] bg-[#fff2d8] text-[#c92a20]",
  },
};

export function CognitiveCalibrationLog({
  logs,
}: CognitiveCalibrationLogProps) {
  return (
    <section
      id="cognitive-calibration"
      className="mx-auto max-w-[1680px] px-4 pb-5 sm:px-8"
    >
      <div className="rounded-[8px] border border-[#14110e] bg-[#f4dfbd] p-4 shadow-[0_18px_48px_rgba(20,17,14,0.12)] sm:p-5">
        <div className="grid gap-4 border-b border-[#14110e]/25 pb-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase text-[#c92a20]">
              Cognitive Calibration Log
            </p>
            <h2 className="mt-2 [font-family:var(--font-display)] text-2xl font-semibold leading-tight text-[#14110e] sm:text-3xl">
              认知校准日志
            </h2>
          </div>
          <div className="border-l-2 border-[#c92a20] pl-4 text-[0.95rem] leading-7 text-[#3a2e24]">
            记录判断如何被现实改写。所有解释只是当前版本，不是最终答案。
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {logs.map((log, index) => {
            const project = getProjectBySlug(log.projectSlug);
            const status = statusMeta[log.status];

            return (
              <article
                key={log.projectSlug}
                className="flex min-h-full flex-col rounded-[8px] border border-[#14110e] bg-[#fff8eb] p-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#14110e]/20 pb-3">
                  <span className="font-mono text-xs font-semibold text-[#c92a20]">
                    LOG 0{index + 1}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <dl className="mt-4 flex-1 space-y-4">
                  <div>
                    <dt className="font-mono text-[0.68rem] font-semibold uppercase text-[#8b3a28]">
                      先验判断
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-6 text-[#14110e]">
                      {log.prior}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.68rem] font-semibold uppercase text-[#8b3a28]">
                      现实反馈
                    </dt>
                    <dd className="mt-1.5 text-sm leading-6 text-[#4b3829]">
                      {log.feedback}
                    </dd>
                  </div>
                  <div className="rounded-[6px] border-l-2 border-[#c92a20] bg-[#fff2d8] p-3">
                    <dt className="font-mono text-[0.68rem] font-semibold uppercase text-[#c92a20]">
                      当前版本
                    </dt>
                    <dd className="mt-1.5 text-sm leading-6 text-[#3a2e24]">
                      {log.currentVersion}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/projects/${log.projectSlug}/`}
                  className="mt-5 inline-flex items-center justify-between gap-3 border-t border-[#14110e]/20 pt-3 text-sm font-semibold text-[#14110e] transition hover:text-[#c92a20]"
                >
                  <span>{project?.title ?? "查看关联项目"}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
