"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName) {
            setError("Please enter your name.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            setError("Enter a valid 10-digit Indian mobile number.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: cleanName,
                    email: cleanEmail,
                    phone,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            if (!data.token || !data.user) {
                throw new Error(
                    "Registration response is missing user or token data.",
                );
            }

            // Save authentication data.
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Update the Navbar immediately in the same tab.
            window.dispatchEvent(new Event("auth-change"));

            router.replace("/shop");
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Registration failed.",
            );
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
                <section className="hidden min-h-[600px] flex-col justify-center bg-[#E8CFC8] px-6 py-10 text-[#26332A] md:flex md:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#71806A]">
                        Dermisca
                    </p>

                    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                        Start your natural beauty journey.
                    </h1>

                    <p className="mt-5 max-w-md leading-7 text-[#465047]">
                        Create your account and discover simple skincare and
                        haircare essentials for your daily routine.
                    </p>

                    <div className="mt-8 space-y-3 text-sm text-[#465047]">
                        <p>✓ Explore skincare essentials</p>
                        <p>✓ Discover everyday haircare</p>
                        <p>✓ Keep your orders in one place</p>
                    </div>
                </section>

                {/* Registration form */}
                <section className="flex items-center px-6 py-8 sm:px-10 md:px-12 md:py-10">
                    <div className="w-full">
                        <h2 className="text-3xl font-bold text-[#26332A]">
                            Create Account
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Join Dermisca and start shopping.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-[#26332A]"
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="mt-5">
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
                                    autoComplete="email"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-[#26332A]"
                                >
                                    Mobile Number
                                </label>

                                <div className="flex">
                                    <span className="flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-[#F9F5EE] px-3 text-sm text-[#26332A]">
                                        +91
                                    </span>

                                    <input
                                        id="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(
                                                event.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 10),
                                            )
                                        }
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                        pattern="[6-9][0-9]{9}"
                                        title="Enter a valid 10-digit Indian mobile number."
                                        required
                                        className={`${inputClass} rounded-l-none`}
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-gray-500">
                                    Enter 10 digits starting with 6, 7, 8 or 9.
                                </p>
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
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                    minLength={6}
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
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-[#71806A] hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
