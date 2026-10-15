"use client";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
const slides = [
  { image: "/images/home/hero_banner.png", alt: "Dermisca skin and hair care essentials inspired by nature" },
  { image: "/images/home/hero_banner1.png", alt: "Dermisca hair serum, hair mask, shampoo and conditioner collection" },
  { image: "/images/home/hero_banner2.png", alt: "Discover the Dermisca beauty collection for your daily care ritual" },
];
function subscribeMotion(callback: () => void) { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); media.addEventListener("change", callback); return () => media.removeEventListener("change", callback); }
export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive(value => (value + 1) % slides.length); }, 5000);
    return () => window.clearInterval(timer);
  }, [reduced]);
  return <section className="home-carousel" aria-label="Dermiscaa beauty collection" aria-roledescription="carousel" aria-live="off">
    <h1 className="sr-only">Dermiscaa skin and hair care. Pure care, everyday confidence.</h1>
    <div className="carousel-images">{slides.map((slide, index) => <div key={slide.image} aria-hidden={index !== active} className={`carousel-slide ${index === active ? "active" : ""}`}><Image src={slide.image} alt={slide.alt} fill preload={index === 0} loading={index === 0 ? undefined : "eager"} sizes="100vw" className="object-cover" /></div>)}</div>
  </section>;
}
