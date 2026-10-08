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
        <main className="min-h-[calc(100vh-160px)] bg-[#F9F5EE] px-4 py-10 md:py-16">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[#E8DDD2] bg-white shadow-sm md:grid-cols-2">
                {/* Left Side */}
                <div className="flex min-h-[260px] flex-col justify-center bg-[#71806A] px-6 py-10 text-white sm:px-10 md:min-h-[560px] md:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#F9F5EE]">
                        Dermisca
                    </p>

                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                        Natural care for your skin & hair.
                    </h1>

                    <p className="mt-5 max-w-md leading-7 text-[#F5F2EC]">
                        Simple, gentle and thoughtful beauty care made for your
                        everyday routine.
                    </p>

                    <div className="mt-8 space-y-3 text-sm text-[#F5F2EC]">
                        <p>✓ Clean and simple beauty essentials</p>
                        <p>✓ Skin and hair care products</p>
                        <p>✓ Easy and secure shopping</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center px-6 py-10 sm:px-10 md:px-12">
                    <div className="w-full">
                        <h2 className="text-3xl font-bold text-[#26332A]">
                            Welcome Back
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Login to your Dermisca account.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-[#26332A]"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter your email"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-[#26332A] outline-none transition focus:border-[#71806A] focus:ring-2 focus:ring-[#E5EDDF]"
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-[#26332A]"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-[#26332A] outline-none transition focus:border-[#71806A] focus:ring-2 focus:ring-[#E5EDDF]"
                                />
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full rounded-xl bg-[#71806A] px-6 py-3.5 font-medium text-white transition hover:bg-[#5C6B55] disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-[#71806A] hover:underline"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
