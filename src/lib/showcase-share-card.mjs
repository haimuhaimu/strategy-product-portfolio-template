import { getSafeCurrentPageUrl } from "./showcase-share.mjs";

export const SHOWCASE_SHARE_CARD_WIDTH = 1200;
export const SHOWCASE_SHARE_CARD_HEIGHT = 1500;
export const SHOWCASE_REPOSITORY_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template";
export const SHOWCASE_CONTRIBUTION_URL = "https://github.com/haimuhaimu/strategy-product-portfolio-template/issues/new?template=showcase.yml";

const DIMENSIONS = [
  ["resultEvidence", "结果证据"],
  ["scopeAndAttribution", "口径归因"],
  ["methodEvidence", "方法证据"],
  ["artifactEvidence", "资产证据"],
  ["contributionBoundary", "贡献边界"],
];

function cleanText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

export function escapeShowcaseSvgText(value) {
  return cleanText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function splitText(value, maxCharacters, maxLines) {
  const characters = Array.from(cleanText(value));
  const lines = [];
  for (let index = 0; index < characters.length && lines.length < maxLines; index += maxCharacters) {
    const line = characters.slice(index, index + maxCharacters).join("");
    const hasMore = index + maxCharacters < characters.length;
    lines.push(hasMore && lines.length === maxLines - 1 ? `${line.slice(0, -1)}…` : line);
  }
  return lines.length > 0 ? lines : ["待补充"];
}

function compactUrl(value, maxCharacters = 92) {
  const text = cleanText(value).replace(/^https?:\/\//u, "");
  return Array.from(text).length > maxCharacters
    ? `${Array.from(text).slice(0, maxCharacters - 1).join("")}…`
    : text;
}

export function createShowcaseShareCardModel(entry, currentHref) {
  return {
    slug: cleanText(entry.slug),
    kind: entry.kind === "maintainer/self-test" ? "维护者自测" : "社区投稿",
    roleTags: Array.isArray(entry.roleTags) ? entry.roleTags.map(cleanText).slice(0, 8) : [],
    publicHighlights: Array.isArray(entry.publicHighlights)
      ? entry.publicHighlights.map(cleanText).slice(0, 3)
      : [],
    auditSummary: {
      score: Number.isInteger(entry.auditSummary?.score) ? entry.auditSummary.score : 0,
      maxScore: 5,
      dimensions: Object.fromEntries(DIMENSIONS.map(([key]) => [key, entry.auditSummary?.dimensions?.[key] === true])),
    },
    detailUrl: getSafeCurrentPageUrl(currentHref, cleanText(entry.slug)),
    repositoryUrl: SHOWCASE_REPOSITORY_URL,
    contributionUrl: SHOWCASE_CONTRIBUTION_URL,
  };
}

function highlightMarkup(highlights) {
  return highlights.map((highlight, index) => {
    const y = 480 + index * 210;
    const lines = splitText(highlight, 34, 3)
      .map((line, lineIndex) => `<text x="152" y="${y + 64 + lineIndex * 40}" fill="#14110e" font-size="29" font-weight="600">${escapeShowcaseSvgText(line)}</text>`)
      .join("");
    return `<g>
      <rect x="72" y="${y}" width="1056" height="174" fill="#fffdf8" stroke="#14110e" stroke-width="2"/>
      <text x="100" y="${y + 66}" fill="#c92a20" font-family="ui-monospace, monospace" font-size="25" font-weight="800">0${index + 1}</text>
      ${lines}
    </g>`;
  }).join("");
}

export function createShowcaseShareCardSvg(entry, currentHref) {
  const card = createShowcaseShareCardModel(entry, currentHref);
  const title = splitText(card.roleTags.length > 0 ? `${card.roleTags[0]}作品集案例` : "作品集案例", 18, 1)[0];
  const tags = splitText(card.roleTags.join(" · "), 45, 1)[0];
  const dimensions = DIMENSIONS.map(([key, label], index) => {
    const x = 72 + index * 211;
    const covered = card.auditSummary.dimensions[key];
    return `<g transform="translate(${x} 1170)">
      <rect width="187" height="106" fill="${covered ? "#eff9f2" : "#fff0ec"}" stroke="#14110e" stroke-width="2"/>
      <text x="94" y="43" text-anchor="middle" fill="#14110e" font-size="22" font-weight="700">${label}</text>
      <text x="94" y="79" text-anchor="middle" fill="${covered ? "#26734d" : "#c92a20"}" font-size="21" font-weight="800">${covered ? "已覆盖" : "待补强"}</text>
    </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SHOWCASE_SHARE_CARD_WIDTH}" height="${SHOWCASE_SHARE_CARD_HEIGHT}" viewBox="0 0 ${SHOWCASE_SHARE_CARD_WIDTH} ${SHOWCASE_SHARE_CARD_HEIGHT}">
    <rect width="1200" height="1500" fill="#fffaf0"/>
    <rect x="30" y="30" width="1140" height="1440" fill="none" stroke="#14110e" stroke-width="3"/>
    <rect x="72" y="70" width="1056" height="12" fill="#c92a20"/>
    <text x="72" y="145" fill="#8b3a28" font-family="ui-monospace, monospace" font-size="24" font-weight="700" letter-spacing="3">COMMUNITY SHOWCASE</text>
    <text x="72" y="235" fill="#14110e" font-family="serif" font-size="58" font-weight="700">${escapeShowcaseSvgText(title)}</text>
    <text x="72" y="294" fill="#6e5743" font-size="25">${escapeShowcaseSvgText(tags)}</text>
    <rect x="72" y="340" width="780" height="84" fill="#f4dfbd"/>
    <text x="104" y="393" fill="#8b3a28" font-family="ui-monospace, monospace" font-size="24" font-weight="700">${escapeShowcaseSvgText(card.slug)} · ${escapeShowcaseSvgText(card.kind)}</text>
    <text x="1090" y="405" text-anchor="end" fill="#14110e" font-family="ui-monospace, monospace" font-size="64" font-weight="800">${card.auditSummary.score}/${card.auditSummary.maxScore}</text>
    ${highlightMarkup(card.publicHighlights)}
    ${dimensions}
    <text x="72" y="1336" fill="#26734d" font-size="24" font-weight="700">纯本地生成 · 仅含 Showcase 公开字段 · 不含外部图片</text>
    <text x="72" y="1380" fill="#1437d6" font-family="ui-monospace, monospace" font-size="18">详情：${escapeShowcaseSvgText(compactUrl(card.detailUrl))}</text>
    <text x="72" y="1417" fill="#6e5743" font-family="ui-monospace, monospace" font-size="18">Star：${escapeShowcaseSvgText(compactUrl(card.repositoryUrl))}</text>
    <text x="72" y="1452" fill="#6e5743" font-family="ui-monospace, monospace" font-size="18">投稿：${escapeShowcaseSvgText(compactUrl(card.contributionUrl))}</text>
  </svg>`;
}
