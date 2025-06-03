import * as schema from "./schema";
import Database from "better-sqlite3";
const databaseUrl = process.env.DATABASE_URL;
import { drizzle as sqliteDrizzle } from "drizzle-orm/better-sqlite3";
let db: ReturnType<typeof sqliteDrizzle> | undefined;
if (databaseUrl && databaseUrl.endsWith(".db")) {
    const sqlite = new Database(databaseUrl, { fileMustExist: false });
    db = sqliteDrizzle(sqlite, { schema });
}
export { db };
