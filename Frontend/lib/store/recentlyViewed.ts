"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentlyViewedItem = {
  id: number;
  product_name: string;
  amount: string | number;
  descriptions?: string;
  image_path?: string;
};

type RecentlyViewedState = {
  items: RecentlyViewedItem[];
  add: (item: RecentlyViewedItem) => void;
  clear: () => void;
};

export const useRecentlyViewed = create<RecentlyViewedState>()(persist(
  (set, get) => ({
    items: [],
    add: (item) => {
      const current = get().items.filter((i) => i.id !== item.id);
      // Keep only the most recent 8 items
      const updated = [item, ...current].slice(0, 8);
      set({ items: updated });
    },
    clear: () => set({ items: [] }),
  }),
  { name: "recently-viewed-store" }
));
