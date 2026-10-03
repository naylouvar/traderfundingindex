import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Room for logo uploads (capped at 2 MB in src/lib/uploads.ts) plus form overhead.
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
