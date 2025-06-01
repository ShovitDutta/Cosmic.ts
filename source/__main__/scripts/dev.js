/* eslint-disable no-undef */
import { spawn } from "child_process";
import { config } from "dotenv";
import path from "path";

config();

const nextExecutablePath = path.join(process.cwd(), "node_modules", ".bin", "next");

const child = spawn(nextExecutablePath, ["dev", "--turbopack", "--port", process.env.NEXT_PUBLIC_BASE_PORT, "--hostname", "0.0.0.0"], {
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: "inherit",
    shell: true,
});
const basePath = "";
child.stdout.on("data", data => {
    let output = data.toString();
    output = output.replace(/- Local:\s+http:\/\/localhost:(\d+)/g, `- Local:         http://localhost:$1${basePath}`);
    output = output.replace(/- Network:\s+http:\/\/0\.0\.0\.0:(\d+)/g, `- Network:       http://0.0.0.0:$1${basePath}`);
    process.stdout.write(output);
});
