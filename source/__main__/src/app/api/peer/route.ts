import { handleCorsPreflight, setCorsHeaders } from "../../../utils/CorsHeaders";
import { basePort } from "../../../utils/dynamicEnv";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    const response = NextResponse.json({ message: `${basePort} > Has Connected!` });
    setCorsHeaders(request, response);
    return response;
}
export async function OPTIONS(request: Request) {
    return handleCorsPreflight(request);
}
