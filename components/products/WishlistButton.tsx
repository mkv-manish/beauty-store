"use client";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/lib/wishlist";
export default function WishlistButton({ id, name }: { id: string; name: string }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(id);
  return <button type="button" aria-label={`${saved ? "Remove" : "Save"} ${name} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved} onClick={() => toggle(id)} className={`wishlist-button ${saved ? "saved" : ""}`}><FiHeart size={20} fill={saved ? "currentColor" : "none"} /></button>;
}
