import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Natura Glow",
    description: "Natural skin and hair care products",
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

                    <main className="min-h-screen">{children}</main>

                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
