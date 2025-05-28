// source/frontend/src/app/(auth)/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-black">
            <div className="relative z-10">{children}</div>
        </main>
    );
}
