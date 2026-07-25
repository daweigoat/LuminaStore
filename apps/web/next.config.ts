import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@luminastore/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
