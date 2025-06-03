import process from "node:process";
const basePort = process.env.NEXT_PUBLIC_BASE_PORT;
const basePeers = process.env.NEXT_PUBLIC_CONNECT_PEERS;
export { basePort, basePeers };