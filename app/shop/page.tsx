import { Suspense } from "react";
import ShopContent from "./ShopContent";

function ShopLoading() {
    return (
        <main className="min-h-screen bg-[#FBF8F3] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl animate-pulse">
                <div className="h-4 w-36 rounded bg-[#E7E2DA]" />
                <div className="mt-5 h-10 max-w-sm rounded bg-[#E7E2DA]" />
                <div className="mt-3 h-4 max-w-lg rounded bg-[#E7E2DA]" />

                <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white"
                        >
                            <div className="aspect-square bg-[#EDE9E1]" />
                            <div className="space-y-3 p-3 sm:p-4">
                                <div className="h-4 rounded bg-[#EDE9E1]" />
                                <div className="h-4 w-1/3 rounded bg-[#EDE9E1]" />
                                <div className="h-9 rounded-full bg-[#EDE9E1]" />
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
