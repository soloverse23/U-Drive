import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Internal workspace packages ship TypeScript source.
  transpilePackages: ["@u-drive/core", "@u-drive/i18n", "@u-drive/ui-tokens"],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
