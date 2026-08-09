"use client";

import { useRef, useState } from "react";
import { AtlasDetailPanel } from "@/components/AtlasDetailPanel";
import type { StarMap } from "@/types/project";

type ThinkingStarMapProps = { map: StarMap; compact?: boolean };

const palette = { capability: "#1437d6", project: "#d84b28" };

export function ThinkingStarMap({ map, compact = false }: ThinkingStarMapProps) {
  const [activeId, setActiveId] = useState(map.nodes[0]?.id ?? "");
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const active = map.nodes.find((node) => node.id === activeId) ?? map.nodes[0];
  const byId = new Map(map.nodes.map((node) => [node.id, node]));
  const connectedIds = new Set([activeId]);
  map.edges.forEach((edge) => {
    if (edge.source === activeId) connectedIds.add(edge.target);
    if (edge.target === activeId) connectedIds.add(edge.source);
  });

  if (!active) return null;

  function moveFocus(index: number) {
    const next = (index + map.nodes.length) % map.nodes.length;
    const node = map.nodes[next];
    if (!node) return;
    setActiveId(node.id);
    nodeRefs.current[next]?.focus();
  }

  return (
    <div className={compact ? "star-map-grid is-compact" : "star-map-grid"}>
      <div className="star-map-canvas" aria-label="思考能力与项目关系图">
        <div className="atlas-scan" aria-hidden="true" />
        <svg viewBox="0 0 1000 620" role="group" aria-label="使用方向键浏览节点" className="min-w-[620px]">
          <g className="star-grid" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <line key={`v-${index}`} x1={100 + index * 100} y1="42" x2={100 + index * 100} y2="578" />)}
            {Array.from({ length: 5 }, (_, index) => <line key={`h-${index}`} x1="54" y1={110 + index * 100} x2="946" y2={110 + index * 100} />)}
          </g>
          <g className="star-edges">
            {map.edges.map((edge) => {
              const source = byId.get(edge.source);
              const target = byId.get(edge.target);
              if (!source || !target) return null;
              const highlighted = edge.source === activeId || edge.target === activeId;
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x * 10}
                  y1={source.y * 6.2}
                  x2={target.x * 10}
                  y2={target.y * 6.2}
                  className={highlighted ? "is-active" : ""}
                />
              );
            })}
          </g>
          <g className="star-nodes">
            {map.nodes.map((node, index) => {
              const selected = node.id === activeId;
              const dimmed = activeId && !connectedIds.has(node.id);
              return (
                <g
                  key={node.id}
                  ref={(element) => { nodeRefs.current[index] = element; }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.kind === "project" ? "项目" : "能力"}：${node.label}`}
                  aria-pressed={selected}
                  onClick={() => setActiveId(node.id)}
                  onFocus={() => setActiveId(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); moveFocus(index + 1); }
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); moveFocus(index - 1); }
                    if (event.key === "Home") { event.preventDefault(); moveFocus(0); }
                    if (event.key === "End") { event.preventDefault(); moveFocus(map.nodes.length - 1); }
                  }}
                  transform={`translate(${node.x * 10} ${node.y * 6.2})`}
                  className={`${selected ? "is-active" : ""} ${dimmed ? "is-dimmed" : ""}`}
                  style={{ color: palette[node.kind] }}
                >
                  <circle className="star-pulse" r={node.kind === "project" ? 23 : 29} />
                  <circle className="star-core" r={node.kind === "project" ? 9 : 12} />
                  <text y={node.y > 65 ? -25 : 36} textAnchor="middle">{node.label}</text>
                </g>
              );
            })}
          </g>
          <text x="56" y="34" className="star-coordinate">COGNITIVE FIELD / X 000—100</text>
          <text x="944" y="598" textAnchor="end" className="star-coordinate">TRACE: {map.edges.length} LINKS</text>
        </svg>
      </div>

      {!compact ? (
        <div className="grid gap-4">
          <AtlasDetailPanel
            index={active.kind === "project" ? "PROJECT TRACE" : "CAPABILITY NODE"}
            title={active.label}
            summary={active.summary}
            proof={`连接：${map.nodes.filter((node) => connectedIds.has(node.id) && node.id !== active.id).map((node) => node.label).join(" / ") || "独立节点"}`}
            tags={active.projectSlugs}
            tone={active.kind === "project" ? "orange" : "blue"}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="星图节点列表">
            {map.nodes.map((node) => (
              <button key={node.id} type="button" onClick={() => setActiveId(node.id)} className={`star-map-list-item ${node.id === activeId ? "is-active" : ""}`}>
                <span className="size-2 rounded-full" style={{ background: palette[node.kind] }} />{node.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
