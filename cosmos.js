import { readFileSync, statSync } from "fs";
import { spawn } from "child_process";
import blessed from "blessed";
import * as glob from "glob";
import { join } from "path";

const screen = blessed.screen({
    smartCSR: true,
    title: "Cosmos.ts Monorepo Task Runner",
    fullUnicode: true,
    terminal: "xterm-256color",
    forceUnicode: true,
    dockBorders: true,
    transparent: true,
});

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
            };
            runnableWorkspaces.push(workspacePath);
        }
    }

    const projectLogs = {};
    const activeProcesses = [];
    let currentSelectedProjectIndex = 0;

    const header = blessed.box({
        top: 0,
        left: 0,
        width: "100%",
        height: 3,
        content: `╔═══ Cosmos.ts Task Runner ═══╗\n Running: ${taskName}\n Press 'q' to quit, ↑↓ to navigate`,
        align: "center",
        valign: "middle",
        style: {
            fg: "white",
            bg: "blue",
            bold: true,
        },
        border: {
            type: "line",
            fg: "cyan",
        },
    });
    screen.append(header);

    const statusBar = blessed.box({
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        content: "Ready",
        align: "center",
        style: {
            fg: "black",
            bg: "white",
        },
    });
    screen.append(statusBar);

    const leftPanel = blessed.box({
        top: 3,
        left: 0,
        width: "30%",
        height: "100%-4",
        label: " Workspaces ",
        border: {
            type: "line",
            fg: "cyan",
        },
        style: {
            fg: "white",
        },
    });
    screen.append(leftPanel);

    const rightPanel = blessed.box({
        top: 3,
        left: "30%",
        width: "70%",
        height: "100%-4",
        label: " Output ",
        border: {
            type: "line",
            fg: "cyan",
        },
        style: {
            fg: "white",
            bg: "black",
        },
    });
    screen.append(rightPanel);

    const projectList = blessed.list({
        parent: leftPanel,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        keys: true,
        mouse: true,
        vi: true,
        scrollbar: {
            ch: "█",
            style: {
                bg: "cyan",
            },
        },
        style: {
            fg: "white",
            selected: {
                bg: "green",
                fg: "black",
                bold: true,
            },
            item: {
                hover: {
                    bg: "blue",
                    fg: "white",
                },
            },
        },
    });

    const logDisplay = blessed.log({
        parent: rightPanel,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        tags: true,
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        wrap: false,
        scrollbar: {
            ch: "█",
            style: {
                bg: "cyan",
            },
        },
        style: {
            fg: "white",
        },
    });

    function updateProjectListItems() {
        const items = runnableWorkspaces.map((workspace) => {
            const packageName = getPackageJson(workspace).name;
            const details = workspaceDetails[packageName];
            const statusIcon =
                {
                    pending: "⏳",
                    running: "🔄",
                    completed: "✅",
                    failed: "❌",
                }[details.status] || "❓";
            return `${statusIcon} ${packageName}`;
        });
        projectList.setItems(items);
    }

    for (const workspace of runnableWorkspaces) {
        projectLogs[workspace] = [];
    }

    updateProjectListItems();

    const runNextTasks = () => {
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

        const runningCount = Object.values(workspaceDetails).filter((d) => d.status === "running").length;
        const completedCount = Object.values(workspaceDetails).filter((d) => d.status === "completed").length;
        const failedCount = Object.values(workspaceDetails).filter((d) => d.status === "failed").length;
        const totalCount = runnableWorkspaces.length;

        statusBar.setContent(`Running: ${runningCount} | Completed: ${completedCount} | Failed: ${failedCount} | Total: ${totalCount}`);

        for (const workspacePath of tasksReadyToRun) {
            const packageName = getPackageJson(workspacePath).name;
            const details = workspaceDetails[packageName];
            details.status = "running";

            updateProjectListItems();

            const startMsg = `{cyan-fg}🚀 Starting 'yarn ${taskName}' in ${packageName}{/cyan-fg}`;
            projectLogs[workspacePath].push(startMsg);

            if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                logDisplay.log(startMsg);
            }

            const child = spawn("yarn", ["--cwd", workspacePath, taskName], {
                stdio: ["ignore", "pipe", "pipe"],
                shell: true,
            });

            details.process = child;

            child.stdout.on("data", (data) => {
                const rawOutput = data.toString();
                const lines = rawOutput.split("\n").filter((line) => line.trim());

                for (const line of lines) {
                    let coloredOutput = line;

                    if (line.includes("✓") || line.includes("Compiled successfully")) {
                        coloredOutput = `{green-fg}${line}{/green-fg}`;
                    } else if (line.includes("warn") || line.includes("Warning")) {
                        coloredOutput = `{yellow-fg}${line}{/yellow-fg}`;
                    } else if (line.includes("error") || line.includes("Error") || line.includes("✗")) {
                        coloredOutput = `{red-fg}${line}{/red-fg}`;
                    } else if (line.includes("info") || line.includes("Info")) {
                        coloredOutput = `{cyan-fg}${line}{/cyan-fg}`;
                    } else if (line.includes("Creating") || line.includes("Building") || line.includes("Starting")) {
                        coloredOutput = `{blue-fg}${line}{/blue-fg}`;
                    } else if (line.includes("Next.js") || line.includes("ready") || line.includes("started server")) {
                        coloredOutput = `{magenta-fg}${line}{/magenta-fg}`;
                    } else {
                        coloredOutput = `{white-fg}${line}{/white-fg}`;
                    }

                    projectLogs[workspacePath].push(coloredOutput);

                    if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                        logDisplay.log(coloredOutput);
                    }
                }
                screen.render();
            });

            child.stderr.on("data", (data) => {
                const rawOutput = data.toString();
                const lines = rawOutput.split("\n").filter((line) => line.trim());

                for (const line of lines) {
                    let coloredOutput;

                    if (line.includes("warn") || line.includes("Warning")) {
                        coloredOutput = `{yellow-fg}⚠️  ${line}{/yellow-fg}`;
                    } else {
                        coloredOutput = `{red-fg}❌ ${line}{/red-fg}`;
                    }

                    projectLogs[workspacePath].push(coloredOutput);

                    if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                        logDisplay.log(coloredOutput);
                    }
                }
                screen.render();
            });

            child.on("close", (code) => {
                const isSuccess = code === 0;
                const statusMsg = isSuccess ? `{green-fg}✅ Task completed successfully (exit code: ${code}){/green-fg}` : `{red-fg}❌ Task failed (exit code: ${code}){/red-fg}`;

                const message = `{bold}${packageName}{/bold} - ${statusMsg}`;
                projectLogs[workspacePath].push(message);

                if (runnableWorkspaces[currentSelectedProjectIndex] === workspacePath) {
                    logDisplay.log(message);
                }

                details.status = isSuccess ? "completed" : "failed";
                updateProjectListItems();

                activeProcesses.splice(activeProcesses.indexOf(child), 1);

                screen.render();
                runNextTasks();

                if (activeProcesses.length === 0) {
                    const allCompleted = runnableWorkspaces.every((wp) => workspaceDetails[getPackageJson(wp).name].status === "completed");

                    if (allCompleted) {
                        header.setContent("╔═══ All Tasks Completed! ═══╗\n🎉 Success! All workspaces completed\n Press 'q' to exit");
                        header.style.bg = "green";
                    } else {
                        header.setContent("╔═══ Tasks Finished ═══╗\n⚠️  Some tasks failed or were blocked\n Press 'q' to exit");
                        header.style.bg = "yellow";
                    }
                    screen.render();
                }
            });

            activeProcesses.push(child);
        }
    };

    projectList.on("select", (item, index) => {
        currentSelectedProjectIndex = index;
        const selectedWorkspace = runnableWorkspaces[currentSelectedProjectIndex];

        logDisplay.setContent("");
        if (projectLogs[selectedWorkspace]) {
            projectLogs[selectedWorkspace].forEach((logLine) => {
                logDisplay.log(logLine);
            });
        }
        screen.render();
    });

    projectList.key(["up", "down"], () => {
        setTimeout(() => {
            currentSelectedProjectIndex = projectList.selected;
            const selectedWorkspace = runnableWorkspaces[currentSelectedProjectIndex];

            logDisplay.setContent("");
            if (projectLogs[selectedWorkspace]) {
                projectLogs[selectedWorkspace].forEach((logLine) => {
                    logDisplay.log(logLine);
                });
            }
            screen.render();
        }, 10);
    });

    if (runnableWorkspaces.length > 0) {
        projectList.select(0);
        const selectedWorkspace = runnableWorkspaces[0];
        logDisplay.setContent("");
        if (projectLogs[selectedWorkspace]) {
            projectLogs[selectedWorkspace].forEach((logLine) => {
                logDisplay.log(logLine);
            });
        }
    }

    projectList.focus();
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
