// source/frontend/src/app/(home)/page.tsx
import React from "react";
import { auth } from "../../../auth";
import SignIn from "./_components/client/signin";
import { Dashboard } from "./_components/server/Dashboard";
export default async function Page() {
    const session = await auth();
    if (!session) return <SignIn />;
    return <Dashboard session={session} />;
}
