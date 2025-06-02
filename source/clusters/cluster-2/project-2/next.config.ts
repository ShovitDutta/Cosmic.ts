/* eslint-disable turbo/no-undeclared-env-vars */
const basePeers = process.env.NEXT_PUBLIC_CONNECT_PEERS;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
const basePort = process.env.NEXT_PUBLIC_BASE_PORT;
import { commonNextConfig } from "@cosmos/next";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    basePath: basePath,
    ...commonNextConfig,
    async rewrites() {
        return [{ source: basePath + "/api/:path*", destination: "/api/:path*" }];
    },
    env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_INTERNAL_API_HOST: basePath?.replace("/", "") + ":" + basePort, ...(basePeers && { NEXT_PUBLIC_CONNECT_PEERS: basePeers }) },
};
export default nextConfig;
