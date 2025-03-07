import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  },
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['airtable'],
  },
};

export default nextConfig;
