/**
 * useWishlist Hook
 * Wishlist state management
 */

import { useCallback } from "react";
import { useWishlist as useWishlistStore } from "@store/wishlist";

export interface UseWishlistReturn {
  items: any[];
  has: (productId: number) => boolean;
  toggle: (item: any) => void;
  clear: () => void;
}

/**
 * Hook for managing wishlist state
 */
export const useWishlist = (): UseWishlistReturn => {
  const store = useWishlistStore();

  const has = useCallback(
    (productId: number) => {
      return store.has(productId);
    },
    [store],
  );

  const handleToggle = useCallback(
    (item: any) => {
      store.toggle(item);
    },
    [store],
  );

  const handleClear = useCallback(() => {
    store.clear();
  }, [store]);

  return {
    items: store.items,
    has,
    toggle: handleToggle,
    clear: handleClear,
  };
};
