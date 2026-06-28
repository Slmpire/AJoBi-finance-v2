import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'ajobi-643447426952.europe-west1.run.app',
      },
      {
        protocol: 'https',
        hostname: 'storage.url',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      }
    ],
  },
};

export default nextConfig;
