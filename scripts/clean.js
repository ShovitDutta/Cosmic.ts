import os from "os";
import { join } from "path";
import process from "process";
import { promises as fs } from "fs";
import { spawn } from "child_process";
const isWindows = os.platform() === "win32";
async function executeCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd, shell: true, stdio: "inherit" });
        child.on("close", code => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}: ${command} ${args.join(" ")}`));
        });
        child.on("error", err => reject(err));
    });
}
let deletedCount = 0;
async function findAndDelete(currentPath) {
    try {
        const dirents = await fs.readdir(currentPath, { withFileTypes: true });
        for (const dirent of dirents) {
            const fullPath = join(currentPath, dirent.name);
            if (dirent.isDirectory()) {
                if (dirent.name === "node_modules" || dirent.name === ".turbo") {
                    process.stdout.write(`Deleting directory: ${fullPath}\n`);
                    try {
                        if (isWindows) await executeCommand("rmdir", ["/s", "/q", fullPath]);
                        else await executeCommand("rm", ["-rf", fullPath]);
                        deletedCount++;
                    } catch (err) {
                        process.stderr.write(`Failed to delete directory ${fullPath}: ${err.message}\n`);
                    }
                } else if (dirent.name === "drizzle") {
                    const drizzleContents = await fs.readdir(fullPath, { withFileTypes: true });
                    for (const drizzleItem of drizzleContents) {
                        const drizzleItemPath = join(fullPath, drizzleItem.name);
                        if (drizzleItem.isDirectory() && drizzleItem.name === "meta") {
                            process.stdout.write(`Deleting directory: ${drizzleItemPath}\n`);
                            try {
                                if (isWindows) await executeCommand("rmdir", ["/s", "/q", drizzleItemPath]);
                                else await executeCommand("rm", ["-rf", drizzleItemPath]);
                                deletedCount++;
                            } catch (err) {
                                process.stderr.write(`Failed to delete directory ${drizzleItemPath}: ${err.message}\n`);
                            }
                        }
                    }
                    await findAndDelete(fullPath);
                } else await findAndDelete(fullPath);
            } else if (dirent.isFile() && (dirent.name.endsWith(".db") || dirent.name.endsWith(".sql"))) {
                process.stdout.write(`Deleting file: ${fullPath}\n`);
                try {
                    if (isWindows) await executeCommand("del", ["/f", "/q", fullPath]);
                    else await executeCommand("rm", ["-f", fullPath]);
                    deletedCount++;
                } catch (err) {
                    process.stderr.write(`Failed to delete file ${fullPath}: ${err.message}\n`);
                }
            }
        }
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "EPERM" || error.code === "EACCES") process.stderr.write(`Skipping inaccessible path ${currentPath}: ${error.message}\n`);
        else process.stderr.write(`Error reading directory ${currentPath}: ${error.message}\n`);
    }
}
(async () => {
    process.stdout.write("Starting clean-up process...\n");
    const rootDir = process.cwd();
    await findAndDelete(rootDir);
    process.stdout.write(`Clean-up process finished. Deleted ${deletedCount} items.\n`);
    process.exit(0);
})();
