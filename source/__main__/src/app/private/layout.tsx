import Image from "next/image";
import { ReactNode } from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { FaCode, FaDatabase, FaShieldAlt, FaBolt, FaBoxOpen, FaLayerGroup, FaStar, FaCheckCircle, FaCodeBranch, FaTachometerAlt } from "react-icons/fa";
export default async function PrivateLayout({ children, client, server, peer, socket }: { children: ReactNode; client: ReactNode; server: ReactNode; peer: ReactNode; socket: ReactNode }) {
    const session = await auth();
    if (!session?.user?.name) redirect("/");
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-cyan-900/20" />
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
            <div className="relative z-10">
                {children} {/* Landing Hero Section */}
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="relative">
                                <Image src="/favicon.svg" alt="Cosmos.ts Logo" width={100} height={100} className="rounded-full object-cover animate-spin" />
                                <div className="absolute -inset-1 rounded-full animate-pulse" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">Cosmos.ts</h1>
                            <FaStar className="text-yellow-400 w-8 h-8" />
                        </div>
                        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto font-light">
                            A Typescript Based Multi-Repo Framework For Next.Js With A Structured Approach To Managing Multiple Projects In Clusters.
                        </p>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Designed to manage multiple projects in clusters with ease. Production-ready boilerplate for building scalable applications.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                                <FaCheckCircle className="w-4 h-4 text-green-400" /> <span className="text-green-300 text-sm font-medium">Build Passing</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <FaCodeBranch className="w-4 h-4 text-blue-400" /> <span className="text-blue-300 text-sm font-medium">v1.0.0</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                                <FaTachometerAlt className="w-4 h-4 text-green-400" /> <span className="text-green-300 text-sm font-medium">90% Coverage</span>
                            </div>
                        </div>
                    </div>
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-violet-900/20 to-purple-900/30 border border-violet-500/20 backdrop-blur-xl hover:border-violet-400/40 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <FaLayerGroup className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-violet-300 mb-2">Monorepo Magic</h3>
                            <p className="text-gray-400 text-sm">TurboRepo management with optimized builds and shared configurations for multiple Next.js projects.</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/30 border border-blue-500/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-3 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <FaCode className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-300 mb-2">TypeScript Power</h3>
                            <p className="text-gray-400 text-sm">Full type safety across your entire application for better code quality and developer experience.</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/30 border border-green-500/20 backdrop-blur-xl hover:border-green-400/40 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <FaDatabase className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-green-300 mb-2">Drizzle ORM</h3>
                            <p className="text-gray-400 text-sm">Type-safe database operations with SQLite, easily extendable to other databases.</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/30 border border-amber-500/20 backdrop-blur-xl hover:border-amber-400/40 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <FaShieldAlt className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-amber-300 mb-2">NextAuth.js</h3>
                            <p className="text-gray-400 text-sm">Secure, flexible authentication system with support for multiple providers.</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-pink-900/20 to-rose-900/30 border border-pink-500/20 backdrop-blur-xl hover:border-pink-400/40 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-3 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <FaBolt className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-pink-300 mb-2">State Management</h3>
                            <p className="text-gray-400 text-sm">Zustand for lightweight state management and Tanstack Query for efficient data fetching.</p>
                        </div>
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-blue-900/30 border border-indigo-500/20 backdrop-blur-xl hover:border-indigo-400/40 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-3 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <FaBoxOpen className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-indigo-300 mb-2">Docker Ready</h3>
                            <p className="text-gray-400 text-sm">Containerized applications for consistent development and deployment environments.</p>
                        </div>
                    </div>
                    {/* Tech Stack */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Powered by Modern Technologies</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {["Next.js", "TypeScript", "TurboRepo", "Drizzle ORM", "Tailwind CSS", "Framer Motion", "Zustand", "Docker"].map((tech, index) => (
                                <div key={index} className="px-4 py-2 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                                    <span className="text-2xl font-thin text-gray-200">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Components Demo Section */}
                    <div className="container mx-auto px-6 py-12">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Live Component Demonstrations</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Experience the power of our architecture with real-time examples of client-side, server-side, peer connectivity, and socket communications.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                            {/* Client Column */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 backdrop-blur-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00ffff] animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-cyan-300 opacity-60" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-wide">Client Component</h3>
                                        <p className="text-cyan-200/70 text-sm font-medium">Interactive UI • HTTP Polling</p>
                                    </div>
                                </div>
                                <div className="group">{client}</div> {/* Peer Section */}
                                <div className="mt-28 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 backdrop-blur-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00ffff] animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-cyan-300 opacity-60" />
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
                                        <div className="w-2 h-2 rounded-full bg-violet-300 opacity-60" />
                                        <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6] animate-pulse" />
                                    </div>
                                </div>
                                <div className="group">{server}</div> {/* Socket Section */}
                                <div className="mt-28 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-500/20 backdrop-blur-xl justify-end">
                                    <div>
                                        <h3 className="font-bold text-lg bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent tracking-wide text-right">Socket.IO</h3>
                                        <p className="text-violet-200/70 text-sm font-medium text-right">Real-Time • WebSocket Connections</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-violet-300 opacity-60" />
                                        <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6] animate-pulse" />
                                    </div>
                                </div>
                                <div className="group">{socket}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
