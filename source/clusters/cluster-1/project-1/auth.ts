import { db } from "./drizzle";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
if (!db) throw new Error("Database is not initialized");
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google, Discord, GitHub],
    adapter: DrizzleAdapter(db),
    basePath: process.env.NEXT_PUBLIC_BASE_PATH + "/api/auths",
    pages: { signIn: "/", signOut: "/", error: "/api/auth/error" },
    ...(process.env.NODE_ENV === "production"
        ? {
              logger: {
                  warn(code) {
                      if (code === "env-url-basepath-mismatch") return;
                      else console.warn(code);
                  },
              },
          }
        : {}),
});