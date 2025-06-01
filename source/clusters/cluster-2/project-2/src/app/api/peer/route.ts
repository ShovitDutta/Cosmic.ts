import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { basePort, basePath, basePeers } from "../../../utils/dynamicEnv";

export async function GET() {
    const origin = (await headers()).get("origin");
    const allowedOrigins = basePeers ? basePeers.split(",") : [];

    let corsOrigin = '';
    if (origin && allowedOrigins.includes(origin)) {
        corsOrigin = origin;
    }

    return NextResponse.json(
        { basePort, basePath },
        {
            headers: {
                "Access-Control-Allow-Origin": corsOrigin,
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            },
        },
    );
}
