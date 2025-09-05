"use client";
import { useCart } from "@/lib/store/cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api, assetUrl } from "@/lib/api";
import { useAuth } from "@/lib/store/auth";
import Link from "next/link";

export default function CartPage() {
  const { items, remove, updateQty, total } = useCart();
  const userId = useAuth((s) => s.userId);

  const inc = async (productId: number, current: number) => {
    if (!userId) return;
    try {
      await api.cartAdd(Number(userId), Number(productId));
      updateQty(productId, current + 1);
    } catch (e) { console.error(e); }
  };
  const dec = async (productId: number, current: number) => {
    try {
      await api.cartDecrement(Number(productId));
      const next = Math.max(0, current - 1);
      if (next === 0) remove(productId); else updateQty(productId, next);
    } catch (e) { console.error(e); }
  };
  const del = async (productId: number) => {
    try {
      await api.cartRemove(0 as any, Number(productId));
    } catch (e) { console.error(e); }
    remove(productId);
  };

  const payNow = async () => {
    try {
      // assemble productIds and qtys
      const productIds = items.map(i => i.product_id || i.id);
      const qtys = items.map(i => i.qty);
      const res = await api.createOrder({ productIds, qtys });
      if (res && res.url) {
        // redirect to Stripe checkout
        window.location.href = res.url;
      } else if (res && res.sessionUrl) {
        window.location.href = res.sessionUrl;
      } else {
        console.error('Unexpected createOrder response', res);
      }
    } catch (e) {
      console.error('Failed to initiate checkout', e);
    }
  }

  const handleBuyNow = async (productId:number,qty:number) => {
  try {
    const res = await api.createSingle({productId,qty});
      if (res && res.url) {
        // redirect to Stripe checkout
        window.location.href = res.url;
      } else if (res && res.sessionUrl) {
        window.location.href = res.sessionUrl;
      } else {
        console.error('Unexpected createOrder response', res);
      }
  } catch (e) {
    console.error("Buy Now failed:", e);
  }
};

  return (
    <div className="min-h-full flex items-center justify-center py-12 bg-slate-50">
      <div className="w-full max-w-6xl px-6 space-y-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-center">
              Looks like your cart’s been quiet – time to place your first order!
            </p>
            <Link href="/products">
            <Button className="px-6 py-2">
              Shop Now
            </Button>
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => {
                const pid = Number(i.product_id ?? i.id);
                const qty = Number(i.qty ?? 0);
                return (
                  <div key={i.id ?? pid} className="flex items-center gap-4 p-4 rounded-2xl border bg-white">
                    <Image src={assetUrl(i.image_path) || "https://via.placeholder.com/100"} alt="" width={100} height={100} className="rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-medium text-lg">{i.product_name}</div>
                      <div className="text-slate-700 font-semibold mt-1">₹{Number(i.amount).toLocaleString()}</div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" onClick={() => dec(pid, qty)}>-</Button>
                        <span className="px-3">{qty}</span>
                        <Button size="sm" onClick={() => inc(pid, qty)}>+</Button>
                        <Button variant="ghost" onClick={() => del(pid)}>Remove</Button>

                         <Button
                      className="ml-auto"
                      onClick={() => handleBuyNow(pid, qty)}
                    >
                      Buy Now
                    </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-6 rounded-2xl border bg-white h-fit">
              <div className="flex justify-between">
                <div>Total</div>
                <div className="font-semibold">₹{total().toLocaleString()}</div>
              </div>
              <Button className="w-full mt-4" onClick={payNow}>Pay Now</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
