// source/frontend/src/components/server/(root-page)/UserAvatar.tsx
import Image from "next/image";
import type { Session } from "next-auth";
export function UserAvatar({ session, size = "lg" }: { session: Session | null; size?: "sm" | "md" | "lg" | "xl" }) {
    const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };
    const ringClasses = { sm: "ring-1", md: "ring-2", lg: "ring-3", xl: "ring-4" };
    return (
        <div className="relative">
            <div
                className={`${sizeClasses[size]} ${ringClasses[size]} ring-black ring-offset-1 ring-offset-transparent rounded-full overflow-hidden shadow-xl bg-gradient-to-br from-red-800 to-orange-800 p-0.5`}>
                <Image
                    alt={session?.user?.name ?? "User Avatar"}
                    className="w-full h-full rounded-full object-cover"
                    src={session?.user?.image ?? "https://i.pravatar.cc/300"}
                    width={size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 48 : 32}
                    height={size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 48 : 32}
                />
            </div>
        </div>
    );
}
