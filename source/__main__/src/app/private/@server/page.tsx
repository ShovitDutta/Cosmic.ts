export const dynamic = "force-dynamic";
import { Suspense } from "react";
async function ServerTimeDisplay() {
    const baseUrl = new URL("http://localhost:" + "3000");
    const response = await fetch(baseUrl.toString() + "/api/clock", { cache: "no-store" });
    const data = await response.json();
    return (
        <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-600/40 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#10b981]"></div>
                <span className="text-emerald-300 text-sm font-semibold tracking-wider">LIVE</span>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-500 to-transparent"></div>
            <div className="flex-1 text-right">
                <p className="text-2xl font-mono font-black text-white tracking-wider drop-shadow-lg">{data.time}</p>
            </div>
        </div>
    );
}
export default async function ParallelServerPage() {
    return (
        <div className="h-[600px] flex flex-col">
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-400/30 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-violet-300 mb-2 text-right">Server-Side Rendering (SSR)</h3>
                <ul className="text-sm text-violet-200/80 space-y-1 text-right">
                    <li>• Renders on server before sending to browser</li>
                    <li>• SEO-friendly with pre-rendered HTML content</li>
                    <li>• Data fetched at request time on server</li>
                    <li>• Requires page refresh for new data</li>
                </ul>
            </div>
            <div className="flex-1 flex flex-col items-end justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-indigo-900/30 rounded-3xl blur-3xl"></div>
                <div className="relative group perspective-1000">
                    <div className="absolute -inset-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
                    <div
                        className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-3xl rounded-[1.5rem] p-16 border border-violet-400/40 shadow-2xl shadow-violet-500/30"
                        style={{
                            background: `linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(0,0,0,0.95) 50%, rgba(31,41,55,0.95) 100%)`,
                            boxShadow: `0 25px 50px -12px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.1)`,
                        }}>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg"></div>
                        </div>
                        <div className="flex items-center gap-4 mb-8 justify-end">
                            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent tracking-tight text-right">
                                Server Runtime
                            </h1>
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_20px_#8b5cf6] animate-spin-slow"></div>
                                <div className="absolute inset-0 w-4 h-4 rounded-full bg-violet-300 animate-ping"></div>
                            </div>
                        </div>
                        <div className="space-y-6 text-right">
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-400/30 backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative text-right">
                                    <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed">Next.js Server Component</p>
                                    <p className="text-violet-300/80 text-sm font-medium mb-2">Pre-rendered on server at request time</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="flex-1 h-px bg-gradient-to-l from-violet-400/50 to-transparent"></div>
                                        <span className="text-violet-300 text-sm font-mono">Server-side fetch</span>
                                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                                    </div>
                                </div>
                            </div>
                            <Suspense
                                fallback={
                                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/30 justify-end">
                                        <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse"></div>
                                        <span className="text-yellow-300 text-sm font-semibold">Loading...</span>
                                    </div>
                                }>
                                <ServerTimeDisplay />
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex items-center gap-3 text-gray-400 justify-end">
                    <span className="text-xs font-mono text-gray-500">Server-side Computation</span>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-sm font-medium tracking-wide">Pre-rendered HTML</span>
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
