import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // three.js 사용 시 필요할 수 있음
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: "raw-loader",
    });

    config.resolve.extensions.push(".glsl", ".vs", ".fs");

    return config;
  },
};

export default nextConfig;
