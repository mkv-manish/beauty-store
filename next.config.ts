import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], deviceSizes: [360, 640, 768, 1024, 1280, 1920] },
};

export default nextConfig;
