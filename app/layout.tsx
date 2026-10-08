import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dermiscaa | Pure Care. Everyday Confidence.",
    description:
        "Dermiscaa skincare and haircare products for your everyday beauty routine.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ReduxProvider>
                    <Navbar />

                    <main className="pt-16">{children}</main>

                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
