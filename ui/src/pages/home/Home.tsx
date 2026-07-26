import { useState } from "react";

import usePrincipal from "../../context/usePrincipal";

export default function Home() {
    const auth = usePrincipal();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        setLoading(true);

        try {
            await auth.authenticate({
                email,
                password,
            });

        } catch (err: unknown) {
            console.error(err);
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Insurance Management System
                    </h1>

                    <p className="mt-2 text-slate-500">Sign in to continue</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Username
                        </label>

                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter username"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
}
