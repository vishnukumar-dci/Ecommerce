/**
 * useProducts Hook
 * Product fetching with filtering and caching
 */

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "react-query";
import { productService } from "@services/productService";
import { queryKeys } from "@services/queryClient";
import type { Product } from "../types/models";

export interface ProductFilters {
  search?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
}

export interface UseProductsReturn {
  products: Product[];
  homepage: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  filteredProducts: Product[];
}

/**
 * Hook for fetching and filtering products
 * Caches products across navigation, applies client-side filtering
 */
export const useProducts = (): UseProductsReturn => {
  const [filters, setFilters] = useState<ProductFilters>({});

  // Fetch all products
  const {
    data: productData,
    isLoading,
    error: listError,
  } = useQuery(
    queryKeys.products.list(),
    () => productService.getList(),
    { staleTime: 1000 * 60 * 5 }, // 5 minutes
  );

  // Fetch homepage products
  const { data: homepageData } = useQuery(
    queryKeys.products.homepage(),
    () => productService.getHomepage(),
    { staleTime: 1000 * 60 * 5 },
  );

  const products = useMemo(
    () => productData?.list || productData?.data || [],
    [productData],
  );
  const homepage = useMemo(
    () => homepageData?.list || homepageData?.data || [],
    [homepageData],
  );

  // Apply filters on client side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(searchLower) ||
          p.descriptions.toLowerCase().includes(searchLower),
      );
    }

    // Sort
    if (filters.sortBy) {
      result.sort((a, b) => {
        const aVal = filters.sortBy === "name" ? a.product_name : a.amount;
        const bVal = filters.sortBy === "name" ? b.product_name : b.amount;

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return result;
  }, [products, filters]);

  const handleSetFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    products,
    homepage,
    isLoading,
    error: listError instanceof Error ? listError.message : null,
    filters,
    setFilters: handleSetFilters,
    filteredProducts,
  };
};
