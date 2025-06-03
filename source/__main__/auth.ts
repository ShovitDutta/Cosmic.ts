import { db } from "./drizzle";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
if (!db) throw new Error("Database is not initialized");
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
    basePath: "/api/auth",
    adapter: DrizzleAdapter(db),
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
