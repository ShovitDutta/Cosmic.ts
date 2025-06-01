const basePeers = process.env.NEXT_PUBLIC_CONNECT_PEERS;
import { commonNextConfig } from "@cosmic/next";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    ...commonNextConfig,
    env: { NEXT_PUBLIC_INTERNAL_API_HOST: "http://localhost:3000", ...(basePeers && { NEXT_PUBLIC_CONNECT_PEERS: basePeers }) },
};
export default nextConfig;