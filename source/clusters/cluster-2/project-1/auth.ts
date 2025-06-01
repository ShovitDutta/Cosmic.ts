import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google, Discord, GitHub],
    adapter: PrismaAdapter(new PrismaClient()),
    pages: { signIn: "/", error: "/api/auth/error" },
    basePath: process.env.NEXT_PUBLIC_BASE_PATH + "/api/auths",
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
