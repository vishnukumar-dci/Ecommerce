/**
 * Cart Service
 * Handles all cart-related API calls
 */

import { apiFetch } from "@lib/api";
import type {
  GetCartResponse,
  AddToCartResponse,
  UpdateCartResponse,
  DeleteCartResponse,
} from "../types/api";
import { API_ENDPOINTS } from "@constants/api";

export const cartService = {
  /**
   * Get cart items
   */
  getItems: async (): Promise<GetCartResponse> => {
    return apiFetch<GetCartResponse>(API_ENDPOINTS.CART_LIST, {
      method: "GET",
    });
  },

  /**
   * Add item to cart
   */
  addItem: async (productId: number): Promise<AddToCartResponse> => {
    return apiFetch<AddToCartResponse>(API_ENDPOINTS.CART_ADD, {
      method: "POST",
      body: { productId },
    });
  },

  /**
   * Remove item from cart
   */
  removeItem: async (productId: number): Promise<UpdateCartResponse> => {
    return apiFetch<UpdateCartResponse>(API_ENDPOINTS.CART_REMOVE, {
      method: "PUT",
      body: { productId },
    });
  },

  /**
   * Decrement item quantity
   */
  decrementItem: async (productId: number): Promise<UpdateCartResponse> => {
    return apiFetch<UpdateCartResponse>(API_ENDPOINTS.CART_DECREMENT, {
      method: "PUT",
      body: { productId },
    });
  },

  /**
   * Clear entire cart
   */
  clear: async (): Promise<DeleteCartResponse> => {
    return apiFetch<DeleteCartResponse>(API_ENDPOINTS.CART_DELETE_ALL, {
      method: "DELETE",
    });
  },
};
