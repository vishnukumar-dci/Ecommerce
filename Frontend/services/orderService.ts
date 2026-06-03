/**
 * Order Service
 * Handles all order-related API calls
 */

import { apiFetch } from "@lib/api";
import type {
  CreateOrderResponse,
  BuyNowResponse,
  GetOrderStatusResponse,
  GetOrderHistoryResponse,
  UpdateOrderResponse,
  GetStripeLogsResponse,
} from "../types/api";
import type { CreateOrderPayload, BuyNowPayload } from "../types/models";
import { API_ENDPOINTS } from "@constants/api";

export const orderService = {
  /**
   * Create order from cart items
   */
  createOrder: async (
    payload: CreateOrderPayload,
  ): Promise<CreateOrderResponse> => {
    return apiFetch<CreateOrderResponse>(API_ENDPOINTS.ORDER_CREATE, {
      method: "POST",
      body: {
        productIds: payload.productIds,
        qtys: payload.qtys,
      },
    });
  },

  /**
   * Buy single item directly (buynow)
   */
  buyNow: async (payload: BuyNowPayload): Promise<BuyNowResponse> => {
    return apiFetch<BuyNowResponse>(API_ENDPOINTS.ORDER_BUY_NOW, {
      method: "POST",
      body: {
        productId: payload.productId,
        qty: payload.qty,
      },
    });
  },

  /**
   * Get order status
   */
  getStatus: async (orderId: number): Promise<GetOrderStatusResponse> => {
    return apiFetch<GetOrderStatusResponse>(API_ENDPOINTS.ORDER_STATUS, {
      method: "GET",
      params: { orderId },
    });
  },

  /**
   * Get admin order history (all orders)
   */
  getHistory: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<GetOrderHistoryResponse> => {
    return apiFetch<GetOrderHistoryResponse>(
      `${API_ENDPOINTS.ORDER_HISTORY}?page=${page}&limit=${limit}`,
      {
        method: "GET",
      },
    );
  },

  /**
   * Get customer order history (user's orders)
   */
  getCustomerOrders: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<GetOrderHistoryResponse> => {
    return apiFetch<GetOrderHistoryResponse>(API_ENDPOINTS.ORDER_USER_HISTORY, {
      method: "GET",
      params: { page, limit },
    });
  },

  /**
   * Update order
   */
  updateOrder: async (orderId: number): Promise<UpdateOrderResponse> => {
    return apiFetch<UpdateOrderResponse>(API_ENDPOINTS.ORDER_UPDATE, {
      method: "PUT",
      params: { orderId },
    });
  },

  /**
   * Verify payment (webhook callback)
   */
  verifyPayment: async (orderId: number): Promise<any> => {
    return apiFetch<any>(API_ENDPOINTS.ORDER_VERIFY_PAYMENT, {
      method: "GET",
      params: { orderId },
    });
  },

  /**
   * Get Stripe logs (admin only)
   */
  getStripeLogs: async (): Promise<GetStripeLogsResponse> => {
    return apiFetch<GetStripeLogsResponse>(API_ENDPOINTS.ORDER_STRIPE_LOGS, {
      method: "GET",
    });
  },
};
