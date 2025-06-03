import dotenv from "dotenv";
import colors from "colors";
import yaml from "js-yaml";
import path from "path";
import fs from "fs";
dotenv.config();
function generateSupervisordConf(projects) {
    let programBlocks = "";
    for (const project of projects) {
        const envVars = Object.entries(project.environment || {})
            .map(([key, value]) => `${key}="${value}"`)
            .join(",");
        programBlocks += `\n`;
        programBlocks += `[program:${project.name}]\n`;
        programBlocks += `autostart=true\n`;
        programBlocks += `autorestart=true\n`;
        programBlocks += `stdout_logfile_maxbytes=0\n`;
        programBlocks += `stderr_logfile_maxbytes=0\n`;
        programBlocks += `stdout_logfile=/dev/stdout\n`;
        programBlocks += `stderr_logfile=/dev/stderr\n`;
        programBlocks += `directory=${project.directory_path}\n`;
        programBlocks += `command=${project.command}\n`;
        if (envVars) programBlocks += `environment=${envVars}\n`;
    }
    const supervisordConfTemplate =
        `[supervisord]\n` +
        `user=root\n` +
        `nodaemon=true\n` +
        `\n` +
        `[program:nginx]\n` +
        `autostart=true\n` +
        `autorestart=true\n` +
        `stdout_logfile_maxbytes=0\n` +
        `stderr_logfile_maxbytes=0\n` +
        `stdout_logfile=/dev/stdout\n` +
        `stderr_logfile=/dev/stderr\n` +
        `command=/usr/sbin/nginx -g "daemon off;"\n` +
        `\n` +
        `[program:database-services]\n` +
        `autostart=true\n` +
        `autorestart=true\n` +
        `stdout_logfile_maxbytes=0\n` +
        `stderr_logfile_maxbytes=0\n` +
        `stdout_logfile=/dev/stdout\n` +
        `stderr_logfile=/dev/stderr\n` +
        `directory=/app/source/database\n` +
        `command=docker-compose -f docker-compose.yml up\n` +
        programBlocks;
    return supervisordConfTemplate;
}
function generateNginxConf(projects, nginxPort) {
    let upstreamBlocks = "";
    let locationBlocks = "";
    for (const project of projects) {
        const projectBasePath = project.base_path;
        upstreamBlocks += `    upstream ${project.name} {\n`;
        upstreamBlocks += `        server localhost:${project.port};\n`;
        upstreamBlocks += `    }\n`;
        locationBlocks += `        location ${projectBasePath} {\n`;
        locationBlocks += `            proxy_pass http://${project.name};\n`;
        locationBlocks += `            proxy_set_header Host $proxy_host;\n`;
        locationBlocks += `            proxy_set_header X-Real-IP $remote_addr;\n`;
        locationBlocks += `            proxy_set_header X-Forwarded-Proto $scheme;\n`;
        locationBlocks += `            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
        locationBlocks += `        }\n`;
    }
    const nginxConfTemplate =
        `worker_processes auto;\n` +
        `events {\n` +
        `    worker_connections 1024;\n` +
        `}\n` +
        `http {\n` +
        `    sendfile on;\n` +
        `    keepalive_timeout 65;\n` +
        `    include /etc/nginx/mime.types;\n` +
        `    default_type application/octet-stream;\n` +
        upstreamBlocks +
        `    server {\n` +
        `        listen ${nginxPort};\n` +
        `        server_name localhost;\n` +
        locationBlocks +
        `    }\n` +
        `}`;
    return nginxConfTemplate;
}
(async () => {
    const yamlFileName = "cosmos.yaml";
    const repoYamlPath = path.join(process.cwd(), yamlFileName);
    const nginxConfPath = path.join(process.cwd(), "docker", "nginx.conf");
    const supervisordConfPath = path.join(process.cwd(), "docker", "supervisord.conf");
    if (!fs.existsSync(repoYamlPath)) {
        console.error(`${colors.red("[error]:")} The '${yamlFileName}' file was not found at ${repoYamlPath}. Please read the 'README.md' and create it to proceed. `);
        return;
    }
    try {
        console.log(`${colors.blue(`[${yamlFileName}]:`)} Reading '${yamlFileName}' from ${repoYamlPath} ...`);
        const fileContents = fs.readFileSync(repoYamlPath, "utf8");
        const config = yaml.load(fileContents);
        const resolveValue = (value, contextName = "") => {
            if (typeof value === "string" && value.startsWith("ENV_")) {
                const envVarName = value;
                const resolved = process.env[envVarName];
                if (resolved === undefined) {
                    console.warn(
                        `${colors.yellow("[warning]:")} Environment variable '${envVarName}' ${contextName ? `(for ${contextName})` : ""} is not set in .env or system environment. Using empty string.`,
                    );
                    return "";
                }
                return resolved;
            }
            return value;
        };
        const nginxPort = resolveValue(config.HOST_PORT, "HOST_PORT") || 8000;
        const projects = [];
        if (config.BASE && config.BASE.length > 0) {
            const baseApp = config.BASE[0];
            const resolvedBaseEnv = {};
            if (baseApp.ENVIRONMENT_VARIABLES) {
                for (const key in baseApp.ENVIRONMENT_VARIABLES) resolvedBaseEnv[key] = resolveValue(baseApp.ENVIRONMENT_VARIABLES[key], `BASE.${baseApp.NAME}.ENVIRONMENT_VARIABLES.${key}`);
            }
            const baseAppAuthUrl = `http://localhost:${nginxPort}`;
            const baseAppGoogleRedirectUrl = `http://localhost:${baseApp.PORT}/api/auth/callback/google`;
            projects.push({
                name: baseApp.NAME,
                port: baseApp.PORT,
                command: baseApp.COMMAND,
                environment: {
                    ...resolvedBaseEnv,
                    AUTH_TRUST_HOST: "true",
                    AUTH_URL: baseAppAuthUrl,
                    GOOGLE_AUTHORIZED_REDIRECT_URL: baseAppGoogleRedirectUrl,
                },
                directory_path: "/app/source/__main__",
                base_path: resolvedBaseEnv.NEXT_PUBLIC_BASE_PATH || "/",
            });
        }
        if (config.CLUSTERS) {
            for (const cluster of config.CLUSTERS) {
                for (const repo of cluster.PROJECTS) {
                    const resolvedRepoEnv = {};
                    if (repo.ENVIRONMENT_VARIABLES) {
                        for (const key in repo.ENVIRONMENT_VARIABLES) resolvedRepoEnv[key] = resolveValue(repo.ENVIRONMENT_VARIABLES[key], `${cluster.NAME}.${repo.NAME}.ENVIRONMENT_VARIABLES.${key}`);
                    }
                    const repoAuthUrl = `http://localhost:${nginxPort}${resolvedRepoEnv.NEXT_PUBLIC_BASE_PATH || ""}`;
                    const repoGoogleRedirectUrl = `http://localhost:${repo.PORT}${resolvedRepoEnv.NEXT_PUBLIC_BASE_PATH || ""}/api/auth/callback/google`;
                    projects.push({
                        port: repo.PORT,
                        command: repo.COMMAND,
                        environment: {
                            ...resolvedRepoEnv,
                            AUTH_TRUST_HOST: "true",
                            AUTH_URL: repoAuthUrl,
                            GOOGLE_AUTHORIZED_REDIRECT_URL: repoGoogleRedirectUrl,
                        },
                        name: `${cluster.NAME}-${repo.NAME}`,
                        base_path: resolvedRepoEnv.NEXT_PUBLIC_BASE_PATH,
                        directory_path: `/app/source/clusters/${cluster.NAME}/${repo.NAME}`,
                    });
                }
            }
        }
        const supervisordContent = generateSupervisordConf(projects);
        const nginxContent = generateNginxConf(projects, nginxPort);
        fs.writeFileSync(supervisordConfPath, supervisordContent);
        console.log(`${colors.green("[supervisord.conf]:")} generated ${supervisordConfPath}`);
        fs.writeFileSync(nginxConfPath, nginxContent);
        console.log(`${colors.green("[nginx.conf]:")} generated ${nginxConfPath}`);
    } catch (e) {
        console.error(`${colors.red("[error]:")} Error generating configs: ${e.message}`);
    }
})();