import { useState } from "react";

import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import usePrincipal, { AuthStatus } from "../../context/usePrincipal";

export default function Home() {
    const { principal, status, authenticate, getHomeRoute } = usePrincipal();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        setLoading(true);

        const response = await authenticate({
            email,
            password,
        });
        if (response != undefined && "errorMessage" in response) {
            setError(response.errorMessage);
        } else {
            navigate(getHomeRoute(principal.roles));
        }
        setLoading(false);
    }

    return (
        <>
            <LoadingPortalComponent
                isLoading={status == AuthStatus.INITIALIZING}
                message="Restoring your session..."
                subMessage="Please wait while we take you to your dashboard."
            />
            <div className="flex min-h-screen w-screen items-center justify-center bg-slate-100">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800">
                            Insurance Management System
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Sign in to continue
                        </p>
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
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
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
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                            />
                        </div>

                        <ActionButton
                            type="button"
                            text={loading ? "Signing In..." : "Sign In"}
                            onClick={handleLogin}
                            // disabled={loading}
                            icon={LockClosedIcon}
                            className="w-full text-right p-3 rounded-lg outline-1 outline-offset-1 outline-indigo-600 cursor-pointer justify-around"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
