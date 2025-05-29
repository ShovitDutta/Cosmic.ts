import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
    basePath: process.env.NODE_ENV === "production" ? "/project-1" : "",
    env: { NEXT_PUBLIC_BASE_PATH: "/project-1", NEXT_PUBLIC_INTERNAL_API_HOST: "project-1:3001" },
    async headers() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/:path*",
                    headers: [
                        { key: "Access-Control-Allow-Origin", value: "*" },
                        { key: "Access-Control-Allow-Credentials", value: "true" },
                        { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                        { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                    ],
                },
            ];
        } else return [];
    },
};
export default nextConfig;
