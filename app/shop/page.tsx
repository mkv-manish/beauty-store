import { Suspense } from "react";
import ShopContent from "./ShopContent";

function ShopLoading() {
    return (
        <main className="min-h-screen bg-[#F4FAF8] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl animate-pulse">
                <div className="h-4 w-36 rounded bg-[#D9E7E3]" />
                <div className="mt-5 h-10 max-w-sm rounded bg-[#D9E7E3]" />
                <div className="mt-3 h-4 max-w-lg rounded bg-[#D9E7E3]" />

                <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-[#D9E7E3] bg-white"
                        >
                            <div className="aspect-square bg-[#D3E9E5]" />
                            <div className="space-y-3 p-3 sm:p-4">
                                <div className="h-4 rounded bg-[#D3E9E5]" />
                                <div className="h-4 w-1/3 rounded bg-[#D3E9E5]" />
                                <div className="h-9 rounded-full bg-[#D3E9E5]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopLoading />}>
            <ShopContent />
        </Suspense>
    );
}
