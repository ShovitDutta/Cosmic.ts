import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
const prisma = new PrismaClient();
export const { handlers, auth, signIn, signOut } = NextAuth({ adapter: PrismaAdapter(prisma), providers: [Google], pages: { signIn: "/" } });
