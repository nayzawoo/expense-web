import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose Vercel private API_KEY to the browser bundle at build time so
  // direct Laravel API calls can send X-Api-Key. Keep WEB_API_KEY in sync
  // on the Laravel side.
  env: {
    API_KEY: process.env.API_KEY ?? "",
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
