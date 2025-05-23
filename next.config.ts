import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `${process.env.BACKEND_API}/:path*`, // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;