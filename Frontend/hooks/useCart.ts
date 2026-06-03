/**
 * useCart Hook
 * Cart state management with API sync
 */

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useCart as useCartStore } from "@store/cart";
import { cartService } from "@services/cartService";
import { queryKeys } from "@services/queryClient";
import type { CartItem } from "../types/models";

export interface UseCartReturn {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  decrementItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

/**
 * Hook for managing cart state and operations
 * Combines Zustand store with API calls and React Query caching
 */
export const useCart = (): UseCartReturn => {
  const queryClient = useQueryClient();
  const store = useCartStore();

  // Fetch cart items
  const { isLoading, error: fetchError } = useQuery(
    queryKeys.cart.list(),
    () => cartService.getItems(),
    {
      onSuccess: (data) => {
        if (data.products) {
          store.setItems(data.products);
        }
      },
      enabled: true,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  );

  // Add to cart mutation
  const addMutation = useMutation(
    (productId: number) => cartService.addItem(productId),
    {
      onSuccess: (data) => {
        if (data.cart) {
          store.setItems(data.cart);
        }
        queryClient.invalidateQueries(queryKeys.cart.list());
      },
    },
  );

  // Remove from cart mutation
  const removeMutation = useMutation(
    (productId: number) => cartService.removeItem(productId),
    {
      onSuccess: (data) => {
        if (data.cart) {
          store.setItems(data.cart);
        }
        queryClient.invalidateQueries(queryKeys.cart.list());
      },
    },
  );

  // Decrement mutation
  const decrementMutation = useMutation(
    (productId: number) => cartService.decrementItem(productId),
    {
      onSuccess: (data) => {
        if (data.cart) {
          store.setItems(data.cart);
        }
        queryClient.invalidateQueries(queryKeys.cart.list());
      },
    },
  );

  // Clear cart mutation
  const clearMutation = useMutation(() => cartService.clear(), {
    onSuccess: () => {
      store.clear();
      queryClient.invalidateQueries(queryKeys.cart.list());
    },
  });

  const handleAddItem = useCallback(
    async (productId: number) => {
      await addMutation.mutateAsync(productId);
    },
    [addMutation],
  );

  const handleRemoveItem = useCallback(
    async (productId: number) => {
      await removeMutation.mutateAsync(productId);
    },
    [removeMutation],
  );

  const handleDecrementItem = useCallback(
    async (productId: number) => {
      await decrementMutation.mutateAsync(productId);
    },
    [decrementMutation],
  );

  const handleClearCart = useCallback(async () => {
    await clearMutation.mutateAsync();
  }, [clearMutation]);

  return {
    items: store.items,
    total: store.total(),
    itemCount: store.count(),
    isLoading,
    error:
      (fetchError instanceof Error ? fetchError.message : null) ||
      (addMutation.error instanceof Error ? addMutation.error.message : null) ||
      null,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    decrementItem: handleDecrementItem,
    clearCart: handleClearCart,
  };
};
