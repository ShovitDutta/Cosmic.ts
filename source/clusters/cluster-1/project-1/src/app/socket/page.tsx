"use client";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { useEffect, useState, useMemo } from "react";
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
interface PeerCheckResponse {
    port: number;
    message: string;
    timestamp: string;
    socketId: string;
}
export default function SocketPage() {
    const [socketClients, setSocketClients] = useState<Socket[]>([]);
    const [peerResults, setPeerResults] = useState<SocketPeerResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalStatus, setGlobalStatus] = useState<string>("Connecting...");
    const socketEndpoints = useMemo(() => {
        const peersString = process.env.NEXT_PUBLIC_CONNECT_PEERS;
        if (!peersString) {
            return [];
        }
        return peersString
            .split(",")
            .map((peerUrl) => {
                try {
                    const url = new URL(peerUrl.trim());
                    return { url: url.origin, port: parseInt(url.port) || (url.protocol === "https:" ? 443 : 80) };
                } catch (error) {
                    console.error(`Invalid peer URL in NEXT_PUBLIC_CONNECT_PEERS: ${peerUrl}`, error);
                    return null;
                }
            })
            .filter(Boolean) as { url: string; port: number }[];
    }, []);
    useEffect(() => {
        const clients: Socket[] = [];
        const results: SocketPeerResult[] = [];
        const initializeSockets = async () => {
            setLoading(true);
            setGlobalStatus("Initializing socket connections...");
            for (const endpoint of socketEndpoints) {
                const initialResult: SocketPeerResult = { url: endpoint.url, port: endpoint.port, message: null, error: null, connected: false };
                results.push(initialResult);
                try {
                    const socket = io(endpoint.url, { transports: ["websocket", "polling"], timeout: 5000, forceNew: true });
                    socket.on("connect", () => {
                        console.log(`Socket connected to ${endpoint.url}:`, socket.id);
                        setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, connected: true, error: null } : result)));
                        socket.emit("peer-check", { from: window.location.origin, timestamp: new Date().toISOString() }, (response: PeerCheckResponse) => {
                            console.log(`Peer check response from ${endpoint.url}:`, response);
                            setPeerResults((prev) =>
                                prev.map((result) =>
                                    result.url === endpoint.url ? { ...result, message: response.message, timestamp: response.timestamp, socketId: response.socketId, error: null } : result,
                                ),
                            );
                        });
                    });
                    socket.on("connect_error", (error) => {
                        console.error(`Socket connection error for ${endpoint.url}:`, error);
                        setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, connected: false, error: error.message || "Connection failed" } : result)));
                    });
                    socket.on("disconnect", (reason) => {
                        console.log(`Socket disconnected from ${endpoint.url}:`, reason);
                        setPeerResults((prev) => prev.map((result) => (result.url === endpoint.url ? { ...result, connected: false, error: `Disconnected: ${reason}` } : result)));
                    });
                    socket.on("peer-check-response", (response: PeerCheckResponse) => {
                        console.log(`Broadcast peer check response:`, response);
                    });
                    clients.push(socket);
                } catch (error) {
                    console.error(`Failed to create socket for ${endpoint.url}:`, error);
                    const errorMessage = error instanceof Error ? error.message : "Unknown error";
                    const lastResult = results[results.length - 1];
                    if (lastResult) {
                        lastResult.error = errorMessage;
                    }
                }
            }
            setPeerResults(results);
            setSocketClients(clients);
            setTimeout(() => {
                setLoading(false);
                setGlobalStatus("Socket peer checking complete");
            }, 3000);
        };
        initializeSockets();
        return () => {
            clients.forEach((socket) => {
                if (socket.connected) {
                    socket.disconnect();
                }
            });
        };
    }, [socketEndpoints]);
    const handleTestMessage = () => {
        socketClients.forEach((socket, index) => {
            if (socket.connected) {
                const testMessage = `Test message from client at ${new Date().toLocaleTimeString()} - Socket ${index + 1}`;
                socket.emit("message", testMessage);
                if (socketEndpoints[index]) console.log(`Sent test message to ${socketEndpoints[index].url}:`, testMessage);
                else console.log(`Sent test message to an unknown endpoint (index ${index}):`, testMessage);
            }
        });
    };
    const connectedCount = peerResults.filter((result) => result.connected).length;
    const totalCount = peerResults.length;
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
                    <h1 className="text-3xl font-bold text-white mb-2">Socket.IO Peer Connection Check</h1> <p className="text-gray-300">Testing real-time socket connections to multiple peers</p>
                    <div className="mt-4 text-sm text-gray-400">
                        Connected: {connectedCount} / {totalCount}
                    </div>
                </motion.div>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl"
                    >
                        <AiOutlineLoading3Quarters className="text-blue-400 text-xl animate-spin" /> <p className="text-blue-200 text-sm">{globalStatus}</p>
                    </motion.div>
                )}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="space-y-4">
                    {peerResults.length > 0 ? (
                        peerResults.map((result, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {result.error ? (
                                            <BsXCircle className="text-red-400 text-xl" />
                                        ) : result.connected && result.message ? (
                                            <BsCheckCircle className="text-green-400 text-xl" />
                                        ) : result.connected ? (
                                            <AiOutlineLoading3Quarters className="text-blue-400 text-xl animate-spin" />
                                        ) : (
                                            <BsXCircle className="text-red-400 text-xl" />
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="mb-3">
                                            <span className="text-gray-300 text-sm font-medium">Socket Endpoint:</span>
                                            <code className="ml-2 px-3 py-1 bg-gray-800/50 text-gray-200 rounded-lg text-sm font-mono break-all">
                                                {result.url} (Port: {result.port})
                                            </code>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-gray-300 text-sm font-medium">Connection Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${result.connected ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                                                {result.connected ? "Connected" : "Disconnected"}
                                            </span>
                                        </div>
                                        {result.error ? (
                                            <div className="flex items-start space-x-2">
                                                <AiOutlineWarning className="text-red-400 text-lg flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-red-300 text-sm font-medium">Error:</span> <p className="text-red-200 text-sm mt-1">{result.error}</p>
                                                </div>
                                            </div>
                                        ) : result.message ? (
                                            <div>
                                                <span className="text-green-300 text-sm font-medium">Peer Response:</span> <p className="text-green-200 text-sm mt-1 font-medium">{result.message}</p>
                                                {result.socketId && <p className="text-gray-400 text-xs mt-1">Socket ID: {result.socketId}</p>}
                                                {result.timestamp && <p className="text-gray-400 text-xs">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>}
                                            </div>
                                        ) : result.connected ? (
                                            <div className="text-blue-200 text-sm">Connected - Waiting for peer check response...</div>
                                        ) : null}
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center space-y-4">
                    <button
                        onClick={handleTestMessage}
                        disabled={connectedCount === 0}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${connectedCount > 0 ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                    >
                        Send Test Message to All Connected Sockets
                    </button>
                    <p className="text-sm text-gray-400">Socket connections updated in real-time • Check server console for messages</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
