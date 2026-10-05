import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sculpture images carry fine stone grain that falls apart below ~80.
    qualities: [75, 82, 85],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
