"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const value = identifier.trim();
        const isEmail = value.includes("@");

        if (!isEmail && !/^[6-9]\d{9}$/.test(value)) {
            setError("Enter a valid email or 10-digit mobile number.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier: value,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            if (!data.token || !data.user) {
                throw new Error(
                    "Login response is missing user or token data.",
                );
            }

            // Save authentication data.
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Update the Navbar immediately in the same tab.
            window.dispatchEvent(new Event("auth-change"));

            // Navigate after successful login.
            router.replace("/");
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed.");
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full rounded-xl border border-gray-300 px-4 py-3.5 text-[#26332A] outline-none transition focus:border-[#71806A] focus:ring-2 focus:ring-[#E5EDDF]";

    return (
        <main className="min-h-[calc(100vh-160px)] bg-[#F9F5EE] px-4 py-6 md:py-16">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[#E8DDD2] bg-white shadow-sm md:grid-cols-2">
                {/* Branding */}
                <section className="hidden min-h-[560px] flex-col justify-center bg-[#71806A] px-6 py-10 text-white md:flex md:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.2em]">
                        Dermisca
                    </p>

                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                        Natural care for your skin and hair.
                    </h1>

                    <p className="mt-5 max-w-md leading-7 text-[#F5F2EC]">
                        Simple, gentle and thoughtful beauty care made for your
                        everyday routine.
                    </p>

                    <div className="mt-8 space-y-3 text-sm text-[#F5F2EC]">
                        <p>✓ Clean and simple beauty essentials</p>
                        <p>✓ Skin and hair care products</p>
                        <p>✓ Easy shopping experience</p>
                    </div>
                </section>

                {/* Login form */}
                <section className="flex items-center px-6 py-8 sm:px-10 md:px-12 md:py-10">
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
                                    htmlFor="identifier"
                                    className="mb-2 block text-sm font-medium text-[#26332A]"
                                >
                                    Email or Mobile Number
                                </label>

                                <input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(event) =>
                                        setIdentifier(event.target.value)
                                    }
                                    placeholder="Enter email or mobile number"
                                    autoComplete="username"
                                    required
                                    className={inputClass}
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
                                    autoComplete="current-password"
                                    required
                                    className={inputClass}
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
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-[#71806A] hover:underline"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
