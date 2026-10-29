"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, isCategory } from "@/config/categories";
import CategoryIcon from "@/components/ui/CategoryIcon";
const navigation = [{ id: "all", label: "Shop All", icon: "leaf", href: "/shop" }, ...categories.map(category => ({ ...category, href: `/shop?category=${category.id}` }))];
export default function CategoryNav() {
  const params = useSearchParams();
  const requested = params.get("category");
  const current = isCategory(requested) ? requested : "all";
  return <nav aria-label="Product categories" className="category-navigation"><div className="category-navigation-inner"><div className="category-navigation-list">{navigation.map(category => <Link key={category.id} href={category.href} aria-current={current === category.id ? "page" : undefined} className="category-chip"><CategoryIcon name={category.icon} size={16} /><span>{category.label}</span></Link>)}</div></div></nav>;
}
