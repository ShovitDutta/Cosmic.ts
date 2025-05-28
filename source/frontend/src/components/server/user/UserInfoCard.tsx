// source/frontend/src/components/server/user/UserInfoCard.tsx
import type { Session } from "next-auth";
import { UserAvatar } from "../(root-page)/UserAvatar";
import { SignOut } from "../../client/(root-page)/signout";
import { HiOutlineMail, HiOutlineFingerPrint, HiOutlineUser } from "react-icons/hi";
export function UserInfoCard({ session }: { session: Session }) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl space-y-6">
            {/* Avatar and Name */}
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <UserAvatar session={session} size="xl" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{session.user?.name || "Unknown User"}</h2> <p className="text-gray-300 text-sm">Premium Member</p>
            </div>
            {/* User Details */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <HiOutlineUser className="text-purple-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Name</p> <p className="text-white font-medium truncate">{session.user?.name || "Not provided"}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <HiOutlineMail className="text-blue-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Email</p>
                        <p className="text-white font-medium truncate">{session.user?.email || "Not provided"}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <HiOutlineFingerPrint className="text-green-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">User ID</p>
                        <p className="text-white font-medium font-mono text-sm truncate">{session.user?.id || "Not available"}</p>
                    </div>
                </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">24</p> <p className="text-gray-400 text-sm">Projects</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">12</p> <p className="text-gray-400 text-sm">Tasks</p>
                </div>
            </div>
            {/* Sign Out Button (Mobile) */}
            <div className="md:hidden pt-4 border-t border-white/10">
                <SignOut />
            </div>
        </div>
    );
}
