import { createServer } from "node:http";
import process from "node:process";
import { Server } from "socket.io";
import { config } from "dotenv";
import path from "node:path";
import colors from "colors";
import os from "node:os";
import fs from "node:fs";
import next from "next";
config();
const isProductionFlag = process.argv.includes("--production");
const isDevelopmentFlag = process.argv.includes("--dev") || process.argv.includes("--development");
const dev = isProductionFlag ? false : isDevelopmentFlag ? true : process.env.NODE_ENV !== "production";
const port = parseInt(process.env.NEXT_PUBLIC_BASE_PORT);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
const app = next({ dev, hostname: "0.0.0.0", port, turbo: dev });
const handler = app.getRequestHandler();
function getNetworkAddress() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        const interfaceInfo = interfaces[name];
        if (!interfaceInfo) continue;
        for (const { address, family, internal } of interfaceInfo) if (family === "IPv4" && !internal) return address;
    }
    return null;
}
function getNextVersion() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        return packageJson.dependencies?.next || "unknown";
    } catch {
        return "unknown";
    }
}
app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: { origin: process.env.NEXT_PUBLIC_CONNECT_PEERS ? process.env.NEXT_PUBLIC_CONNECT_PEERS.split(",") : [], methods: ["GET", "POST"] },
    });
    io.on("connection", (socket) => {
        console.log(colors.green(`Socket Connected: [ID: ${socket.id}, URL: ${socket.handshake.url}, Time: ${socket.handshake.time}, Host: ${socket.handshake.headers.host}]`));
        socket.on("message", (data) => {
            console.log(`Received message from ${socket.id}:`, data);
        });
        socket.on("peer-check", (data, callback) => {
            const response = { port: port, message: `Socket peer ${port} > Connection Verified!`, timestamp: new Date().toISOString(), socketId: socket.id };
            if (callback && typeof callback === "function") callback(response);
            socket.broadcast.emit("peer-check-response", response);
        });
        socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected: ${socket.id} (${reason})`);
        });
    });
    console.log("Socket.IO routes initialized.");
    const nextVersion = getNextVersion();
    const networkAddress = getNetworkAddress();
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
        .once("error", (err) => {
            console.error(colors.red(`HTTP server error:`), err);
            process.exit(1);
        })
        .listen(port, "0.0.0.0", () => console.log(colors.green(`✓ Ready on ${localUrl}`)));
});
process.on("uncaughtException", (err) => {
    console.error(colors.red("Uncaught Exception:"), err);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error(colors.red("Unhandled Rejection at:"), promise, "reason:", reason);
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log(colors.yellow("\nGracefully shutting down..."));
    process.exit(0);
});
