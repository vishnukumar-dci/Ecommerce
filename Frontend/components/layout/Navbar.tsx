"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Search,
  Package,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ListOrdered,
  History,
  Grid,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { useAuth } from "@/lib/store/auth";
import { clearAuthCookie } from "@/lib/cookies";
import { api } from "@/lib/api";
import { toast } from "@/lib/store/toast";

export default function Navbar() {
  const cartCount = useCart((s) => s.count());
  const clearCart = useCart((s) => s.clear);
  const wishlistCount = useWishlist((s) => s.items.length);

  const role = useAuth((s) => s.role);
  const name = useAuth((s) => s.name);
  const setAuth = useAuth((s) => s.setAuth);
  const logout = useAuth((s) => s.logout);
  const isAdmin = role === "admin";

  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch products list client-side once for search suggestions
    const fetchAllProducts = async () => {
      try {
        const res = await api.productList().catch(() => ({ list: [] }));
        setAllProducts(res.list || []);
      } catch (err) {}
    };
    fetchAllProducts();
  }, []);

  // Restore session if cookie exists but state is lost
  useEffect(() => {
    if (!role) {
      try {
        const cookie = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("auth="));
        if (cookie) {
          const json = decodeURIComponent(cookie.split("=")[1] || "{}");
          const parsed = JSON.parse(json || "{}");
          if (parsed && (parsed.token || parsed.userId)) {
            setAuth({
              token: parsed.token,
              userId: parsed.userId,
              name: parsed.name || parsed.user?.name,
              email: parsed.email || parsed.user?.email,
              role: parsed.role || parsed.user?.role,
            });
          }
        }
      } catch (e) {}
    }
  }, [role, setAuth]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync suggestion filtering
  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    const query = q.toLowerCase();
    const filtered = allProducts
      .filter((p) =>
        String(p.product_name || p.name)
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 5);
    setSuggestions(filtered);
  }, [q, allProducts]);

  const handleSearchSubmit = (searchTerm: string) => {
    setShowSuggestions(false);
    const target = pathname.startsWith("/products") ? pathname : "/products";
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    router.push(`${target}?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/customer/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch {}
    clearCart();
    logout();
    clearAuthCookie();
    toast.success("Successfully logged out");
    router.push("/");
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Link
            href="/"
            className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 hover:opacity-90"
          >
            ShopEZ
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div
          ref={searchRef}
          className="hidden md:block flex-1 max-w-xl relative"
        >
          <div className="relative">
            <Input
              placeholder="Search products, categories, brands..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(q);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in duration-100">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setQ(s.product_name || s.name);
                    handleSearchSubmit(s.product_name || s.name);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Search className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-800 font-medium">
                    {s.product_name || s.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation Link / Badges */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-600">
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-700 transition-all duration-200"
          >
            <Grid size={18} />
            <span>Shop</span>
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/profile?tab=wishlist"
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-700 transition-all duration-200"
          >
            <Heart
              size={18}
              className="text-slate-500 hover:text-red-500 transition-colors"
            />
            <span>Wishlist</span>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-1 rounded-full bg-red-500 text-white font-bold text-[10px] w-4.5 h-4.5 flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-700 transition-all duration-200 ${isAdmin ? "hidden" : ""}`}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-0.5 -right-1.5 rounded-full bg-blue-600 text-white font-bold text-[10px] w-4.5 h-4.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Logs for Admin */}
          {isAdmin && (
            <Link
              href="/logs"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-700 transition-all duration-200"
            >
              <History size={18} />
              <span>Logs</span>
            </Link>
          )}

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            {role ? (
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-700 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold uppercase">
                    {name ? name[0] : "U"}
                  </div>
                  <span className="max-w-[80px] truncate">
                    {name || "User"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden py-1 z-50 animate-in fade-in duration-100">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User size={16} />
                      Profile Details
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ListOrdered size={16} />
                      My Orders
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left font-semibold"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all duration-200 inline-block font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          {/* Wishlist Link for Mobile */}
          <Link
            href="/profile?tab=wishlist"
            className="relative p-2 text-slate-500"
          >
            <Heart size={20} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 rounded-full bg-red-500 text-white font-bold text-[8px] w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible under logo line on mobile */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Input
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit(q);
            }}
            className="w-full pl-10 rounded-full bg-slate-50 border-slate-200 text-slate-900"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 z-40 relative animate-in slide-in-from-top-4 duration-250">
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
          >
            <Grid size={18} />
            <span className="font-semibold text-sm">Shop Products</span>
          </Link>

          <Link
            href="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
          >
            <ShoppingCart size={18} />
            <span className="font-semibold text-sm">Cart ({cartCount})</span>
          </Link>

          <Link
            href="/orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
          >
            <ListOrdered size={18} />
            <span className="font-semibold text-sm">My Orders</span>
          </Link>

          {isAdmin && (
            <Link
              href="/logs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
            >
              <History size={18} />
              <span className="font-semibold text-sm">Logs</span>
            </Link>
          )}

          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
          >
            <User size={18} />
            <span className="font-semibold text-sm">My Profile</span>
          </Link>

          <hr className="border-slate-100" />

          {role ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-left font-bold"
            >
              <LogOut size={18} />
              <span className="text-sm">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-full font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
