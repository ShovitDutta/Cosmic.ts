// source/frontend/src/app/error.tsx
"use client";
import { useEffect } from "react";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (
        <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-red-950 to-stone-950 flex items-center justify-center">
            <div className="relative z-10 text-center text-white p-8 rounded-lg shadow-xl bg-black/50">
                <h1 className="text-6xl font-extrabold text-red-500 mb-4 animate-pulse">Error</h1>
                <h2 className="text-3xl font-semibold mb-6">Something went wrong!</h2>
                <p className="text-lg mb-8">We apologize for the inconvenience. Please try again.</p>
                <button
                    className="flex items-center space-x-2 px-4 py-4 bg-gray-800/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 hover:border-red-500/50 rounded-full transition-all duration-200 group"
                    onClick={() => reset()}>
                    Try again
                </button>
            </div>
        </main>
    );
}
