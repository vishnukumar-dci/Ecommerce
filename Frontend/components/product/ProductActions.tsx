"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { CartItem } from "@/lib/types";

export default function ProductActions({ product }: { product: any }) {
  const add = useCart((s) => s.add);
  const token = useAuth((s) => s.token);
  const userId = useAuth((s) => s.userId);
  const router = useRouter();
  const items = useCart((s) => s.items)
  const isInCart = items.some((i) => i.product_id === product.id)

  const ensureAuth = () => {
    if (!token || !userId) {
      const redirect = typeof window !== "undefined" ? window.location.pathname : "/products";
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!ensureAuth()) return;

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
    } catch (e) {
      console.error("Failed to add to cart:", e);
    }
  };

  const handleBuyNow = async () => {
    if (!ensureAuth()) return;
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
      window.location.href = "/checkout";
    } catch (e) {
      console.error("Failed to add to cart:", e);
    }
  };

  if(isInCart){
    return (
      <>
      <Button className=" bg-[#AFB1B6] text-white hover:bg-[#AFB1B6]/80" onClick={() => router.push("/cart")}>
          Go-to-Cart
      </Button>

      <Button onClick={handleBuyNow}>Buy Now</Button>
      </>
    )
  }
  return (
    <>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
      <Button variant="outline" onClick={handleBuyNow}>Buy Now</Button>
    </>
  );
}
