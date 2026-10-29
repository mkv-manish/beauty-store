"use client";

import ErrorNotice from "@/components/ui/ErrorNotice";
import { clearLegacyAuth, notifyAuthChange } from "@/lib/auth-events";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "@/components/auth/Auth.module.css";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
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

            if (!data.user) {
                throw new Error(
                    "Unable to establish your session.",
                );
            }

            // Save authentication data.
            clearLegacyAuth();

            // Update the Navbar immediately in the same tab.
            notifyAuthChange(data.user);

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
        "w-full rounded-xl border border-gray-300 px-4 py-3.5 text-[#203C3B] outline-none transition focus:border-[#287C78] focus:ring-2 focus:ring-[#D3E9E5]";

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                {/* Branding */}
                <section className={styles.story} aria-label="Dermiscaa care">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#287C78]">
                        Dermiscaa
                    </p>

                    <h2>
                        Start your natural beauty journey.
                    </h2>

                    <p className="mt-5 max-w-md leading-7 text-[#354F4D]">
                        Create your account and discover simple skincare and
                        haircare essentials for your daily routine.
                    </p>

                    <div className="mt-8 space-y-3 text-sm text-[#354F4D]">
                        <p>✓ Explore skincare essentials</p>
                        <p>✓ Discover everyday haircare</p>
                        <p>✓ Keep your orders in one place</p>
                    </div>
                </section>

                {/* Registration form */}
                <section className={styles.formPanel}>
                    <div className={styles.formBody}>
                        <h1>
                            Create account
                        </h1>

                        <p className={styles.subtitle}>
                            Your beauty favourites, all in one place.
                        </p>

                        <form onSubmit={handleSubmit} className={styles.form} aria-busy={loading}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Full name
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
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
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
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    autoComplete="email"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Mobile number
                                </label>

                                <div className={styles.phone}>
                                    <span className="phone-prefix flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-[#F4FAF8] px-3 text-sm text-[#203C3B]">
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

                                <p className={styles.hint}>
                                    Enter 10 digits starting with 6, 7, 8 or 9.
                                </p>
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
                                    placeholder="Minimum 8 characters"
                                    autoComplete="new-password"
                                    minLength={8}
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
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <p className={styles.switch}>
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-[#287C78] hover:underline"
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
