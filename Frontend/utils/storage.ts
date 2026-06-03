/**
 * Storage utilities
 * Safely interact with localStorage
 */

export const getFromStorage = <T = any>(
  key: string,
  defaultValue?: T,
): T | undefined => {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from storage key "${key}":`, error);
    return defaultValue;
  }
};

export const setToStorage = <T = any>(key: string, value: T): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to storage key "${key}":`, error);
    return false;
  }
};

export const removeFromStorage = (key: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage key "${key}":`, error);
    return false;
  }
};

export const clearStorage = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};

export const getStorageKey = (feature: string, property: string): string => {
  return `app_${feature}_${property}`;
};
