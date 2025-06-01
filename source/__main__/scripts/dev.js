/* eslint-disable no-undef */
import { spawn } from "child_process";
import { config } from "dotenv";
config();
const child = spawn("next", ["dev", "--turbopack", "--port", process.env.NEXT_PUBLIC_BASE_PORT, "--hostname", "0.0.0.0"], {
    env: { ...process.env, FORCE_COLOR: "1" },
    shell: true,
});
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
child.stdout.on("data", data => {
    let output = data.toString();
    if (basePath != undefined) {
        output = output.replace(/- Local:\s+http:\/\/localhost:(\d+)/g, `- Local:         http://localhost:$1${basePath}`);
        output = output.replace(/- Network:\s+http:\/\/0\.0\.0\.0:(\d+)/g, `- Network:       http://0.0.0.0:$1${basePath}`);
    }
    process.stdout.write(output);
});
child.stderr.on("data", data => process.stderr.write(data.toString()));
child.on("error", err => console.error("Failed to start next dev process:", err));
child.on("close", code => {
    if (code !== 0) console.error(`next dev process exited with code ${code}`);
});