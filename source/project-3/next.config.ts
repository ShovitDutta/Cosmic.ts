import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
    basePath: process.env.NODE_ENV === "production" ? "/project-3" : "",
};
export default nextConfig;
