import type { NextConfig } from "next";
import { getGithubPagesBasePath } from "./src/lib/github-pages.mjs";

const basePath = getGithubPagesBasePath(process.env);

// Expose the resolved path to browser-facing code so public assets use the same prefix.
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
