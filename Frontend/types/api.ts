/**
 * API Request and Response types
 */

import type { Product, User, CartItem, Order, OrderItem } from "./models";

export interface GetProductsResponse {
  list: Product[];
  data: Product[];
}

export interface GetHomepageProductsResponse {
  list: Product[];
  data: Product[];
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface UpdateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export interface GetCartResponse {
  products: CartItem[];
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  cart: CartItem[];
}

export interface UpdateCartResponse {
  success: boolean;
  message: string;
  cart: CartItem[];
}

export interface DeleteCartResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  url?: string;
  sessionUrl?: string;
}

export interface BuyNowResponse {
  success: boolean;
  message: string;
  url?: string;
  sessionUrl?: string;
}

export interface GetOrderStatusResponse {
  items: OrderItem[];
  payment_status: string;
  amount: number;
  created_at: string;
}

export interface GetOrderHistoryResponse {
  history: Order[];
  totalRecords: number;
}

export interface UpdateOrderResponse {
  success: boolean;
  message: string;
}

export interface GetStripeLogsResponse {
  logs: any[];
  totalLogs: number;
}
