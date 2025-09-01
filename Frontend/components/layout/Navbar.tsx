"use client";
import Link from "next/link";
import { ShoppingCart, User, Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/auth";

export default function Navbar() {
  const count = useCart((s) => s.count());
  const role = useAuth((s) => s.role);
  const setAuth = useAuth((s) => s.setAuth);
  const isAdmin = role === "admin";
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // If the auth store is empty but an auth cookie exists, restore minimal auth state
    if (!role) {
      try {
        const cookie = document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith("auth="));
        if (cookie) {
          const json = decodeURIComponent(cookie.split("=")[1] || "{}");
          const parsed = JSON.parse(json || "{}");
          if (parsed && (parsed.token || parsed.userId)) {
            setAuth({ token: parsed.token, userId: parsed.userId });
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [role, setAuth]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-slate-900">ShopEZ</Link>
        </div>

        <div className="flex-1 px-6">
          <div className="relative">
            <Input
              placeholder="Search products, brands and more"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = pathname.startsWith('/products') ? pathname : '/products';
                  const params = new URLSearchParams();
                  if (q) params.set('q', q);
                  router.push(`${target}?${params.toString()}`);
                }
              }}
              className="pl-10 rounded-full bg-slate-100 text-slate-900"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        <nav className="flex items-center space-x-6 text-sm text-slate-700">
          <Link href="/products" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50"> 
            <Package size={18}/> <span>Products</span>
          </Link>
          <Link href="/cart" className={`relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 ${isAdmin ? 'hidden' : ''}`}>
            <ShoppingCart size={18} />
            <span>Cart</span>
            <span className={`absolute -top-1 -right-2 rounded-full bg-red-600 text-white text-xs px-2 ${mounted && count > 0 ? '' : 'hidden'}`}>{mounted ? count : ''}</span>
          </Link>
          <Link href="/orders" className="px-3 py-2 rounded-md hover:bg-slate-50">Orders</Link>
          <Link href="/logs" className={`relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 ${isAdmin ? '' : 'hidden'}`}>Logs</Link>
          <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50"><User size={18}/> <span>Profile</span></Link>
        </nav>
      </div>
    </header>
  );
}
