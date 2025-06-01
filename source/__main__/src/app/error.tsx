"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineWarning } from "react-icons/ai";
import { BsArrow90DegRight } from "react-icons/bs";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl"
            >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-center">
                    <div className="animate-pulse mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <AiOutlineWarning className="text-white text-2xl" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-red-400 mb-2">Error</h1>
                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
                    <p className="text-gray-300">We apologize for the inconvenience. Please try again.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <AiOutlineWarning className="text-red-400 text-xl flex-shrink-0" />
                    <p className="text-red-200 text-sm">{error.message || "An unexpected error occurred"}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group"
                    >
                        <span>Try again</span>
                        <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} animate={{ x: 0 }} whileHover={{ x: 4 }}>
                            <BsArrow90DegRight />
                        </motion.div>
                    </motion.button>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-sm text-gray-400">
                    <p>If the problem persists, please contact support.</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
