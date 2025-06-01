import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
export const users = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    emailVerified: integer("emailVerified", { mode: "timestamp" }),
    image: text("image"),
});
export const accounts = sqliteTable(
    "account",
    {
        userId: text("userId").notNull(),
        type: text("type").notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    account => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
);
export const sessions = sqliteTable("session", { sessionToken: text("sessionToken").primaryKey(), userId: text("userId").notNull(), expires: integer("expires", { mode: "timestamp" }).notNull() });
export const verificationTokens = sqliteTable(
    "verificationToken",
    { identifier: text("identifier").notNull(), token: text("token").notNull(), expires: integer("expires", { mode: "timestamp" }).notNull() },
    vt => [primaryKey({ columns: [vt.identifier, vt.token] })],
);
