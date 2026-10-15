import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/components/providers/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: "Dermiscaa | Pure Care. Everyday Confidence.",
    description:
        "Dermisca skincare and haircare products for your everyday beauty routine.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <a href="#main-content" className="skip-link">Skip to content</a>
                <ReduxProvider>
                    <Navbar />
                    <div id="main-content">{children}</div>
                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
