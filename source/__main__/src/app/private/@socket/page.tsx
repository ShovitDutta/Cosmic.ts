"use client";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters, AiOutlineWarning } from "react-icons/ai";
interface SocketPeerResult {
    url: string;
    port: number;
    message: string | null;
    error: string | null;
    timestamp?: string;
    socketId?: string;
    connected: boolean;
}
export default function ParallelSocketPage() {
    const [socketClients, setSocketClients] = useState<Socket[]>([]);
    const [peerResults, setPeerResults] = useState<SocketPeerResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const socketEndpoints = useMemo(
        () => [
            { url: "http://localhost:3000", port: 3000 },
            { url: "http://localhost:3001", port: 3001 },
            { url: "http://localhost:3002", port: 3002 },
            { url: "http://localhost:3003", port: 3003 },
            { url: "http://localhost:3004", port: 3004 },
        ],
        [],
    );
    useEffect(() => {
        const clients: Socket[] = [];
        const results: SocketPeerResult[] = [];
        const initializeSockets = async () => {
            setLoading(true);
            for (const endpoint of socketEndpoints) {
                const initialResult: SocketPeerResult = { url: endpoint.url, port: endpoint.port, message: null, error: null, connected: false };
                results.push(initialResult);
                try {
                    const socket = io(endpoint.url, { transports: ["websocket", "polling"], timeout: 5000, forceNew: true });
                    socket.on("connect", () => {
                        setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, connected: true, error: null } : result)));
                    });
                    socket.on("connect_error", (error) => {
                        setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, connected: false, error: error.message || "Connection failed" } : result)));
                    });
                    socket.on("disconnect", (reason) => {
                        setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, connected: false, error: `Disconnected: ${reason}` } : result)));
                    });
                    clients.push(socket);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Unknown error";
                    setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, error: errorMessage } : result)));
                }
            }
            setPeerResults(results);
            setSocketClients(clients);
            setTimeout(() => setLoading(false), 3000);
        };
        initializeSockets();
        return () => {
            clients.forEach((socket) => {
                if (socket.connected) socket.disconnect();
            });
        };
    }, [socketEndpoints]);
    const handleTestMessage = () => {
        socketClients.forEach((socket) => {
            if (socket.connected) {
                const testMessage = `Test from ${new Date().toLocaleTimeString()}`;
                socket.emit("message", testMessage);
            }
        });
    };
    const connectedCount = peerResults.filter((result) => result.connected).length;
    const totalCount = peerResults.length;
    return (
        <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center space-x-3 p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl mb-4"
                    >
                        <AiOutlineLoading3Quarters className="text-purple-400 text-xl animate-spin" /> <p className="text-purple-200 text-sm">Initializing socket connections...</p>
                    </motion.div>
                )}
                <motion.div className="space-y-4">
                    {peerResults.length > 0 ? (
                        peerResults.map((result, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/30 backdrop-blur-xl rounded-xl hover:bg-violet-900/40 transition-all"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {result.error ? (
                                            <BsXCircle className="text-red-400 text-xl" />
                                        ) : result.connected ? (
                                            <BsCheckCircle className="text-green-400 text-xl" />
                                        ) : (
                                            <AiOutlineLoading3Quarters className="text-blue-400 text-xl animate-spin" />
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="mb-3">
                                            <span className="text-gray-300 text-sm font-medium">Endpoint:</span>
                                            <code className="ml-2 px-3 py-1 bg-gray-800/50 text-gray-200 rounded-lg text-sm font-mono break-all">
                                                {result.url} (Port: {result.port})
                                            </code>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-gray-300 text-sm font-medium">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${result.connected ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                                                {result.connected ? "Connected" : "Disconnected"}
                                            </span>
                                        </div>
                                        {result.error && (
                                            <div className="flex items-start space-x-2 mt-2">
                                                <AiOutlineWarning className="text-red-400 text-lg flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-red-300 text-sm font-medium">Error:</span> <p className="text-red-200 text-sm mt-1">{result.error}</p>
                                                </div>
                                            </div>
                                        )}
                                        {result.socketId && <p className="text-gray-400 text-xs mt-2">Socket ID: {result.socketId}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-3 p-6 bg-red-500/20 border border-red-500/30 rounded-xl"
                        >
                            <AiOutlineWarning className="text-red-400 text-xl flex-shrink-0" /> <p className="text-red-200">No socket connections established.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="mt-4 flex items-center gap-3 text-purple-300 justify-start">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div> <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-200"></div>
                    </div>
                    <span className="text-xs font-mono text-gray-500">Web Sockets Connection</span>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-sm font-medium tracking-wide">
                        Sockets Connected: {connectedCount}/{totalCount}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                </div>
                <button
                    onClick={handleTestMessage}
                    disabled={connectedCount === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${connectedCount > 0 ? "bg-purple-600/20 hover:bg-purple-700/40 text-white shadow-md" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                >
                    Send Test Message
                </button>
            </div>
        </div>
    );
}
