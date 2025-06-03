import { basePeers } from "./dynamicEnv";
import { NextResponse } from "next/server";
const peers: string[] = basePeers ? basePeers.split(",") : [];
export function setCorsHeaders(request: Request, response: NextResponse | Response) {
    const origin = request.headers.get("origin");
    if (origin && peers.includes(origin)) response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
}
export function handleCorsPreflight(request: Request) {
    const origin = request.headers.get("origin");
    const headers: HeadersInit = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
    };
    if (origin && peers.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
    return new Response(null, { status: 204, headers: headers });
}
