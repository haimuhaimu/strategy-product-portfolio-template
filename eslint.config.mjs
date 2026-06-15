import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      ".vercel/**",
      "out/**",
      "deploy/**",
      "docs/superpowers/**",
      "obsidian/**",
      "output/**",
      "scripts/build-*.mjs",
      "scripts/build-*.py",
      "scripts/install-*.mjs",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
