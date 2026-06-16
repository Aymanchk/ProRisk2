import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  sassOptions: {
    // Lets SCSS files resolve `@use "theme/tokens"` from anywhere under src.
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

export default withNextIntl(nextConfig);
