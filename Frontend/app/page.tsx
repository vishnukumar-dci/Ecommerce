"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, assetUrl } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { useRecentlyViewed } from "@/lib/store/recentlyViewed";
import { toast } from "@/lib/store/toast";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Grid,
  Star,
  Mail,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

// Mock Categories
const CATEGORIES = [
  {
    name: "Electronics",
    query: "electronics",
    icon: "💻",
    bg: "bg-blue-50 border-blue-100 text-blue-700",
  },
  {
    name: "Fashion",
    query: "fashion",
    icon: "👗",
    bg: "bg-pink-50 border-pink-100 text-pink-700",
  },
  {
    name: "Home Essentials",
    query: "home",
    icon: "🏠",
    bg: "bg-amber-50 border-amber-100 text-amber-700",
  },
  {
    name: "Books",
    query: "book",
    icon: "📚",
    bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
  },
  {
    name: "Beauty",
    query: "beauty",
    icon: "💄",
    bg: "bg-purple-50 border-purple-100 text-purple-700",
  },
  {
    name: "Sports",
    query: "sports",
    icon: "⚽",
    bg: "bg-sky-50 border-sky-100 text-sky-700",
  },
];

// Mock Testimonials
const REVIEWS = [
  {
    name: "Sneha Sharma",
    text: "Amazing delivery speeds and super easy checkouts. I got my headphones in just 1 day!",
    rating: 5,
    date: "2 days ago",
  },
  {
    name: "Rahul Verma",
    text: "Quality is top-notch. Love the direct returns feature—made buying shoes so stress-free.",
    rating: 5,
    date: "1 week ago",
  },
  {
    name: "Priya Nair",
    text: "The product selection is great and the UI looks super slick. Highly recommend ShopEZ!",
    rating: 4,
    date: "3 days ago",
  },
];

