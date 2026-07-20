import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  serverExternalPackages: [
    "mongodb",
    "better-auth",
    "@better-auth/mongo-adapter",
    "groq-sdk",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
