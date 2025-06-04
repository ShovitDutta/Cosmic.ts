"use server";
import { auth } from "../../../auth";
import SignOut from "./_components/SignOut";
import UserAvatar from "./_components/UserAvatar";
export default async function PrivatePage() {
    const session = await auth();
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };
    return (
        <div className="sticky top-0 z-40 border-b border-white/10 bg-transparent backdrop-blur-3xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <nav className="flex items-center justify-between py-6">
                    <div className="flex items-center space-x-6">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <UserAvatar session={session} size="lg" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-black shadow-lg">
                                <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                                {getGreeting()}, <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{session?.user?.name || "User"}</span>
                                <span className="ml-2 text-2xl animate-bounce">👋</span>
                            </h1>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">{session?.user?.email}</p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative">
                            <SignOut />
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
