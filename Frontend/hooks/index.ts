/**
 * Custom Hooks Index
 * Re-export all custom hooks for easy importing
 */

export { useApi } from "./useApi";
export { useAuth } from "./useAuth";
export { useCart } from "./useCart";
export { useWishlist } from "./useWishlist";
export { useProducts } from "./useProducts";
export { usePagination } from "./usePagination";
export { useDebounce } from "./useDebounce";
export { useLocalStorage } from "./useLocalStorage";
export { useApiErrorHandler } from "./useApiErrorHandler";

// Re-export hook return types
export type { UseApiReturn } from "./useApi";
export type { UseAuthReturn } from "./useAuth";
export type { UseCartReturn } from "./useCart";
export type { UseWishlistReturn } from "./useWishlist";
export type { UseProductsReturn, ProductFilters } from "./useProducts";
export type { UsePaginationReturn } from "./usePagination";
export type { UseLocalStorageReturn } from "./useLocalStorage";
export type { UseApiErrorHandlerReturn } from "./useApiErrorHandler";
