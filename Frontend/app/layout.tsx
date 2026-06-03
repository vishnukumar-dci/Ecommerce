import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastContainer from "@/components/ui/toast";
import { Providers } from "./providers";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "ShopEZ | Premium Modern E-Commerce Store",
  description:
    "Experience modern, seamless shopping with lightning fast performance, rich animations, and premium visual design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-slate-50 text-slate-800 font-sans min-h-screen">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
              {children}
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
