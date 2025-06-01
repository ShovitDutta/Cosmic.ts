"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
export default function PublicPage() {
    const [fetchedData, setFetchedData] = useState<{ url: string; message: string | null; error: string | null }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const apiEndpoints = useMemo(
        () => [
            "http://localhost:3000/api/peer",
            "http://localhost:4001/cluster-1/project-1/api/peer",
            "http://localhost:4002/cluster-1/project-2/api/peer",
            "http://localhost:5001/cluster-2/project-1/api/peer",
            "http://localhost:5002/cluster-2/project-2/api/peer",
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
                        let errorMessage = "An unknown error occurred.";
                        if (e instanceof Error) errorMessage = e.message;
                        else if (typeof e === "string") errorMessage = e;
                        return { url, message: null, error: errorMessage };
                    }
                }),
            );
            setFetchedData(results);
            setLoading(false);
        };
        fetchAllMessages();
    }, [apiEndpoints]);
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-4xl p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl"
            >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-center">
                    <div className="animate-pulse mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <div className="animate-spin w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Peer Connection Check</h1> <p className="text-gray-300">Testing connectivity to multiple API endpoints</p>
                </motion.div>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl"
                    >
                        <AiOutlineLoading3Quarters className="text-blue-400 text-xl animate-spin" /> <p className="text-blue-200 text-sm">Fetching data from all endpoints...</p>
                    </motion.div>
                )}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="space-y-4">
                    {!loading && fetchedData.length > 0 ? (
                        fetchedData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200"
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-sm text-gray-400">
                    <p>Connection status updated in real-time</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
