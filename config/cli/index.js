import { glob } from "glob";
import blessed from "blessed";
import { readFileSync } from "fs";
import stripAnsi from "strip-ansi";
import { spawn } from "child_process";
import { join, dirname, basename } from "path";

async function findWorkspaceProjects() {
    const rootPackageJsonPath = join(process.cwd(), "package.json");
    let rootPackageJson;

    try {
        rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, "utf-8"));
    } catch (error) {
        console.error(`Error: Could not read or parse root package.json at ${rootPackageJsonPath}`);
        console.error(error.message);
        process.exit(1);
    }

    const workspaces = rootPackageJson.workspaces;

    if (!workspaces || !Array.isArray(workspaces)) {
        console.error("Error: 'workspaces' property not found or is not an array in root package.json.");
        process.exit(1);
    }

    const projectPaths = [];
    for (const workspace of workspaces) {
        let pattern = join(process.cwd(), workspace, "package.json");
        pattern = pattern.replace(/\\/g, "/");
        const files = await glob(pattern, { ignore: "**/node_modules/**" });
        for (const file of files) projectPaths.push(dirname(file));
    }
    return projectPaths;
}

function App({ scriptName }) {
    const screen = blessed.screen({
        smartCSR: true,
        title: "Cosmic Workspace Runner",
        fullUnicode: true,
    });

    let projects = [];
    let projectNames = [];
    const projectLogs = new Map();
    const projectStatus = new Map();
    let currentProjectIndex = 0;
    const startTime = new Date();

    const getStatusIcon = (status) => {
        if (status.running) return "⚡";
        if (status.completed) return "✅";
        if (status.failed) return "❌";
        return "⏳";
    };

    const getStatusColor = (status) => {
        if (status.running) return "yellow";
        if (status.completed) return "green";
        if (status.failed) return "red";
        return "gray";
    };

    const header = blessed.box({
        top: 0,
        left: 0,
        width: "100%",
        height: 7,
        valign: "middle",
        tags: true,
        border: { type: "line" },
        style: {
            fg: "white",
            bg: "black",
            border: { fg: "cyan" },
        },
    });

    const mainContent = blessed.box({
        top: 7,
        left: 0,
        width: "100%",
        height: "100%-8",
        tags: true,
    });

    const sidebar = blessed.box({
        parent: mainContent,
        top: 0,
        left: 0,
        width: "35%",
        height: "100%",
        tags: true,
        border: { type: "line" },
        style: {
            fg: "white",
            bg: "black",
            border: { fg: "blue" },
        },
        scrollable: true,
        scrollbar: { ch: " " },
        alwaysScroll: true,
        keys: true,
        vi: true,
    });

    const logsPanel = blessed.box({
        parent: mainContent,
        top: 0,
        left: "35%+1",
        width: "65%-1",
        height: "100%",
        tags: true,
        border: { type: "line" },
        style: {
            fg: "white",
            bg: "black",
            border: { fg: "green" },
        },
        scrollable: true,
        scrollbar: { ch: " " },
        alwaysScroll: false,
        keys: true,
        vi: true,
    });

    const footer = blessed.box({
        bottom: 0,
        left: 0,
        width: "100%",
        height: 3,
        valign: "middle",
        tags: true,
        border: { type: "line" },
        style: {
            fg: "white",
            bg: "black",
            border: { fg: "magenta" },
        },
    });

    screen.append(header);
    screen.append(mainContent);
    screen.append(footer);

    const updateHeader = () => {
        const runningCount = Array.from(projectStatus.values()).filter((s) => s.running).length;
        const completedCount = Array.from(projectStatus.values()).filter((s) => s.completed).length;
        const failedCount = Array.from(projectStatus.values()).filter((s) => s.failed).length;
        const pendingCount = projectNames.length - (runningCount + completedCount + failedCount);

        header.setContent(
            `{cyan-fg}{bold}🚀 Cosmic Workspace Runner{/bold}{/cyan-fg}\n\n` +
                `Script: {yellow-fg}{bold}${scriptName}{/bold}{/yellow-fg} ` +
                `Started: {green-fg}${startTime.toLocaleTimeString()}{/green-fg}\n` +
                `\n{yellow-fg}⚡ Running: ${runningCount}{/yellow-fg}    ` +
                `{green-fg}✅ Completed: ${completedCount}{/green-fg}    ` +
                `{red-fg}❌ Failed: ${failedCount}{/red-fg}    ` +
                `{gray-fg}⏳ Pending: ${pendingCount}{/gray-fg}    ` +
                `{gray-fg}📦 Total: ${projectNames.length}{/gray-fg}`,
        );
        screen.render();
    };

    const updateSidebar = () => {
        let content = `{blue-fg}{bold}📁 Projects (${projectNames.length}){/bold}{/blue-fg}\n`;
        projectNames.forEach((name, index) => {
            const status = projectStatus.get(index) || { running: false, completed: false, failed: false };
            const isSelected = index === currentProjectIndex;
            const statusIcon = getStatusIcon(status);
            const statusColor = getStatusColor(status);
            const textColor = isSelected ? "black" : statusColor;
            const bgColor = isSelected ? "blue" : "black";
            content += `\n{${bgColor}-bg}{${textColor}-fg}${statusIcon} ${name.padEnd(sidebar.width - 7)}{/${textColor}-fg}{/${bgColor}-bg}`;
        });
        sidebar.setContent(content);
        sidebar.setScrollPerc(Math.floor((currentProjectIndex / projectNames.length) * 100));
        screen.render();
    };

    const updateLogsPanel = () => {
        logsPanel.setContent("");
        screen.render();

        const currentLogs = projectLogs.get(currentProjectIndex) || [];
        const currentStatus = projectStatus.get(currentProjectIndex) || { running: false, completed: false, failed: false };
        const statusIcon = getStatusIcon(currentStatus);
        const statusColor = getStatusColor(currentStatus);
        const statusText = currentStatus.running
            ? "Running"
            : currentStatus.completed
              ? "Completed"
              : currentStatus.failed
                ? `Failed${currentStatus.code !== undefined ? ` (${currentStatus.code})` : ""}`
                : "Waiting";

        let headerContent = `{green-fg}{bold}📋 Logs: {/bold}{/green-fg}{white-fg}${projectNames[currentProjectIndex] || "N/A"}{/white-fg}\n`;
        headerContent += `{${statusColor}-fg}${statusIcon} ${statusText}{/${statusColor}-fg}`;

        logsPanel.setContent(headerContent + "\n\n" + currentLogs.slice(-500).join("\n"));
        logsPanel.setScrollPerc(100);
        screen.render();
    };

    footer.setContent("{magenta-fg}💡 Use ↑/↓ arrows to navigate • Press 'q' or Ctrl+C to quit{/magenta-fg}");

    async function loadProjects() {
        const foundProjects = await findWorkspaceProjects();
        projects = foundProjects;
        projectNames = foundProjects.map((p) => {
            const packageJsonPath = join(p, "package.json");
            let packageJson;
            try {
                packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            } catch (error) {
                console.warn(`Warning: Could not read or parse package.json for project at ${p}. Using folder name.`);
                return `${basename(p)} (Error)`;
            }
            return packageJson.name || basename(p);
        });

        foundProjects.forEach((_, index) => {
            projectLogs.set(index, []);
            projectStatus.set(index, { running: false, completed: false, failed: false });
        });

        updateHeader();
        updateSidebar();
        updateLogsPanel();
        startProjectScripts();
    }

    const startProjectScripts = () => {
        if (projects.length === 0) return;
        projects.forEach((projectPath, index) => {
            const packageJsonPath = join(projectPath, "package.json");
            let packageJson;
            try {
                packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            } catch (error) {
                const timestamp = new Date().toLocaleTimeString();
                const logLine = `🚨 [${timestamp}] ERROR: Could not read package.json for '${projectNames[index]}'. Skipping.`;
                projectLogs.get(index).push(logLine);
                projectStatus.set(index, { running: false, completed: false, failed: true, code: 1 });
                updateHeader();
                updateSidebar();
                if (index === currentProjectIndex) {
                    updateLogsPanel();
                }
                return;
            }

            if (packageJson.scripts && packageJson.scripts[scriptName]) {
                projectStatus.set(index, { running: true, completed: false, failed: false });
                const timestamp = new Date().toLocaleTimeString();
                const startLogLine = `🚀 [${timestamp}] Starting '${scriptName}' in '${projectNames[index]}'...\n---`;
                projectLogs.get(index).push(startLogLine);
                if (index === currentProjectIndex) {
                    updateLogsPanel();
                }

                const child = spawn("yarn", [scriptName], { cwd: projectPath, shell: true });

                child.stdout.on("data", (data) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const lines = data
                        .toString()
                        .trim()
                        .split("\n")
                        .map((line) => stripAnsi(line)); // Strip ANSI codes
                    lines.forEach((line) => projectLogs.get(index).push(`📝 [${timestamp}] ${line}`));
                    if (index === currentProjectIndex) {
                        updateLogsPanel();
                    }
                });

                child.stderr.on("data", (data) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const lines = data
                        .toString()
                        .trim()
                        .split("\n")
                        .map((line) => stripAnsi(line)); // Strip ANSI codes
                    lines.forEach((line) => projectLogs.get(index).push(`🚨 [${timestamp}] ERROR: ${line}`));
                    if (index === currentProjectIndex) {
                        updateLogsPanel();
                    }
                });

                child.on("close", (code) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const isSuccess = code === 0;
                    const statusText = isSuccess ? "completed successfully" : `failed with code ${code}`;
                    const icon = isSuccess ? "✨" : "💥";
                    const logLine = `---\n${icon} [${timestamp}] Script '${scriptName}' ${statusText} for '${projectNames[index]}'`;
                    projectLogs.get(index).push(logLine);
                    projectStatus.set(index, { running: false, completed: isSuccess, failed: !isSuccess, code });
                    updateHeader();
                    updateSidebar();
                    if (index === currentProjectIndex) {
                        updateLogsPanel();
                    }
                });

                child.on("error", (err) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const logLine = `💀 [${timestamp}] Failed to spawn process for '${projectNames[index]}': ${err.message}`;
                    projectLogs.get(index).push(logLine);
                    projectStatus.set(index, { running: false, completed: false, failed: true });
                    updateHeader();
                    updateSidebar();
                    if (index === currentProjectIndex) {
                        updateLogsPanel();
                    }
                });
            } else {
                const timestamp = new Date().toLocaleTimeString();
                const logLine = `⏭️  [${timestamp}] Skipping '${projectNames[index]}' - script '${scriptName}' not found.`;
                projectLogs.get(index).push(logLine);
                projectStatus.set(index, { running: false, completed: true, failed: false, code: 0 });
                updateHeader();
                updateSidebar();
                if (index === currentProjectIndex) {
                    updateLogsPanel();
                }
            }
        });
    };

    screen.key(["up"], function (ch, key) {
        currentProjectIndex = Math.max(0, currentProjectIndex - 1);
        updateSidebar();
        updateLogsPanel();
    });

    screen.key(["down"], function (ch, key) {
        currentProjectIndex = Math.min(projectNames.length - 1, currentProjectIndex + 1);
        updateSidebar();
        updateLogsPanel();
    });

    screen.key(["q", "C-c"], function (ch, key) {
        screen.destroy();
        process.exit(0);
    });

    loadProjects();
    screen.render();
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("🚀 Cosmic Workspace Runner");
    console.log("Usage: node cosmic.mjs <script-name>");
    console.log("");
    console.log("Examples:");
    console.log("  node cosmic.mjs build");
    console.log("  node cosmic.mjs test");
    console.log("  node cosmic.mjs dev");
    process.exit(0);
}

const scriptToRun = args[0];
App({ scriptName: scriptToRun });
