"use client";

import ErrorNotice from "@/components/ui/ErrorNotice";
import { clearLegacyAuth, notifyAuthChange } from "@/lib/auth-events";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "@/components/auth/Auth.module.css";

export default function LoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

            if (!data.user) {
                throw new Error(
                    "Unable to establish your session.",
                );
            }

            // Save authentication data.
            clearLegacyAuth();

            // Update the Navbar immediately in the same tab.
            notifyAuthChange(data.user);

            // Navigate after successful login.
            const next = new URLSearchParams(window.location.search).get("next");
            router.replace(next && /^\/(?:checkout|wishlist|orders|cart|product\/[a-f0-9]{24})$/.test(next) ? next : "/shop");
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed.");
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full rounded-xl border border-gray-300 px-4 py-3.5 text-[#203C3B] outline-none transition focus:border-[#287C78] focus:ring-2 focus:ring-[#D3E9E5]";

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                {/* Branding */}
                <section className={styles.story} aria-label="Dermiscaa care">
                    <p className="text-sm font-medium uppercase tracking-[0.2em]">
                        Dermiscaa
                    </p>

                    <h2>
                        Natural care for your skin and hair.
                    </h2>

                    <p className="mt-5 max-w-md leading-7 text-[#F4FAF8]">
                        Simple, gentle and thoughtful beauty care made for your
                        everyday routine.
                    </p>

                    <div className="mt-8 space-y-3 text-sm text-[#F4FAF8]">
                        <p>✓ Clean and simple beauty essentials</p>
                        <p>✓ Skin and hair care products</p>
                        <p>✓ Easy shopping experience</p>
                    </div>
                </section>

                {/* Login form */}
                <section className={styles.formPanel}>
                    <div className={styles.formBody}>
                        <h1>
                            Welcome back
                        </h1>

                        <p className={styles.subtitle}>
                            Sign in to see your orders and keep shopping.
                        </p>

                        <form onSubmit={handleSubmit} className={styles.form} aria-busy={loading}>
                            <div>
                                <label
                                    htmlFor="identifier"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Email or mobile
                                </label>

                                <input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(event) =>
                                        setIdentifier(event.target.value)
                                    }
                                    placeholder="Enter email or mobile number"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    autoComplete="username"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Password
                                </label>

                                <div className={styles.password}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className={inputClass}
                                />
                                    <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</button>
                                </div>
                            </div>

                            {error && (
                                <ErrorNotice className="mt-4">{error}</ErrorNotice>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.submit}
                                aria-busy={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <p className={styles.switch}>
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-[#287C78] hover:underline"
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
