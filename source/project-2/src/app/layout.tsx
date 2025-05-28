import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "../providers";
const geist = Geist({ subsets: ["latin"] });
export const metadata: Metadata = { title: "MonoRepo.js", description: "A TypeScript based Next.js mono-repo powered by Turbo" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={geist.className}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
