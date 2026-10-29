"use client";
import { useCart } from "@/store/useCart";

import { BagIcon as FiShoppingBag } from "@/components/ui/BeautyIcons";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";

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
        <article className="product-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D9E7E3] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute right-2 top-2 z-10"><WishlistButton id={product._id} name={product.name} /></div>
            {/* Product Image */}
            <Link
                href={`/product/${product._id}`}
                aria-label={`View ${product.name}`}
                className="product-card-image relative block aspect-square overflow-hidden bg-[#EFF7F5]"
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
            <div className="product-card-content flex flex-1 flex-col p-3 sm:p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#617B78]">{categoryLabel(product.category)}</p>
                <Link href={`/product/${product._id}`}>
                    <h3 className="line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-[#203C3B] transition-colors hover:text-[#287C78] sm:text-base">
                        {product.name}
                    </h3>
                </Link>

                {!!product.reviewCount && <Link href={`/product/${product._id}#reviews`} className="mt-2 text-xs text-[#287C78]">★ {product.rating?.toFixed(1)} <span className="text-[#617B78]">({product.reviewCount})</span></Link>}
                <p className="mt-2 text-base font-semibold text-[#203C3B] sm:text-lg">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="mt-auto pt-4">
                    {product.stock <= 0 ? (
                        <button
                            type="button"
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#D9E7E3] px-3 min-h-11 py-2.5 text-xs font-medium text-[#617B78] sm:text-sm"
                        >
                            Out of Stock
                        </button>
                    ) : isAdded ? (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            className="product-card-added flex w-full items-center justify-center gap-2 rounded-full bg-[#203C3B] px-3 min-h-11 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#246662] sm:text-sm"
                        >
                            <FiCheck size={16} />
                            View cart
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            aria-label={`Add ${product.name} to cart`}
                            className="commerce-action flex w-full items-center justify-center gap-2 rounded-full bg-[#287C78] px-3 min-h-11 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#246662] sm:text-sm"
                        >
                            <FiShoppingBag size={16} />
                            Add to cart
                        </button>
                    )}
                </div>


            </div>
        </article>
    );
}
