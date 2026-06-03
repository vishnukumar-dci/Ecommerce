/**
 * React Query configuration and setup
 * Centralized QueryClient with default options and plugins
 */

import { QueryClient } from "react-query";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes (storage time)
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
      },
      mutations: {
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
};

/**
 * Query key factory for type-safe and consistent query keys
 * Organized by feature domain
 */
export const queryKeys = {
  // Products
  products: {
    all: ["products"],
    list: () => [...queryKeys.products.all, "list"],
    listWithFilters: (filters: Record<string, any>) => [
      ...queryKeys.products.list(),
      { filters },
    ],
    homepage: () => [...queryKeys.products.all, "homepage"],
    detail: (id: number) => [...queryKeys.products.all, "detail", id],
  },

  // Cart
  cart: {
    all: ["cart"],
    list: () => [...queryKeys.cart.all, "list"],
  },

  // Orders
  orders: {
    all: ["orders"],
    list: () => [...queryKeys.orders.all, "list"],
    history: (page: number, limit: number) => [
      ...queryKeys.orders.list(),
      "history",
      { page, limit },
    ],
    status: (orderId: number) => [...queryKeys.orders.all, "status", orderId],
    stripeLogs: () => [...queryKeys.orders.all, "stripeLogs"],
  },

  // Auth
  auth: {
    all: ["auth"],
    user: () => [...queryKeys.auth.all, "user"],
    profile: () => [...queryKeys.auth.all, "profile"],
  },
};
