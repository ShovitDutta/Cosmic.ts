import { writeFileSync, unlinkSync, existsSync } from "fs";
import { execSync } from "child_process";
import { config } from "dotenv";
import { resolve } from "path";
config();
const databaseUrl = process.env.DATABASE_URL;
let dialect = "sqlite";
let dbCredentials = {};
if (!databaseUrl) {
    console.warn("DATABASE_URL environment variable is not set. Defaulting to SQLite with ./drizzle.db.");
    dbCredentials = { url: "./drizzle.db" };
} else if (databaseUrl.startsWith("sqlite://") || databaseUrl.endsWith(".db")) {
    dialect = "sqlite";
    dbCredentials = { url: databaseUrl.replace("sqlite://", "") };
} else if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
    dialect = "postgresql";
    dbCredentials = { url: databaseUrl };
} else if (databaseUrl.startsWith("mysql://")) {
    dialect = "mysql";
    dbCredentials = { url: databaseUrl };
} else {
    console.warn(`Unsupported DATABASE_URL format: ${databaseUrl}. Defaulting to SQLite with ./drizzle.db.`);
    dialect = "sqlite";
    dbCredentials = { url: "./drizzle.db" };
}

const configContent = `
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./drizzle/schema.ts",
    dialect: "${dialect}",
    dbCredentials: ${JSON.stringify(dbCredentials, null, 2)}
});
`;
const configPath = resolve(process.cwd(), "drizzle.config.ts");
try {
    if (existsSync(configPath)) unlinkSync(configPath);
    writeFileSync(configPath, configContent.trim());
    execSync(`drizzle-kit push --config=${configPath}`, { stdio: "inherit" });
    execSync(`drizzle-kit generate --config=${configPath}`, { stdio: "inherit" });
} catch (error) {
    if (error instanceof Error) {
        console.error("An error occurred:", error.message);
    } else {
        console.error("An unknown error occurred:", error);
    }
    process.exit(1);
}
