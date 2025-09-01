"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product, CartItem } from "@/lib/types";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { assetUrl, api } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const role = useAuth((s) => s.role);
  const isAdmin = role === "admin";
  return (
    <Card className="overflow-hidden bg-slate-200">
      <CardContent className="p-3">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-3">
            <Image src={assetUrl(product.image_path) || "https://via.placeholder.com/400x300?text=Product"} alt={product.product_name} width={400} height={300} className="object-cover w-full h-full" />
          </div>
          <div className="font-medium line-clamp-1">{product.product_name}</div>
          <div className="text-brand font-semibold mt-1">₹{Number(product.amount).toLocaleString()}</div>
        </Link>
        {isAdmin ? <EditButton productId={product.id} /> : <AddToCart product={product} />}
      </CardContent>
    </Card>
  );
}

function EditButton({ productId }: { productId: number }) {
  const router = useRouter();
  return <Button className="mt-3 w-full" variant="outline" onClick={() => router.push("/admin")}>Edit Product</Button>;
}

function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const token = useAuth((s) => s.token);
  const userId = useAuth((s) => s.userId);
  const router = useRouter();
  
  const handleAddToCart = async () => {
    if (!token || !userId) {
      const redirect = typeof window !== "undefined" ? window.location.pathname : "/products";
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    try {
      await api.cartAdd(Number(userId), Number(product.id));
      const cartItem: CartItem = {
        id: 0,
        product_id: product.id,
        qty: 1,
        image_path: product.image_path,
        product_name: product.product_name,
        amount: product.amount
      };
      add(cartItem);
    } catch (e) {
      console.error("Failed to add to cart:", e);
    }
  };
  
  return <Button className="mt-3 w-full" onClick={handleAddToCart}>Add to Cart</Button>;
}
