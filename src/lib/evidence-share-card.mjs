import {
  createSafeDiagnosticShareModel,
  normalizeSafePriorityQuestion,
  SHARE_DIMENSIONS,
} from "./diagnostic-share.mjs";

export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 1500;
export const SHARE_CARD_PRODUCT_NAME = "Strategy Product Portfolio";

export function escapeSvgText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeExperienceUrl(experienceUrl) {
  try {
    const url = new URL(String(experienceUrl));
    if (!new Set(["http:", "https:"]).has(url.protocol)) throw new TypeError("Invalid protocol");
    return url.toString();
  } catch {
    return "";
  }
}

export function createEvidenceShareCardModel(report, experienceUrl) {
  const safeModel = createSafeDiagnosticShareModel(report);
  return {
    productName: SHARE_CARD_PRODUCT_NAME,
    experienceUrl: normalizeExperienceUrl(experienceUrl),
    score: safeModel.totalScore,
    maxScore: 5,
    level: safeModel.level,
    dimensions: SHARE_DIMENSIONS.map(([key, label]) => ({
      key,
      label,
      coverage: safeModel.dimensions[key],
    })),
    privacyRiskCount: safeModel.privacyRiskCount,
    priorityQuestion: normalizeSafePriorityQuestion(safeModel.priorityQuestion),
    privacyStatement: "完全本地运行 · 不上传经历 · 分享卡不含原文",
  };
}

function splitQuestion(question, maxCharacters = 23) {
  const characters = Array.from(question);
  const lines = [];
  for (let index = 0; index < characters.length; index += maxCharacters) {
    lines.push(characters.slice(index, index + maxCharacters).join(""));
  }
  return lines.slice(0, 3);
}

export function createEvidenceShareCardSvg(report, experienceUrl) {
  const card = createEvidenceShareCardModel(report, experienceUrl);
  const questionLines = splitQuestion(card.priorityQuestion);
  const dimensionCards = card.dimensions.map((dimension, index) => {
    const x = 72 + index * 211;
    const fill = dimension.coverage > 0 ? "#eff9f2" : "#fff0ec";
    const accent = dimension.coverage > 0 ? "#26734d" : "#c92a20";
    return `<g transform="translate(${x} 690)">
      <rect width="187" height="176" fill="${fill}" stroke="#14110e" stroke-width="2"/>
      <text x="18" y="47" fill="#14110e" font-size="25" font-weight="700">${escapeSvgText(dimension.label)}</text>
      <text x="18" y="116" fill="${accent}" font-size="50" font-weight="800">${dimension.coverage}%</text>
      <rect x="18" y="139" width="151" height="10" fill="#14110e" opacity="0.12"/>
      <rect x="18" y="139" width="${Math.round(151 * dimension.coverage / 100)}" height="10" fill="${accent}"/>
    </g>`;
  }).join("");
  const questionText = questionLines.map((line, index) => (
    `<text x="110" y="${1044 + index * 56}" fill="#14110e" font-size="34" font-weight="700">${escapeSvgText(line)}</text>`
  )).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SHARE_CARD_WIDTH}" height="${SHARE_CARD_HEIGHT}" viewBox="0 0 ${SHARE_CARD_WIDTH} ${SHARE_CARD_HEIGHT}">
    <rect width="1200" height="1500" fill="#fffaf0"/>
    <rect x="30" y="30" width="1140" height="1440" fill="none" stroke="#14110e" stroke-width="3"/>
    <rect x="72" y="70" width="1056" height="12" fill="#c92a20"/>
    <text x="72" y="145" fill="#8b3a28" font-family="ui-monospace, monospace" font-size="24" font-weight="700" letter-spacing="3">${escapeSvgText(card.productName)}</text>
    <text x="72" y="230" fill="#14110e" font-family="serif" font-size="57" font-weight="700">本地作品集证据体检</text>
    <text x="72" y="330" fill="#6e5743" font-size="25">总分 / 等级</text>
    <text x="72" y="495" fill="#14110e" font-family="ui-monospace, monospace" font-size="170" font-weight="800">${card.score}</text>
    <text x="370" y="475" fill="#6e5743" font-size="39">/ ${card.maxScore}</text>
    <rect x="870" y="355" width="258" height="110" fill="#f4dfbd" stroke="#14110e" stroke-width="2"/>
    <text x="999" y="425" fill="#8b3a28" text-anchor="middle" font-size="36" font-weight="700">${escapeSvgText(card.level)}</text>
    <line x1="72" y1="555" x2="1128" y2="555" stroke="#14110e" stroke-width="2"/>
    <text x="72" y="635" fill="#14110e" font-size="31" font-weight="700">五维覆盖</text>
    ${dimensionCards}
    <rect x="72" y="912" width="1056" height="250" fill="#f4dfbd"/>
    <text x="110" y="975" fill="#8b3a28" font-family="ui-monospace, monospace" font-size="21" font-weight="700" letter-spacing="2">唯一优先追问</text>
    ${questionText}
    <text x="72" y="1245" fill="#14110e" font-size="30" font-weight="700">隐私风险：${card.privacyRiskCount} 类</text>
    <text x="72" y="1315" fill="#26734d" font-size="27" font-weight="700">${escapeSvgText(card.privacyStatement)}</text>
    <text x="72" y="1390" fill="#1437d6" font-family="ui-monospace, monospace" font-size="21">${escapeSvgText(card.experienceUrl)}</text>
  </svg>`;
}
