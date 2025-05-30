import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API}/:path*`, // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;