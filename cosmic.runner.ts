import { cpus } from "os";
import colors from "colors";
import { promisify } from "util";
import { createHash } from "crypto";
import { performance } from "perf_hooks";
import { spawn, exec } from "child_process";
import { existsSync, promises as fs, Stats } from "fs";
import { join, dirname, resolve as _resolve, relative, sep } from "path";
const execAsync = promisify(exec);
interface CosmicConfig {
    cacheDir?: string;
    maxConcurrency?: number;
    timeout?: number;
    ignorePatterns?: string[];
    hashIncludes?: string[];
    verbose?: boolean;
    dryRun?: boolean;
    failFast?: boolean;
}
interface Project {
    name: string;
    path: string;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    relativePath: string;
    packageJson: any;
}
interface TaskResult {
    project: string;
    task: string;
    success: boolean;
    duration: number;
    cached: boolean;
    error?: string;
}
interface DependencyGraph {
    graph: Map<string, Set<string>>;
    inDegree: Map<string, number>;
    projectMap: Map<string, Project>;
}
class CosmicRunner {
    private config: Required<CosmicConfig>;
    private projects: Project[] = [];
    private startTime: number = 0;
    private results: TaskResult[] = [];
    constructor(config: CosmicConfig = {}) {
        this.config = {
            cacheDir: config.cacheDir || join(process.cwd(), ".cosmic-cache"),
            maxConcurrency: config.maxConcurrency || Math.max(1, cpus().length - 1),
            timeout: config.timeout || 300000,
            ignorePatterns: config.ignorePatterns || ["node_modules", ".git", ".next", "dist", "build", ".turbo", ".cosmic-cache", "coverage", ".nyc_output"],
            hashIncludes: config.hashIncludes || [
                "package.json",
                "package-lock.json",
                "yarn.lock",
                "pnpm-lock.yaml",
                "tsconfig.json",
                "tsconfig.*.json",
                "vite.config.*",
                "webpack.config.*",
                "rollup.config.*",
                ".env*",
            ],
            verbose: config.verbose ?? false,
            dryRun: config.dryRun ?? false,
            failFast: config.failFast ?? true,
        };
        this.setupSignalHandlers();
    }
    private setupSignalHandlers(): void {
        process.on("SIGINT", this.handleShutdown.bind(this));
        process.on("SIGTERM", this.handleShutdown.bind(this));
    }
    private handleShutdown(): void {
        console.log(colors.yellow("\n⚠️  Shutting down gracefully..."));
        this.printSummary();
        process.exit(0);
    }
    private log(level: "info" | "warn" | "error" | "success", message: string, project?: string): void {
        const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
        const prefix = `[${timestamp}]`;
        const projectPrefix = project ? `[${project}] ` : "";
        switch (level) {
            case "info":
                console.log(colors.blue(prefix), colors.cyan("INFO:"), projectPrefix + message);
                break;
            case "warn":
                console.log(colors.blue(prefix), colors.yellow("WARN:"), projectPrefix + message);
                break;
            case "error":
                console.log(colors.blue(prefix), colors.red("ERROR:"), projectPrefix + message);
                break;
            case "success":
                console.log(colors.blue(prefix), colors.green("SUCCESS:"), projectPrefix + message);
                break;
        }
    }
    private async calculateContentHash(projectPath: string): Promise<string> {
        const hash = createHash("sha256");
        try {
            const packageJsonPath = join(projectPath, "package.json");
            if (existsSync(packageJsonPath)) {
                const content = await fs.readFile(packageJsonPath);
                hash.update(content);
            }
            for (const pattern of this.config.hashIncludes) {
                const files = await this.globFiles(projectPath, pattern);
                for (const file of files) {
                    try {
                        const stat = await fs.stat(file);
                        if (stat.isFile()) {
                            const content = await fs.readFile(file);
                            hash.update(relative(projectPath, file));
                            hash.update(content);
                        }
                    } catch (error) {}
                }
            }
            const project = this.projects.find((p) => p.path === projectPath);
            if (project) hash.update(JSON.stringify(project.dependencies));

            return hash.digest("hex");
        } catch (error) {
            this.log("warn", `Failed to calculate hash for ${projectPath}: ${error}`);
            return createHash("sha256").update(projectPath).digest("hex");
        }
    }
    private async globFiles(dir: string, pattern: string): Promise<string[]> {
        const files: string[] = [];
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (this.shouldIgnore(entry.name)) continue;
                const fullPath = join(dir, entry.name);
                if (entry.isFile() && this.matchesPattern(entry.name, pattern)) files.push(fullPath);
                else if (entry.isDirectory()) files.push(...(await this.globFiles(fullPath, pattern)));
            }
        } catch (error) {}
        return files;
    }
    private matchesPattern(filename: string, pattern: string): boolean {
        if (pattern.includes("*")) {
            const regex = new RegExp(pattern.replace(/\*/g, ".*"));
            return regex.test(filename);
        }
        return filename === pattern;
    }
    private shouldIgnore(name: string): boolean {
        return this.config.ignorePatterns.some((pattern) => {
            if (pattern.includes("*")) {
                const regex = new RegExp(pattern.replace(/\*/g, ".*"));
                return regex.test(name);
            }
            return name === pattern || name.startsWith(pattern);
        });
    }
    private async getCachePath(project: Project, task: string): Promise<string> {
        const contentHash = await this.calculateContentHash(project.path);
        return join(this.config.cacheDir, project.name, task, contentHash);
    }
    private async restoreCache(project: Project, task: string): Promise<boolean> {
        try {
            const cachePath = await this.getCachePath(project, task);
            if (existsSync(cachePath)) {
                const cacheStats = await fs.stat(cachePath);
                const projectStats = await fs.stat(project.path);
                if (cacheStats.mtime > projectStats.mtime) {
                    this.log("info", `Cache hit for ${task}`, project.name);
                    return true;
                }
            }
        } catch (error) {
            this.log("warn", `Cache restoration failed: ${error}`, project.name);
        }
        return false;
    }
    private async saveCache(project: Project, task: string): Promise<void> {
        try {
            const cachePath = await this.getCachePath(project, task);
            await fs.mkdir(cachePath, { recursive: true });
            await fs.writeFile(
                join(cachePath, ".cache-marker"),
                JSON.stringify({ project: project.name, task, timestamp: new Date().toISOString(), hash: await this.calculateContentHash(project.path) }),
            );
            this.log("info", `Cache saved for ${task}`, project.name);
        } catch (error) {
            this.log("warn", `Cache save failed: ${error}`, project.name);
        }
    }
    private async findProjects(dir: string): Promise<Project[]> {
        const projects: Project[] = [];
        const rootDir = _resolve(process.cwd());
        try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                if (this.shouldIgnore(file.name)) continue;
                const fullPath = join(dir, file.name);
                if (file.isDirectory()) projects.push(...(await this.findProjects(fullPath)));
                else if (file.isFile() && file.name === "package.json") {
                    try {
                        const packageJsonContent = await fs.readFile(fullPath, "utf-8");
                        const packageJson = JSON.parse(packageJsonContent);
                        if (!packageJson.name) continue;
                        const projectPath = dirname(fullPath);
                        projects.push({
                            name: packageJson.name,
                            path: projectPath,
                            relativePath: relative(rootDir, projectPath),
                            scripts: packageJson.scripts || {},
                            dependencies: { ...packageJson.dependencies, ...packageJson.devDependencies, ...packageJson.peerDependencies },
                            packageJson,
                        });
                    } catch (error) {
                        this.log("error", `Error reading package.json at ${fullPath}: ${error}`);
                    }
                }
            }
        } catch (error) {
            this.log("error", `Error scanning directory ${dir}: ${error}`);
        }
        return projects;
    }
    private buildDependencyGraph(projects: Project[]): DependencyGraph {
        const graph = new Map<string, Set<string>>();
        const inDegree = new Map<string, number>();
        const projectMap = new Map(projects.map((p) => [p.name, p]));
        for (const project of projects) {
            graph.set(project.name, new Set());
            inDegree.set(project.name, 0);
        }
        for (const project of projects) {
            for (const depName in project.dependencies) {
                if (projectMap.has(depName)) {
                    graph.get(depName)!.add(project.name);
                    inDegree.set(project.name, inDegree.get(project.name)! + 1);
                }
            }
        }
        return { graph, inDegree, projectMap };
    }
    private topologicalSort(dependencyGraph: DependencyGraph): Project[] {
        const { graph, inDegree, projectMap } = dependencyGraph;
        const queue: string[] = [];
        const sortedProjects: Project[] = [];
        for (const [projectName, degree] of inDegree.entries()) {
            if (degree === 0) queue.push(projectName);
        }
        while (queue.length > 0) {
            const projectName = queue.shift()!;
            const project = projectMap.get(projectName)!;
            sortedProjects.push(project);
            for (const dependentProjectName of graph.get(projectName)!) {
                const newDegree = inDegree.get(dependentProjectName)! - 1;
                inDegree.set(dependentProjectName, newDegree);
                if (newDegree === 0) queue.push(dependentProjectName);
            }
        }
        if (sortedProjects.length !== projectMap.size) {
            const remaining = Array.from(projectMap.keys()).filter((name) => !sortedProjects.some((p) => p.name === name));
            throw new Error(`Circular dependency detected in projects: ${remaining.join(", ")}`);
        }
        return sortedProjects;
    }
    private async runTask(task: string, project: Project): Promise<TaskResult> {
        const startTime = performance.now();
        const result: TaskResult = { project: project.name, task, success: false, duration: 0, cached: false };
        try {
            if (!project.scripts[task]) {
                this.log("info", `No script "${task}" found, skipping`, project.name);
                result.success = true;
                result.duration = performance.now() - startTime;
                return result;
            }
            const cached = await this.restoreCache(project, task);
            if (cached) {
                this.log("success", `Task "${task}" restored from cache`, project.name);
                result.success = true;
                result.cached = true;
                result.duration = performance.now() - startTime;
                return result;
            }
            if (this.config.dryRun) {
                this.log("info", `[DRY RUN] Would run "${task}"`, project.name);
                result.success = true;
                result.duration = performance.now() - startTime;
                return result;
            }
            this.log("info", `Running "${task}"`, project.name);
            await new Promise<void>((resolve, reject) => {
                const child = spawn("npm", ["run", task], { cwd: project.path, stdio: this.config.verbose ? "inherit" : "pipe", timeout: this.config.timeout });
                let stdout = "";
                let stderr = "";
                if (!this.config.verbose) {
                    child.stdout?.on("data", (data) => (stdout += data.toString()));
                    child.stderr?.on("data", (data) => (stderr += data.toString()));
                }
                child.on("close", (code, signal) => {
                    if (signal) reject(new Error(`Task killed by signal: ${signal}`));
                    else if (code === 0) resolve();
                    else {
                        const error = new Error(`Task failed with exit code: ${code}`);
                        if (!this.config.verbose && stderr) console.error(colors.red(`[${project.name}] ${stderr}`));
                        reject(error);
                    }
                });
                child.on("error", reject);
            });
            await this.saveCache(project, task);
            this.log("success", `Task "${task}" completed`, project.name);
            result.success = true;
        } catch (error) {
            this.log("error", `Task "${task}" failed: ${error}`, project.name);
            result.error = error instanceof Error ? error.message : String(error);
        }
        result.duration = performance.now() - startTime;
        return result;
    }
    private async runTasksConcurrently(task: string, projects: Project[]): Promise<TaskResult[]> {
        const results: TaskResult[] = [];
        const semaphore = new Array(this.config.maxConcurrency).fill(null);
        let index = 0;
        const runBatch = async (): Promise<void> => {
            const promises = semaphore.map(async () => {
                while (index < projects.length) {
                    const currentIndex = index++;
                    const project = projects[currentIndex];
                    try {
                        const result = await this.runTask(task, project);
                        results[currentIndex] = result;
                        if (!result.success && this.config.failFast) throw new Error(`Fast fail: ${project.name} failed`);
                    } catch (error) {
                        results[currentIndex] = { project: project.name, task, success: false, duration: 0, cached: false, error: error instanceof Error ? error.message : String(error) };
                        if (this.config.failFast) throw error;
                    }
                }
            });
            await Promise.all(promises);
        };
        await runBatch();
        return results.filter(Boolean);
    }
    private printSummary(): void {
        const totalDuration = performance.now() - this.startTime;
        const successCount = this.results.filter((r) => r.success).length;
        const failedCount = this.results.filter((r) => !r.success).length;
        const cachedCount = this.results.filter((r) => r.cached).length;
        console.log("\n" + colors.bold("=".repeat(60)));
        console.log(colors.bold.cyan("📊 COSMIC RUNNER SUMMARY"));
        console.log(colors.bold("=".repeat(60)));
        console.log(`⏱️  Total Duration: ${colors.yellow((totalDuration / 1000).toFixed(2))}s`);
        console.log(`✅ Successful: ${colors.green(successCount.toString())}`);
        console.log(`❌ Failed: ${colors.red(failedCount.toString())}`);
        console.log(`⚡ Cached: ${colors.blue(cachedCount.toString())}`);
        console.log(`🚀 Total Projects: ${colors.cyan(this.results.length.toString())}`);
        if (failedCount > 0) {
            console.log("\n" + colors.red.bold("❌ FAILED TASKS:"));
            this.results.filter((r) => !r.success).forEach((r) => console.log(`  • ${colors.red(r.project)} - ${r.error || "Unknown error"}`));
        }
        if (cachedCount > 0) {
            console.log("\n" + colors.blue.bold("⚡ CACHED TASKS:"));
            this.results.filter((r) => r.cached).forEach((r) => console.log(`  • ${colors.blue(r.project)} - ${(r.duration / 1000).toFixed(2)}s`));
        }
        console.log("=".repeat(60) + "\n");
    }
    async run(task: string, sourceDir?: string): Promise<void> {
        this.startTime = performance.now();
        try {
            const rootDir = _resolve(process.cwd());
            const searchDir = sourceDir ? _resolve(sourceDir) : rootDir;
            this.log("info", `🔍 Searching for projects in: ${searchDir}`);
            this.projects = await this.findProjects(searchDir);
            if (this.projects.length === 0) {
                this.log("warn", "No projects found");
                return;
            }
            this.log("info", `📦 Found ${this.projects.length} project(s):`);
            if (this.config.verbose) {
                this.projects.forEach((project) => {
                    console.log(`  • ${colors.cyan(project.name)} ${colors.gray(`(${project.relativePath})`)}`);
                    const scripts = Object.keys(project.scripts);
                    if (scripts.length > 0) console.log(`    Scripts: ${colors.yellow(scripts.join(", "))}`);
                });
            }
            this.log("info", "🔗 Building dependency graph...");
            const dependencyGraph = this.buildDependencyGraph(this.projects);
            const sortedProjects = this.topologicalSort(dependencyGraph);
            this.log("info", `🚀 Running "${task}" task in dependency order...`);
            this.results = await this.runTasksConcurrently(task, sortedProjects);
            this.printSummary();
            const hasFailures = this.results.some((r) => !r.success);
            if (hasFailures) process.exit(1);
        } catch (error) {
            this.log("error", `Runner failed: ${error}`);
            process.exit(1);
        }
    }
    static async build(sourceDir?: string, config?: CosmicConfig): Promise<void> {
        const runner = new CosmicRunner(config);
        await runner.run("build", sourceDir);
    }
    static async test(sourceDir?: string, config?: CosmicConfig): Promise<void> {
        const runner = new CosmicRunner(config);
        await runner.run("test", sourceDir);
    }
    static async lint(sourceDir?: string, config?: CosmicConfig): Promise<void> {
        const runner = new CosmicRunner(config);
        await runner.run("lint", sourceDir);
    }
}
async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const task = args[0] || "build";
    const sourceDir = args[1];
    const config: CosmicConfig = { verbose: args.includes("--verbose") || args.includes("-v"), dryRun: args.includes("--dry-run"), failFast: !args.includes("--no-fail-fast") };
    const concurrencyIndex = args.findIndex((arg) => arg.startsWith("--concurrency="));
    if (concurrencyIndex !== -1) {
        const concurrency = parseInt(args[concurrencyIndex].split("=")[1]);
        if (!isNaN(concurrency) && concurrency > 0) config.maxConcurrency = concurrency;
    }
    const runner = new CosmicRunner(config);
    await runner.run(task, sourceDir);
}
export { CosmicRunner, CosmicConfig, Project, TaskResult };
if (require.main === module) {
    main().catch((error) => {
        console.error(colors.red("💥 Fatal error:"), error);
        process.exit(1);
    });
}
