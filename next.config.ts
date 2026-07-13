import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 430, 576, 640, 768, 1024, 1366, 1440, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
