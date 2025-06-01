import "../styles/globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "../providers";
const geist = Geist({ subsets: ["latin"] });
export const metadata: Metadata = {
    title: "Cosmic.ts",
    manifest: "/site.webmanifest",
    description: "A Typescript Multi-Repo Framework For Next.Js With A Structured Approach To Managing Multiple Projects In Clusters.",
    icons: {
        apple: "/apple-touch-icon.png",
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        ],
    },
};
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={geist.className}>
                <main className="min-h-screen bg-neutral-950">
                    <AppProviders>
                        <div className="relative z-10">{children}</div>
                    </AppProviders>
                </main>
            </body>
        </html>
    );
}