import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal workspace packages ship TypeScript source.
  transpilePackages: ["@u-drive/core"],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
