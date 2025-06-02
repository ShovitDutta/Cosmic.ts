import { glob } from "glob";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { spawn } from "child_process";
import blessed from "blessed";

async function findWorkspaceProjects(): Promise<string[]> {
    const rootPackageJsonPath = join(process.cwd(), "package.json");
    const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, "utf-8"));
    const workspaces: string[] = rootPackageJson.workspaces;
    const projectPaths: string[] = [];
    for (const workspace of workspaces) {
        let pattern = join(process.cwd(), workspace, "package.json");
        pattern = pattern.replace(/\\/g, "/");
        const files = await glob(pattern, { ignore: "**/node_modules/**" });
        for (const file of files) projectPaths.push(dirname(file));
    }
    return projectPaths;
}

interface ProjectStatus {
    running: boolean;
    completed: boolean;
    failed: boolean;
    code?: number;
}

interface AppProps {
    scriptName: string;
}

function App({ scriptName }: AppProps) {
    const screen = blessed.screen({
        smartCSR: true,
        title: "Cosmic Workspace Runner",
        fullUnicode: true,
    });

    let projects: string[] = [];
    let projectNames: string[] = [];
    const projectLogs = new Map<number, string[]>();
    const projectStatus = new Map<number, ProjectStatus>();
    let currentProjectIndex = 0;
    const startTime = new Date();

    const getStatusIcon = (status: ProjectStatus): string => {
        if (status.running) return "⚡";
        if (status.completed) return "✅";
        if (status.failed) return "❌";
        return "⏸️";
    };

    const getStatusColor = (status: ProjectStatus): string => {
        if (status.running) return "yellow";
        if (status.completed) return "green";
        if (status.failed) return "red";
        return "gray";
    };

    // Create main layout boxes
    const header = blessed.box({
        top: 0,
        left: 0,
        width: "100%",
        height: 7,
        valign: "middle",
        tags: true,
        border: {
            type: "line",
        },
        style: {
            fg: "white",
            bg: "black",
            border: {
                fg: "cyan",
            },
        },
    });

    const mainContent = blessed.box({
        top: 7,
        left: 0,
        width: "100%",
        height: "100%-8", // Header + Footer height
        tags: true,
    });

    const sidebar = blessed.box({
        parent: mainContent,
        top: 0,
        left: 0,
        width: "35%",
        height: "100%",
        tags: true,
        border: {
            type: "line",
        },
        style: {
            fg: "white",
            bg: "black",
            border: {
                fg: "blue",
            },
        },
        scrollable: true,
        scrollbar: {
            ch: " ",
        },
        alwaysScroll: true,
        keys: true,
        vi: true,
    });

    const logsPanel = blessed.box({
        parent: mainContent,
        top: 0,
        left: "35%+1", // Sidebar width + border
        width: "65%-1",
        height: "100%",
        tags: true,
        border: {
            type: "line",
        },
        style: {
            fg: "white",
            bg: "black",
            border: {
                fg: "green",
            },
        },
        scrollable: true,
        scrollbar: {
            ch: " ",
        },
        alwaysScroll: true,
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
        border: {
            type: "line",
        },
        style: {
            fg: "white",
            bg: "black",
            border: {
                fg: "magenta",
            },
        },
    });

    screen.append(header);
    screen.append(mainContent);
    screen.append(footer);

    // Update functions for blessed elements
    const updateHeader = () => {
        const runningCount = Array.from(projectStatus.values()).filter((s) => s.running).length;
        const completedCount = Array.from(projectStatus.values()).filter((s) => s.completed).length;
        const failedCount = Array.from(projectStatus.values()).filter((s) => s.failed).length;

        header.setContent(
            `{cyan-fg}{bold}🚀 Cosmic Workspace Runner{/bold}{/cyan-fg}\n\n` +
                `Script: {yellow-fg}{bold}${scriptName}{/bold}{/yellow-fg} ` +
                `Started: {green-fg}${startTime.toLocaleTimeString()}{/green-fg}\n\n` +
                `{yellow-fg}⚡ Running: ${runningCount}{/yellow-fg}    ` +
                `{green-fg}✅ Completed: ${completedCount}{/green-fg}    ` +
                `{red-fg}❌ Failed: ${failedCount}{/red-fg}    ` +
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
            content += `\n{${bgColor}-bg}{${textColor}-fg}${statusIcon} ${name}{/${textColor}-fg}{/${bgColor}-bg}`;
        });
        sidebar.setContent(content);
        screen.render();
    };

    const updateLogsPanel = () => {
        const currentLogs = projectLogs.get(currentProjectIndex) || [];
        const currentStatus = projectStatus.get(currentProjectIndex) || { running: false, completed: false, failed: false };
        const statusIcon = getStatusIcon(currentStatus);
        const statusColor = getStatusColor(currentStatus);
        const statusText = currentStatus.running
            ? "Running"
            : currentStatus.completed
              ? "Completed"
              : currentStatus.failed
                ? `Failed${currentStatus.code ? ` (${currentStatus.code})` : ""}`
                : "Waiting";

        let headerContent = `{green-fg}{bold}📋 Logs: {/bold}{/green-fg}{white-fg}${projectNames[currentProjectIndex] || "N/A"}{/white-fg}\n`;
        headerContent += `{${statusColor}-fg}${statusIcon} ${statusText}{/${statusColor}-fg}`;
        logsPanel.setContent(headerContent + "\n\n" + currentLogs.slice(-50).join("\n"));
        logsPanel.setScrollPerc(100);
        screen.render();
    };

    footer.setContent("{magenta-fg}💡 Use ↑/↓ arrows to navigate • Press 'q' or Ctrl+C to quit{/magenta-fg}");

    // Initial load of projects
    async function loadProjects() {
        const foundProjects = await findWorkspaceProjects();
        projects = foundProjects;
        projectNames = foundProjects.map((p) => {
            const packageJsonPath = join(p, "package.json");
            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            return packageJson.name || dirname(p).split("/").pop();
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
            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
            const projectName = packageJson.name || dirname(projectPath).split("/").pop();
            if (packageJson.scripts && packageJson.scripts[scriptName]) {
                projectStatus.set(index, { running: true, completed: false, failed: false });
                const timestamp = new Date().toLocaleTimeString();
                const startLogLine = `🚀 [${timestamp}] Starting '${scriptName}'...`;
                projectLogs.get(index)!.push(startLogLine);
                updateLogsPanel();

                const child = spawn("yarn", [scriptName], { cwd: projectPath, shell: true });
                child.stdout.on("data", (data: Buffer) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const logLine = `📝 [${timestamp}] ${data.toString().trim()}`;
                    projectLogs.get(index)!.push(logLine);
                    updateLogsPanel();
                });
                child.stderr.on("data", (data: Buffer) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const logLine = `🚨 [${timestamp}] ERROR: ${data.toString().trim()}`;
                    projectLogs.get(index)!.push(logLine);
                    updateLogsPanel();
                });
                child.on("close", (code: number) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const isSuccess = code === 0;
                    const status = isSuccess ? "completed successfully" : `failed with code ${code}`;
                    const icon = isSuccess ? "✨" : "💥";
                    const logLine = `${icon} [${timestamp}] Script '${scriptName}' ${status}`;
                    projectLogs.get(index)!.push(logLine);
                    projectStatus.set(index, { running: false, completed: isSuccess, failed: !isSuccess, code });
                    updateHeader();
                    updateSidebar();
                    updateLogsPanel();
                });
                child.on("error", (err: Error) => {
                    const timestamp = new Date().toLocaleTimeString();
                    const logLine = `💀 [${timestamp}] Failed to start script: ${err.message}`;
                    projectLogs.get(index)!.push(logLine);
                    projectStatus.set(index, { running: false, completed: false, failed: true });
                    updateHeader();
                    updateSidebar();
                    updateLogsPanel();
                });
            } else {
                const timestamp = new Date().toLocaleTimeString();
                const logLine = `⏭️  [${timestamp}] Skipping '${scriptName}' (script not found)`;
                projectLogs.get(index)!.push(logLine);
                updateLogsPanel();
            }
        });
    };

    screen.key(["up"], function (ch: string, key: any) {
        currentProjectIndex = Math.max(0, currentProjectIndex - 1);
        updateSidebar();
        updateLogsPanel();
    });

    screen.key(["down"], function (ch: string, key: any) {
        currentProjectIndex = Math.min(projectNames.length - 1, currentProjectIndex + 1);
        updateSidebar();
        updateLogsPanel();
    });

    loadProjects();
    screen.render();
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("🚀 Cosmic Workspace Runner");
    console.log("Usage: node cosmic.js <script-name>");
    console.log("");
    console.log("Examples:");
    console.log("  node cosmic.js build");
    console.log("  node cosmic.js test");
    console.log("  node cosmic.js dev");
    process.exit(0);
}

const scriptToRun = args[0];
// The App component will be called directly, and it will manage the blessed screen.
App({ scriptName: scriptToRun! });
