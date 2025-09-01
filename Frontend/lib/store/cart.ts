"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
  setItems: (items: CartItem[]) => void;
};

export const useCart = create<CartState>()(persist(
  (set, get) => ({
    items: [],
    add: (item) => {
      const items = [...get().items];
      const idx = items.findIndex(i => i.product_id === item.product_id);
      if (idx >= 0) items[idx].qty += item.qty;
      else items.push(item);
      set({ items });
    },
    remove: (productId) => set({ items: get().items.filter(i => i.product_id !== productId) }),
    updateQty: (productId, qty) => set({ items: get().items.map(i => i.product_id === productId ? { ...i, qty } : i) }),
    clear: () => set({ items: [] }),
    total: () => get().items.reduce((sum, i) => sum + (Number(i.amount) * i.qty), 0),
    count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    setItems: (items) => set({ items }),
  }),
  { name: "cart-store" }
));
