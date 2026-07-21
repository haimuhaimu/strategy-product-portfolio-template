import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/site-paths.mjs";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH || undefined,
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
