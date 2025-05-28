// source/frontend/src/components/server/(root-page)/UserAvatar.tsx
import Image from "next/image";
import type { Session } from "next-auth";
export function UserAvatar({ session, size = "lg" }: { session: Session | null; size?: "sm" | "md" | "lg" | "xl" }) {
    const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };
    const ringClasses = { sm: "ring-2", md: "ring-3", lg: "ring-4", xl: "ring-4" };
    return (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} ${ringClasses[size]} ring-purple-500/30 ring-offset-2 ring-offset-transparent rounded-full overflow-hidden shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 p-1`}>
                <Image
                    src={session?.user?.image ?? "https://i.pravatar.cc/300"}
                    alt={session?.user?.name ?? "User Avatar"}
                    className="w-full h-full rounded-full object-cover"
                    height={size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 48 : 32}
                    width={size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 48 : 32}
                />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 shadow-lg">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
}
