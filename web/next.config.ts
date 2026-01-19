import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OpenNext-compatible settings for Netlify deployment
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
