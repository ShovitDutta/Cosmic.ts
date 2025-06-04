import { ReactNode } from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
export default async function PrivateLayout({ children, client, server, peer, socket }: { children: ReactNode; client: ReactNode; server: ReactNode; peer: ReactNode; socket: ReactNode }) {
    const session = await auth();
    if (!session?.user?.name) redirect("/");
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-cyan-900/20"></div>
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            <div className="relative z-10">
                {children}
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                        {/* Client Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 backdrop-blur-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00ffff] animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-cyan-300 opacity-60"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-wide">Client Component</h3>
                                    <p className="text-cyan-200/70 text-sm font-medium">Interactive UI • HTTP Polling</p>
                                </div>
                            </div>
                            <div className="group">{client}</div>
                            {/* Peer Section */}
                            <div className="mt-28 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 backdrop-blur-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00ffff] animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-cyan-300 opacity-60"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-wide">HTTP Peer Check</h3>
                                    <p className="text-cyan-200/70 text-sm font-medium">API Connectivity • Multi-Endpoint</p>
                                </div>
                            </div>
                            <div className="group">{peer}</div>
                        </div>
                        {/* Server Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-500/20 backdrop-blur-xl justify-end">
                                <div>
                                    <h3 className="font-bold text-lg bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent tracking-wide text-right">Server Component</h3>
                                    <p className="text-violet-200/70 text-sm font-medium text-right">Server-Side Logic • Pre-rendered</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-300 opacity-60"></div>
                                    <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6] animate-pulse"></div>
                                </div>
                            </div>
                            <div className="group">{server}</div>
                            {/* Socket Section */}
                            <div className="mt-28 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-500/20 backdrop-blur-xl justify-end">
                                <div>
                                    <h3 className="font-bold text-lg bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent tracking-wide text-right">Socket.IO</h3>
                                    <p className="text-violet-200/70 text-sm font-medium text-right">Real-Time • WebSocket Connections</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-300 opacity-60"></div>
                                    <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6] animate-pulse"></div>
                                </div>
                            </div>
                            <div className="group">{socket}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
