import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ShopEZ ",
  description: "Flipkart/Amazon-style e-commerce built with Next.js App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
