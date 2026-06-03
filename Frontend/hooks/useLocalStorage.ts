/**
 * useLocalStorage Hook
 * Safe localStorage interaction
 */

import { useState, useEffect, useCallback } from "react";
import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "@utils/storage";

export interface UseLocalStorageReturn<T> {
  value: T | undefined;
  setValue: (value: T | ((prev: T | undefined) => T)) => void;
  removeValue: () => void;
}

/**
 * Hook for managing localStorage with type safety
 * Syncs with actual storage and provides state
 *
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Storage value and methods to update/remove it
 *
 * @example
 * const { value, setValue } = useLocalStorage('user-theme', 'light')
 */
export const useLocalStorage = <T = any>(
  key: string,
  initialValue?: T,
): UseLocalStorageReturn<T> => {
  const [value, setValue] = useState<T | undefined>(() => {
    return getFromStorage<T>(key, initialValue);
  });

  // Update storage when value changes
  const handleSetValue = useCallback(
    (newValue: T | ((prev: T | undefined) => T)) => {
      setValue((prevValue) => {
        const valueToStore =
          typeof newValue === "function"
            ? (newValue as (prev: T | undefined) => T)(prevValue)
            : newValue;

        // Update state
        setValue(valueToStore);

        // Update storage
        setToStorage(key, valueToStore);

        return valueToStore;
      });
    },
    [key],
  );

  const handleRemoveValue = useCallback(() => {
    setValue(undefined);
    removeFromStorage(key);
  }, [key]);

  return {
    value,
    setValue: handleSetValue,
    removeValue: handleRemoveValue,
  };
};
