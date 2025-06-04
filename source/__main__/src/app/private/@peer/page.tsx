"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
export default function ParallelPeerPage() {
    const [fetchedData, setFetchedData] = useState<{ url: string; message: string | null; error: string | null }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const apiEndpoints = useMemo(
        () => [
            "http://localhost:3000/api/peer",
            "http://localhost:3001/cluster-1/project-1/api/peer",
            "http://localhost:3002/cluster-1/project-2/api/peer",
            "http://localhost:3003/cluster-2/project-1/api/peer",
            "http://localhost:3004/cluster-2/project-2/api/peer",
        ],
        [],
    );
    useEffect(() => {
        const fetchAllMessages = async () => {
            setLoading(true);
            const results = await Promise.all(
                apiEndpoints.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const data = await response.json();
                        return { url, message: data.message, error: null };
                    } catch (e) {
                        return { url, message: null, error: e instanceof Error ? e.message : "Connection failed" };
                    }
                }),
            );
            setFetchedData(results);
            setLoading(false);
        };
        fetchAllMessages();
    }, [apiEndpoints]);
    return (
        <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl mb-4"
                    >
                        <AiOutlineLoading3Quarters className="text-blue-400 text-xl animate-spin" /> <p className="text-blue-200 text-sm">Fetching data from all endpoints...</p>
                    </motion.div>
                )}
                <motion.div className="space-y-4">
                    {!loading && fetchedData.length > 0 ? (
                        fetchedData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 backdrop-blur-xl rounded-xl hover:bg-cyan-900/40 transition-all"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">{item.error ? <BsXCircle className="text-red-400 text-xl" /> : <BsCheckCircle className="text-green-400 text-xl" />}</div>
                                    <div className="flex-grow min-w-0">
                                        <div className="mb-3">
                                            <span className="text-gray-300 text-sm font-medium">Endpoint:</span>
                                            <code className="ml-2 px-3 py-1 bg-gray-800/50 text-gray-200 rounded-lg text-sm font-mono break-all">{item.url}</code>
                                        </div>
                                        {item.error ? (
                                            <div className="flex items-start space-x-2">
                                                <AiOutlineWarning className="text-red-400 text-lg flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-red-300 text-sm font-medium">Error:</span> <p className="text-red-200 text-sm mt-1">{item.error}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="text-green-300 text-sm font-medium">Response:</span> <p className="text-green-200 text-sm mt-1 font-medium">{item.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : !loading && fetchedData.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-3 p-6 bg-red-500/20 border border-red-500/30 rounded-xl"
                        >
                            <AiOutlineWarning className="text-red-400 text-xl flex-shrink-0" /> <p className="text-red-200">No data fetched. Check API endpoints or network connection.</p>
                        </motion.div>
                    ) : null}
                </motion.div>
            </div>
            <motion.div className="mt-8 flex items-center gap-4 text-gray-400 justify-start" animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse delay-200"></div>
                </div>
                <span className="text-sm font-medium tracking-wide">Real-Time HTTP Polling</span>
                <div className="h-4 w-px bg-gray-600"></div>
                <span className="text-xs font-mono text-gray-500">Multi-Endpoint Peer Connection</span>
            </motion.div>
        </div>
    );
}
