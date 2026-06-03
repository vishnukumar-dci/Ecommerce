"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "@/lib/store/toast";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HeartHandshake 
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you! You have subscribed to our newsletter.");
    setEmail("");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Truck className="w-8 h-8 text-blue-500 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-sm">Free Express Delivery</h4>
            <p className="text-xs text-slate-400">On orders above ₹999</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <RotateCcw className="w-8 h-8 text-blue-500 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-sm">Easy 30-Day Returns</h4>
            <p className="text-xs text-slate-400">Hassle-free refund policy</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-sm">100% Safe Payments</h4>
            <p className="text-xs text-slate-400">Secured checkout sessions</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <HeartHandshake className="w-8 h-8 text-blue-500 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-sm">24/7 Dedicated Support</h4>
            <p className="text-xs text-slate-400">Always here to assist you</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About column */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-white">ShopEZ</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            ShopEZ is a next-generation shopping experience offering the finest selection of quality electronics, designer fashion, and everyday essentials.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-all duration-200">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 hover:text-white transition-all duration-200">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-white transition-all duration-200">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-700 hover:text-white transition-all duration-200">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/products" className="hover:text-white hover:underline transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/products?q=electronics" className="hover:text-white hover:underline transition-colors">
                Electronics Deals
              </Link>
            </li>
            <li>
              <Link href="/products?q=fashion" className="hover:text-white hover:underline transition-colors">
                Fashion Closet
              </Link>
            </li>
            <li>
              <Link href="/products?q=home" className="hover:text-white hover:underline transition-colors">
                Home Essentials
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/orders" className="hover:text-white hover:underline transition-colors">
                Track Orders
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-white hover:underline transition-colors">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white hover:underline transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>+91 1234567890</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>support@shopez.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Newsletter</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Subscribe to receive details about special promotions, discount updates, and new arrivals!
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold py-2.5 transition active:scale-98 shadow-lg shadow-blue-500/10"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Copy */}
      <div className="bg-slate-950/80 py-6 text-center text-xs text-slate-500 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} ShopEZ Inc. All rights reserved. Designed with ❤️ for a premium experience.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
