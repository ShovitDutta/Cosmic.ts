// source/frontend/src/components/server/(root-page)/Dashboard.tsx
"use server";
import type { Session } from "next-auth";
import { UserAvatar } from "./UserAvatar";
import { SignOut } from "../client/signout";
export async function Dashboard({ session }: { session: Session }) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        else return "Good Evening";
    };
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <nav className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-full border border-white/20 p-4 shadow-xl">
                    <div className="flex items-center space-x-4">
                        <UserAvatar session={session} size="lg" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {getGreeting()}, {session.user?.name || "User"}! 👋
                            </h1>
                            <p className="text-gray-300 text-sm md:text-base">{session.user?.email}</p>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <SignOut />
                    </div>
                </nav>
            </div>
        </div>
    );
}
