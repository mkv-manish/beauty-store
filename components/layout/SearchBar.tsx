"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!isTyping) return;

        const timer = window.setTimeout(() => {
            const query = search.trim();

            if (query) {
                router.replace(`/shop?search=${encodeURIComponent(query)}`);
            } else {
                router.replace("/shop");
            }
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, isTyping, router]);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsTyping(false);

        const query = search.trim();

        if (query) {
            router.push(`/shop?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/shop");
        }
    }

    return (
        <form
            onSubmit={handleSearch}
            role="search"
            className="flex h-10 w-full min-w-0 items-center rounded-full border border-[#E7E2DA] bg-[#F7F6F1] px-3 transition focus-within:border-[#7B8A74] focus-within:ring-2 focus-within:ring-[#7B8A74]/10 sm:h-11 sm:px-4"
        >
            <button
                type="submit"
                aria-label="Search products"
                className="shrink-0 text-[#687169]"
            >
                <FiSearch size={18} />
            </button>

            <input
                type="search"
                name="search"
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setIsTyping(true);
                }}
                placeholder="Search skincare, haircare..."
                aria-label="Search products"
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-[#26352B] outline-none placeholder:text-[#92998F] sm:px-3"
            />
        </form>
    );
}
