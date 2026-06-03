"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistItem = {
  id: number;
  product_name: string;
  amount: string | number;
  descriptions?: string;
  image_path?: string;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => boolean; // returns true if added, false if removed
  has: (productId: number) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(persist(
  (set, get) => ({
    items: [],
    toggle: (item) => {
      const current = get().items;
      const exists = current.some((i) => i.id === item.id);
      if (exists) {
        set({ items: current.filter((i) => i.id !== item.id) });
        return false;
      } else {
        set({ items: [...current, item] });
        return true;
      }
    },
    has: (productId) => get().items.some((i) => i.id === productId),
    clear: () => set({ items: [] }),
  }),
  { name: "wishlist-store" }
));
