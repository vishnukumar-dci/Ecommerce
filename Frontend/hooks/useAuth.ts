/**
 * useAuth Hook
 * Authentication state and methods
 */

import { useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAuth as useAuthStore } from "@store/auth";
import { authService } from "@services/authService";
import { queryKeys } from "@services/queryClient";
import type {
  LoginResponse,
  RegisterResponse,
  UpdateProfileResponse,
} from "../types/api";
import type {
  AuthPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "../types/models";
import { getErrorMessage } from "@utils/errorHandling";

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistering: boolean;
  isUpdating: boolean;
  error: string | null;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  logout: () => void;
}

/**
 * Hook for managing authentication state and operations
 * Combines Zustand store with API calls
 */
export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();
  const authState = useAuthStore();

  // Login mutation
  const loginMutation = useMutation(
    (payload: AuthPayload) => authService.login(payload),
    {
      onSuccess: (data: LoginResponse) => {
        if (data.token && data.user) {
          authState.setAuth({
            token: data.token,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            userId: data.user.id ? parseInt(String(data.user.id)) : undefined,
          });
          queryClient.invalidateQueries(queryKeys.auth.profile());
        }
      },
    },
  );

  // Register mutation
  const registerMutation = useMutation(
    (payload: RegisterPayload) => authService.register(payload),
    {
      onSuccess: (data: RegisterResponse) => {
        if (data.token && data.user) {
          authState.setAuth({
            token: data.token,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            userId: data.user.id ? parseInt(String(data.user.id)) : undefined,
          });
          queryClient.invalidateQueries(queryKeys.auth.profile());
        }
      },
    },
  );

  // Update profile mutation
  const updateMutation = useMutation(
    (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    {
      onSuccess: (data: UpdateProfileResponse) => {
        if (data.user) {
          authState.setAuth({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            userId: data.user.id ? parseInt(String(data.user.id)) : undefined,
          });
          queryClient.invalidateQueries(queryKeys.auth.profile());
        }
      },
    },
  );

  const handleLogin = useCallback(
    async (payload: AuthPayload) => {
      await loginMutation.mutateAsync(payload);
    },
    [loginMutation],
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      await registerMutation.mutateAsync(payload);
    },
    [registerMutation],
  );

  const handleUpdateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      await updateMutation.mutateAsync(payload);
    },
    [updateMutation],
  );

  const handleLogout = useCallback(() => {
    authState.logout();
    queryClient.clear();
  }, [authState, queryClient]);

  const user: User | null =
    authState.token && authState.email
      ? {
          id: authState.userId?.toString(),
          name: authState.name || "",
          email: authState.email,
          role: authState.role || "customer",
        }
      : null;

  return {
    user,
    token: authState.token || null,
    isAuthenticated: !!authState.token && !!authState.email,
    isLoading: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    error:
      (loginMutation.error instanceof Error
        ? loginMutation.error.message
        : null) ||
      (registerMutation.error instanceof Error
        ? registerMutation.error.message
        : null) ||
      null,
    login: handleLogin,
    register: handleRegister,
    updateProfile: handleUpdateProfile,
    logout: handleLogout,
  };
};
