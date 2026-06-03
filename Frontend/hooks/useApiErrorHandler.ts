/**
 * useApiErrorHandler Hook
 * Centralized error handling for API calls
 */

import { useState, useCallback } from "react";
import { useToastStore } from "@store/toast";
import {
  getErrorMessage,
  formatErrorForDisplay,
  isAuthError,
} from "@utils/errorHandling";
import { useRouter } from "next/navigation";

export interface UseApiErrorHandlerReturn {
  error: string | null;
  setError: (error: string | Error | unknown) => void;
  clearError: () => void;
  displayError: (error: string | Error | unknown, autoClose?: boolean) => void;
}

/**
 * Hook for centralized error handling
 * Extracts error messages, displays toasts, and handles auth errors
 */
export const useApiErrorHandler = (): UseApiErrorHandlerReturn => {
  const [error, setErrorState] = useState<string | null>(null);
  const { addToast } = useToastStore();
  const router = useRouter();

  const handleSetError = useCallback((err: string | Error | unknown) => {
    const message = typeof err === "string" ? err : getErrorMessage(err);
    setErrorState(message);
  }, []);

  const handleClearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleDisplayError = useCallback(
    (err: string | Error | unknown, autoClose: boolean = true) => {
      const message = formatErrorForDisplay(err);
      setErrorState(message);
      addToast(message, "error", autoClose ? 5000 : undefined);

      // Redirect to login if auth error
      if (isAuthError(err)) {
        router.push("/login");
      }
    },
    [addToast, router],
  );

  return {
    error,
    setError: handleSetError,
    clearError: handleClearError,
    displayError: handleDisplayError,
  };
};
