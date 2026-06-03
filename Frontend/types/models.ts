/**
 * Domain models and types
 * Normalized API response types to match backend structure
 */

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  list?: any[];
  products?: any[];
  history?: any[];
  items?: any[];
  totalRecords?: number;
  totalLogs?: number;
  logs?: any[];
  payment_status?: string;
  amount?: number;
  created_at?: string;
  url?: string;
  sessionUrl?: string;
}

export interface Product {
  id: number;
  product_name: string;
  descriptions: string;
  amount: number;
  image_path: string;
  in_cart: number;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  qty: number;
  image_path: string;
  product_name: string;
  amount: number;
}

export interface Order {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_id: number;
  product_id: number;
  qty: number;
  amount: number;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name: string;
  image?: File;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  amount: number;
  image?: File;
}

export interface UpdateProductPayload {
  productId: number;
  name?: string;
  description?: string;
  amount?: number;
  image?: File;
}

export interface CreateOrderPayload {
  productIds: number[];
  qtys: number[];
}

export interface BuyNowPayload {
  productId: number;
  qty: number;
}
