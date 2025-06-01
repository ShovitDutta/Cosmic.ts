"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import { basePath } from "../utils/dynamicEnv";
import { ReactNode } from "react";
const queryClient = new QueryClient();
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AnimatePresence mode="wait">
                <SessionProvider basePath={basePath + "/api/auth"}>
                    {children}
                </SessionProvider>
            </AnimatePresence>
        </QueryClientProvider>
    );
}