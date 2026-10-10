import HeroBanner from "@/components/home/HeroBanner";
import BestSellers from "@/components/home/BestSellers";
import AllProducts from "@/components/home/AllProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
    return (
        <main className="overflow-hidden bg-white">
            <HeroBanner />
            <BestSellers />
            <AllProducts />
            <WhyChooseUs />
        </main>
    );
}
