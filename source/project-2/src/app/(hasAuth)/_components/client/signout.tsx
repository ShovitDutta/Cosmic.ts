// source/frontend/src/components/client/(root-page)/signout.tsx
"use client";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { HiOutlineLogout } from "react-icons/hi";
export function SignOut() {
    return (
        <motion.button
            onClick={() => signOut()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-4 bg-gray-800/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 hover:border-red-500/50 rounded-full transition-all duration-200 group">
            <HiOutlineLogout className="text-lg group-hover:rotate-12 transition-transform duration-200" /> <span className="font-medium">Sign Out</span>
        </motion.button>
    );
}
