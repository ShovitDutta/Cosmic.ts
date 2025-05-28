// source/frontend/src/components/server/(root-page)/Dashboard.tsx
import type { Session } from "next-auth";
import { UserInfoCard } from "../user/UserInfoCard";
import { WelcomeHeader } from "../user/WelcomeHeader";
export function Dashboard({ session }: { session: Session }) {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */} <WelcomeHeader session={session} /> {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <UserInfoCard session={session} />
                    </div>
                    {/* Dashboard Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105">
                                    <div className="text-2xl mb-2">📊</div> <p className="text-purple-200 text-sm font-medium">Analytics</p>
                                </div>
                                <div className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105">
                                    <div className="text-2xl mb-2">⚙️</div> <p className="text-blue-200 text-sm font-medium">Settings</p>
                                </div>
                                <div className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105">
                                    <div className="text-2xl mb-2">📝</div> <p className="text-green-200 text-sm font-medium">Projects</p>
                                </div>
                            </div>
                        </div>
                        {/* Recent Activity */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div> <p className="text-gray-300 text-sm">Signed in successfully</p>
                                    <span className="text-gray-500 text-xs ml-auto">Just now</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div> <p className="text-gray-300 text-sm">Profile updated</p>
                                    <span className="text-gray-500 text-xs ml-auto">2 hours ago</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div> <p className="text-gray-300 text-sm">New project created</p>
                                    <span className="text-gray-500 text-xs ml-auto">1 day ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
