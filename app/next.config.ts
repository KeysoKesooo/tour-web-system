import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Keep this if you want to bypass type errors for now
    ignoreBuildErrors: true,
  },
  // DELETE the entire eslint: { ... } block from here
};

export default nextConfig;
