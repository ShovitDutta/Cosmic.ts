import process from "node:process";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
const basePort = process.env.NEXT_PUBLIC_BASE_PORT;
const basePeers = process.env.NEXT_PUBLIC_CONNECT_PEERS;
export { basePath, basePort, basePeers };