/**
 * useApi Hook
 * Generic React Query wrapper for data fetching
 */

import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

type UseApiOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;

export type UseApiReturn<T> = UseQueryResult<T, Error>;

/**
 * Generic hook for fetching data with React Query
 * Handles loading, error, and caching automatically
 *
 * @param queryKey - React Query key for caching
 * @param queryFn - Async function to fetch data
 * @param options - Additional React Query options
 * @returns React Query result with data, loading, error states
 *
 * @example
 * const { data, isLoading, error } = useApi(
 *   ['products'],
 *   () => productService.getList()
 * )
 */
export const useApi = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: UseApiOptions<T>,
): UseApiReturn<T> => {
  return useQuery<T, Error>({
    queryKey,
    queryFn,
    ...options,
  });
};
