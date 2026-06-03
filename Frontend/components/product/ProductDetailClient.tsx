"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assetUrl, api } from "@/lib/api";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { useRecentlyViewed } from "@/lib/store/recentlyViewed";
import { useAuth } from "@/lib/store/auth";
import { toast } from "@/lib/store/toast";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingBag,
  Check,
  Star,
  Truck,
  RotateCcw,
  ShieldAlert,
  ChevronRight,
  Maximize2,
  X,
  MessageSquare,
  HelpCircle,
  Award,
} from "lucide-react";

export default function ProductDetailClient({
  product,
  allProducts,
}: {
  product: any;
  allProducts: any[];
}) {
  const router = useRouter();

  // Stores
  const addCartItem = useCart((s) => s.add);
  const cartItems = useCart((s) => s.items);
  const { toggle, has } = useWishlist();
  const addRecentlyViewed = useRecentlyViewed((s) => s.add);

  // Auth details
  const token = useAuth((s) => s.token);
  const userId = useAuth((s) => s.userId);
  const isAdmin = useAuth((s) => s.role) === "admin";

  const isInCart = cartItems.some((i) => i.product_id === product.id);
  const isWishlisted = has(product.id);

  // Gallery Setup (Generate mock angle views using main image)
  const imageViews = [
    { name: "Default Angle", url: assetUrl(product.image_path) },
    {
      name: "Alternative Detail",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "In-Use View",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    },
  ];
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    backgroundPosition: "0% 0%",
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Info Tab (Specs, Reviews, Q&A)
  const [activeTab, setActiveTab] = useState<"specs" | "reviews" | "qa">(
    "specs",
  );

  // Track recently viewed
  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      product_name: product.product_name,
      amount: product.amount,
      descriptions: product.descriptions,
      image_path: product.image_path,
    });
  }, [product, addRecentlyViewed]);

  // Derived dummy values
  const rating = (4.0 + (product.id % 11) * 0.1).toFixed(1);
  const reviewsCount = 45 + (product.id % 17) * 8;
  const discountPercent = 15 + (product.id % 4) * 5;
  const originalPrice = Math.round(
    Number(product.amount) / (1 - discountPercent / 100),
  );
  const saveAmt = originalPrice - product.amount;

  // Hover zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  const handleAddToCart = async () => {
    if (isInCart) {
      router.push("/cart");
      return;
    }
    if (!token || !userId) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    try {
      await api.cartAdd(Number(userId), Number(product.id));
      addCartItem({
        id: 0,
        product_id: product.id,
        qty: 1,
        image_path: product.image_path,
        product_name: product.product_name,
        amount: product.amount,
      });
      toast.success("Added to shopping cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!token || !userId) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    try {
      const res = await api.createSingle({ productId: product.id, qty: 1 });
      if (res && (res.url || res.sessionUrl)) {
        window.location.href = res.url || res.sessionUrl;
      }
    } catch (err) {
      toast.error("Buy Now failed. Please try again.");
    }
  };

  const handleWishlistToggle = () => {
    const added = toggle({
      id: product.id,
      product_name: product.product_name,
      amount: product.amount,
      descriptions: product.descriptions,
      image_path: product.image_path,
    });
    if (added) {
      toast.success("Added to wishlist");
    } else {
      toast.info("Removed from wishlist");
    }
  };

  // Find related products from similar category (derived)
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <Link href="/" className="hover:text-slate-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-slate-600">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 truncate max-w-[200px]">
          {product.product_name}
        </span>
      </div>

      {/* Grid container: Gallery left, Info right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Section (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="relative aspect-square border border-slate-100 rounded-3xl bg-slate-50 overflow-hidden cursor-crosshair group shadow-sm"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={
                imageViews[selectedImage]?.url ||
                "https://via.placeholder.com/600"
              }
              alt="Main Preview"
              fill
              style={{ objectFit: "cover" }}
              className="transition duration-150"
            />
            {/* Magnifier zoom mirror */}
            <div
              className="absolute inset-0 pointer-events-none hidden md:block bg-no-repeat bg-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                backgroundImage: `url(${imageViews[selectedImage]?.url || "https://via.placeholder.com/600"})`,
                backgroundSize: "200%",
                ...zoomStyle,
              }}
            />
            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 shadow-lg text-slate-500 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail list */}
          <div className="flex gap-3 justify-center">
            {imageViews.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border bg-slate-50 shadow-sm transition ${
                  selectedImage === idx
                    ? "border-blue-600 ring-2 ring-blue-500/10 scale-102"
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt="Thumbnail View"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="inline-block bg-blue-50 text-blue-700 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.id % 2 === 0 ? "Bestseller" : "Verified Quality"}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {product.product_name}
            </h1>
            <p className="text-slate-400 text-xs font-semibold">
              Model ID: EZ-{product.id * 123}
            </p>
          </div>

          {/* Ratings */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-700">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              ({reviewsCount} Customer Reviews)
            </span>
            <span className="text-slate-200">|</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Award className="w-4 h-4" />
              Verified Seller Account
            </span>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{Number(product.amount).toLocaleString()}
              </span>
              <span className="text-base text-slate-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-lg">
                Save {discountPercent}%
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-bold">
              Inclusive of all taxes. Free shipping on this item.
            </p>
          </div>

          {/* Highlights Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overview
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.descriptions ||
                "This premium product brings you high performance and durable build quality. Perfectly suited for everyday modern utility."}
            </p>
          </div>

          {/* Delivery & Return Info badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Dispatch Next Day</p>
                <p className="text-slate-400">
                  Order before 5 PM for express shipping.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">
                  30-Day Money Back Guarantee
                </p>
                <p className="text-slate-400">
                  Easy refunds if not fully satisfied.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          {!isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={handleAddToCart}
                className={`flex-1 rounded-2xl font-bold py-3.5 gap-2 h-12 transition-all active:scale-98 ${
                  isInCart
                    ? "bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20"
                }`}
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {isInCart ? "Go to Shopping Cart" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 h-12 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98"
              >
                Buy Now
              </Button>
              <button
                onClick={handleWishlistToggle}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm transition hover:scale-105 active:scale-95 ${
                  isWishlisted
                    ? "border-red-100 bg-red-50 text-red-500"
                    : "border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section: Specifications, Reviews, Q&A */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 gap-6">
          {[
            { id: "specs", label: "Specifications", icon: HelpCircle },
            { id: "reviews", label: `Reviews (${reviewsCount})`, icon: Star },
            { id: "qa", label: "Questions & Answers", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3.5 text-sm font-extrabold uppercase tracking-wider relative transition-all ${
                activeTab === tab.id
                  ? "text-blue-600 font-black border-b-2 border-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {/* Specifications Table */}
          {activeTab === "specs" && (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  {[
                    { key: "Brand", value: "ShopEZ Exclusive Line" },
                    { key: "Model Number", value: `SEZ-${product.id}-DX` },
                    { key: "Dimensions", value: "15.0cm x 12.0cm x 8.5cm" },
                    { key: "Weight", value: "340 grams" },
                    {
                      key: "Color Options",
                      value: "Black / Platinum Silver / Rose Gold",
                    },
                    {
                      key: "Warranty Period",
                      value: "1 Year Limited Domestic Warranty",
                    },
                    { key: "Seller", value: "ShopEZ Retail Outlet Ltd." },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}
                    >
                      <td className="px-6 py-3 font-bold text-slate-400 w-1/3 border-b border-slate-100">
                        {row.key}
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-700 border-b border-slate-100">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customer Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {[
                {
                  name: "Aarav Mehta",
                  date: "Jan 12, 2026",
                  text: "Incredibly fast shipping. The product quality is top-notch and exactly as described in the specifications.",
                  rating: 5,
                },
                {
                  name: "Kriti Sen",
                  date: "Feb 03, 2026",
                  text: "Really good value for money. Minor delivery delay but the customer support team kept me updated constantly.",
                  rating: 4,
                },
                {
                  name: "Amit Patel",
                  date: "Mar 14, 2026",
                  text: "Extremely satisfied. Easy returns policy is a lifesaver. Will shop from here again!",
                  rating: 5,
                },
              ].map((rev, idx) => (
                <div
                  key={idx}
                  className="pb-5 border-b border-slate-100 last:border-b-0 space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{rev.name}</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">"{rev.text}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Simulated Q&A Section */}
          {activeTab === "qa" && (
            <div className="space-y-6">
              {[
                {
                  q: "Is this item covered under domestic warranty details?",
                  a: "Yes! Every purchase comes with a stable 1 Year Domestic warranty covering any manufacturing defects.",
                },
                {
                  q: "Can I return this product if the size/fit is incorrect?",
                  a: "Absolutely. We offer a no-questions-asked 30-day easy return policy for a full refund or swap.",
                },
                {
                  q: "Does the package bundle include charge adapters?",
                  a: "Yes, standard charging block adapters and cable details are packaged inside the core box.",
                },
              ].map((qa, idx) => (
                <div
                  key={idx}
                  className="space-y-1 text-sm pb-5 border-b border-slate-100 last:border-b-0"
                >
                  <p className="font-bold text-slate-800 flex items-start gap-2">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                      Q
                    </span>
                    {qa.q}
                  </p>
                  <p className="text-slate-500 pl-6 flex items-start gap-2">
                    <span className="bg-blue-50 px-1.5 py-0.5 rounded text-[10px] text-blue-600">
                      A
                    </span>
                    {qa.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products display */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              You May Also Like
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Explore similar recommendations based on this item
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  product_name: p.product_name || p.name,
                  amount: p.amount,
                  descriptions: p.descriptions || p.description || "",
                  image_path: p.image_path || p.image || "",
                  in_cart: 0,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Gallery zoom Modal overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl p-4 shadow-2xl animate-in scale-in duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-3 -right-3 bg-white text-slate-500 hover:text-slate-700 border border-slate-100 rounded-full p-2.5 shadow-xl hover:scale-115 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src={
                  imageViews[selectedImage]?.url ||
                  "https://via.placeholder.com/800"
                }
                alt="Fullscreen view"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">
              Viewing: {imageViews[selectedImage]?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
