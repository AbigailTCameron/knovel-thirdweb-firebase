import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // Workaround for Turbopack + pino/thread-stream issue
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
