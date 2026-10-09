"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const heroBanners = [
    "/images/home/hero_banner.png",
    "/images/home/hero_banner1.png",
    "/images/home/hero_banner2.png",
];

export default function HeroBanner() {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const slider = setInterval(() => {
            setCurrentBanner((current) =>
                current === heroBanners.length - 1 ? 0 : current + 1,
            );
        }, 4000);

        return () => clearInterval(slider);
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative m-0 w-full overflow-hidden bg-white p-0"
        >
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/7] md:aspect-[1920/800]">
                {heroBanners.map((banner, index) => (
                    <motion.div
                        key={banner}
                        initial={false}
                        animate={{
                            opacity: currentBanner === index ? 1 : 0,
                            scale: currentBanner === index ? 1 : 1.02,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={banner}
                            alt={`Dermisca beauty banner ${index + 1}`}
                            fill
                            priority={index === 0}
                            sizes="100vw"
                            className="object-contain md:object-cover"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
                {heroBanners.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        aria-label={`Go to banner ${index + 1}`}
                        aria-current={
                            currentBanner === index ? "true" : undefined
                        }
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            currentBanner === index
                                ? "w-7 bg-[#26352B]"
                                : "w-2 bg-white/80"
                        }`}
                    />
                ))}
            </div>
        </motion.section>
    );
}