// Hero Banners
const HERO_SLIDES = [
  {
    title: "Unleash The Future",
    subtitle: "Premium Gadgets Fest",
    desc: "Upgrade your tech game with up to 40% OFF on high-fidelity headphones, tablets, smartwatches, and laptop essentials.",
    cta: "Shop Tech Deals",
    url: "/products?q=electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    gradient: "from-blue-900/90 via-blue-800/70 to-indigo-900/50",
  },
  {
    title: "Refine Your Style",
    subtitle: "Wardrobe Refresh Sale",
    desc: "Step out in confidence. Snag luxury apparel, sportswear, and casual footwear with instant 25% discounts.",
    cta: "Explore Fashion",
    url: "/products?q=fashion",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    gradient: "from-pink-950/90 via-pink-900/70 to-purple-900/50",
  },
  {
    title: "Cozy Modern Living",
    subtitle: "Home Makeover Essentials",
    desc: "Discover beautiful, minimalist lighting, ergonomic chairs, and organic kitchenware with special cashback offers.",
    cta: "Browse Home Decor",
    url: "/products?q=home",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    gradient: "from-amber-950/90 via-amber-900/70 to-orange-950/50",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Recently Viewed
  const recentlyViewed = useRecentlyViewed((s) => s.items);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 15,
  });

  // Newsletter Email
  const [newsEmail, setNewsEmail] = useState("");

  // Fetch Homepage Products client-side for loading skeleton states
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.homepageProducts().catch(() => ({ data: [] }));
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Auto-play slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer decrement
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 }; // Loop timer
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes("@")) {
      toast.error("Please provide a valid email");
      return;
    }
    toast.success("Subscribed! Check your inbox for exclusive discounts.");
    setNewsEmail("");
  };

  return (
    <div className="space-y-12 pb-10">
      {/* 1. Hero Carousel Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-md h-[460px] md:h-[500px]">
        {/* Slide view */}
        <div className="relative w-full h-full transition-all duration-700 ease-in-out">
          {/* Background Image */}
          <img
            src={HERO_SLIDES[currentSlide].img}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Tint Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[currentSlide].gradient} mix-blend-multiply`}
          />

          {/* Slide Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white z-10 max-w-2xl space-y-4">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold w-fit uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              {HERO_SLIDES[currentSlide].subtitle}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
              {HERO_SLIDES[currentSlide].desc}
            </p>
            <div className="pt-2">
              <Link
                href={HERO_SLIDES[currentSlide].url}
                className="bg-white hover:bg-slate-50 text-slate-900 font-bold px-7 py-3 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 inline-flex items-center gap-2 text-sm"
              >
                {HERO_SLIDES[currentSlide].cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center backdrop-blur-sm transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center backdrop-blur-sm transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bullet indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3.5 h-2 rounded-full transition-all ${
                currentSlide === idx ? "bg-white w-7" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Category circular Quick Navigation */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
              <Grid className="w-5 h-5 text-blue-600" />
              Browse by Category
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Explore curated styles and tech items
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 justify-center">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?q=${cat.query}`}
              className="flex flex-col items-center group gap-2"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${cat.bg} group-hover:scale-108 transition-all duration-300 group-hover:rotate-3`}
              >
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Live Flash Sale Segment */}
      <section className="relative bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden">
        {/* Decorative backdrop elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Hot Deal of the Hour
            </span>
            <h2 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
              ⚡ FLASH SALE IN PROGRESS
            </h2>
            <p className="text-slate-100 text-sm max-w-md">
              Hurry up! Grab top-rated items with up to 55% extra price cuts.
              Limited stock items only.
            </p>
          </div>

          {/* Countdown timer UI */}
          <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-red-100 font-bold uppercase tracking-wider mr-2">
              <Clock className="w-4 h-4 animate-pulse text-amber-300" />
              Ends In:
            </div>
            <div className="flex gap-2.5 text-center">
              <div>
                <span className="bg-white text-red-600 text-lg font-black px-2.5 py-1.5 rounded-lg block shadow-sm">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-red-100 font-bold uppercase mt-1 block">
                  Hrs
                </span>
              </div>
              <span className="text-white text-xl font-bold self-center -mt-4">
                :
              </span>
              <div>
                <span className="bg-white text-red-600 text-lg font-black px-2.5 py-1.5 rounded-lg block shadow-sm">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-red-100 font-bold uppercase mt-1 block">
                  Min
                </span>
              </div>
              <span className="text-white text-xl font-bold self-center -mt-4">
                :
              </span>
              <div>
                <span className="bg-white text-red-600 text-lg font-black px-2.5 py-1.5 rounded-lg block shadow-sm">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-red-100 font-bold uppercase mt-1 block">
                  Sec
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending & Best-Selling Products Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Trending Offers
            </h2>
            <p className="text-slate-400 text-sm">
              Picked directly from our best customer orders
            </p>
          </div>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 hover:underline"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 animate-pulse"
              >
                <div className="bg-slate-200 rounded-xl aspect-[4/3] w-full" />
                <div className="h-4.5 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-8 bg-slate-200 rounded-full w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-500">
            No products available at the moment. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p: any) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  product_name: p.product_name || p.name,
                  amount: p.amount,
                  descriptions: p.descriptions || p.description || "",
                  image_path: p.image_path || p.image || "",
                  in_cart: p.in_cart,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Persisted Recently Viewed Carousel */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin-slow" />
                Recently Viewed
              </h2>
              <p className="text-slate-400 text-sm">
                Pick up right where you left off
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  product_name: p.product_name,
                  amount:
                    typeof p.amount === "string"
                      ? parseFloat(p.amount)
                      : p.amount,
                  descriptions: p.descriptions || "",
                  image_path: p.image_path || "",
                  in_cart: 0,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Customer Reviews Section */}
      <section className="bg-slate-100 rounded-3xl p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-800">
            What Our Shoppers Say
          </h2>
          <p className="text-slate-500 text-sm">
            Real reviews written by verified ShopEZ accounts
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? "fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{rev.name}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter Signup Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="flex justify-center">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Stay updated with premium offers!
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Subscribe to our newsletter list today and grab a flat ₹500 discount
            coupon code directly in your inbox.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your personal email..."
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/15 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition placeholder:text-slate-400"
              required
            />
            <button
              type="submit"
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-sm px-7 py-3 transition active:scale-98 shadow-md"
            >
              Sign Up Free
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
