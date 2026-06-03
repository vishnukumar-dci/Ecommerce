/**
 * Authentication Service
 * Handles all auth-related API calls
 */

import { apiFetch } from "@lib/api";
import type {
  LoginResponse,
  RegisterResponse,
  UpdateProfileResponse,
} from "../types/api";
import type {
  AuthPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "../types/models";
import { API_ENDPOINTS } from "@constants/api";

export const authService = {
  /**
   * Register a new user
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const body = {
      name: payload.name,
      email: payload.email,
      passwords: payload.password, // Note: backend uses 'passwords'
    };
    return apiFetch<RegisterResponse>(API_ENDPOINTS.AUTH_SIGNUP, {
      method: "POST",
      body,
    });
  },

  /**
   * Login user
   */
  login: async (payload: AuthPayload): Promise<LoginResponse> => {
    const body = {
      email: payload.email,
      passwords: payload.password, // Note: backend uses 'passwords'
    };
    return apiFetch<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      body,
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.image) {
      formData.append("image", payload.image);
    }

    return apiFetch<UpdateProfileResponse>(API_ENDPOINTS.AUTH_UPDATE, {
      method: "PUT",
      body: formData,
    });
  },

  /**
   * Logout user (clears session)
   * Note: This might be a client-side only operation
   */
  logout: async (): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(API_ENDPOINTS.AUTH_LOGOUT, {
      method: "POST",
    });
  },
};
