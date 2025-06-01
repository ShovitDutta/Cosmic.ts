"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
import { BsArrow90DegRight, BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";
export default function RootPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSignIn = async (provider: string) => {
        setLoading(true);
        setError(null);
        try {
            await signIn(provider);
        } catch (error) {
            if (error instanceof Error) setError(error.message);
            else setError("An unknown error occurred during sign-in.");
        } finally {
            setLoading(false);
        }
    };
    const { data: session } = useSession();
    if (session?.user) return redirect("/private");
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-center">
                    <div className="animate-pulse mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <div className="animate-spin w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded"></div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1> <p className="text-gray-300">Sign in to continue..</p>
                </motion.div>
                {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                        <AiOutlineWarning className="text-red-400 text-xl flex-shrink-0" /> <p className="text-red-200 text-sm">{error}</p>
                    </motion.div>
                )}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center space-x-3 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                        <AiOutlineLoading3Quarters className="text-orange-400 text-xl animate-spin" /> <p className="text-orange-200 text-sm">Signing you in...</p>
                    </motion.div>
                )}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="space-y-2">
                    <motion.button
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => handleSignIn("google")}
                        className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group">
                        <BsGoogle className="text-2xl" />
                        <span>Signup with Google</span>
                        <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} animate={{ x: 0 }} whileHover={{ x: 4 }}>
                            <BsArrow90DegRight />
                        </motion.div>
                    </motion.button>
                    <motion.button
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => handleSignIn("github")}
                        className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group">
                        <BsGithub className="text-2xl" />
                        <span>Signup with Github</span>
                        <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} animate={{ x: 0 }} whileHover={{ x: 4 }}>
                            <BsArrow90DegRight />
                        </motion.div>
                    </motion.button>
                    <motion.button
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => handleSignIn("discord")}
                        className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group">
                        <BsDiscord className="text-2xl" />
                        <span>Signup with Discord</span>
                        <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} animate={{ x: 0 }} whileHover={{ x: 4 }}>
                            <BsArrow90DegRight />
                        </motion.div>
                    </motion.button>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-sm text-gray-400">
                    <p>By signing in, you agree to our terms and privacy policy</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
