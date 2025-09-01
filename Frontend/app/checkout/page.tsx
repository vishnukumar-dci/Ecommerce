"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const auth = useAuth();
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function placeOrder() {
    setLoading(true); setError(null);
    try {
      const productIds = items.map(i => i.product_id);
      const qtys = items.map(i => i.qty);

      const res = await fetch("http://localhost:8088/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        body: JSON.stringify({ productIds, qtys }),
        redirect: "manual",
        credentials: "include",
      });

      if (res.status === 303 || (res.status >= 300 && res.status < 400)) {
        const location = res.headers.get("Location");
        if (location) {
          window.location.href = location;
          return;
        }
      }

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Order create failed ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      if ((data as any).url) window.location.href = (data as any).url;
    } catch (e: any) {
      setError(e.message || "Failed to place order");
      setLoading(false);
      return;
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <Label htmlFor="addr">Address</Label>
          <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat, Street, City, Pincode" />
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold mb-3">Payment</h2>
          <select className="h-10 rounded-xl border px-3" value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="card">Card</option>
          </select>
        </div>
      </div>
      <div className="rounded-2xl border p-4 h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="flex justify-between"><span>Items</span><span>{mounted ? items.length : 0}</span></div>
        <div className="flex justify-between"><span>Total</span><span className="font-semibold">₹{mounted ? total().toLocaleString() : 0}</span></div>
        {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        <Button className="w-full mt-4" disabled={loading || items.length===0} onClick={placeOrder}>
          {loading ? "Redirecting..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
