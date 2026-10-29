import Image from "next/image";

export default function HeroBanner() {
  return <section className="home-carousel" aria-label="Dermiscaa beauty collection">
    <div className="carousel-images">
      <Image src="/images/home/ocean-hero.webp" alt="Dermisca skin and hair care collection with hair mask, serum, shampoo and conditioner" fill preload sizes="100vw" className="object-cover" />
    </div>
    <h1 className="sr-only">Dermiscaa skin and hair care</h1>
  </section>;
}
