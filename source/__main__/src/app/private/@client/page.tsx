"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function ParallelClientPage() {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionCount, setConnectionCount] = useState(0);
    const [currentTime, setCurrentTime] = useState("Loading...");
    useEffect(() => {
        async function fetchTime() {
            try {
                setError(false);
                const response = await fetch("/api/clock");
                const data = await response.json();
                setCurrentTime(data.time);
                setConnectionCount((prev) => prev + 1);
            } catch (error) {
                console.log(error);
                setCurrentTime("Connection Error");
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTime();
        const interval = setInterval(fetchTime, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="h-[600px] flex flex-col">
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-400/30 backdrop-blur-xl"
            >
                <h3 className="text-lg font-bold text-cyan-300 mb-2">Client-Side Rendering (CSR)</h3>
                <ul className="text-sm text-cyan-200/80 space-y-1">
                    <li>• Renders in the browser after JavaScript loads</li>
                    <li>• Interactive immediately, updates without page refresh</li>
                    <li>• Real-time data fetching with HTTP polling</li>
                    <li>• SEO considerations require additional setup</li>
                </ul>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex-1 flex flex-col justify-center relative"
            >
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-float-delayed"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-cyan-500/10 via-blue-500/10 to-teal-500/10 rounded-full blur-3xl animate-spin-slow"></div>
                </div>
                <motion.div className="relative group">
                    <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-500 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-50 transition-all duration-1000 animate-pulse"></div>
                    <motion.div
                        className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-3xl rounded-[1.5rem] p-16 border border-cyan-400/40 shadow-2xl shadow-cyan-500/30"
                        style={{
                            background: `linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(0,0,0,0.95) 50%, rgba(31,41,55,0.95) 100%)`,
                            boxShadow: `0 25px 50px -12px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.1)`,
                        }}
                    >
                        <div className="absolute top-6 left-6 flex gap-3">
                            <motion.div
                                className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400/50"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                            <motion.div
                                className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                            ></motion.div>
                            <motion.div
                                className="w-4 h-4 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                            ></motion.div>
                        </div>
                        <div className="absolute top-6 right-6 text-xs text-gray-500 font-mono">#{connectionCount.toString().padStart(4, "0")}</div>
                        <div className="flex items-center gap-5 mb-8">
                            <motion.div
                                className="relative"
                                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_30px_#00ffff]"></div>
                                <div className="absolute inset-0 w-6 h-6 rounded-full bg-cyan-300/50 animate-ping"></div>
                                <div className="absolute inset-1 w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm"></div>
                            </motion.div>
                            <motion.h1
                                className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-400 bg-clip-text text-transparent tracking-tight text-left"
                                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                                transition={{ duration: 5, repeat: Infinity }}
                            >
                                Client Runtime
                            </motion.h1>
                        </div>
                        <div className="space-y-6 text-left">
                            <motion.div
                                className="p-5 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-400/30 backdrop-blur-xl relative overflow-hidden"
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative text-left">
                                    <p className="text-gray-200 text-lg font-semibold leading-relaxed mb-2">React Client Component</p>
                                    <p className="text-cyan-300/80 text-sm font-medium mb-3">Interactive UI with HTTP polling</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"></div>
                                        <span className="text-cyan-300 text-sm font-mono tracking-wider">HTTP Requests every 1s</span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-600/40 backdrop-blur-xl relative overflow-hidden"
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                                <div className="flex items-center gap-3">
                                    <AnimatePresence mode="wait">
                                        {isLoading ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                                className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse shadow-[0_0_20px_#fbbf24]"
                                            >
                                                <div className="w-full h-full rounded-full bg-yellow-300/50 animate-ping"></div>
                                            </motion.div>
                                        ) : error ? (
                                            <motion.div
                                                key="error"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                                className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-pulse shadow-[0_0_20px_#f87171]"
                                            >
                                                <div className="w-full h-full rounded-full bg-red-300/50 animate-ping"></div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                                className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse shadow-[0_0_20px_#10b981]"
                                            >
                                                <div className="w-full h-full rounded-full bg-emerald-300/50 animate-ping"></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <motion.span
                                        className={`text-sm font-bold tracking-wider uppercase ${isLoading ? "text-yellow-300" : error ? "text-red-300" : "text-emerald-300"}`}
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        {isLoading ? "Syncing" : error ? "Offline" : "Live"}
                                    </motion.span>
                                </div>
                                <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-500 to-transparent"></div>
                                <motion.div
                                    key={currentTime}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="flex-1 text-left"
                                >
                                    <p className="text-2xl font-mono font-black text-white tracking-wider drop-shadow-lg">{currentTime}</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
                <motion.div className="mt-8 flex items-center gap-4 text-gray-400 justify-start" animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse delay-200"></div>
                    </div>
                    <span className="text-sm font-medium tracking-wide">Real-Time HTTP Polling</span>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-xs font-mono text-gray-500">Fetch API Connected</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
