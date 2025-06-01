/* eslint-disable no-undef */
import { join } from "path";
import { readdir, rm } from "fs/promises";
const prismaDir = join(process.cwd(), "prisma");
async function cleanPrismaDir(dirPath) {
    try {
        const migrationsPath = join(dirPath, "migrations");
        await rm(migrationsPath, { recursive: true, force: true });
    } catch {
        /* empty */
    }
    try {
        const entries = await readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile() && (entry.name.endsWith(".db") || entry.name.endsWith(".db-journal"))) {
                const filePath = join(dirPath, entry.name);
                await rm(filePath, { force: true });
            }
        }
    } catch {
        /* empty */
    }
}
async function main() {
    try {
        await cleanPrismaDir(prismaDir);
    } catch {
        /* empty */
    }
}
main().catch(console.error);