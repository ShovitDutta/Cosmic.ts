"use client";
import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AnimatePresence mode="wait">
                <SessionProvider>{children}</SessionProvider>
            </AnimatePresence>
        </QueryClientProvider>
    );
}
