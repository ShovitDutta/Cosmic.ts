import { createServer, Server as HttpServer } from "node:http";
import { Server, Socket, DisconnectReason } from "socket.io";
import { config } from "dotenv";
import path from "node:path";
import colors from "colors";
import os from "node:os";
import fs from "node:fs";
import next from "next";
config();
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const isProductionFlag: boolean = process.argv.includes("--production");
const isDevelopmentFlag: boolean = process.argv.includes("--dev") || process.argv.includes("--development");
const dev: boolean = isProductionFlag ? false : isDevelopmentFlag ? true : process.env.NODE_ENV !== "production";
const port: number = parseInt(process.env.NEXT_PUBLIC_BASE_PORT as string);
const basePath: string | undefined = process.env.NEXT_PUBLIC_BASE_PATH;
const app = next({ dev, hostname: "0.0.0.0", port, turbo: dev });
const handler = app.getRequestHandler();
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
function getNetworkAddress(): string | null {
    const interfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
    for (const name in interfaces) {
        const interfaceInfo = interfaces[name];
        if (!interfaceInfo) continue;
        for (const { address, family, internal } of interfaceInfo) if (family === "IPv4" && !internal) return address;
    }
    return null;
}
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
function getNextVersion(): string {
    try {
        const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
        const packageJson: { dependencies?: { next?: string } } = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        return packageJson.dependencies?.next || "unknown";
    } catch {
        return "unknown";
    }
}
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
app.prepare().then(() => {
    const httpServer: HttpServer = createServer(handler);
    const io: Server = new Server(httpServer);
    io.on("connection", (socket: Socket) => {
        console.log(colors.green(`Socket Connected: [ID: ${socket.id}, URL: ${socket.handshake.url}, Time: ${socket.handshake.time}, Host: ${socket.handshake.headers.host}]`));
        socket.on("message", (data: unknown) => console.log(`Received message from ${socket.id}:`, data));
        socket.on("disconnect", (reason: DisconnectReason) => console.log(`Socket disconnected: ${socket.id} (${reason})`));
    });
    console.log("Socket.IO routes initialized.");
    const nextVersion: string = getNextVersion();
    const networkAddress: string | null = getNetworkAddress();
    const mode = dev ? "Development" : "Production";
    const turboText = dev ? "(Custom Server, Turbopack)" : "(Custom Server, Production)";
    console.log(`\n  ${"▲"} ${colors.bold("Next.js")} ${nextVersion} ${colors.dim(turboText)}`);
    console.log(`  ${colors.dim("-")} ${colors.bold("Mode:")}     ${colors.cyan(mode)}`);
    const localUrl = `http://localhost:${port}${basePath || ""}`;
    const networkUrl = networkAddress ? `http://${networkAddress}:${port}${basePath || ""}` : null;
    console.log(`  ${colors.dim("-")} ${colors.bold("Local:")}    ${colors.green(localUrl)}`);
    if (networkUrl) console.log(`  ${colors.dim("-")} ${colors.bold("Network:")}  ${colors.green(networkUrl)}`);
    else console.log(`  ${colors.dim("-")} ${colors.bold("Network:")}  ${colors.dim("unavailable")}`);
    console.log("\n");
    httpServer
        .once("error", (err: Error) => {
            console.error(colors.red(`HTTP server error:`), err);
            process.exit(1);
        })
        .listen(port, "0.0.0.0", () => console.log(colors.green(`✓ Ready on ${localUrl}`)));
});
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
process.on("uncaughtException", (err: Error) => {
    console.error(colors.red("Uncaught Exception:"), err);
    process.exit(1);
});
process.on("unhandledRejection", (reason: object | null | undefined, promise: Promise<unknown>) => {
    console.error(colors.red("Unhandled Rejection at:"), promise, "reason:", reason);
    process.exit(1);
});
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
