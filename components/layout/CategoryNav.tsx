"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    FiGrid,
    FiStar,
    FiDroplet,
    FiFeather,
    FiChevronRight,
} from "react-icons/fi";

const categories = [
    {
        label: "For You",
        href: "/shop",
        icon: FiGrid,
        value: "all",
    },
    {
        label: "Skin Care",
        href: "/shop?category=skin",
        icon: FiDroplet,
        value: "skin",
    },
    {
        label: "Hair Care",
        href: "/shop?category=hair",
        icon: FiFeather,
        value: "hair",
    },
];

export default function CategoryNav() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "all";

    return (
        <nav
            aria-label="Product categories"
            className="border-b border-[#E7E2DA] bg-white"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Mobile navigation */}
                <div className="flex gap-2 overflow-x-auto py-3 lg:hidden">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const active = currentCategory === category.value;

                        return (
                            <Link
                                key={category.value}
                                href={category.href}
                                aria-current={active ? "page" : undefined}
                                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                                    active
                                        ? "border-[#26352B] bg-[#26352B] text-white"
                                        : "border-[#E7E2DA] bg-white text-[#26352B] hover:bg-[#F5F3ED]"
                                }`}
                            >
                                <Icon size={16} />
                                {category.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop sidebar-style category bar */}
                <div className="hidden items-center gap-1 py-2 lg:flex">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const active = currentCategory === category.value;

                        return (
                            <Link
                                key={category.value}
                                href={category.href}
                                aria-current={active ? "page" : undefined}
                                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                                    active
                                        ? "bg-[#E7EBDD] text-[#26352B]"
                                        : "text-[#687169] hover:bg-[#F7F6F1] hover:text-[#26352B]"
                                }`}
                            >
                                <Icon size={18} />

                                <span>{category.label}</span>

                                {active && (
                                    <FiChevronRight
                                        size={16}
                                        className="ml-2"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
