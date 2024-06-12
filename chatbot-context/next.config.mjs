/** @type {import('next').NextConfig} */
import prisma from "./utils/prisma.mjs";
const nextConfig = {
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  env: {
    APPBLOCKS_DISCORD_URL: process.env.APPBLOCKS_DISCORD_URL,
    DOCS_PUBLIC_PATH: process.env.DOCS_PUBLIC_PATH,
    BLOCK_ENV_URL_CLIENT_ID: process.env.BLOCK_ENV_URL_CLIENT_ID,
    SHIELD_AUTH_URL: process.env.SHIELD_AUTH_URL,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  },
};

export default nextConfig;
