import { NextResponse } from "next/server";
import { basePort, basePath } from "../../../utils/dynamicEnv";
export async function GET() {
    return NextResponse.json({ basePort, basePath });
}
