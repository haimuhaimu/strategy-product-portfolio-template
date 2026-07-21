"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/site-paths.mjs";

type CareerNode = {
  id: string;
  title: string;
  symbol: string;
  stage: string;
  x: number;
  hoverLine: string;
  problem: string;
  action: string;
  ability: string;
  result: string;
};

type LifeNode = {
  id: string;
  title: string;
  label: string;
  note: string;
  x: number;
  y: number;
  kind: "football" | "mixtape" | "game" | "companion" | "algo";
  align?: "left" | "right" | "center";
};

type CompanionPose = "giggle" | "point" | "map" | "sit" | "run" | "wave";

const routeStart = 9;
const routeEnd = 91;
const routeSpan = routeEnd - routeStart;
const currentCareerId = "monetization";

const careerNodes: CareerNode[] = [
  {
    id: "search",
    title: "搜索质量",
    symbol: "搜",
    stage: "需求满足",
    x: 9,
    hoverLine: "搜索不是给更多结果，而是更快满足问题",
    problem: "用户搜到了很多内容，但不代表问题被解决。",
    action: "拆搜索词意图、供给质量、排序、首位命中和答案形态。",
    ability: "搜索满足度评估、坏样本归因、答案质量判断。",
    result: "问答式结果覆盖双位数比例的搜索需求。",
  },
  {
    id: "game",
    title: "游戏分发",
    symbol: "游",
    stage: "内容带发行",
    x: 29,
    hoverLine: "播放热度不等于激活和充值",
    problem: "游戏内容容易热，但业务要的是下载、激活和可归因流水。",
    action: "把发行目标翻译成作者任务、内容供给和推荐策略。",
    ability: "内容带发行漏斗、创作者任务激励、转化归因复盘。",
    result: "小游戏 DAU 百万级规模；重度游戏日激活 万级规模；可归因年流水 数亿级。",
  },
  {
    id: "image-text",
    title: "图文推荐",
    symbol: "图",
    stage: "体裁验证",
    x: 50,
    hoverLine: "图文不是视频补充，而是独立内容形态",
    problem: "图文容易被短视频指标误判，流量和体验都会波动。",
    action: "把单列、双列和图文社区分开验证，分别看场景、供给和推荐目标。",
    ability: "内容评估、样本建模、实验设计、策略诊断。",
    result: "图文 DAU 百万级增量；频道 DAU 千万级规模；社区 DAU 百万级规模。",
  },
  {
    id: "monetization",
    title: "作者变现",
    symbol: "收",
    stage: "当前主线",
    x: 71,
    hoverLine: "收入高不等于变现健康",
    problem: "只看收入，会把短期成交误判成长期平台价值。",
    action: "拆内容健康度和变现模式健康度，用标注校准边界样本。",
    ability: "作者价值评估、健康度分层、过度营销识别和治理动作。",
    result: "沉淀健康度标准，并在过度营销场景承接为识别模型和治理动作。",
  },
  {
    id: "ai-workflow",
    title: "AI 工作流",
    symbol: "智",
    stage: "判断工具化",
    x: 91,
    hoverLine: "AI 不替人拍脑袋，它承接被拆清楚的判断",
    problem: "作者收入问题过去太依赖运营和管理者的人肉经验。",
    action: "把作者阶段、收入结构、变现方式和问题诊断结构化。",
    ability: "作者挖掘模型、自动化投流、作者收入智能体。",
    result: "让重复判断进入工具，让复杂问题更快定位到可行动原因。",
  },
];

const lifeNodes: LifeNode[] = [
  {
    id: "football",
    title: "曼联 / 足球",
    label: "Old Trafford",
    note: "资源不等于结果，体系才决定上限。",
    x: 14,
    y: 59,
    kind: "football",
  },
  {
    id: "mixtape",
    title: "说唱 / Mixtape",
    label: "播放条",
    note: "内容背后有圈层、身份、情绪和机制。",
    x: 21,
    y: 76,
    kind: "mixtape",
  },
  {
    id: "companion",
    title: "桌面伙伴",
    label: "持续迭代",
    note: "继续迭代，不端着。",
    x: 43,
    y: 85,
    kind: "companion",
  },
  {
    id: "game",
    title: "游戏 / 像素风",
    label: "FIFA / FM",
    note: "一个训练临场，一个训练系统。",
    x: 89,
    y: 59,
    kind: "game",
    align: "right",
  },
  {
    id: "algorithm",
    title: "算法学习",
    label: "持续补课",
    note: "把直觉补成更硬的技术理解。",
    x: 82,
    y: 77,
    kind: "algo",
    align: "right",
  },
];

