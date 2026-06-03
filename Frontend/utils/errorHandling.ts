/**
 * Error handling utilities
 * Extract, format, and display errors
 */

import { ERROR_MESSAGES, HTTP_STATUS } from "@constants/api";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return (
      error.message === "Failed to fetch" ||
      error.message.includes("NetworkError") ||
      error.message.includes("network")
    );
  }
  return false;
};

export const getErrorMessage = (error: unknown): string => {
  // Error is a string
  if (typeof error === "string") {
    return error;
  }

  // Error is an Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Error is a Response or API error object
  if (error && typeof error === "object") {
    const err = error as Record<string, any>;

    if (err.message) {
      return err.message;
    }

    if (err.error) {
      return typeof err.error === "string" ? err.error : err.error.message;
    }

    if (err.statusText) {
      return err.statusText;
    }
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
};

export const formatErrorForDisplay = (error: unknown): string => {
  const message = getErrorMessage(error);

  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Check if it's a known error message
  const knownErrors = Object.values(ERROR_MESSAGES);
  if (knownErrors.includes(message)) {
    return message;
  }

  // Return the error message, or a generic one if empty
  return message || ERROR_MESSAGES.GENERIC_ERROR;
};

export const getHttpStatusErrorMessage = (status: number): string => {
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case HTTP_STATUS.SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.GENERIC_ERROR;
  }
};

export const isAuthError = (error: unknown): boolean => {
  const message = getErrorMessage(error);
  return (
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("authentication") ||
    message.toLowerCase().includes("token") ||
    message.toLowerCase().includes("login")
  );
};

export const isValidationError = (error: unknown): boolean => {
  const message = getErrorMessage(error);
  return message.toLowerCase().includes("validation");
};
