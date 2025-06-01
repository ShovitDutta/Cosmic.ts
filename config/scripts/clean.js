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
                } else if (dirent.name === "prisma") {
                    const prismaContents = await fs.readdir(fullPath, { withFileTypes: true });
                    for (const prismaItem of prismaContents) {
                        const prismaItemPath = join(fullPath, prismaItem.name);
                        if (prismaItem.isDirectory() && prismaItem.name === "migrations") {
                            process.stdout.write(`Deleting directory: ${prismaItemPath}\n`);
                            try {
                                if (isWindows) await executeCommand("rmdir", ["/s", "/q", prismaItemPath]);
                                else await executeCommand("rm", ["-rf", prismaItemPath]);
                                deletedCount++;
                            } catch (err) {
                                process.stderr.write(`Failed to delete directory ${prismaItemPath}: ${err.message}\n`);
                            }
                        } else if (prismaItem.isFile() && (prismaItem.name.endsWith(".db") || prismaItem.name.endsWith(".db-journal"))) {
                            process.stdout.write(`Deleting file: ${prismaItemPath}\n`);
                            try {
                                if (isWindows) await executeCommand("del", ["/f", "/q", prismaItemPath]);
                                else await executeCommand("rm", ["-f", prismaItemPath]);
                                deletedCount++;
                            } catch (err) {
                                process.stderr.write(`Failed to delete file ${prismaItemPath}: ${err.message}\n`);
                            }
                        }
                    }
                    await findAndDelete(fullPath);
                } else await findAndDelete(fullPath);
            }
        }
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "EPERM" || error.code === "EACCES") {
            process.stderr.write(`Skipping inaccessible path ${currentPath}: ${error.message}\n`);
        } else {
            process.stderr.write(`Error reading directory ${currentPath}: ${error.message}\n`);
        }
    }
}

(async () => {
    process.stdout.write("Starting clean-up process...\n");
    const rootDir = process.cwd();
    await findAndDelete(rootDir);
    process.stdout.write(`Clean-up process finished. Deleted ${deletedCount} items.\n`);
    process.exit(0);
})();
