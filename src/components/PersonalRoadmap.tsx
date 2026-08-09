"use client";

import { useRef, useState } from "react";
import { AtlasDetailPanel } from "@/components/AtlasDetailPanel";
import type { RoadmapStage } from "@/types/project";

type PersonalRoadmapProps = { stages: RoadmapStage[]; compact?: boolean };

const tones = ["blue", "orange", "gold", "blue", "orange"] as const;

export function PersonalRoadmap({ stages, compact = false }: PersonalRoadmapProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = stages[activeIndex] ?? stages[0];

  if (!active) return null;

  function moveFocus(index: number) {
    const next = (index + stages.length) % stages.length;
    setActiveIndex(next);
    buttonRefs.current[next]?.focus();
  }

  return (
    <div className={compact ? "roadmap-shell is-compact" : "roadmap-shell"}>
      <div className="hidden md:block">
        <div className="roadmap-axis" role="group" aria-label="个人能力演进路线">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              ref={(node) => { buttonRefs.current[index] = node; }}
              type="button"
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); moveFocus(index + 1); }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); moveFocus(index - 1); }
                if (event.key === "Home") { event.preventDefault(); moveFocus(0); }
                if (event.key === "End") { event.preventDefault(); moveFocus(stages.length - 1); }
              }}
              className={`roadmap-node tone-${tones[index % tones.length]} ${activeIndex === index ? "is-active" : ""}`}
            >
              <span className="roadmap-coordinate">{stage.index}</span>
              <span className="roadmap-dot" aria-hidden="true" />
              <span className="roadmap-title">{stage.title}</span>
            </button>
          ))}
        </div>
        {!compact ? (
          <div className="mt-6">
            <AtlasDetailPanel
              index={active.index}
              title={active.title}
              summary={active.summary}
              proof={active.proof}
              tags={active.projectSlugs}
              tone={tones[activeIndex % tones.length]}
            />
          </div>
        ) : (
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#55534d]">{active.summary}</p>
        )}
      </div>

      <div className="grid gap-3 md:hidden" aria-label="个人能力演进路线">
        {stages.map((stage, index) => (
          <article key={stage.id} className={`roadmap-mobile-card tone-${tones[index % tones.length]}`}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.68rem] font-bold tracking-[0.14em]">{stage.index}</span>
              <span className="h-px flex-1 bg-current opacity-30" />
              <span className="size-2 rounded-full bg-current" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-[#242320]">{stage.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#55534d]">{stage.summary}</p>
            {!compact ? <p className="mt-3 border-t border-[#242320]/10 pt-3 text-xs leading-5 text-[#68655e]">{stage.proof}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
