"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function PublicPage() {
    const [socketError, setSocketError] = useState<string | null>(null);
    const [socketClient, setSocketClient] = useState<Socket | null>(null);
    const [socketStatus, setSocketStatus] = useState<string>("Connecting...");
    useEffect(() => {
        const newSocket = io("http://localhost:3000", {
            transports: ["websocket", "polling"],
        });
        newSocket.on("connect", () => {
            setSocketStatus("Connected");
            setSocketError(null);
            console.log("Socket.IO client connected:", newSocket.id);
            newSocket.emit("message", "Hello from Next.js client!");
        });
        newSocket.on("disconnect", (reason) => {
            setSocketStatus(`Disconnected: ${reason}`);
            setSocketError("Socket disconnected unexpectedly.");
            console.log("Socket.IO client disconnected:", reason);
        });
        newSocket.on("connect_error", (error) => {
            setSocketStatus("Connection Error");
            setSocketError(error.message || "Failed to connect to socket server.");
            console.error("Socket.IO connection error:", error);
        });
        newSocket.on("serverMessage", (data) => {
            console.log("Received message from server:", data);
        });
        setSocketClient(newSocket);
        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);
    const handleSendMessage = () => {
        if (socketClient && socketClient.connected) {
            const testMessage = `Client message at ${new Date().toLocaleTimeString()}`;
            socketClient.emit("message", testMessage);
            console.log("Sent message:", testMessage);
        } else alert("Socket not connected. Cannot send message.");
    };
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-xl p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl"
            >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-center">
                    <div className="animate-pulse mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <div className="animate-spin w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Socket.IO Connection Test</h1>
                    <p className="text-gray-300">Testing real-time communication with the server</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`p-6 rounded-xl border ${
                        socketError ? "bg-red-500/20 border-red-500/30" : socketStatus === "Connected" ? "bg-green-500/20 border-green-500/30" : "bg-blue-500/20 border-blue-500/30"
                    }`}
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                            {socketStatus === "Connected" ? (
                                <BsCheckCircle className="text-green-400 text-xl" />
                            ) : socketError ? (
                                <BsXCircle className="text-red-400 text-xl" />
                            ) : (
                                <AiOutlineLoading3Quarters className="text-blue-400 text-xl animate-spin" />
                            )}
                        </div>
                        <div className="flex-grow min-w-0">
                            <span className="text-gray-300 text-sm font-medium">Socket.IO Status:</span>
                            <p className={`mt-1 text-base font-medium ${socketError ? "text-red-200" : socketStatus === "Connected" ? "text-green-200" : "text-blue-200"}`}>{socketStatus}</p>
                            {socketError && <p className="text-red-300 text-xs mt-2">Error: {socketError}</p>}
                            <button
                                onClick={handleSendMessage}
                                disabled={!socketClient || !socketClient.connected}
                                className={`mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                                    socketClient && socketClient.connected ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Send Test Socket Message
                            </button>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-center text-sm text-gray-400">
                    <p>Observe server console for incoming messages.</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
