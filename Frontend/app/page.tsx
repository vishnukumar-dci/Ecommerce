import { api } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
// import Image from "next/image";
import "remixicon/fonts/remixicon.css";


export default async function HomePage() {
  const list = await api.homepageProducts().catch(() => ({ data: [] }));
  const products = (list?.data || []) as any[];

  return (
    <div className="space-y-8 bg-background text-foreground">
      <section className="bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl min-h-[42rem] flex flex-col md:flex-row overflow-hidden">

        {/* Left side */}
        <div className="flex-1 flex flex-col justify-between px-8 py-12">

          {/* Top: Title */}
          <h1 className="text-3xl md:text-5xl font-bold">ShopEZ</h1>

          {/* Middle: Paragraph */}
          <h2 className="text-4xl md:text-4xl font-bold leading-snug max-w-3xl">
            Find the <span className="underline decoration-white/80">Best Deals</span>
            <br />

            for Your Needs
          </h2>

          <p className="mt-6 text-lg text-white/90 max-w-2xl">
            Connect with the latest offers on electronics, fashion, home essentials & more.
            Shopping made smarter, faster, and more rewarding!
          </p>
          {/* Bottom: Button */}
          <div className="mt-8">
            <Link
              href="/login"
              className="bg-white text-brand-dark font-semibold px-6 py-3 rounded-xl shadow hover:bg-white/90 transition inline-block"
            >
              Get Started →
            </Link>
          </div>
        <h3 className="text-lg font-semibold text-yellow-300">Contact us</h3>
        <p>Email: support@shopez.com</p>
        <p>Phone: +91 1234567890</p>
        <div className="flex gap-4 mt-4">
          <a href="#" aria-label="Instagram">
            <i className="ri-instagram-line text-2xl"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i className="ri-facebook-circle-line text-2xl"></i>
          </a>
          <a href="#" aria-label="Twitter/X">
            <i className="ri-twitter-x-line text-2xl"></i>
          </a>
          <a href="#" aria-label="LinkedIn">
            <i className="ri-linkedin-box-line text-2xl"></i>
          </a>
        </div>
        </div>

        {/* Right side full image */}
        <div className="flex-1 relative">
          <img
            src="/hero.png"
            alt="ShopEZ Deals"
            className="absolute inset-0 w-full h-full object-cover object-center rounded-r-2xl"
          />
        </div>
      </section>

      <section>
        <h1 className="text-x1 font-semibold mb-4  text-brand-dark">Latest Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p: any) => (
            <ProductCard key={p.id} product={{ id: p.id, product_name: p.product_name || p.name, amount: p.amount, descriptions: p.descriptions || p.description || "", image_path: p.image_path || p.image ||"",in_cart: p.in_cart }} />
          ))}
        </div>
      </section>
    </div>
  );
}
