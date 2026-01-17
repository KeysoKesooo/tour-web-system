import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This allows the build to finish even if there are linting errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This allows the build to finish even if there are TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
