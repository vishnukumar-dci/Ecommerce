/**
 * usePagination Hook
 * Reusable pagination logic
 */

import { useState, useCallback } from "react";
import { PAGINATION } from "@constants/api";

export interface UsePaginationReturn {
  page: number;
  limit: number;
  offset: number;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  reset: () => void;
}

/**
 * Hook for managing pagination state
 * Provides page, limit, and offset calculations
 *
 * @param initialPage - Starting page (default: 1)
 * @param initialLimit - Items per page (default: 10)
 * @returns Pagination state and handlers
 */
export const usePagination = (
  initialPage: number = PAGINATION.DEFAULT_PAGE,
  initialLimit: number = PAGINATION.DEFAULT_LIMIT,
): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = (page - 1) * limit;

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    if (newLimit > 0 && newLimit <= PAGINATION.MAX_LIMIT) {
      setLimit(newLimit);
      setPage(1); // Reset to first page when limit changes
    }
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    offset,
    handlePageChange,
    handleLimitChange,
    reset,
  };
};
