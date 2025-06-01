const basePeers = process.env.NEXT_PUBLIC_CONNECT_PEERS;
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
    env: { NEXT_PUBLIC_INTERNAL_API_HOST: "http://localhost:3000", ...(basePeers && { NEXT_PUBLIC_CONNECT_PEERS: basePeers }) },
    ...(basePeers && {
        async headers() {
            return [
                {
                    source: "/:path*",
                    headers: [
                        { key: "X-Connect-Peers", value: basePeers },
                        { key: "Access-Control-Allow-Origin", value: "*" },
                        { key: "Access-Control-Allow-Credentials", value: "true" },
                        { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                        { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                    ],
                },
            ];
        },
    }),
};
export default nextConfig;