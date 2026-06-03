/**
 * useDebounce Hook
 * Debounce values for search, filters, etc.
 */

import { useState, useEffect } from "react";

/**
 * Hook to debounce a value
 * Useful for search inputs, autocomplete, etc.
 *
 * @param value - Value to debounce
 * @param delay - Debounce delay in ms (default: 500ms)
 * @returns Debounced value
 *
 * @example
 * const searchQuery = useDebounce(searchInput, 300)
 * // searchQuery updates 300ms after user stops typing
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
