import { join } from "path";
import process from "process";
import { promises as fs } from "fs";
import { spawn } from "child_process";
const colors = ["\x1b[36m", "\x1b[32m", "\x1b[34m", "\x1b[35m", "\x1b[33m", "\x1b[31m"];
const resetColor = "\x1b[0m";
const sourceDir = join(process.cwd(), "source");
(async () => {
    try {
        const workspaceDirs = await fs.readdir(sourceDir, { withFileTypes: true });
        const processesToRun = [];
        for (const dirent of workspaceDirs) {
            if (dirent.isDirectory()) {
                const workspacePath = join(sourceDir, dirent.name);
                const packageJsonPath = join(workspacePath, "package.json");
                try {
                    const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
                    const packageJson = JSON.parse(packageJsonContent);
                    if (packageJson.scripts && packageJson.scripts.start) processesToRun.push({ name: packageJson.name, command: `yarn workspace ${packageJson.name} start`, cwd: process.cwd() });
                } catch (error) {
                    if (error.code !== "ENOENT") {
                        process.stderr.write(`Could not read package.json in ${dirent.name}: ${error.message}\n`);
                    }
                }
            }
        }
        if (processesToRun.length === 0) {
            process.stdout.write('No workspaces with a "start" script found in source/ directory.\n');
            process.exit(0);
        }
        process.stdout.write(`Found ${processesToRun.length} workspace(s) with 'start' scripts:\n`);
        processesToRun.forEach(p => process.stdout.write(`- ${p.name}\n`));
        let colorIndex = 0;
        for (const procDef of processesToRun) {
            const prefixColor = colors[colorIndex % colors.length];
            const prefix = `${prefixColor}[${procDef.name.toUpperCase()}]${resetColor} `;
            const child = spawn(procDef.command, [], { cwd: procDef.cwd, stdio: ["inherit", "pipe", "pipe"], shell: true });
            child.stdout.on("data", data => {
                const lines = data.toString().split(/\r?\n/);
                lines.forEach(line => {
                    if (line.length > 0) process.stdout.write(`${prefix}${line}\n`);
                });
            });
            child.stderr.on("data", data => {
                const lines = data.toString().split(/\r?\n/);
                lines.forEach(line => {
                    if (line.length > 0) process.stderr.write(`${prefix}${line}\n`);
                });
            });
            child.on("close", code => {
                const exitMessage = `${prefixColor}[${procDef.name.toUpperCase()}]${resetColor} Exited with code ${code}\n`;
                if (code !== 0) process.stderr.write(exitMessage);
                else process.stdout.write(exitMessage);
            });
            child.on("error", err => {
                process.stderr.write(`${prefixColor}[${procDef.name.toUpperCase()}]${resetColor} Failed to start: ${err.message}\n`);
                process.exit(1);
            });
            colorIndex++;
        }
    } catch (error) {
        process.stderr.write(`Error in main script: ${error.message}\n`);
        process.exit(1);
    }
})();
