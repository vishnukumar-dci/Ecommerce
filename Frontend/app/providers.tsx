"use client";

/**
 * App Providers
 * Wraps the entire app with necessary providers
 */

import React from "react";
import { QueryClientProvider } from "react-query";
import { createQueryClient } from "@services/queryClient";

interface ProvidersProps {
  children: React.ReactNode;
}

// Create client-side query client instance
const queryClient = createQueryClient();

/**
 * Providers wrapper component
 * Combines React Query, Zustand, and other providers
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
