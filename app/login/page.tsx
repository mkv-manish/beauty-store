"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/shop");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[70vh] px-4 py-12">
            <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 md:p-8">
                <h1 className="text-3xl font-bold text-[#26332A]">Login</h1>

                <p className="mt-2 text-sm text-gray-500">
                    Login to your Natura Glow account.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#71806A]"
                    />

                    <label
                        htmlFor="password"
                        className="mb-2 mt-5 block text-sm font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#71806A]"
                    />

                    {error && (
                        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-[#71806A] px-6 py-3 font-medium text-white hover:bg-[#5C6B55] disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-[#71806A]"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </main>
    );
}
