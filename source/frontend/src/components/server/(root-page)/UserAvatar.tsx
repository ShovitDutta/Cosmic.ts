// source/frontend/src/components/server/(root-page)/UserAvatar.tsx
import Image from "next/image";
import type { Session } from "next-auth";
export function UserAvatar({ session }: { session: Session | null }) {
    return (
        <Image
            src={session?.user?.image ?? "https://i.pravatar.cc/300"}
            alt={session?.user?.name ?? "User Avatar"}
            className="w-[50px] h-[50px] rounded-full"
            style={{ objectFit: "cover" }}
            height={50}
            width={50}
        />
    );
}
