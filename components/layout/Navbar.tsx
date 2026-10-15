"use client";
import { categories } from "@/config/categories";
import CategoryIcon from "@/components/ui/CategoryIcon";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiLogOut, FiUser, FiHeart, FiHome, FiChevronRight, FiChevronDown, FiPackage } from "react-icons/fi";
import { BagIcon, LeafIcon } from "@/components/ui/BeautyIcons";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/lib/wishlist";
import { clearLegacyAuth, notifyAuthChange, type SessionUser } from "@/lib/auth-events";
import SearchBar from "@/components/layout/SearchBar";
import CategoryNav from "@/components/layout/CategoryNav";
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const { ids } = useWishlist();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionRevision, setSessionRevision] = useState(0);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEffect(() => {
    let controller: AbortController | undefined;
    async function loadUser(event?: Event) {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      clearLegacyAuth();
      if (event instanceof CustomEvent && event.detail && "user" in event.detail) {
        setUser(event.detail.user); setAuthLoaded(true);
      }
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store", signal });
        if (!response.ok) throw new Error("Unable to check your session. Please try again.");
        const data = await response.json();
        if (!signal.aborted) { setUser(data.user); setAuthError(""); setAuthLoaded(true); }
      } catch (error) {
        if (!signal.aborted) { setAuthError(error instanceof Error ? error.message : "Unable to check your session."); setAuthLoaded(true); }
      }
    }
    function storage(event: StorageEvent) { if (event.key === "dermisca-auth-event") void loadUser(); }
    function visible() { if (document.visibilityState === "visible") void loadUser(); }
    void loadUser();
    window.addEventListener("auth-change", loadUser);
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", visible);
    return () => { controller?.abort(); window.removeEventListener("auth-change", loadUser); window.removeEventListener("storage", storage); document.removeEventListener("visibilitychange", visible); };
  }, [sessionRevision]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = () => drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select');
    controls()?.[0]?.focus();
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
      if (event.key !== "Tab") return;
      const elements = controls();
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    function resize() { if (window.innerWidth >= 1024) closeMenu(); }
    document.addEventListener("keydown", keyboard);
    window.addEventListener("resize", resize);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", keyboard); window.removeEventListener("resize", resize); previous?.focus(); };
  }, [menuOpen, closeMenu]);
  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true); setAuthError("");
    try {
      const response = await fetch("/api/auth/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      clearLegacyAuth(); notifyAuthChange(null); setUser(null); closeMenu();
      router.replace("/"); router.refresh();
    } catch (error) { setAuthError(error instanceof Error ? error.message : "Could not sign out. Please try again."); }
    finally { setLoggingOut(false); }
  }
  const links = [
    { href: "/", label: "Home", description: "A little care, every day", icon: FiHome },
    { href: "/shop", label: "Shop all essentials", description: "Find your next daily ritual", icon: LeafIcon },
    { href: "/wishlist", label: "Wishlist", description: "Saved for a little later", icon: FiHeart, badge: ids.length },
    { href: "/cart", label: "Shopping cart", description: "Review your everyday essentials", icon: BagIcon, badge: count },
    ...(user ? [{ href: "/orders", label: "My orders", description: "Follow your recent purchases", icon: FiPackage }] : []),
  ];
  return <header className="sticky top-0 z-50 border-b border-[#E7E2DA] bg-white">
    <div className="store-header-row mx-auto flex min-h-[72px] max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
      <Link href="/" onClick={closeMenu} aria-label="Dermiscaa home" className="flex shrink-0 items-center"><Image src="/images/logo/logo.png" alt="Dermiscaa" width={160} height={60} priority className="h-11 w-auto object-contain sm:h-12" /><span className="ml-2 font-serif text-xl tracking-tight sm:text-2xl">Dermiscaa<span className="mt-0.5 block font-sans text-[8px] uppercase tracking-[.24em] text-[#687169]">Pure care. Every day.</span></span></Link>
      <div className="order-3 w-full min-w-0 lg:order-none lg:w-auto lg:flex-1"><SearchBar /></div>
      <div className="desktop-header-actions hidden shrink-0 items-center lg:flex">
        {authLoaded ? user ? <details className="account-menu" onKeyDown={event => { if (event.key === "Escape") event.currentTarget.open = false; }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
          <summary aria-label={`Account for ${user.name}`}><span className="account-avatar">{user.name.trim().charAt(0).toUpperCase()}</span><span className="account-summary-copy"><small>Hello, {user.name.split(" ")[0]}</small><strong>My account</strong></span><FiChevronDown size={15} /></summary>
          <div className="account-dropdown"><div className="account-dropdown-heading"><strong>{user.name}</strong><span>{user.email}</span></div><Link href="/orders" onClick={event => { const details = event.currentTarget.closest("details"); if (details) details.open = false; }}><FiPackage size={18} />My orders</Link><Link href="/wishlist" onClick={event => { const details = event.currentTarget.closest("details"); if (details) details.open = false; }}><FiHeart size={18} />My wishlist</Link><button type="button" disabled={loggingOut} onClick={logout}><FiLogOut size={18} />{loggingOut ? "Signing out…" : "Logout"}</button></div>
        </details> : !authError && <Link href="/login" className="header-login"><FiUser size={18} />Login</Link> : <span className="h-11 w-32 animate-pulse rounded-xl bg-[#F0F2E9]" aria-label="Checking session" />}
        <Link href="/wishlist" className="header-action-link"><FiHeart size={21} /><span>Wishlist</span></Link><Link href="/cart" className="header-action-link"><span className="relative"><BagIcon size={23} />{count > 0 && <span className="header-cart-count">{count > 99 ? "99+" : count}</span>}</span><span>Cart</span></Link>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden"><Link href="/cart" aria-label={`Shopping cart, ${count} items`} className="relative flex h-11 w-11 items-center justify-center rounded-full"><BagIcon size={22} />{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#26352B] px-1 text-[10px] text-white">{count}</span>}</Link><button type="button" aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)} className="flex h-11 w-11 items-center justify-center rounded-full">{menuOpen ? <FiX size={23} /> : user ? <span className="mobile-account-avatar" title={user.name}>{user.name.trim().charAt(0).toUpperCase()}<span className="account-status-dot" /></span> : <FiMenu size={23} />}</button></div>
    </div>
    {authError && !menuOpen && <div role="alert" className="border-t border-[#E7E2DA] bg-[#FBF8F3] px-4 py-2 text-center text-xs">{authError} <button className="ml-2 underline" onClick={() => setSessionRevision(value => value + 1)}>Retry</button></div>}
    <Suspense fallback={<div className="h-12 border-t border-[#E7E2DA]" />}><CategoryNav /></Suspense>
    {menuOpen && <div className="mobile-drawer-overlay"><button type="button" tabIndex={-1} aria-label="Close navigation backdrop" onClick={closeMenu} className="absolute inset-0 h-full w-full" /><aside ref={drawerRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation" className="mobile-drawer">
      <div className="drawer-heading"><div><p className="eyebrow">Your daily ritual</p><span className="font-serif text-2xl">Dermiscaa</span></div><button type="button" aria-label="Close navigation" onClick={closeMenu} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDE3D5] bg-white"><FiX size={21} /></button></div>
      <div className="drawer-account"><span className="drawer-avatar"><FiUser size={23} /></span><div className="min-w-0">{!authLoaded ? <p className="animate-pulse text-sm">Checking your session…</p> : user ? <><p className="truncate font-semibold">Hello, {user.name}</p><p className="mt-1 break-all text-xs text-[#687169]">{user.email}</p></> : <><p className="font-semibold">Welcome to Dermiscaa</p><p className="mt-1 text-xs text-[#687169]">A little care, all in one place.</p></>}</div></div>
      {authError && <div role="alert" className="mx-4 mb-4 rounded-xl bg-[#F7EAE5] p-3 text-sm">{authError}<button className="ml-2 underline" onClick={() => setSessionRevision(value => value + 1)}>Retry</button></div>}
      <nav aria-label="Shopping menu" className="drawer-links">{links.map(item => <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined}><span className="drawer-link-icon"><item.icon size={22} /></span><span className="min-w-0 flex-1"><strong>{item.label}</strong><small>{item.description}</small></span>{!!item.badge && <span className="drawer-badge">{item.badge}</span>}<FiChevronRight size={16} /></Link>)}</nav>
      <div className="mx-5 mb-5 border-t border-[#E7E2DA] pt-5"><p className="eyebrow mb-3">Shop by category</p><div className="grid grid-cols-2 gap-2">{categories.map(category => <Link key={category.id} href={`/shop?category=${category.id}`} onClick={closeMenu} className="drawer-category"><CategoryIcon name={category.icon} size={22} />{category.label}</Link>)}</div></div>
      <div className="drawer-footer">{authLoaded && !authError && (user ? <button type="button" disabled={loggingOut} onClick={logout} className="secondary-link w-full"><FiLogOut size={17} />{loggingOut ? "Signing out…" : "Logout"}</button> : <><Link href={`/login?next=${encodeURIComponent(pathname === "/checkout" || pathname === "/orders" ? pathname : "/shop")}`} onClick={closeMenu} className="primary-link w-full">Sign in</Link><p className="mt-3 text-center text-xs text-[#687169]">New here? <Link href="/register" onClick={closeMenu} className="font-semibold underline">Create an account</Link></p></>)}<p className="mt-5 text-center text-[10px] uppercase tracking-[.18em] text-[#8a9385]">Pure care. Everyday confidence.</p></div>
    </aside></div>}
  </header>;
}
