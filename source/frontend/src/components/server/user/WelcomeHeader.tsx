// source/frontend/src/components/server/user/WelcomeHeader.tsx
import type { Session } from "next-auth";
import { UserAvatar } from "../(root-page)/UserAvatar";
import { SignOut } from "../../client/(root-page)/signout";
export function WelcomeHeader({ session }: { session: Session }) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };
    return (
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl">
            <div className="flex items-center space-x-4">
                <UserAvatar session={session} size="lg" />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {getGreeting()}, {session.user?.name?.split(" ")[0] || "User"}! 👋
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base">Welcome back to your dashboard</p>
                </div>
            </div>
            <div className="hidden md:block">
                <SignOut />
            </div>
        </div>
    );
}
