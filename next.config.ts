import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images
  images: {
    domains: [],
  },
  // Handle proxy issues
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  // Disable proxy for development
  experimental: {
    proxy: false,
  },
};

export default nextConfig;