const detailRows = [
  ["真实问题", "problem"],
  ["判断动作", "action"],
  ["留下能力", "ability"],
  ["结果边界", "result"],
] as const;

const nodePoseMap: Record<string, CompanionPose> = {
  search: "map",
  game: "run",
  "image-text": "point",
  monetization: "sit",
  "ai-workflow": "wave",
};

function getNodeById(id: string) {
  return careerNodes.find((node) => node.id === id) ?? careerNodes[0];
}

export function CareerLifeRoadmap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showLife, setShowLife] = useState(true);

  const currentNode = getNodeById(currentCareerId);
  const selectedNode = selectedId ? getNodeById(selectedId) : null;
  const displayNode = selectedNode ?? currentNode;
  const focusNode = getNodeById(hoveredId ?? selectedId ?? currentCareerId);
  const selectedPose = nodePoseMap[displayNode.id] ?? "point";
  const toggleNode = (nodeId: string) => {
    setSelectedId((value) => (value === nodeId ? null : nodeId));
  };
  const progressWidth = `${Math.max(
    0,
    Math.min(82, ((focusNode.x - routeStart) / routeSpan) * 82),
  )}%`;

  return (
    <div className="isolate flex h-full flex-col overflow-hidden rounded-[8px] border-2 border-[#14110e] bg-[#f4dfbd] shadow-[6px_6px_0_#14110e]">
      <div className="relative border-b-2 border-[#14110e] bg-[#fff8eb] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="grid size-8 place-items-center rounded-[5px] border-2 border-[#14110e] bg-[#c92a20] text-sm font-semibold text-[#fff8eb] shadow-[2px_2px_0_#14110e]"
              aria-hidden="true"
            >
              路
            </span>
            <div>
              <h2 className="text-xl font-semibold leading-6 text-[#14110e]">
                我的路线图
              </h2>
              <p className="text-xs leading-5 text-[#5b4635]">
                职业与生活地图，点击节点看路径和能力。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-[4px] border border-[#c92a20]/35 bg-[#fff2d8] px-2 py-1 font-mono text-[0.62rem] font-semibold text-[#c92a20] xl:inline">
              Portfolio Map
            </span>
            <button
              type="button"
              data-testid="roadmap-life-toggle"
              onClick={() => setShowLife((value) => !value)}
              className="group flex items-center gap-2 rounded-[5px] border border-[#8b3a28]/45 bg-[#fff2d8] px-3 py-2 text-xs font-semibold text-[#4b3829] transition hover:-translate-y-0.5 hover:border-[#c92a20]"
              aria-pressed={showLife}
            >
              <span className="hidden sm:inline">
                {showLife ? "只看职业" : "展开生活支线"}
              </span>
              <span
                className={[
                  "relative inline-flex h-4 w-8 rounded-full border border-[#14110e] transition",
                  showLife ? "bg-[#c92a20]" : "bg-[#f4dfbd]",
                ].join(" ")}
                aria-hidden="true"
              >
                <span
                  className={[
                    "absolute top-0.5 size-2.5 rounded-full border border-[#14110e] bg-[#fff8eb] transition",
                    showLife ? "left-[17px]" : "left-0.5",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden flex-1 md:block">
        <div className="h-full bg-[#f4dfbd] p-4">
          <div className="relative h-full min-h-[36.5rem] overflow-hidden rounded-[8px] border border-dashed border-[#b75a3a]/70 bg-[#f8ead0] shadow-[inset_0_0_0_1px_rgba(255,248,235,0.85)]">
            <MapCorners />
            <MapTexture />

            <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between gap-3 rounded-[5px] border border-[#c92a20]/22 bg-[#fff8eb]/72 px-3 py-2 shadow-[2px_2px_0_rgba(139,58,40,0.12)]">
              <p className="text-sm font-semibold leading-6 text-[#14110e]">
                {focusNode.hoverLine}
              </p>
              <span className="hidden rounded-[5px] border border-[#c92a20]/35 bg-[#fff2d8] px-3 py-1 text-xs font-semibold text-[#c92a20] xl:inline">
                点击节点展开详情
              </span>
            </div>

            {showLife ? <LifeBranchLayer /> : null}

            <div className="absolute left-[9%] right-[9%] top-[32%] z-10 h-4 border border-[#8b3a28]/55 bg-[#d0a66e]/45 shadow-[0_2px_0_rgba(20,17,14,0.18)]">
              <span className="absolute inset-y-0 left-1 right-1 bg-[repeating-linear-gradient(90deg,rgba(139,58,40,0.34)_0_10px,rgba(255,248,235,0.52)_10px_17px)]" />
              <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-[#8b3a28]/70" />
            </div>
            <div
              className="absolute left-[9%] top-[32%] z-20 h-4 border border-[#14110e] bg-[#c92a20] shadow-[0_2px_0_rgba(20,17,14,0.18)] transition-all duration-300"
              style={{ width: progressWidth }}
            >
              <span className="absolute inset-y-0 left-1 right-1 bg-[repeating-linear-gradient(90deg,rgba(255,248,235,0.28)_0_7px,transparent_7px_14px)]" />
            </div>

            {careerNodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isCurrent = currentNode.id === node.id;
              const isFocused = focusNode.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  data-testid={`roadmap-node-${node.id}`}
                  onClick={() => toggleNode(node.id)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={[
                    "absolute top-[26.1%] z-30 min-w-[6.6rem] -translate-x-1/2 rounded-[3px] border-2 px-2.5 py-2.5 text-sm font-semibold shadow-[4px_4px_0_#14110e] transition duration-150",
                    "focus:outline-none focus:ring-2 focus:ring-[#14110e] focus:ring-offset-2 focus:ring-offset-[#f4dfbd]",
                    isSelected || isFocused || isCurrent
                      ? "border-[#c92a20] bg-[#fff2d8] text-[#c92a20] -translate-y-1 shadow-[4px_4px_0_#c92a20]"
                      : "border-[#14110e] bg-[#fff8eb] text-[#14110e] hover:-translate-y-1 hover:border-[#c92a20] hover:bg-[#fff2d8]",
                  ].join(" ")}
                  style={{ left: `${node.x}%` }}
                  aria-pressed={isSelected}
                >
                  <span className="flex items-center justify-center gap-1.5 whitespace-nowrap [overflow-wrap:normal]">
                    <span
                      className={[
                        "grid size-6 shrink-0 place-items-center rounded-[3px] border text-[0.7rem] shadow-[1px_1px_0_rgba(20,17,14,0.35)]",
                        isSelected || isFocused || isCurrent
                          ? "border-[#c92a20] bg-[#c92a20] text-[#fff8eb]"
                          : "border-[#14110e] bg-[#fff2d8] text-[#c92a20]",
                      ].join(" ")}
                    >
                      {node.symbol}
                    </span>
                    <span>{node.title}</span>
                  </span>
                  <span className="mt-1 block text-center font-mono text-[0.56rem] font-semibold leading-3 text-[#8b3a28] opacity-80">
                    {node.stage}
                  </span>
                  <span
                    className={[
                      "absolute -bottom-[14px] left-1/2 size-5 -translate-x-1/2 rotate-45 border-2",
                      isSelected || isFocused || isCurrent
                        ? "border-[#c92a20] bg-[#fff2d8]"
                        : "border-[#14110e] bg-[#fff8eb]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span
                    className={[
                      "absolute -bottom-[27px] left-1/2 size-4 -translate-x-1/2 rounded-full border-2 border-[#14110e]",
                      isSelected || isFocused || isCurrent
                        ? "bg-[#c92a20]"
                        : "bg-[#fff8eb]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="absolute -top-2 right-2 rounded-sm bg-[#fff8eb] px-1 font-mono text-[0.58rem] text-[#5b4635]">
                    {isCurrent ? "当前" : String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}

            <div
              className="absolute top-[8.4%] z-40 -translate-x-1/2 transition-all duration-300"
              style={{ left: `${displayNode.x}%` }}
              aria-hidden="true"
            >
              <div className="relative flex h-[6.5rem] w-[5.5rem] items-end justify-center">
                <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-[#14110e] bg-[#fff8eb] px-2 py-1 text-[0.68rem] font-semibold text-[#14110e] shadow-[2px_2px_0_#14110e]">
                  {selectedNode && selectedNode.id !== currentNode.id
                    ? "查看节点"
                    : "当前阶段"}
                </span>
                <CompanionSprite
                  pose={selectedPose}
                  className="h-[5.1rem] w-[5.1rem] origin-bottom transition-transform duration-200"
                />
                <span className="absolute bottom-0 right-0 grid size-6 place-items-center rounded-[3px] border border-[#14110e] bg-[#c92a20] font-mono text-[0.56rem] font-semibold text-[#fff8eb] shadow-[1px_1px_0_#14110e]">
                  PM
                </span>
              </div>
            </div>

            {selectedNode ? (
              <div
                data-testid="roadmap-detail-card"
                className="absolute left-1/2 top-[42%] z-30 w-[52%] max-w-[28rem] -translate-x-1/2 rounded-[6px] border-2 border-[#14110e] bg-[#fff8eb] p-2.5 shadow-[5px_5px_0_#14110e]"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#8b3a28]/24 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-[4px] border border-[#14110e] bg-[#c92a20] font-mono text-xs font-semibold text-[#fff8eb] shadow-[1px_1px_0_#14110e]">
                      {selectedNode.symbol}
                    </span>
                    <h3 className="text-base font-semibold text-[#14110e]">
                      {selectedNode.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    data-testid="roadmap-detail-close"
                    onClick={() => setSelectedId(null)}
                    className="grid size-7 shrink-0 place-items-center border border-[#14110e] bg-[#fff2d8] text-lg font-semibold leading-none text-[#14110e] shadow-[2px_2px_0_#14110e] transition hover:-translate-y-0.5 hover:bg-[#c92a20] hover:text-[#fff8eb]"
                    aria-label="收起项目详情"
                    title="收起详情"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2 grid gap-1.5">
                  {detailRows.map(([label, key]) => (
                    <div
                      key={label}
                      className="grid gap-1 rounded-[5px] border border-[#8b3a28]/18 bg-[#fff2d8] px-3 py-1 text-[0.76rem] leading-[1.35] xl:grid-cols-[4.15rem_1fr]"
                    >
                      <span className="font-semibold text-[#c92a20]">{label}</span>
                      <span className="text-[#3a2e24]">
                        {selectedNode[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="absolute bottom-3 left-4 z-20 flex flex-wrap gap-2 rounded-[5px] border border-[#8b3a28]/45 bg-[#fff8eb]/88 px-3 py-2 text-[0.72rem] font-semibold text-[#4b3829] shadow-[2px_2px_0_rgba(20,17,14,0.08)]">
              <LegendDot color="bg-[#c92a20]" label="主线：职业路径" />
              <LegendDash label="支线：生活兴趣" />
              <span className="flex items-center gap-1">
                <CompanionSprite pose="point" className="h-5 w-5" />
                当前阶段
              </span>
            </div>

            <div className="absolute bottom-3 right-4 z-20 hidden rounded-[5px] border border-[#c92a20]/45 bg-[#fff2d8]/82 px-3 py-2 font-mono text-xs font-semibold text-[#c92a20] shadow-[2px_2px_0_rgba(20,17,14,0.08)] xl:block">
              提示：点击节点看判断
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="space-y-3 bg-[#f4dfbd] p-4">
          <p className="rounded-[6px] border border-[#8b3a28]/35 bg-[#fff8eb] px-3 py-2 text-sm font-semibold leading-6 text-[#14110e]">
            {focusNode.hoverLine}
          </p>

          <div className="space-y-3">
            {careerNodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isCurrent = currentNode.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  data-testid={`roadmap-mobile-node-${node.id}`}
                  onClick={() => toggleNode(node.id)}
                  className={[
                    "w-full rounded-[8px] border-2 p-3 text-left shadow-[3px_3px_0_#14110e] transition",
                    isSelected || isCurrent
                      ? "border-[#c92a20] bg-[#fff2d8] text-[#c92a20]"
                      : "border-[#14110e] bg-[#fff8eb] text-[#14110e]",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-[6px] border border-current font-mono text-xs font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-base font-semibold">
                        {node.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 opacity-85">
                        {node.hoverLine}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedNode ? (
            <div
              data-testid="roadmap-mobile-detail-card"
              className="rounded-[8px] border-2 border-[#14110e] bg-[#fff8eb] p-3 shadow-[4px_4px_0_#14110e]"
            >
              <div className="flex items-center gap-2 border-b border-[#8b3a28]/24 pb-2">
                <CompanionSprite
                  pose={selectedPose}
                  alt="作品集桌面伙伴"
                  className="h-12 w-12"
                />
                <h3 className="min-w-0 flex-1 text-base font-semibold text-[#14110e]">
                  {selectedNode.title}
                </h3>
                <button
                  type="button"
                  data-testid="roadmap-mobile-detail-close"
                  onClick={() => setSelectedId(null)}
                  className="grid size-8 shrink-0 place-items-center border border-[#14110e] bg-[#fff2d8] text-xl font-semibold leading-none text-[#14110e] shadow-[2px_2px_0_#14110e]"
                  aria-label="收起项目详情"
                >
                  ×
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {detailRows.map(([label, key]) => (
                  <div
                    key={label}
                    className="rounded-[6px] border border-[#8b3a28]/18 bg-[#fff2d8] px-3 py-2 text-sm leading-6"
                  >
                    <span className="font-semibold text-[#c92a20]">
                      {label}：
                    </span>
                    <span className="text-[#3a2e24]">{selectedNode[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-[8px] border border-dashed border-[#8b3a28]/45 bg-[#fff8eb]/75 px-3 py-2.5 text-sm leading-6 text-[#5b4635]">
              <CompanionSprite
                pose={nodePoseMap[currentNode.id] ?? "sit"}
                alt="作品集桌面伙伴"
                className="h-10 w-10 shrink-0"
              />
              <span>
                当前阶段是
                <strong className="mx-1 text-[#c92a20]">
                  {currentNode.title}
                </strong>
                ，点击任意节点展开详情。
              </span>
            </div>
          )}

          {showLife ? (
            <div className="grid gap-2 rounded-[8px] border border-[#8b3a28]/35 bg-[#fff8eb] p-3">
              <p className="text-sm font-semibold text-[#14110e]">
                生活支线，作为观察来源
              </p>
              {lifeNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-2 rounded-[6px] border border-[#8b3a28]/18 bg-[#fff2d8] px-3 py-2"
                >
                  <Sticker kind={node.kind} />
                  <span>
                    <span className="block text-sm font-semibold text-[#14110e]">
                      {node.title}
                    </span>
                    <span className="block text-xs leading-5 text-[#5b4635]">
                      {node.note}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MapTexture() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(201,42,32,0.05),transparent_17%),radial-gradient(circle_at_74%_78%,rgba(76,155,180,0.08),transparent_18%),linear-gradient(90deg,rgba(139,58,40,0.075)_1px,transparent_1px),linear-gradient(180deg,rgba(139,58,40,0.075)_1px,transparent_1px)] bg-[length:auto,auto,26px_26px,26px_26px]" />
      <div className="absolute left-8 top-14 opacity-45">
        <PixelTree />
      </div>
      <div className="absolute left-[17%] top-[14%] opacity-35">
        <PixelTree />
      </div>
      <div className="absolute left-[35%] top-[10%] opacity-36">
        <PixelMountain />
      </div>
      <div className="absolute right-14 top-12 opacity-58">
        <PixelLighthouse />
      </div>
      <div className="absolute bottom-10 left-5 h-8 w-32 rounded-tr-[22px] border-t-2 border-[#4c9bb4]/70 bg-[#4c9bb4]/12" />
      <div className="absolute bottom-11 left-20 h-3 w-20 rounded-full border-t-2 border-[#4c9bb4]/50" />
      <div className="absolute bottom-12 left-[52%] h-1 w-24 -translate-x-1/2 bg-[#4c9bb4]/18" />
      <div className="absolute bottom-12 right-14 opacity-35">
        <PixelMountain />
      </div>
      <div className="absolute bottom-20 right-[6%] opacity-28">
        <PixelMountain />
      </div>
      <div className="absolute right-8 top-[20%] size-4 border-2 border-[#8b3a28]/22 bg-[#fff8eb]/45" />
      <div className="absolute left-[43%] top-[20%] h-1 w-16 bg-[#4c9bb4]/16" />
      <div className="absolute left-[2%] bottom-[34%] h-1 w-20 bg-[#4c9bb4]/16" />
    </div>
  );
}

function MapCorners() {
  const base =
    "absolute z-30 size-5 border-[#14110e] opacity-75 pointer-events-none";

  return (
    <>
      <span className={`${base} left-2 top-2 border-l-2 border-t-2`} />
      <span className={`${base} right-2 top-2 border-r-2 border-t-2`} />
      <span className={`${base} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${base} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  );
}

function LifeBranchLayer() {
  return (
    <div aria-label="生活支线" className="absolute inset-0 z-20">
      <div className="absolute left-[9%] top-[36%] h-[25%] w-[13%] rounded-bl-[18px] border-b-2 border-l-2 border-dashed border-[#8b3a28]/48" />
      <div className="absolute left-[29%] top-[36%] h-[42%] w-[12%] rounded-bl-[18px] border-b-2 border-l-2 border-dashed border-[#8b3a28]/48" />
      <div className="absolute left-[50%] top-[39%] h-[47%] w-[8%] rounded-bl-[18px] border-b-2 border-l-2 border-dashed border-[#8b3a28]/48" />
      <div className="absolute left-[71%] top-[36%] h-[25%] w-[18%] rounded-br-[18px] border-b-2 border-r-2 border-dashed border-[#8b3a28]/48" />
      <div className="absolute left-[71%] top-[40%] h-[39%] w-[13%] rounded-br-[18px] border-b-2 border-r-2 border-dashed border-[#8b3a28]/48" />
      <span className="absolute left-[9%] top-[36%] size-2 rounded-full border border-[#14110e] bg-[#fff8eb]" />
      <span className="absolute left-[29%] top-[36%] size-2 rounded-full border border-[#14110e] bg-[#fff8eb]" />
      <span className="absolute left-[71%] top-[36%] size-2 rounded-full border border-[#14110e] bg-[#fff8eb]" />

      {lifeNodes.map((node) => (
        <LifeSticker key={node.id} node={node} />
      ))}
    </div>
  );
}

function LifeSticker({ node }: { node: LifeNode }) {
  const align =
    node.align === "right"
      ? "-translate-x-full"
      : node.align === "left"
        ? "translate-x-0"
        : "-translate-x-1/2";
  const tooltipAlign =
    node.align === "right"
      ? "right-0 translate-x-0"
      : node.align === "left"
        ? "left-0 translate-x-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      className={[
        "group absolute -translate-y-1/2 rounded-[5px] border border-[#8b3a28]/45 bg-[#fff8eb]/82 px-3 py-2 opacity-75 shadow-[2px_2px_0_rgba(20,17,14,0.24)] transition hover:-translate-y-[53%] hover:border-[#c92a20]/55 hover:bg-[#fff8eb] hover:opacity-100",
        align,
      ].join(" ")}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      title={node.note}
    >
      <div className="flex items-center gap-2">
        <Sticker kind={node.kind} />
        <div>
          <p className="whitespace-nowrap text-xs font-semibold leading-4 text-[#14110e] [overflow-wrap:normal]">
            {node.title}
          </p>
          <p className="font-mono text-[0.62rem] font-semibold text-[#5b4635]">
            {node.label}
          </p>
        </div>
      </div>
      <div
        className={[
          "pointer-events-none absolute top-full mt-1 hidden w-40 rounded-[5px] border border-[#8b3a28]/40 bg-[#fff8eb] px-2 py-1 text-[0.65rem] font-semibold leading-4 text-[#5b4635] shadow-[2px_2px_0_rgba(20,17,14,0.18)] group-hover:block",
          tooltipAlign,
        ].join(" ")}
      >
        {node.note}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`size-2.5 rounded-full border border-[#14110e] ${color}`} />
      {label}
    </span>
  );
}

function LegendDash({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="h-0 w-8 border-t-2 border-dashed border-[#8b3a28]" />
      {label}
    </span>
  );
}

function Sticker({ kind }: { kind: LifeNode["kind"] }) {
  if (kind === "companion") {
    return <CompanionSprite pose="giggle" className="h-10 w-10 shrink-0" />;
  }

  return (
    <span
      className={[
        "relative grid size-8 shrink-0 place-items-center rounded-[5px] border border-[#14110e] bg-[#fff2d8] text-[0.58rem] font-black text-[#14110e] shadow-[1px_1px_0_#14110e]",
        kind === "football" ? "text-[#c92a20]" : "",
        kind === "mixtape" ? "bg-[#14110e] text-[#fff8eb]" : "",
        kind === "game" ? "bg-[#d9c19a]" : "",
        kind === "algo" ? "bg-[#1a1411] text-[#7dd38a]" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      {kind === "football" ? "球" : null}
      {kind === "mixtape" ? "TAPE" : null}
      {kind === "game" ? "PAD" : null}
      {kind === "algo" ? "CODE" : null}
      {kind === "football" ? (
        <span className="absolute inset-1 rounded-full border border-[#14110e]/50" />
      ) : null}
      {kind === "mixtape" ? (
        <>
          <span className="absolute bottom-1 left-1 right-1 h-1 bg-[#c92a20]" />
          <span className="absolute left-2 top-2 size-1.5 rounded-full bg-[#fff8eb]" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#fff8eb]" />
        </>
      ) : null}
    </span>
  );
}

function CompanionSprite({
  pose,
  alt = "",
  className = "",
}: {
  pose: CompanionPose;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src={withBasePath("/images/portfolio-companion.svg")}
      alt={alt}
      data-pose={pose}
      width={180}
      height={180}
      className={[
        "object-contain drop-shadow-[3px_4px_0_rgba(20,17,14,0.28)]",
        className,
      ].join(" ")}
      unoptimized
    />
  );
}

function PixelTree() {
  return (
    <div className="relative h-9 w-6">
      <span className="absolute bottom-0 left-2 h-4 w-2 bg-[#8b3a28]/55" />
      <span className="absolute left-1 top-2 size-4 bg-[#5d8f5a]/45" />
      <span className="absolute left-2 top-0 size-4 bg-[#5d8f5a]/35" />
      <span className="absolute left-0 top-4 size-4 bg-[#5d8f5a]/30" />
    </div>
  );
}

function PixelMountain() {
  return (
    <div className="flex items-end gap-[-2px]">
      <span className="block h-0 w-0 border-x-[16px] border-b-[22px] border-x-transparent border-b-[#8b3a28]/20" />
      <span className="-ml-2 block h-0 w-0 border-x-[20px] border-b-[30px] border-x-transparent border-b-[#8b3a28]/24" />
    </div>
  );
}

function PixelLighthouse() {
  return (
    <div className="relative h-12 w-8">
      <span className="absolute left-3 top-1 h-10 w-3 border border-[#8b3a28]/35 bg-[#fff8eb]/70" />
      <span className="absolute left-2 top-0 h-2 w-5 bg-[#c92a20]/45" />
      <span className="absolute left-1 bottom-0 h-2 w-7 bg-[#8b3a28]/20" />
    </div>
  );
}
