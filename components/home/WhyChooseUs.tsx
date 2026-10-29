"use client";

import { motion } from "motion/react";
import { LeafIcon, RitualIcon, CareIcon } from "@/components/ui/BeautyIcons";

const benefits = [
    {
        icon: LeafIcon,
        title: "Thoughtful Ingredients",
        description:
            "Simple formulas made for an easy everyday beauty routine.",
    },
    {
        icon: RitualIcon,
        title: "Everyday Care",
        description: "Skincare and haircare essentials designed for daily use.",
    },
    {
        icon: CareIcon,
        title: "Quality Focused",
        description: "Carefully selected products with quality at the center.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="care-values bg-white px-4 py-14 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#287C78]">
                        Why Dermiscaa
                    </p>

                    <h2 className="section-title mt-3">
                        Beauty care, kept simple.
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#617B78] sm:text-base">
                        Everything you need for a simple and comfortable
                        everyday routine.
                    </p>
                </motion.div>

                <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;

                        return (
                            <motion.div
                                key={benefit.title}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.45,
                                    delay: index * 0.08,
                                }}
                                whileHover={{ y: -4 }}
                                className="rounded-2xl border border-[#D9E7E3] bg-[#F4FAF8] p-6"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E5F2EF] text-[#287C78]">
                                    <Icon size={20} />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-[#203C3B]">
                                    {benefit.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#617B78]">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
