"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product, CartItem } from "@/lib/types";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { useAuth } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { assetUrl, api } from "@/lib/api";
import { toast } from "@/lib/store/toast";
import { Heart, Star, ShoppingBag, Edit, Check } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const role = useAuth((s) => s.role);
  const isAdmin = role === "admin";
  const router = useRouter();

  // Wishlist logic
  const { toggle, has } = useWishlist();
  const isWishlisted = has(product.id);

  // Derive stable dummy ratings and discount based on product ID
  const rating = (4.0 + (product.id % 11) * 0.1).toFixed(1);
  const reviewCount = 12 + (product.id % 29) * 9;
  const discountPercent = 15 + (product.id % 4) * 5; // 15%, 20%, 25%, 30%
  const originalPrice = Math.round(Number(product.amount) / (1 - discountPercent / 100));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle({
      id: product.id,
      product_name: product.product_name,
      amount: product.amount,
      descriptions: product.descriptions,
      image_path: product.image_path,
    });
    if (added) {
      toast.success(`Added ${product.product_name} to wishlist`);
    } else {
      toast.info(`Removed ${product.product_name} from wishlist`);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-100 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full">
      
      {/* Badge Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
          {discountPercent}% OFF
        </span>
        {product.id % 5 === 0 && (
          <span className="bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Trending
          </span>
        )}
      </div>

      {/* Wishlist Button Overlay */}
      {!isAdmin && (
        <button
          onClick={handleWishlistClick}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 flex items-center justify-center shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-90 transition-all duration-200"
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      )}

      {/* Product Image Link */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3.8] bg-slate-50 overflow-hidden w-full">
        <Image
          src={assetUrl(product.image_path) || "https://via.placeholder.com/400x300?text=Product"}
          alt={product.product_name}
          fill
          style={{ objectFit: "cover" }}
          className="object-cover w-full h-full transform group-hover:scale-106 transition-transform duration-500 ease-out"
        />
        {/* Quick Add Overlay on hover (Desktop) */}
        {!isAdmin && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 px-4">
            <QuickAddToCartButton product={product} className="w-full hidden md:flex" />
          </div>
        )}
      </Link>

      {/* Info Content */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`} className="block group-hover:text-blue-700 transition-colors">
            <div className="font-semibold text-slate-800 text-[15px] line-clamp-1 mb-1">
              {product.product_name}
            </div>
          </Link>
          <p className="text-slate-400 text-xs line-clamp-1 mb-2">
            {product.descriptions || "No description available"}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-700">{rating}</span>
            <span className="text-slate-300 text-[10px]">|</span>
            <span className="text-xs text-slate-400">({reviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{Number(product.amount).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold">You Save ₹{(originalPrice - product.amount).toLocaleString()}</p>
          </div>

          <div className="shrink-0">
            {isAdmin ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/products")}
                className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold gap-1 py-1 px-3 h-8"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </Button>
            ) : (
              // Mobile Quick Add Trigger (shown as icon button)
              <QuickAddToCartButton product={product} isIconOnly={true} className="md:hidden" />
            )}
          </div>
        </div>
      </CardContent>

    </Card>
  );
}

function QuickAddToCartButton({ product, isIconOnly = false, className = "" }: { product: Product, isIconOnly?: boolean, className?: string }) {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const token = useAuth((s) => s.token);
  const userId = useAuth((s) => s.userId);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isInCart = items.some((i) => i.product_id === product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      router.push("/cart");
      return;
    }

    if (!token || !userId) {
      const redirect = typeof window !== "undefined" ? window.location.pathname : "/products";
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setLoading(true);
    try {
      await api.cartAdd(Number(userId), Number(product.id));
      const cartItem: CartItem = {
        id: 0,
        product_id: product.id,
        qty: 1,
        image_path: product.image_path,
        product_name: product.product_name,
        amount: product.amount,
      };
      add(cartItem);
      toast.success(`Added ${product.product_name} to cart!`);
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  };

  if (isIconOnly) {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={loading}
        className={`w-9.5 h-9.5 rounded-full p-0 flex items-center justify-center transition-all ${
          isInCart 
            ? "bg-slate-200 text-slate-600 hover:bg-slate-300" 
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
        } ${className}`}
      >
        {isInCart ? <Check className="w-4.5 h-4.5" /> : <ShoppingBag className="w-4.5 h-4.5" />}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className={`rounded-xl shadow-lg font-bold text-xs gap-1.5 h-9 w-full flex items-center justify-center transition-all ${
        isInCart 
          ? "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/10" 
          : "bg-white hover:bg-slate-50 text-blue-700 border border-slate-100 shadow-slate-200/50"
      } ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : isInCart ? (
        <>
          <Check className="w-3.5 h-3.5" />
          In Cart - Go now
        </>
      ) : (
        <>
          <ShoppingBag className="w-3.5 h-3.5" />
          Quick Add
        </>
      )}
    </Button>
  );
}
