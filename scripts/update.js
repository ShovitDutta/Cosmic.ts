import { join } from "path";
import process from "process";
import { config } from "dotenv";
import { promises as fs } from "fs";
import { spawn } from "child_process";
config();
async function executeCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd, shell: true, env: { ...process.env, FORCE_COLOR: "1" }, stdio: "inherit" });
        child.on("close", code => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}: ${command} ${args.join(" ")}`));
        });
        child.on("error", err => reject(err));
    });
}
let updatedCount = 0;
async function findAndUpdate(currentPath) {
    try {
        const dirents = await fs.readdir(currentPath, { withFileTypes: true });
        for (const dirent of dirents) {
            const fullPath = join(currentPath, dirent.name);
            if (dirent.isDirectory()) {
                if (dirent.name !== "node_modules" && dirent.name !== ".turbo" && dirent.name !== ".git") {
                    try {
                        const packageJsonPath = join(fullPath, "package.json");
                        await fs.access(packageJsonPath);
                        process.stdout.write(`Updating dependencies in: ${fullPath}\n`);
                        try {
                            await executeCommand("yarn", ["upgrade", "--latest", "--force"], fullPath);
                            updatedCount++;
                        } catch (err) {
                            process.stderr.write(`Failed to update dependencies in ${fullPath}: ${err.message}\n`);
                        }
                    } catch {
                        await findAndUpdate(fullPath);
                    }
                }
            }
        }
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "EPERM" || error.code === "EACCES") process.stderr.write(`Skipping inaccessible path ${currentPath}: ${error.message}\n`);
        else process.stderr.write(`Error reading directory ${currentPath}: ${error.message}\n`);
    }
}
(async () => {
    process.stdout.write("Starting dependency update process...\n");
    const rootDir = process.cwd();
    await findAndUpdate(rootDir);
    process.stdout.write(`Dependency update process finished. Updated ${updatedCount} projects.\n`);
    process.exit(0);
})();
