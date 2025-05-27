"use client";
import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
        </QueryClientProvider>
    );
}
