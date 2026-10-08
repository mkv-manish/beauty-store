import HeroBanner from "@/components/home/HeroBanner";
import ShopByCategory from "@/components/home/ShopByCategory";
import BestSellers from "@/components/home/BestSellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
    return (
        <main className="overflow-hidden bg-white">
            <HeroBanner />
            <ShopByCategory />
            <BestSellers />
            <WhyChooseUs />
        </main>
    );
}
