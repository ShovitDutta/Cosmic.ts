// source/frontend/src/app/(auth)/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-red-950 to-stone-950">
            <div className="relative z-10">{children}</div>
        </main>
    );
}
