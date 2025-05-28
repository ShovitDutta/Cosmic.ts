// source/frontend/src/app/(home)/page.tsx
import React from "react";
import { auth } from "../../../auth";
import SignIn from "../../components/client/(root-page)/signin";
import { Dashboard } from "../../components/server/(root-page)/Dashboard";
export default async function Page() {
    const session = await auth();
    if (!session) return <SignIn />;
    return <Dashboard session={session} />;
}
