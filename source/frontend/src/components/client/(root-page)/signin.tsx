// source/frontend/src/components/client/(root-page)/signin.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signIn("google");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred during sign-in.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            {loading && <p>Signing in...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && !error && (
                <button onClick={handleSignIn} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                    Sign in with Google
                </button>
            )}
        </div>
    );
}
