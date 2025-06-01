"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineWarning } from "react-icons/ai";
import { BsArrow90DegRight } from "react-icons/bs";
export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-center">
                    <div className="animate-pulse mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <AiOutlineWarning className="text-white text-2xl" />
                    </div>
                    <h1 className="text-6xl font-extrabold text-red-400 mb-2 animate-pulse">404</h1>
                    <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-300">The page you are looking for does not exist or has been moved.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="space-y-2">
                    <Link href="/">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group">
                            <span>Go back to Home</span>
                            <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} animate={{ x: 0 }} whileHover={{ x: 4 }}>
                                <BsArrow90DegRight />
                            </motion.div>
                        </motion.button>
                    </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-sm text-gray-400">
                    <p>Lost? Don&apos;t worry, we&apos;ll help you find your way back.</p>
                </motion.div>
            </motion.div>
        </div>
    );
}