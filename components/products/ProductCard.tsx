"use client";
import { useCart } from "@/store/useCart";

import { BagIcon as FiShoppingBag } from "@/components/ui/BeautyIcons";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";

import WishlistButton from "@/components/products/WishlistButton";
import { addToCart } from "@/store/cartSlice";

import type { ProductData } from "@/types/product";
import { categoryLabel } from "@/config/categories";

type ProductCardProps = {
    product: ProductData;
};

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();
    const router = useRouter();

    const { items: cartItems } = useCart();

    const isAdded = cartItems.some(item => item._id === product._id);

    function handleCartClick() {
        if (product.stock <= 0) {
            return;
        }

        if (isAdded) {
            router.push("/cart");
            return;
        }

        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: 1,
            }),
        );


    }

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute right-2 top-2 z-10"><WishlistButton id={product._id} name={product.name} /></div>
            {/* Product Image */}
            <Link
                href={`/product/${product._id}`}
                className="relative block aspect-square overflow-hidden bg-[#F6F1EB]"
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            {/* Product Content */}
            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#687169]">{categoryLabel(product.category)}</p>
                <Link href={`/product/${product._id}`}>
                    <h3 className="line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-[#26352B] transition-colors hover:text-[#52634F] sm:text-base">
                        {product.name}
                    </h3>
                </Link>

                {!!product.reviewCount && <Link href={`/product/${product._id}#reviews`} className="mt-2 text-xs text-[#52634F]">★ {product.rating?.toFixed(1)} <span className="text-[#687169]">({product.reviewCount})</span></Link>}
                <p className="mt-2 text-base font-semibold text-[#26352B] sm:text-lg">
                    ₹{product.price}
                </p>

                <div className="mt-auto pt-4">
                    {product.stock <= 0 ? (
                        <button
                            type="button"
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#E7E2DA] px-3 min-h-11 py-2.5 text-xs font-medium text-[#687169] sm:text-sm"
                        >
                            Out of Stock
                        </button>
                    ) : isAdded ? (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#26352B] px-3 min-h-11 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#34473A] sm:text-sm"
                        >
                            <FiShoppingBag size={16} />
                            Go to Cart
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#52634F] px-3 min-h-11 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#3C5141] sm:text-sm"
                        >
                            <FiShoppingBag size={16} />
                            Add to Cart
                        </button>
                    )}
                </div>

                {/* Product Details Link */}
                <Link
                    href={`/product/${product._id}`}
                    className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-[#687169] transition-colors hover:text-[#26352B] sm:text-sm"
                >
                    View Details
                    <FiArrowUpRight size={14} />
                </Link>
            </div>
        </article>
    );
}
