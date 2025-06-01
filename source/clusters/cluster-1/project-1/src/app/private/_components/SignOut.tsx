"use client";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { HiOutlineLogout } from "react-icons/hi";
import { basePath } from "../../../utils/dynamicEnv";
export default function SignOut() {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => signOut({ redirectTo: basePath })}
            className="flex items-center space-x-2 px-4 py-4 bg-gray-800/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 hover:border-red-500/50 rounded-full transition-all duration-200 group">
            <HiOutlineLogout className="text-lg group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-medium">Sign Out</span>
        </motion.button>
    );
}