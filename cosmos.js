import { join } from "path";
import * as glob from "glob";
import blessed from "blessed";
import { createHash } from "crypto";
import { spawn } from "child_process";
import * as fsPromises from "fs/promises";
import { readFileSync, statSync } from "fs";
const TASK_OUTPUT_DIRS = { build: ["dist", ".next"] };
const screen = blessed.screen({ smartCSR: true, title: "Cosmos Task Runner", fullUnicode: true, terminal: "xterm-256color", forceUnicode: true, dockBorders: false, transparent: true });
screen.key(["escape", "q", "C-c"], () => process.exit(0));
function getPackageJson(workspacePath) {
    const packageJsonPath = join(workspacePath, "package.json");
    try {
        return JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    } catch (e) {
        return null;
    }
}
function findWorkspaces(patterns) {
    let workspaces = [];
    for (const pattern of patterns) {
        const files = glob.sync(pattern, { cwd: process.cwd() });
        for (const file of files) {
            const packageJsonPath = join(file, "package.json");
            try {
                if (statSync(file).isDirectory() && readFileSync(packageJsonPath, "utf-8")) {
                    workspaces.push(file);
                }
            } catch (e) {}
        }
    }
    return workspaces;
}
async function calculateInputHash(workspacePath, taskName) {
    const hash = createHash("sha256");
    const filesToHash = [];
    filesToHash.push(join(workspacePath, "package.json"));
    const commonConfigFiles = ["tsconfig.json", "next.config.ts", "postcss.config.js", "eslint.config.js", "drizzle.config.ts"];
    for (const configFile of commonConfigFiles) {
        const configFilePath = join(workspacePath, configFile);
        try {
            await fsPromises.stat(configFilePath);
            filesToHash.push(configFilePath);
        } catch (e) {}
    }
    if (taskName === "build") {
        const sourceFiles = glob.sync(join(workspacePath, "src/**/*"), { nodir: true });
        filesToHash.push(...sourceFiles);
    }
    filesToHash.sort();
    for (const filePath of filesToHash) {
        try {
            const content = await fsPromises.readFile(filePath);
            hash.update(content);
        } catch (e) {
            console.warn(`Could not read file for hashing: ${filePath}`, e.message);
        }
    }
    return hash.digest("hex");
}
function getCachePath(workspaceName, taskName, hash) {
    return join(process.cwd(), ".cosmos", workspaceName, `${taskName}-${hash}`);
}
async function restoreFromCache(workspacePath, workspaceName, taskName, hash, outputDirs) {
    const cachePath = getCachePath(workspaceName, taskName, hash);
    try {
        await fsPromises.access(cachePath);
        for (const dir of outputDirs) {
            const sourceDir = join(cachePath, dir);
            const destDir = join(workspacePath, dir);
            try {
                await fsPromises.access(sourceDir);
                await fsPromises.rm(destDir, { recursive: true, force: true });
                await fsPromises.cp(sourceDir, destDir, { recursive: true });
            } catch (e) {
                console.warn(`Partial cache for ${workspaceName}/${taskName}: ${dir} not found in cache.`);
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}
async function saveToCache(workspacePath, workspaceName, taskName, hash, outputDirs) {
    const cachePath = getCachePath(workspaceName, taskName, hash);
    try {
        await fsPromises.mkdir(cachePath, { recursive: true });
        for (const dir of outputDirs) {
            const sourceDir = join(workspacePath, dir);
            const destDir = join(cachePath, dir);
            try {
                await fsPromises.cp(sourceDir, destDir, { recursive: true });
            } catch (e) {
                console.warn(`Could not save ${dir} to cache for ${workspaceName}: ${e.message}`);
            }
        }
    } catch (e) {
        console.error(`Error saving to cache for ${workspaceName}: ${e.message}`);
    }
}
function colorizeLogLine(line) {
    const lowerLine = line.toLowerCase();
    if (
        line.includes("✓") ||
        lowerLine.includes("success") ||
        lowerLine.includes("compiled successfully") ||
        lowerLine.includes("build successful") ||
        lowerLine.includes("complete") ||
        lowerLine.includes("done") ||
        lowerLine.includes("passed") ||
        lowerLine.includes("ok")
    ) {
        return `{green-fg}${line}{/green-fg}`;
    }
    if (
        line.includes("✗") ||
        lowerLine.includes("error") ||
        lowerLine.includes("failed") ||
        lowerLine.includes("failure") ||
        lowerLine.includes("exception") ||
        lowerLine.includes("fatal") ||
        lowerLine.includes("denied") ||
        line.includes("❌")
    ) {
        return `{red-fg}${line}{/red-fg}`;
    }
    if (lowerLine.includes("warn") || lowerLine.includes("warning") || lowerLine.includes("deprecated") || lowerLine.includes("caution") || line.includes("⚠") || line.includes("⚠️")) {
        return `{yellow-fg}${line}{/yellow-fg}`;
    }
    if (
        lowerLine.includes("info") ||
        lowerLine.includes("installing") ||
        lowerLine.includes("resolving") ||
        lowerLine.includes("fetching") ||
        lowerLine.includes("downloading") ||
        line.includes("ℹ") ||
        line.includes("ℹ️")
    ) {
        return `{cyan-fg}${line}{/cyan-fg}`;
    }
    if (
        lowerLine.includes("creating") ||
        lowerLine.includes("building") ||
        lowerLine.includes("starting") ||
        lowerLine.includes("compiling") ||
        lowerLine.includes("bundling") ||
        lowerLine.includes("processing") ||
        lowerLine.includes("generating") ||
        lowerLine.includes("executing")
    ) {
        return `{blue-fg}${line}{/blue-fg}`;
    }
    if (
        lowerLine.includes("next.js") ||
        lowerLine.includes("ready") ||
        lowerLine.includes("started server") ||
        lowerLine.includes("listening") ||
        lowerLine.includes("server running") ||
        lowerLine.includes("dev server") ||
        lowerLine.includes("webpack") ||
        lowerLine.includes("vite") ||
        lowerLine.includes("react") ||
        lowerLine.includes("vue") ||
        lowerLine.includes("angular")
    ) {
        return `{magenta-fg}${line}{/magenta-fg}`;
    }
    if (line.match(/\d+(\.\d+)?(ms|s|m)\b/) || lowerLine.includes("duration") || lowerLine.includes("elapsed") || lowerLine.includes("took")) {
        return `{gray-fg}${line}{/gray-fg}`;
    }
    if (line.match(/https?:\/\/[^\s]+/) || lowerLine.includes("localhost") || line.match(/:\d{4,5}\b/)) {
        return `{blue-fg}{underline}${line}{/underline}{/blue-fg}`;
    }
    if (
        line.match(/[\w-]+\.(js|ts|jsx|tsx|css|scss|json|md|html|vue)/) ||
        line.includes("./") ||
        line.includes("../") ||
        line.includes("/src/") ||
        line.includes("/dist/") ||
        line.includes("/build/")
    ) {
        return `{white-fg}${line}{/white-fg}`;
    }
    if (line.match(/v?\d+\.\d+\.\d+/) || lowerLine.includes("version")) {
        return `{bold}${line}{/bold}`;
    }
    return line;
}
async function runTask(taskName) {
    const rootPackageJson = JSON.parse(readFileSync("package.json", "utf-8"));
    const workspacePatterns = rootPackageJson.workspaces;
    const allWorkspacePaths = findWorkspaces(workspacePatterns);
    let cosmosConfig = {};
    try {
        cosmosConfig = JSON.parse(readFileSync("cosmos.json", "utf-8"));
    } catch (e) {}
    const taskConfig = cosmosConfig.tasks?.[taskName] || {};
    const workspaceDetails = {};
    const runnableWorkspaces = [];
    for (const workspacePath of allWorkspacePaths) {
        const packageJson = getPackageJson(workspacePath);
        if (packageJson && packageJson.scripts && packageJson.scripts[taskName]) {
            const packageName = packageJson.name;
            workspaceDetails[packageName] = {
                path: workspacePath,
                dependencies: { ...packageJson.dependencies, ...packageJson.devDependencies, ...packageJson.peerDependencies },
                status: "pending",
                process: null,
                logs: [],
                startTime: null,
                endTime: null,
            };
            runnableWorkspaces.push(workspacePath);
        }
    }
    const activeProcesses = [];
    let currentSelectedProjectIndex = 0;
    const header = blessed.box({ top: 0, left: 0, width: "100%", height: 2, content: `cosmos  ${taskName}`, style: { fg: "white" }, padding: { left: 1, top: 0 } });
    screen.append(header);
    const separator = blessed.line({ top: 2, left: 0, width: "100%", orientation: "horizontal", style: { fg: "gray" } });
    screen.append(separator);
    const metricsBar = blessed.box({ top: 3, left: 0, width: "100%", height: 2, content: "", style: { fg: "gray" }, padding: { left: 1 } });
    screen.append(metricsBar);
    const bottomSeparator = blessed.line({ top: 5, left: 0, width: "100%", orientation: "horizontal", style: { fg: "gray" } });
    screen.append(bottomSeparator);
    const workspacePanel = blessed.box({ top: 6, left: 0, width: "35%", height: "100%-6", style: { fg: "white" } });
    screen.append(workspacePanel);
    const verticalSeparator = blessed.line({ top: 6, left: "35%", height: "100%-6", orientation: "vertical", style: { fg: "gray" } });
    screen.append(verticalSeparator);
    const outputPanel = blessed.box({ top: 6, left: "35%+1", width: "65%-1", height: "100%-6", style: { fg: "white" } });
    screen.append(outputPanel);
    const workspaceList = blessed.list({
        parent: workspacePanel,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        keys: true,
        mouse: true,
        vi: true,
        style: { fg: "white", selected: { bg: "blue", fg: "white", bold: true }, item: { hover: { bg: "gray" } } },
        padding: { left: 1 },
    });
    const outputHeader = blessed.box({ parent: outputPanel, top: 0, left: 0, width: "100%", height: 2, content: "", style: { fg: "white" }, padding: { left: 1 } });
    const logDisplay = blessed.log({
        parent: outputPanel,
        top: 3,
        left: 0,
        width: "100%",
        height: "100%-3",
        tags: true,
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        scrollbar: { ch: "│", style: { fg: "gray" } },
        padding: { left: 1 },
    });
    function formatDuration(ms) {
        if (ms < 1000) return `${ms}ms`;
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    }
    function updateMetrics() {
        const running = Object.values(workspaceDetails).filter((d) => d.status === "running").length;
        const completed = Object.values(workspaceDetails).filter((d) => d.status === "completed").length;
        const failed = Object.values(workspaceDetails).filter((d) => d.status === "failed").length;
        const pending = Object.values(workspaceDetails).filter((d) => d.status === "pending").length;
        const content = `▶ ${running} running   ✓ ${completed} done   ✗ ${failed} failed   ⏳ ${pending} pending`;
        metricsBar.setContent(content);
    }
    function updateWorkspaceList() {
        const items = runnableWorkspaces.map((workspace) => {
            const packageName = getPackageJson(workspace).name;
            const details = workspaceDetails[packageName];
            const statusIcons = { pending: "○", running: "●", completed: "✓", failed: "✗" };
            const icon = statusIcons[details.status] || "?";
            const duration =
                details.endTime && details.startTime ? ` (${formatDuration(details.endTime - details.startTime)})` : details.startTime ? ` (${formatDuration(Date.now() - details.startTime)})` : "";
            return `${icon} ${packageName}${duration}`;
        });
        workspaceList.setItems(items);
    }
    function updateOutputHeader() {
        if (runnableWorkspaces.length === 0) return;
        const selectedWorkspace = runnableWorkspaces[currentSelectedProjectIndex];
        const packageName = getPackageJson(selectedWorkspace).name;
        const details = workspaceDetails[packageName];
        const statusText = { pending: "Waiting", running: "Running", completed: "Completed", failed: "Failed" }[details.status] || "Unknown";
        outputHeader.setContent(`${packageName} • ${statusText}`);
    }
    updateMetrics();
    updateWorkspaceList();
    updateOutputHeader();
    const runNextTasks = async () => {
        let tasksReadyToRun = [];
        for (const workspacePath of runnableWorkspaces) {
            const packageName = getPackageJson(workspacePath).name;
            const details = workspaceDetails[packageName];
            if (details.status === "pending") {
                let canRun = true;
                if (taskConfig.dependsOn && taskConfig.dependsOn.includes("^" + taskName)) {
                    for (const depName in details.dependencies) {
                        if (workspaceDetails[depName] && workspaceDetails[depName].status !== "completed") {
                            canRun = false;
                            break;
                        }
                    }
                }
                if (canRun) {
                    tasksReadyToRun.push(workspacePath);
                }
            }
        }
        for (const workspacePath of tasksReadyToRun) {
            const packageName = getPackageJson(workspacePath).name;
            const details = workspaceDetails[packageName];
            const inputHash = await calculateInputHash(workspacePath, taskName);
            const outputDirs = TASK_OUTPUT_DIRS[taskName] || [];
            if (outputDirs.length > 0) {
                const restored = await restoreFromCache(workspacePath, packageName, taskName, inputHash, outputDirs);
                if (restored) {
                    details.status = "completed";
                    details.endTime = Date.now();
                    const cacheHitMsg = `{green-fg}✓ Restored from cache for ${packageName} (${taskName}){/green-fg}`;
                    details.logs.push(cacheHitMsg);
                    if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                        logDisplay.log(cacheHitMsg);
                    }
                    updateWorkspaceList();
                    updateMetrics();
                    updateOutputHeader();
                    continue;
                }
            }
            details.status = "running";
            details.startTime = Date.now();
            updateWorkspaceList();
            updateMetrics();
            updateOutputHeader();
            const startMsg = `{blue-fg}Starting ${taskName}...{/blue-fg}`;
            details.logs.push(startMsg);
            if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                logDisplay.log(startMsg);
            }
            const child = spawn("yarn", ["--cwd", workspacePath, taskName], { stdio: ["ignore", "pipe", "pipe"], shell: true });
            details.process = child;
            activeProcesses.push(child);
            child.stdout.on("data", (data) => {
                const lines = data
                    .toString()
                    .split("\n")
                    .filter((line) => line.trim());
                for (const line of lines) {
                    const coloredOutput = colorizeLogLine(line);
                    details.logs.push(coloredOutput);
                    if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                        logDisplay.log(coloredOutput);
                    }
                }
                screen.render();
            });
            child.stderr.on("data", (data) => {
                const lines = data
                    .toString()
                    .split("\n")
                    .filter((line) => line.trim());
                for (const line of lines) {
                    let coloredOutput = colorizeLogLine(line);
                    if (!coloredOutput.includes("{yellow-fg}")) {
                        coloredOutput = `{red-fg}${line}{/red-fg}`;
                    }
                    details.logs.push(coloredOutput);
                    if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                        logDisplay.log(coloredOutput);
                    }
                }
                screen.render();
            });
            child.on("close", async (code) => {
                details.endTime = Date.now();
                const isSuccess = code === 0;
                details.status = isSuccess ? "completed" : "failed";
                if (isSuccess && outputDirs.length > 0) {
                    await saveToCache(workspacePath, packageName, taskName, inputHash, outputDirs);
                }
                const statusMsg = isSuccess ? `{green-fg}✓ Completed in ${formatDuration(details.endTime - details.startTime)}{/green-fg}` : `{red-fg}✗ Failed with code ${code}{/red-fg}`;
                details.logs.push(statusMsg);
                if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                    logDisplay.log(statusMsg);
                }
                updateWorkspaceList();
                updateMetrics();
                updateOutputHeader();
                activeProcesses.splice(activeProcesses.indexOf(child), 1);
                screen.render();
                runNextTasks();
                if (activeProcesses.length === 0) {
                    const allCompleted = runnableWorkspaces.every((wp) => workspaceDetails[getPackageJson(wp).name].status === "completed");
                    if (allCompleted) {
                        header.setContent(`cosmos  ${taskName}  ✓  All ${runnableWorkspaces.length} workspaces completed`);
                    } else {
                        const failedCount = Object.values(workspaceDetails).filter((d) => d.status === "failed").length;
                        header.setContent(`cosmos  ${taskName}  ✗  ${failedCount} workspace${failedCount > 1 ? "s" : ""} failed`);
                    }
                    screen.render();
                }
            });
        }
    };
    workspaceList.on("select", (item, index) => {
        currentSelectedProjectIndex = index;
        const selectedWorkspace = runnableWorkspaces[currentSelectedProjectIndex];
        const packageName = getPackageJson(selectedWorkspace).name;
        const details = workspaceDetails[packageName];
        logDisplay.setContent("");
        details.logs.forEach((logLine) => logDisplay.log(logLine));
        updateOutputHeader();
        screen.render();
    });
    workspaceList.key(["up", "down"], () => {
        setTimeout(() => {
            currentSelectedProjectIndex = workspaceList.selected;
            const selectedWorkspace = runnableWorkspaces[currentSelectedProjectIndex];
            const packageName = getPackageJson(selectedWorkspace).name;
            const details = workspaceDetails[packageName];
            logDisplay.setContent("");
            details.logs.forEach((logLine) => logDisplay.log(logLine));
            updateOutputHeader();
            screen.render();
        }, 10);
    });
    if (runnableWorkspaces.length > 0) {
        workspaceList.select(0);
        const selectedWorkspace = runnableWorkspaces[0];
        const packageName = getPackageJson(selectedWorkspace).name;
        const details = workspaceDetails[packageName];
        details.logs.forEach((logLine) => logDisplay.log(logLine));
    }
    workspaceList.focus();
    screen.render();
    runNextTasks();
}
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Usage: node cosmos.js <task-name>");
    process.exit(1);
}
const taskName = args[0];
runTask(taskName);
