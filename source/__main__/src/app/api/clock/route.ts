import { NextResponse } from "next/server";
export async function GET() {
    const currentTime = new Date().toLocaleString();
    return NextResponse.json({ time: currentTime });
}
